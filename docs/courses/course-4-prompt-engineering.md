# Course 4: Prompt Engineering & Structured Output

> **Exam Weight: 20%** — Equal weight with Domain 3. Heavy focus on practical patterns.

---

## Module 4.1 — Explicit Criteria (Reducing False Positives)

### The Problem with Vague Instructions

```
❌ "Check that comments are accurate"
❌ "Be conservative in your findings"
❌ "Only report high-confidence findings"
```

These instructions sound reasonable but **fail to improve precision**. Claude doesn't know what "accurate" or "conservative" means in your specific context.

### Explicit Criteria Pattern

Define **what to flag** AND **what to ignore**:

```markdown
## Code Review Criteria

### REPORT these issues:
- **Bugs**: Logic errors that will produce incorrect results at runtime
- **Security**: SQL injection, XSS, hardcoded credentials, path traversal
- **Data loss**: Operations that could delete or corrupt user data

### SKIP these issues:
- Minor style inconsistencies (spacing, bracket placement)
- Local variable naming that follows the module's existing conventions
- TODO comments (these are tracked separately)
- Import ordering

### Severity Levels (with examples):
- **Critical**: `user_input` used directly in SQL query (SQL injection)
- **High**: Missing null check before `.length` on nullable array
- **Medium**: Async function missing error handling (try/catch)
- **Low**: Unused variable imported but not referenced
```

### False Positive Impact

High false positive rates in one category **undermine trust** in ALL categories. If Claude flags too many style issues incorrectly, developers start ignoring security findings too.

**Fix:** Temporarily **disable** high-false-positive categories while improving prompts for them. Keep the accurate categories active.

---

## Module 4.2 — Few-Shot Prompting

### When to Use Few-Shot Examples

| Situation | Solution |
|---|---|
| Detailed instructions produce **inconsistent** output | Add 2–4 few-shot examples |
| Ambiguous scenarios need **judgment** | Show examples with reasoning |
| Output **format** varies between runs | Show exact format expected |
| False positives for certain **patterns** | Show examples of acceptable vs problematic code |

### Anatomy of a Good Few-Shot Example

Each example should show:
1. The input
2. The output
3. **The reasoning** (why this output, not an alternative)

```markdown
## Examples

### Example 1: Report (genuine bug)
**Code:**
```python
def get_user_age(user):
    return user["age"]  # KeyError if "age" missing
```
**Finding:** Missing key check. `user.get("age")` or try/except needed.
**Severity:** High
**Reasoning:** Runtime crash in production. Not a style issue.

### Example 2: Skip (acceptable pattern)
**Code:**
```python
# HACK: workaround for upstream API bug #1234
result = api.get_data(force_refresh=True)
```
**Finding:** None — skip this.
**Reasoning:** The HACK comment references a specific upstream issue. 
This is a documented workaround, not a code smell.
```

### Key Properties

- **2–4 examples** is usually sufficient (not 8–10)
- Target **ambiguous** scenarios (not obvious ones)
- Examples enable **generalization** — Claude applies the judgment pattern to novel cases it hasn't seen
- Include examples for **varied document structures** (inline citations vs. bibliographies, narrative vs. tables)

### Few-Shot for Extraction Tasks

When extracting data from documents with varied formats:

```markdown
### Example: Informal measurements
Document: "The building is about three stories tall"
Extraction: {"height_stories": 3, "height_exact": null, "confidence": "low"}

### Example: Structured table
Document: | Height | 42.5m | 14 floors |
Extraction: {"height_stories": 14, "height_exact": "42.5m", "confidence": "high"}

### Example: Missing data
Document: "The historic property was renovated in 2019"
Extraction: {"height_stories": null, "height_exact": null, "confidence": null}
Note: Return null, do NOT fabricate values.
```

---

## Module 4.3 — Structured Output with `tool_use` and JSON Schemas

### Why `tool_use` Is the Best Approach

| Approach | Syntax Errors | Semantic Errors |
|---|---|---|
| "Return JSON in your response" | ❌ Common | ❌ Common |
| "Use this JSON format: ..." | ⚠️ Occasional | ❌ Common |
| **`tool_use` with JSON schema** | ✅ **Eliminated** | ⚠️ Still possible |

`tool_use` with schemas guarantees **schema-compliant** output. But it does NOT prevent semantic errors (e.g., line items that don't sum to the total).

### Implementation

```python
# Define the extraction tool with a JSON schema
tools = [{
    "name": "extract_invoice",
    "description": "Extract structured invoice data from the document",
    "input_schema": {
        "type": "object",
        "properties": {
            "vendor_name": {"type": "string"},
            "invoice_number": {"type": "string"},
            "total_amount": {"type": "number"},
            "currency": {
                "type": "string",
                "enum": ["USD", "EUR", "GBP", "other"]
            },
            "currency_detail": {
                "type": ["string", "null"],
                "description": "If currency is 'other', specify which"
            },
            "line_items": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "description": {"type": "string"},
                        "amount": {"type": "number"}
                    }
                }
            },
            "payment_terms": {
                "type": ["string", "null"],
                "description": "May not exist in all invoices"
            }
        },
        "required": ["vendor_name", "invoice_number", "total_amount", "currency"]
    }
}]
```

### Schema Design Best Practices

| Pattern | When | Example |
|---|---|---|
| `required` | Field is always present in source documents | `invoice_number` |
| `["type", "null"]` (nullable) | Field may not exist in source | `payment_terms` |
| `enum` | Fixed set of valid values | `["USD", "EUR", "GBP"]` |
| `enum` + `"other"` + detail | Extensible categories | `currency` with `currency_detail` |
| `"unclear"` enum value | Ambiguous cases | `classification: "unclear"` |

### Critical Rule: Nullable Fields Prevent Hallucination

If a field is `required` but the source document doesn't contain that information, Claude will **fabricate** a value to satisfy the schema.

**Fix:** Make it `["string", "null"]` and NOT required → Claude returns `null` instead of hallucinating.

### `tool_choice` for Structured Output

```python
# Guarantee structured output (model MUST call a tool)
tool_choice = "any"  # Model chooses which extraction tool

# Force a SPECIFIC tool
tool_choice = {"type": "tool", "name": "extract_invoice"}

# Let model decide whether to extract or respond
tool_choice = "auto"  # Default — may return text instead
```

### Format Normalization

Include normalization rules in prompts **alongside** strict schemas:

```markdown
When extracting dates, normalize to ISO 8601:
- "March 5, 2025" → "2025-03-05"
- "5/3/25" → "2025-03-05" (assume US date format MM/DD/YY)
- "Q1 2025" → "2025-01-01" (use first day of quarter)

When extracting currencies, normalize to uppercase ISO codes:
- "$" → "USD", "€" → "EUR", "£" → "GBP"
```

---

## Module 4.4 — Validation, Retry, and Feedback Loops

### Retry-with-Error-Feedback

When extraction fails validation, re-prompt with:
1. The **original document**
2. The **failed extraction**
3. The **specific validation error**

```python
# First attempt
extraction = extract_data(document)
errors = validate(extraction)

if errors:
    # Retry with feedback
    retry_prompt = f"""
    Original document:
    {document}
    
    Your previous extraction:
    {json.dumps(extraction)}
    
    Validation errors found:
    {json.dumps(errors)}
    
    Please fix these specific errors and re-extract.
    """
    extraction = extract_data(retry_prompt)
```

### When Retries DON'T Work

Retries are **ineffective** when the information is simply **absent from the source document**.

| Situation | Retries Help? |
|---|---|
| Wrong format (date as "March 5" not "2025-03-05") | ✅ Yes |
| Structural error (items in wrong fields) | ✅ Yes |
| Information is in the document but missed | ✅ Yes |
| Information only exists in a **different document** not provided | ❌ No |
| Information doesn't exist anywhere | ❌ No |

### Self-Correction Patterns

Build validation into the schema itself:

```json
{
  "stated_total": 1250.00,
  "calculated_total": 1275.00,
  "conflict_detected": true
}
```

Extract BOTH the stated total and the calculated sum of line items. If they differ, flag the conflict instead of silently picking one.

### `detected_pattern` Field

Track what code constructs trigger findings for systematic analysis:

```json
{
  "finding": "Potential null pointer dereference",
  "severity": "high",
  "location": "src/api/handler.ts:45",
  "detected_pattern": "optional_chain_missing",
  "suggested_fix": "Use optional chaining: user?.profile?.email"
}
```

When developers dismiss findings, you can analyze which `detected_pattern` values have high dismissal rates and improve prompts for those patterns.

---

## Module 4.5 — Batch Processing

### Message Batches API

| Feature | Detail |
|---|---|
| **Cost savings** | 50% compared to synchronous API |
| **Processing window** | Up to 24 hours (no guaranteed latency) |
| **Multi-turn tool calling** | ❌ NOT supported |
| **Correlation** | `custom_id` field links requests to responses |

### When to Use Batch vs Synchronous

| Workflow | API |
|---|---|
| Pre-merge code review (blocking) | **Synchronous** — developer is waiting |
| Overnight technical debt report | **Batch** — nobody is waiting |
| Weekly audit of 10,000 documents | **Batch** — latency tolerance is high |
| Real-time customer support | **Synchronous** — customer is waiting |
| Nightly test generation | **Batch** — runs while team sleeps |

### Batch Failure Handling

```python
# Submit batch with custom_ids
batch = submit_batch([
    {"custom_id": "doc_001", "content": doc1},
    {"custom_id": "doc_002", "content": doc2},
    {"custom_id": "doc_003", "content": doc3},  # This one fails (too long)
])

# After completion, identify failures by custom_id
failures = [r for r in batch.results if r.status == "failed"]
# Resubmit ONLY failed documents with modifications
for failure in failures:
    if failure.error == "context_limit_exceeded":
        chunks = chunk_document(original_docs[failure.custom_id])
        resubmit_batch(chunks)
```

### SLA Calculations

If batch processing takes up to 24 hours, and your SLA requires results within 30 hours, you need to submit batches with enough buffer:

```
SLA: 30 hours
Batch processing: up to 24 hours
Buffer needed: 30 - 24 = 6 hours
→ Submit batches at least every 6 hours
```

### Pre-Batch Prompt Refinement

Before batch-processing thousands of documents, **test on a sample set first**:
1. Run 20-50 documents through the prompt
2. Analyze error patterns
3. Refine the prompt
4. Then submit the full batch

This maximizes first-pass success and reduces costly resubmissions.

---

## Module 4.6 — Multi-Pass Review Architectures

### The Self-Review Problem

A model retains reasoning context from generation. When asked to review its own output **in the same session**, it's biased toward confirming its decisions.

**Fix:** Use an **independent review instance** — a separate session without the generator's reasoning context.

### Multi-Pass Pattern for Large Reviews

```
Pass 1: File A — local analysis
Pass 2: File B — local analysis
Pass 3: File C — local analysis
...
Pass N: Cross-file integration pass (data flow, API contracts)
```

**Why?** Analyzing 14 files in one pass causes:
- ❌ Detailed feedback for some, superficial for others
- ❌ Obvious bugs missed
- ❌ Contradictory findings (flagging a pattern in one file, approving it in another)

### Confidence-Based Review Routing

```json
{
  "finding": "Potential race condition in concurrent handler",
  "confidence": 0.65,
  "reasoning": "Two goroutines access shared state without synchronization"
}
```

- High confidence (>0.9): Auto-post as PR comment
- Medium confidence (0.6-0.9): Route to human review
- Low confidence (<0.6): Suppress or log for analysis

---

## Practice Questions — Domain 4

**Q1:** Your code review produces 40% false positives for "comment accuracy" findings. Developers now ignore ALL findings, including valid security issues. What's the best fix?

A) Add "be more conservative" to the system prompt
B) Lower the confidence threshold to only report high-confidence findings
C) Temporarily disable the comment accuracy category while improving its prompts; keep security active
D) Add more few-shot examples for all categories

**Answer: C** — Disable the noisy category to restore trust. Fix it separately. Don't let one category undermine all findings.

---

**Q2:** Claude extracts invoices but sometimes fabricates payment terms that don't exist in the document. What's the schema fix?

A) Add `"default": "N/A"` to the `payment_terms` field
B) Make `payment_terms` type `["string", "null"]` and remove from `required`
C) Add "do not fabricate" to the extraction prompt
D) Add validation that checks extracted terms against a known list

**Answer: B** — Nullable optional fields let Claude return `null` instead of making up values.

---

**Q3:** Your manager wants to use the Batch API for pre-merge code reviews (developers are waiting). Is this appropriate?

A) Yes — 50% savings is significant
B) No — Batch API has up to 24h latency and no SLA; use synchronous for blocking workflows
C) Yes — batch results "often complete within minutes"
D) Yes — with polling to check for completion

**Answer: B** — Blocking workflows need guaranteed latency. Batch has no SLA and up to 24h processing time.

---

**Q4:** A single-pass review of 14 files produces contradictory findings. What's the fix?

A) Use a larger context model
B) Split into per-file passes + cross-file integration pass
C) Have developers submit smaller PRs
D) Run 3 passes and flag issues found in 2+ passes

**Answer: B** — Per-file passes ensure consistent depth; integration pass catches cross-file issues. D would suppress detection of real bugs.
