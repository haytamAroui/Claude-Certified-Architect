# Course 5: Context Management & Reliability

> **Exam Weight: 15%** — Smallest domain, but concepts appear across all scenarios.

---

## Module 5.1 — Preserving Critical Information

### Progressive Summarization Risks

When context is compressed (e.g., via `/compact`), exact values get lost:

```
❌ Before summarization: "Customer's order #ORD-4521 for $847.50 placed on 2025-01-15"
❌ After summarization:  "Customer had a recent order with an issue"
```

Lost: order number, exact amount, exact date. These are critical for downstream processing.

### The "Case Facts" Block Solution

Extract transactional facts into a **persistent structured block** that lives outside summarized history:

```markdown
## Case Facts (do not summarize)
- Customer ID: CUST-12345
- Order: #ORD-4521
- Amount: $847.50
- Order Date: 2025-01-15
- Issue: Damaged item received
- Status: Return requested
```

This block is included in **every prompt**, separate from the conversation history, so facts survive summarization.

### The "Lost in the Middle" Effect

Models process information at the **beginning** and **end** of long inputs reliably. Information in the **middle** gets less attention.

```
┌─────────────────────────────────────────┐
│▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░▓▓▓▓▓▓▓▓│
│ HIGH         LOW ATTENTION       HIGH   │
│ATTENTION                       ATTENTION│
└─────────────────────────────────────────┘
 Start ◄──── Middle ────► End
```

**Fix:** Place key findings summaries at the **beginning** of aggregated inputs. Use explicit section headers to help the model navigate.

### Trimming Verbose Tool Outputs

Tool results like `get_order` may return 40+ fields when only 5 are relevant:

```python
# PostToolUse hook: trim to relevant fields only
def post_tool_use_hook(tool_name, result):
    if tool_name == "get_order":
        order = json.loads(result)
        return json.dumps({
            "order_id": order["order_id"],
            "status": order["status"],
            "total": order["total"],
            "return_eligible": order["return_eligible"],
            "items": order["items"]
        })
        # Drops 35+ irrelevant fields (internal IDs, audit logs, etc.)
    return result
```

### Context-Efficient Subagent Output

Subagents should return **structured summaries**, not raw data:

```python
# ❌ BAD: Subagent returns verbose raw content (15 pages)
return full_search_results  # Fills coordinator's context

# ✅ GOOD: Subagent returns structured summary
return {
    "key_findings": ["AI music revenue grew 40% in 2025", ...],
    "sources": [{"url": "...", "title": "...", "date": "..."}],
    "relevance_score": 0.85,
    "coverage_gaps": ["No data found on AI in theater"]
}
```

---

## Module 5.2 — Escalation and Ambiguity Resolution

### When to Escalate

| ✅ Escalate | ❌ Don't Escalate Based On |
|---|---|
| Customer explicitly asks for a human | Sentiment analysis scores |
| Policy gap (no rule covers this case) | Model's self-reported confidence |
| Can't make meaningful progress | Case "feels" complex |
| Policy exception needed | Customer seems frustrated (alone) |

### Escalation Decision Tree

```
Customer says "get me a manager" ──► ESCALATE IMMEDIATELY
                                      (don't try to resolve first)

Issue is within agent's capability ──► TRY TO RESOLVE
  BUT customer reiterates human request ──► THEN ESCALATE

Policy is silent on customer's request ──► ESCALATE
  (e.g., competitor price matching       (flag as policy gap)
   when policy only covers own-site)

Multiple customer matches found ──► ASK FOR MORE IDENTIFIERS
                                    (don't guess based on heuristics)
```

### Key Exam Distinction: Sentiment vs Complexity

**Sentiment-based escalation is unreliable:**
- An angry customer can have a simple issue (easy fix)
- A polite customer can have a complex issue (needs escalation)
- Sentiment ≠ case complexity

**Self-reported confidence is unreliable:**
- Claude may be "100% confident" on hard cases and correctly uncertain on easy ones
- LLM confidence is **not well-calibrated**

### Handling Multiple Matches

When a customer lookup returns 3 matches for "John Smith":

```
❌ Pick the most recent one (heuristic — might be wrong)
❌ Pick the one in the same city (assumption — might be wrong)
✅ Ask: "I found multiple accounts for John Smith. Can you provide 
   your email address or phone number to help me find the right one?"
```

---

## Module 5.3 — Error Propagation in Multi-Agent Systems

### Structured Error Context

When a subagent fails, return **rich context**, not generic errors:

```json
// ❌ Generic error — coordinator can't decide what to do
{"status": "error", "message": "Search unavailable"}

// ✅ Structured error — coordinator can make intelligent decisions
{
  "status": "partial_failure",
  "failure_type": "timeout",
  "attempted_query": "AI market size 2025",
  "partial_results": [
    {"source": "Forbes", "data": "Market valued at $150B"}
  ],
  "alternatives": [
    "Try academic database instead",
    "Narrow query to specific sector"
  ],
  "retries_attempted": 3
}
```

### Anti-Patterns

| Anti-Pattern | Why It's Bad |
|---|---|
| **Silent suppression** (return empty as success) | Coordinator thinks search found nothing; doesn't retry or use alternatives |
| **Terminate entire workflow** on one failure | Wastes successful subagent results; one failure shouldn't kill everything |
| **Generic error status** | Hides valuable context; coordinator can't make recovery decisions |

### Coverage Annotations

The synthesis output should annotate coverage quality:

```markdown
## Research Report: AI in Creative Industries

### Visual Arts (FULL COVERAGE)
AI-generated art revenue... [3 sources, consistent findings]

### Music (PARTIAL COVERAGE)  
Limited data available... [1 source — web search timed out for 2 additional queries]

### Film Production (NO COVERAGE)
⚠️ No sources found — web search subagent failed for all film-related queries.
Consider manual research or re-running with alternative search terms.
```

---

## Module 5.4 — Large Codebase Exploration

### Context Degradation Problem

In extended exploration sessions, models start:
- Giving inconsistent answers
- Referencing "typical patterns" instead of specific classes discovered earlier
- Losing track of what's already been found

### Scratchpad Files

Use **external files** to persist findings across context boundaries:

```python
# Agent writes findings to a scratchpad file
write_file("scratchpad.md", """
## Key Findings
- Entry point: src/main.py:42 (Application.start)
- Database: PostgreSQL via SQLAlchemy (src/db/engine.py)
- Refund flow: src/api/refunds.py → src/services/payment.py → src/db/transactions.py
- Test coverage: 67% overall, 12% for refund flow
""")

# Later, agent RE-READS the scratchpad instead of re-discovering
findings = read_file("scratchpad.md")
```

### Subagent Delegation for Context Isolation

Spawn subagents for specific questions to keep the main agent's context clean:

```
Main Agent (coordinator — high-level understanding)
  ├── Subagent: "Find all test files" → returns: ["test list summary"]
  ├── Subagent: "Trace refund flow dependencies" → returns: ["flow summary"]
  └── Subagent: "Analyze payment module" → returns: ["module summary"]
```

The main agent gets **1-line summaries** instead of the raw output from reading 15+ files.

### Crash Recovery with Manifests

For long multi-agent workflows:

```json
// manifest.json — each agent exports state here
{
  "workflow_id": "research-2025-03-15",
  "phase": "synthesis",
  "completed": {
    "web_search": {
      "status": "complete",
      "findings_file": "web_findings.json",
      "timestamp": "2025-03-15T10:30:00Z"
    },
    "doc_analysis": {
      "status": "complete",
      "findings_file": "doc_findings.json",
      "timestamp": "2025-03-15T10:45:00Z"
    }
  },
  "pending": {
    "synthesis": {
      "status": "not_started",
      "depends_on": ["web_search", "doc_analysis"]
    }
  }
}
```

On resume, the coordinator loads the manifest and re-injects completed agent states into prompts.

### Using `/compact`

When context fills with verbose discovery output during long sessions:
- `/compact` compresses the conversation history
- **Risk:** Loses exact numbers, dates, percentages
- **Mitigation:** Extract key facts to a scratchpad BEFORE compacting

---

## Module 5.5a — Prompt Caching and Cost Optimization

### The `cache_control` Mechanism

The Anthropic API supports **prompt caching** to reduce costs and latency when you repeatedly send the same large content blocks (system prompts, long documents, tool definitions):

```python
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=4096,
    system=[
        {
            "type": "text",
            "text": "You are a legal document analyzer...",  # Long system prompt
            "cache_control": {"type": "ephemeral"}  # ← Cache this block
        }
    ],
    messages=messages
)
```

### How It Works

| Concept | Detail |
|---|---|
| **What gets cached** | Content blocks marked with `cache_control: {"type": "ephemeral"}` |
| **Cache lifetime** | ~5 minutes (ephemeral) — refreshed on each use |
| **Cost savings** | Cached input tokens cost **90% less** than uncached |
| **Latency savings** | Cached content is processed faster (no re-encoding) |
| **What to cache** | System prompts, large documents, tool definitions, few-shot examples |

### Best Practices

```python
# ✅ GOOD: Cache the stable parts, not the variable parts
system_prompt = [
    {
        "type": "text",
        "text": large_system_prompt,          # Stable — same every call
        "cache_control": {"type": "ephemeral"}
    }
]

# The messages array changes per request — don't cache it
messages = [{"role": "user", "content": current_query}]
```

### When to Use Caching

| Scenario | Cache? | Why |
|---|---|---|
| Long system prompt reused across many requests | Yes | Same content, high repetition |
| Large document analyzed with multiple questions | Yes | Document is stable, questions vary |
| Tool definitions (many tools) | Yes | Tools don't change between calls |
| User messages | No | Different every time |
| Short system prompts (<1024 tokens) | No | Below minimum cacheable size |

### Exam Insight

> If a question asks about **reducing API costs for repeated large prompts**, the answer involves `cache_control: {"type": "ephemeral"}` on stable content blocks — not reducing prompt length or switching models.

---

## Module 5.5b — Human Review and Confidence Calibration

### The 97% Accuracy Trap

Aggregate accuracy can mask terrible performance on subsets:

```
Overall accuracy: 97%  ← Looks great!

By document type:
- Invoices:     99%    ← Great
- Contracts:    98%    ← Great
- Handwritten:  40%    ← Terrible! Hidden by the aggregate
```

### Stratified Sampling

Don't just random-sample. **Stratify by document type AND field:**

```
Sample plan:
- 50 invoices → check: vendor, amount, date, line items
- 50 contracts → check: parties, terms, dates, clauses
- 50 handwritten → check: all fields (known weakness)
```

### Confidence Calibration

1. Have the model output **field-level confidence scores**
2. Calibrate thresholds using a **labeled validation set**
3. Route based on calibrated confidence:

```
High confidence (>0.95, calibrated) → Auto-approve
Medium confidence (0.7-0.95) → Spot-check queue
Low confidence (<0.7) → Human review required
Contradictory sources → Always human review
```

### Accuracy Segmentation

Before reducing human review, verify accuracy is consistent **across all segments**:

```python
accuracy_by_type = {
    "invoice": 0.99,
    "contract": 0.98,
    "receipt": 0.96,
    "handwritten_note": 0.40  # ← BLOCK: too low for automation
}

# Only automate types with >95% accuracy
automate = {t: a for t, a in accuracy_by_type.items() if a > 0.95}
```

---

## Module 5.6 — Information Provenance

### What Is Provenance?

**Provenance** = knowing WHERE each claim came from. Without it, you can't verify or audit the output.

### Claim-Source Mappings

Every claim in a synthesis should be traceable to its source:

```json
{
  "claim": "AI-generated music revenue grew 40% in 2025",
  "sources": [
    {
      "url": "https://ifpi.org/report-2025",
      "document": "IFPI Global Music Report 2025",
      "excerpt": "Revenue from AI-assisted composition reached $2.1B...",
      "page": 42,
      "publication_date": "2025-03-01"
    }
  ]
}
```

### Handling Conflicting Sources

When two credible sources disagree:

```markdown
❌ WRONG: "AI market is valued at $150B" (silently picked one)

✅ CORRECT: "AI market valuation varies by source:
    - Forbes (Jan 2025): $150B
    - McKinsey (Mar 2025): $180B
    Difference may reflect different scope definitions—Forbes 
    covers software only while McKinsey includes hardware."
```

**Rules:**
- Preserve **both values** with source attribution
- Include **publication/collection dates** (temporal differences aren't contradictions)
- Note methodological differences when known

### Temporal Data

Always require dates in structured outputs to prevent temporal confusion:

```json
{
  "claim": "Global AI market size",
  "value_a": "$150B",
  "source_a_date": "2025-01-15",
  "value_b": "$180B",
  "source_b_date": "2025-03-01",
  "note": "Different measurement dates; may reflect market growth, not contradiction"
}
```

### Coverage Annotations

Reports should indicate completeness:

```markdown
## Findings

### Market Size (FULL COVERAGE — 5 sources)
Well-established consensus around $150-180B...

### Regulatory Impact (PARTIAL COVERAGE — 2 sources)
Limited data; EU AI Act analysis available but no US regulatory data found.

### Employment Effects (COVERAGE GAP)
No primary sources found. All claims are from secondary reports 
citing the same unpublished study.
```

### Content-Type Appropriate Rendering

Don't force everything into the same format:

| Content Type | Best Format |
|---|---|
| Financial data | Tables |
| News / events | Prose narrative |
| Technical findings | Structured lists |
| Comparisons | Side-by-side tables |

---

## Practice Questions — Domain 5

**Q1:** After using `/compact`, the agent loses the customer's order number and refund amount. What should have been done?

A) Don't use `/compact` at all
B) Extract transactional facts to a persistent "case facts" block before `/compact`
C) Add a PostToolUse hook to log all facts
D) Increase the context window size

**Answer: B** — Extract critical facts to a separate block that survives summarization.

---

**Q2:** The agent uses sentiment analysis to escalate angry customers. What's wrong with this approach?

A) Nothing — sentiment is a reliable proxy for complexity
B) Sentiment doesn't correlate with case complexity; an angry customer may have a simple issue
C) Sentiment analysis is too expensive to run in real-time
D) Sentiment should only be used combined with confidence scores

**Answer: B** — Sentiment ≠ complexity. Use explicit escalation criteria, not emotion detection.

---

**Q3:** Overall extraction accuracy is 97%, but stakeholders report frequent errors on handwritten documents. What's the issue?

A) The 97% aggregate masks poor performance on specific document types
B) Handwritten documents need OCR preprocessing
C) The model needs more training on handwritten text
D) 97% is acceptable; some errors are expected

**Answer: A** — Stratified analysis by document type reveals hidden weaknesses.

---

**Q4:** A synthesis report attributes a statistic to "research" without specifying which source. What architectural change fixes this?

A) Add more sources to the search phase
B) Require subagents to output claim-source mappings that downstream agents preserve
C) Have the synthesis agent verify all claims independently
D) Add a post-processing step that matches claims to sources

**Answer: B** — Provenance must be built into the structured data flow from the start, not patched after.
