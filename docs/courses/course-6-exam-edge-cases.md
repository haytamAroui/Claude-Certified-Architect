# Course 6: Exam Edge Cases & Traps

> **Supplementary Course** — Fills the 6 gaps identified from mock exam analysis.
> Read this AFTER completing Courses 1–5. Focus: subtle distinctions and "almost right" distractors.

---

## Trap 1 — Escalation: "Policy Silent" vs "Policy Denies"

This is the single most nuanced exam distinction. Two nearly identical scenarios demand **opposite actions**.

### Scenario A: Policy Is SILENT (→ Escalate)

> Customer: "Can you match Amazon's price for this item?"
> Your policy: *"We match prices from our own website promotions."*
> The policy says nothing about competitor matching.

**Action: ESCALATE.** This is a **policy gap** — the customer is asking for something the policy doesn't address. The agent has no authority to approve or deny. A human must decide whether to create a new policy or make an exception.

### Scenario B: Policy EXPLICITLY Denies (→ Deny)

> Customer: "Can you match Amazon's price for this item?"
> Your policy: *"We match prices from our own website promotions. No other price matching is offered."*
> The policy explicitly addresses and denies competitor matching.

**Action: DENY.** The policy directly covers this request. No gap exists. The agent has clear authority to deny.

### The Decision Rule

```
Does the policy address the customer's request?
├── YES, and it ALLOWS it ──────► PROCESS the request  
├── YES, and it DENIES it ──────► DENY with explanation
└── NO (policy is silent) ──────► ESCALATE (policy gap)
```

### How Distractors Trick You

The exam will show a policy and a customer request. Read the policy **word by word**:
- If the policy **says nothing** about the topic → escalate
- If the policy **explicitly says no** → deny
- If the policy **covers it with conditions** → check the conditions

### Practice

> Policy: "Refunds are available within 30 days of purchase for unused items."
> Customer: "I want a refund for this item I bought 45 days ago. I never opened it."

**Answer:** The policy explicitly sets a 30-day window. 45 days exceeds it. **Deny** (not escalate) — the policy addresses this scenario directly.

> Policy: "Refunds are available within 30 days of purchase for unused items."
> Customer: "I received a defective item. I want a replacement."

**Answer:** The policy covers refunds for unused items. It says nothing about **defective items** or **replacements**. This is a **policy gap** → **Escalate.**

---

## Trap 2 — Cumulative Hook Tracking (Split-Transaction Circumvention)

### The Basic Hook

Most courses teach per-transaction hooks:

```python
def pre_tool_use_hook(tool_name, tool_input):
    if tool_name == "process_refund" and tool_input["amount"] > 500:
        return block_and_escalate()
    return allow()
```

This blocks a single $600 refund. ✅

### The Gap: Split Transactions

A customer is owed $1,200 for three defective items ($400 + $350 + $450). The agent processes three separate refunds — **all below $500** — and the hook allows each one.

**Total refunded: $1,200** — far above the $500 policy intent.

### The Fix: Stateful Cumulative Tracking

```python
# Track cumulative refunds per order/customer session
session_refund_totals = {}

def pre_tool_use_hook(tool_name, tool_input):
    if tool_name == "process_refund":
        order_id = tool_input["order_id"]
        amount = tool_input["amount"]
        
        # Check cumulative total, not just this transaction
        cumulative = session_refund_totals.get(order_id, 0) + amount
        
        if cumulative > 500:
            return {
                "action": "block",
                "message": f"Cumulative refund ${cumulative} exceeds $500 limit",
                "redirect": "escalate_to_human"
            }
        
        # Track the approved amount
        session_refund_totals[order_id] = cumulative
        return allow()
```

### Exam Signal

If a question mentions:
- Multiple refunds for the same order
- Items processed individually that total more than the limit
- "Each below the threshold but total above"

→ **The answer involves cumulative/aggregate tracking**, not per-transaction hooks.

---

## Trap 3 — Session State Across Follow-Ups

### The Scenario

```
Turn 1: Customer asks about order #8842
Turn 2: Agent calls get_customer → verifies identity ✅
Turn 3: Agent processes return for order #8842
Turn 4: Customer says "Also, what's my loyalty points balance?"
Turn 5: Agent calls get_customer AGAIN → redundant ❌
```

### Why This Happens

The agent doesn't recognize that the customer verified in Turn 2 is the **same customer** in Turn 4. Without explicit guidance, it treats each new topic as a fresh interaction.

### The Fix

Add session state awareness to the system prompt:

```markdown
## Session State Rules
- Once a customer is verified via `get_customer`, that verification 
  is valid for the ENTIRE session. Do NOT re-verify for follow-up 
  questions about the same customer.
- When handling follow-up requests, check if the customer was already 
  verified earlier in the conversation before calling `get_customer`.
- Only re-verify if the customer explicitly provides different 
  identifying information suggesting they're asking about a different 
  account.
```

### The Exam Distinction

| Situation | Action |
|---|---|
| Same customer, new question in same session | **Don't re-verify** — use existing verification |
| Different customer identifier provided | **Re-verify** — may be a different account |
| New session (no prior history) | **Verify** — fresh start |

### Why This Isn't the Same as "Maintaining Conversation History"

The Messages API is **stateless** — you send full conversation history each turn. The model CAN see that `get_customer` was called in Turn 2. The issue is that without explicit guidance, the model **defaults to re-verifying** because it treats verification as a per-request requirement rather than a per-session state.

---

## Trap 4 — Empty Results vs Tool Errors

### The Scenario

```python
# Database is down for maintenance
order = lookup_order("ORD-5582")
# Returns: {"orders": [], "isError": false}
```

The tool returns successfully (`isError: false`) with empty results — but the empty results are caused by a database outage, NOT by a non-existent order.

The agent tells the customer: **"Order #5582 doesn't exist."** ← WRONG

### The Distinction

| Situation | `isError` | `results` | Meaning |
|---|---|---|---|
| Order genuinely doesn't exist | `false` | `[]` | No matching order — valid result |
| Database is down | `true` | N/A | Tool itself failed — transient error |
| Invalid format provided | `true` | N/A | Bad input — validation error |

### The Fix: Tool Must Distinguish Internally

The tool implementation must differentiate between:

```json
// Successful query, no matches → valid empty result
{
  "isError": false, 
  "results": [], 
  "query": "ORD-5582",
  "message": "No matching orders found"
}

// Database unavailable → transient error
{
  "isError": true,
  "errorCategory": "transient",
  "isRetryable": true,
  "message": "Database connection timed out",
  "attempted": "SELECT * FROM orders WHERE id = 'ORD-5582'"
}
```

### Exam Signal

If a question mentions:
- A tool returning empty results during known outages
- The agent incorrectly telling users something doesn't exist
- Maintenance windows causing incorrect behavior

→ **The answer involves distinguishing empty results (`isError: false`) from access failures (`isError: true`).**

---

## Trap 5 — `tool_choice` Workflow: Forced → Then Auto

### The Pattern

Some workflows need a **specific tool called first**, then flexibility afterward:

```python
# Turn 1: FORCE get_customer (identity verification is mandatory)
response = client.messages.create(
    tools=all_tools,
    tool_choice={"type": "tool", "name": "get_customer"},
    messages=messages
)

# Process the forced tool call result
messages.append(...)

# Turn 2+: Switch to AUTO (model decides freely)
response = client.messages.create(
    tools=all_tools,
    tool_choice="auto",  # ← Switch to auto after mandatory step
    messages=messages
)
```

### The Three Settings Side-by-Side

| Setting | Guarantee | Model Freedom | Use Case |
|---|---|---|---|
| `"auto"` | None — might return text only | Full freedom | Default behavior |
| `"any"` | Will call A tool (not text) | Chooses which tool | Guarantee structured output |
| `{"type":"tool","name":"X"}` | Will call tool X specifically | No choice | Mandatory first step |

### Key Exam Facts

- `"auto"` = model may **skip tools entirely** and respond with text (20% of cases in extraction scenarios)
- `"any"` = guarantees a tool call but the **model chooses which** — good when you have one extraction tool
- Forced selection = guarantees a **specific** tool — good for mandatory prerequisites
- You can **change `tool_choice` between turns** — forced on turn 1, auto on subsequent turns
- `"required"` does NOT exist as a `tool_choice` option

---

## Trap 6 — Edit Tool Fallback Chain

### Built-in Edit Tool: How It Works

The Edit tool finds a **unique text match** in the file and replaces it. If the text isn't unique (appears multiple times), the edit fails.

### The Fallback Chain

```
Step 1: Try Edit with the target text
├── Unique match found → ✅ Edit succeeds
└── Multiple matches found → ❌ Edit fails
    │
Step 2: Try Edit with a LONGER anchor text (more context = unique)
├── Unique match found → ✅ Edit succeeds  
└── Still not unique → ❌ Edit fails
    │
Step 3: Fall back to Read + Write
├── Read the entire file
├── Modify the content in memory
└── Write the modified version back → ✅ Always works
```

### Exam Signal

If a question mentions:
- Edit failing due to non-unique text
- Multiple instances of the same pattern in a file
- "What's the correct fallback?"

→ **Try Edit with a longer anchor text first, then fall back to Read+Write. Always attempt Edit before falling back.**

### The Six Built-in Tools — Quick Reference

| Tool | Searches | Returns | Modifies? |
|---|---|---|---|
| **Grep** | File **contents** (patterns inside files) | Matching lines + file paths | No |
| **Glob** | File **names/paths** (filesystem patterns) | File paths matching pattern | No |
| **Read** | Nothing (loads specified file) | File contents | No |
| **Write** | Nothing (creates/overwrites file) | Confirmation | **Yes — full file** |
| **Edit** | Unique text within a file | Modified file | **Yes — surgical** |
| **Bash** | Nothing (runs commands) | Command output | **Depends on command** |

### Most Common Confusion: Grep vs Glob

> "Find all test files" → **Glob** (`**/*.test.tsx`)
> "Find all files that call processRefund" → **Grep** (`processRefund`)

Grep = searches **inside**. Glob = searches **names**.

---

## Bonus: The 8 Most Dangerous Distractors

These are the "almost right" answers that appear across both mock exams:

### 1. "Add stronger language to the prompt"
> ❌ If the question involves **financial rules, compliance, or security**, prompts are never the answer. Use **hooks** (100% enforcement).
> ✅ Prompts ARE correct for **style, tone, preferences** (ok at ~95%).

### 2. "Use a larger context window / higher-tier model"
> ❌ Almost always wrong. Larger windows don't fix attention quality (lost-in-the-middle), tool selection (too many tools), or context pollution (verbose outputs).
> ✅ The real fix is usually structural: trim outputs, split passes, use subagents.

### 3. "Run multiple passes and require consensus"
> ❌ Consensus-based detection (flag only if 2 of 3 passes find it) **suppresses** intermittent bug detection. Real bugs caught once are still real bugs.
> ✅ Multi-pass is correct when each pass has a different **focus** (per-file → cross-file).

### 4. "Subagents inherit coordinator context"
> ❌ **Never.** Subagents have isolated context. This is tested repeatedly. Every piece of information must be explicitly passed in the Task prompt.

### 5. "Use sentiment analysis for escalation"
> ❌ Sentiment ≠ complexity. Angry customer + simple issue = don't escalate. Polite customer + policy gap = escalate. Use **explicit criteria**, not emotion detection.

### 6. "Confidence-based / self-reported confidence"
> ❌ Model confidence is **not well-calibrated** out of the box. Don't use it for escalation decisions or auto-approval without empirical calibration using labeled validation sets.

### 7. "Terminate the workflow on subagent failure"
> ❌ One subagent failing shouldn't kill the entire workflow. Return **structured error context** with partial results, and let the coordinator decide (retry, skip, use alternatives).

### 8. "Average conflicting values" / "Pick the newer source"
> ❌ For conflicting data, **preserve both values with source attribution** and note methodological or temporal differences. Never average, never silently pick one.

---

## Quick Self-Test: 10 One-Line Questions

Answer these instantly — if you hesitate, review the relevant trap:

1. Policy says nothing about gift cards. Customer asks for a gift card refund. **Escalate or deny?**
   → Escalate (policy gap)

2. Policy says "Gift card purchases are final and non-refundable." Customer asks for refund. **Escalate or deny?**
   → Deny (policy explicitly covers it)

3. Three $400 refunds for one order. $500 per-transaction hook. All pass. **Problem?**
   → Yes — cumulative $1,200 exceeds intent. Need aggregate tracking.

4. Customer verified in turn 2, asks new question in turn 8. **Re-verify?**
   → No — same session, same customer.

5. `lookup_order` returns `{"orders": [], "isError": false}` during DB maintenance. **What's wrong?**
   → Tool should return `isError: true` for transient failures, not empty success.

6. `tool_choice: "auto"` and model returns text instead of calling extraction tool. **Fix?**
   → Change to `"any"` or forced selection.

7. Edit fails — anchor text appears 4 times in file. **Next step?**
   → Try longer anchor. If still not unique, use Read + Write.

8. "Find all `.test.tsx` files" — **Grep or Glob?**
   → Glob (searching file names, not contents).

9. Two sources say AI market is $150B (Jan) and $180B (Mar). **How to synthesize?**
   → Preserve both with dates and source attribution.

10. Subagent timeout. Return `{"error": "failed"}`? **Good enough?**
    → No. Return structured context: failure type, partial results, alternatives.

**If you got all 10 right instantly → you're exam-ready.** 🎯
