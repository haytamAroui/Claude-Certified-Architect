# Course 1: Agentic Architecture & Orchestration

> **Exam Weight: 27%** — This is the heaviest domain. Master it first.

---

## Module 1.1 — The Agentic Loop

### What Is an Agentic Loop?

An agentic loop is the fundamental execution pattern for Claude-powered agents. Instead of a single request→response, the agent operates in a **cycle**:

```
User Request → Claude thinks → Calls a tool → Gets result → Thinks again → Calls another tool → ... → Final answer
```

The loop continues as long as Claude decides it needs more information or actions.

### The `stop_reason` Mechanism

Every Claude API response includes a `stop_reason` field. There are three values you must know:

| `stop_reason` | Meaning | What to do |
|---|---|---|
| `"tool_use"` | Claude wants to call a tool | Execute the tool, return results, continue the loop |
| `"end_turn"` | Claude is done | Exit the loop, present the final response to the user |
| `"max_tokens"` | Response was truncated (hit `max_tokens` limit) | Continue the conversation so Claude can finish its response |

> **Exam focus:** Most questions test `"tool_use"` vs `"end_turn"`. But a production agentic loop must also handle `"max_tokens"` to avoid silently truncated responses.

### Correct Implementation

```python
import anthropic

client = anthropic.Anthropic()
messages = [{"role": "user", "content": user_query}]

# The agentic loop
while True:
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        tools=tools,
        messages=messages
    )

    # ✅ Correct: check stop_reason
    if response.stop_reason == "end_turn":
        break  # Claude is done

    # Append the assistant message ONCE (before processing tool calls)
    messages.append({"role": "assistant", "content": response.content})

    # Collect ALL tool results into a single user message
    tool_results = []
    for block in response.content:
        if block.type == "tool_use":
            result = execute_tool(block.name, block.input)
            tool_results.append({
                "type": "tool_result",
                "tool_use_id": block.id,
                "content": result
            })

    # Append all tool results as one user message
    messages.append({"role": "user", "content": tool_results})
```

> **Why this structure matters:** The assistant message must be appended **once** before the loop over content blocks. Tool results must be **batched** into a single user message. If you append inside the loop, you corrupt the conversation history when multiple tools are called in one response.

### ❌ Three Anti-Patterns to Avoid

These are **explicitly tested** on the exam:

1. **Parsing natural language for "done"** — Don't look for phrases like "I'm finished" or "Here's your answer" in the text output. This is fragile and unreliable.

2. **Arbitrary iteration caps as the PRIMARY mechanism** — Don't use `for i in range(10)` as the primary stopping mechanism. The model should decide when it's done via `stop_reason`. A generous safety limit (e.g., `max_iterations=50`) is fine as a **secondary safeguard** — just log a warning when it's hit.

3. **Checking for text content** — Don't check if the response contains text blocks as a completion signal. A response can contain both text AND tool calls simultaneously.

### Key Exam Insight

> **Q: How should an agentic loop determine when to stop?**
> **A:** By checking `stop_reason == "end_turn"`. Always. Not by parsing text, not by counting iterations, not by looking for text blocks.

---

## Module 1.2 — Multi-Agent Systems (Coordinator-Subagent)

### Hub-and-Spoke Architecture

In production multi-agent systems, a **coordinator** agent manages everything:

```
                    ┌──────────────┐
                    │  Coordinator │
                    │    Agent     │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────▼────┐ ┌────▼─────┐ ┌────▼─────┐
        │  Search   │ │ Analysis │ │Synthesis │
        │ Subagent  │ │ Subagent │ │ Subagent │
        └──────────┘ └──────────┘ └──────────┘
```

**The coordinator is responsible for:**
- Task decomposition (breaking work into subtasks)
- Delegation (assigning subtasks to the right subagent)
- Result aggregation (combining subagent outputs)
- Error handling (deciding what to do when a subagent fails)
- Information routing (passing context between agents)

### Critical Rule: Subagents Have Isolated Context

> ⚠️ **Subagents do NOT inherit the coordinator's conversation history.**

This is one of the most frequently tested concepts. When the coordinator spawns a subagent, that subagent starts with a blank slate. Any information the subagent needs must be **explicitly passed** in its prompt.

**Wrong approach:**
```python
# ❌ Assuming the subagent "knows" what happened before
Task(prompt="Now synthesize the research findings")
```

**Correct approach:**
```python
# ✅ Explicitly passing all necessary context
Task(prompt=f"""Synthesize these research findings into a report:

Web search results:
{web_search_results}

Document analysis:
{document_analysis_output}

Requirements: Include source citations for every claim.""")
```

### Task Decomposition Risks

The coordinator must break broad topics into subtasks carefully. **Overly narrow decomposition** is a tested anti-pattern:

**Example:** Topic "Impact of AI on creative industries"
- ❌ Bad decomposition: "AI in digital art", "AI in graphic design", "AI in photography" → misses music, writing, film
- ✅ Good decomposition: "AI in visual arts", "AI in music and audio", "AI in writing and publishing", "AI in film and video production"

### Iterative Refinement Loops

The coordinator doesn't just fire-and-forget. It should:
1. Evaluate synthesis output for **coverage gaps**
2. Re-delegate to search/analysis subagents with **targeted queries**
3. Re-invoke synthesis until coverage is **sufficient**

```
Coordinator → Subagents → Synthesis → Coordinator evaluates
    ↑                                        │
    └── Gaps found? Re-delegate ◄────────────┘
```

---

## Module 1.3 — Subagent Invocation and Context Passing

### The `Task` Tool

Subagents are spawned using the `Task` tool from the Claude Agent SDK:
- The coordinator's `allowedTools` must include `"Task"` for it to spawn subagents
- Each subagent is defined with `AgentDefinition` (description, system prompt, tool restrictions)

### Parallel Execution

To run subagents **in parallel**, the coordinator emits **multiple `Task` calls in a single response**:

```
Coordinator Response:
  - Task("Search for AI impact on visual arts")    ← runs simultaneously
  - Task("Search for AI impact on music")          ← runs simultaneously
  - Task("Search for AI impact on writing")        ← runs simultaneously
```

This is **not** the same as calling them across separate turns (which would be sequential).

### Context Passing Best Practices

When passing context between agents, **separate content from metadata**:

```json
{
  "findings": [
    {
      "claim": "AI-generated music revenue grew 40% in 2025",
      "evidence": "According to IFPI's annual report...",
      "source_url": "https://ifpi.org/report-2025",
      "document_name": "IFPI Global Music Report 2025",
      "page_number": 42,
      "publication_date": "2025-03-01"
    }
  ]
}
```

This preserves **attribution** for downstream synthesis and provenance tracking.

### Fork-Based Sessions

`fork_session` creates **independent branches** from a shared analysis baseline:
- Use Case: Compare two different approaches after a shared discovery phase
- Each fork has a **full copy** of the context at the fork point
- Forks are **independent** — changes in one don't affect the other

---

## Module 1.4 — Enforcement and Handoff Patterns

### Hooks vs Prompts: The Critical Distinction

| Approach | Reliability | Use Case |
|---|---|---|
| **Hooks** (programmatic) | **100% deterministic** | Financial rules, compliance, safety |
| **Prompts** (instructions) | ~95% probabilistic | Style guides, tone, preferences |

> **Exam rule of thumb:** If the question mentions money, legal compliance, identity verification, or safety → the answer is **hooks/programmatic enforcement**, not prompts.

### Example: Blocking Refunds Over $500

```python
# PreToolUse hook — blocks the tool call BEFORE execution
def pre_tool_use_hook(tool_name, tool_input):
    if tool_name == "process_refund":
        amount = tool_input.get("amount", 0)
        if amount > 500:
            return {
                "action": "block",
                "message": "Refunds over $500 require human approval",
                "redirect": "escalate_to_human"
            }
    return {"action": "allow"}
```

### Programmatic Prerequisites

Block downstream tools until prerequisites complete:

```
get_customer ──verified──► lookup_order ──found──► process_refund
     │                         │                        │
     └── Must complete first   └── Must complete first  └── Only then
```

The agent **cannot** call `process_refund` until `get_customer` has returned a verified customer ID. This is enforced in code, not in the prompt.

### Structured Handoff

When escalating to a human, compile a **structured summary**:

```json
{
  "customer_id": "CUST-12345",
  "root_cause": "Return request for item damaged in shipping",
  "refund_amount": 847.50,
  "policy_notes": "Amount exceeds $500 auto-approval threshold",
  "recommended_action": "Approve full refund — damage confirmed by photo",
  "conversation_summary": "Customer reported damage, provided photos, agent verified order"
}
```

The human agent may NOT have access to the conversation transcript, so the handoff must be self-contained.

---

## Module 1.5 — Agent SDK Hooks

### PostToolUse Hooks

Intercept tool results **after** execution, **before** the model processes them.

> **Note:** In Claude Code, hooks are configured as external commands in settings files (`.claude/settings.json`), not inline Python functions. The examples below are **conceptual pseudocode** to illustrate the pattern. In a custom Agent SDK application, you implement hooks in your application code.

**Use case:** Normalize heterogeneous data formats from different MCP tools

```python
# Conceptual pseudocode — illustrates the hook pattern
def post_tool_use_hook(tool_name, tool_result):
    if tool_name == "get_order":
        # Normalize timestamp formats
        result = json.loads(tool_result)
        # Tool returns Unix timestamp, convert to ISO 8601
        result["created_at"] = unix_to_iso(result["created_at"])
        # Normalize status codes to human-readable
        result["status"] = STATUS_MAP.get(result["status_code"], "unknown")
        return json.dumps(result)
    return tool_result
```

### PreToolUse Hooks

Intercept tool calls **before** execution to enforce compliance:

```python
def pre_tool_use_hook(tool_name, tool_input):
    if tool_name == "process_refund" and tool_input["amount"] > 500:
        return block_and_escalate()
    return allow()
```

### When to Use Hooks vs Prompts

| Scenario | Use |
|---|---|
| "Refunds over $500 need approval" | **Hook** — financial rule, must be 100% |
| "Be polite and professional" | **Prompt** — tone guidance, ok if ~95% |
| "Always verify identity first" | **Hook** — security requirement, must be 100% |
| "Prefer concise responses" | **Prompt** — style preference, ok if ~95% |

---

## Module 1.6 — Task Decomposition Strategies

### Two Patterns

| Pattern | When to Use | Example |
|---|---|---|
| **Prompt Chaining** (fixed sequential) | Predictable multi-aspect reviews | File-by-file analysis → cross-file integration pass |
| **Dynamic Decomposition** (adaptive) | Open-ended investigation | "Add tests to legacy codebase" — map structure first, then prioritize |

### Prompt Chaining

```
Step 1: Analyze file A for local issues
Step 2: Analyze file B for local issues
Step 3: Analyze file C for local issues
Step 4: Cross-file integration pass (data flow, API contracts)
```

Each step is a focused prompt. Results from earlier steps feed into later ones.

### Dynamic Decomposition

For open-ended tasks:
1. **Map** the structure (what exists?)
2. **Identify** high-impact areas
3. **Create** a prioritized plan
4. **Adapt** as dependencies are discovered

The plan changes based on what's found at each step.

---

## Module 1.7 — Session Management

### Key Concepts

| Feature | Purpose |
|---|---|
| `--resume <name>` | Continue a named session from where you left off |
| `fork_session` | Branch from a shared baseline to explore alternatives |
| New session + summary | Start fresh when old tool results are stale |

### When to Resume vs Start Fresh

| Situation | Action |
|---|---|
| Prior context is mostly still valid | `--resume` the session |
| Files have changed since last session | Resume but **tell the agent what changed** |
| Tool results are stale (API data changed) | Start a **new session** with injected summary |

### Crash Recovery with Manifests

For long-running multi-agent workflows:
- Each agent **exports state** to a known location (`manifest.json`)
- On resume, the coordinator **loads the manifest** and injects state into agent prompts
- This enables picking up where you left off after crashes

```json
// manifest.json
{
  "phase": "synthesis",
  "completed_agents": ["web_search", "doc_analysis"],
  "pending_agents": ["synthesis"],
  "findings": { ... },
  "last_updated": "2025-03-15T10:30:00Z"
}
```

---

## Practice Questions — Domain 1

**Q1:** Your agent skips `get_customer` 12% of the time and goes straight to `lookup_order`. What's the most effective fix?

A) Add "always call get_customer first" to the system prompt
B) Add few-shot examples showing the correct order
C) Add a programmatic prerequisite blocking `lookup_order` until `get_customer` completes
D) Implement a routing classifier

**Answer: C** — Financial/identity operations need deterministic enforcement, not probabilistic prompts.

---

**Q2:** A multi-agent research system covers only visual arts when asked about "AI in creative industries." Logs show the coordinator decomposed the topic into "AI in digital art," "AI in graphic design," and "AI in photography." What's the root cause?

A) The synthesis agent lacks gap-detection instructions
B) The coordinator's task decomposition is too narrow
C) The web search agent's queries aren't comprehensive enough
D) The document analysis agent filters non-visual sources

**Answer: B** — The subagents worked correctly within their assigned scope. The coordinator assigned too narrow a scope.

---

**Q3:** A PostToolUse hook normalizes timestamps from Unix to ISO 8601. When should you use this approach vs adding format instructions to the prompt?

A) Always use hooks — they're more reliable
B) Use hooks for data normalization; prompts for output style
C) Always use prompts — hooks add complexity
D) Use hooks only for security-related transformations

**Answer: B** — Hooks provide deterministic data transformation. Prompts are appropriate for style/format preferences in the agent's own output.

---

**Q4:** To run subagents in parallel, you should:

A) Create separate threads in your application code
B) Have the coordinator emit multiple Task calls in a single response
C) Configure parallel execution in the AgentDefinition
D) Use fork_session to create parallel branches

**Answer: B** — Multiple Task calls in one coordinator response = parallel execution.
