export const courseContents: Record<string, string> = {
  '1': `# Course 1: Agentic Architecture & Orchestration

> **Exam Weight: 27%** — This is the heaviest domain. Master it first.

---

## Module 1.1 — The Agentic Loop

### What Is an Agentic Loop?

An agentic loop is the fundamental execution pattern for Claude-powered agents. Instead of a single request→response, the agent operates in a **cycle**:

\`\`\`
User Request → Claude thinks → Calls a tool → Gets result → Thinks again → Calls another tool → ... → Final answer
\`\`\`

The loop continues as long as Claude decides it needs more information or actions.

### The \`stop_reason\` Mechanism

Every Claude API response includes a \`stop_reason\` field. There are three values you must know:

| \`stop_reason\` | Meaning | What to do |
|---|---|---|
| \`"tool_use"\` | Claude wants to call a tool | Execute the tool, return results, continue the loop |
| \`"end_turn"\` | Claude is done | Exit the loop, present the final response to the user |
| \`"max_tokens"\` | Response was truncated (hit \`max_tokens\` limit) | Continue the conversation so Claude can finish its response |

> **Exam focus:** Most questions test \`"tool_use"\` vs \`"end_turn"\`. But a production agentic loop must also handle \`"max_tokens"\` to avoid silently truncated responses.

### Correct Implementation

\`\`\`python
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
\`\`\`

> **Why this structure matters:** The assistant message must be appended **once** before the loop over content blocks. Tool results must be **batched** into a single user message. If you append inside the loop, you corrupt the conversation history when multiple tools are called in one response.

### ❌ Three Anti-Patterns to Avoid

These are **explicitly tested** on the exam:

1. **Parsing natural language for "done"** — Don't look for phrases like "I'm finished" or "Here's your answer" in the text output. This is fragile and unreliable.

2. **Arbitrary iteration caps as the PRIMARY mechanism** — Don't use \`for i in range(10)\` as the primary stopping mechanism. The model should decide when it's done via \`stop_reason\`. A generous safety limit (e.g., \`max_iterations=50\`) is fine as a **secondary safeguard** — just log a warning when it's hit.

3. **Checking for text content** — Don't check if the response contains text blocks as a completion signal. A response can contain both text AND tool calls simultaneously.

### Key Exam Insight

> **Q: How should an agentic loop determine when to stop?**
> **A:** By checking \`stop_reason == "end_turn"\`. Always. Not by parsing text, not by counting iterations, not by looking for text blocks.

---

## Module 1.2 — Multi-Agent Systems (Coordinator-Subagent)

### Hub-and-Spoke Architecture

In production multi-agent systems, a **coordinator** agent manages everything:

\`\`\`
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
\`\`\`

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
\`\`\`python
# ❌ Assuming the subagent "knows" what happened before
Task(prompt="Now synthesize the research findings")
\`\`\`

**Correct approach:**
\`\`\`python
# ✅ Explicitly passing all necessary context
Task(prompt=f"""Synthesize these research findings into a report:

Web search results:
{web_search_results}

Document analysis:
{document_analysis_output}

Requirements: Include source citations for every claim.""")
\`\`\`

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

\`\`\`
Coordinator → Subagents → Synthesis → Coordinator evaluates
    ↑                                        │
    └── Gaps found? Re-delegate ◄────────────┘
\`\`\`

---

## Module 1.3 — Subagent Invocation and Context Passing

### The \`Task\` Tool

Subagents are spawned using the \`Task\` tool from the Claude Agent SDK:
- The coordinator's \`allowedTools\` must include \`"Task"\` for it to spawn subagents
- Each subagent is defined with \`AgentDefinition\` (description, system prompt, tool restrictions)

### Parallel Execution

To run subagents **in parallel**, the coordinator emits **multiple \`Task\` calls in a single response**:

\`\`\`
Coordinator Response:
  - Task("Search for AI impact on visual arts")    ← runs simultaneously
  - Task("Search for AI impact on music")          ← runs simultaneously
  - Task("Search for AI impact on writing")        ← runs simultaneously
\`\`\`

This is **not** the same as calling them across separate turns (which would be sequential).

### Context Passing Best Practices

When passing context between agents, **separate content from metadata**:

\`\`\`json
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
\`\`\`

This preserves **attribution** for downstream synthesis and provenance tracking.

### Fork-Based Sessions

\`fork_session\` creates **independent branches** from a shared analysis baseline:
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

\`\`\`python
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
\`\`\`

### Programmatic Prerequisites

Block downstream tools until prerequisites complete:

\`\`\`
get_customer ──verified──► lookup_order ──found──► process_refund
     │                         │                        │
     └── Must complete first   └── Must complete first  └── Only then
\`\`\`

The agent **cannot** call \`process_refund\` until \`get_customer\` has returned a verified customer ID. This is enforced in code, not in the prompt.

### Structured Handoff

When escalating to a human, compile a **structured summary**:

\`\`\`json
{
  "customer_id": "CUST-12345",
  "root_cause": "Return request for item damaged in shipping",
  "refund_amount": 847.50,
  "policy_notes": "Amount exceeds $500 auto-approval threshold",
  "recommended_action": "Approve full refund — damage confirmed by photo",
  "conversation_summary": "Customer reported damage, provided photos, agent verified order"
}
\`\`\`

The human agent may NOT have access to the conversation transcript, so the handoff must be self-contained.

---

## Module 1.5 — Agent SDK Hooks

### PostToolUse Hooks

Intercept tool results **after** execution, **before** the model processes them.

> **Note:** In Claude Code, hooks are configured as external commands in settings files (\`.claude/settings.json\`), not inline Python functions. The examples below are **conceptual pseudocode** to illustrate the pattern. In a custom Agent SDK application, you implement hooks in your application code.

**Use case:** Normalize heterogeneous data formats from different MCP tools

\`\`\`python
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
\`\`\`

### PreToolUse Hooks

Intercept tool calls **before** execution to enforce compliance:

\`\`\`python
def pre_tool_use_hook(tool_name, tool_input):
    if tool_name == "process_refund" and tool_input["amount"] > 500:
        return block_and_escalate()
    return allow()
\`\`\`

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

\`\`\`
Step 1: Analyze file A for local issues
Step 2: Analyze file B for local issues
Step 3: Analyze file C for local issues
Step 4: Cross-file integration pass (data flow, API contracts)
\`\`\`

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
| \`--resume <name>\` | Continue a named session from where you left off |
| \`fork_session\` | Branch from a shared baseline to explore alternatives |
| New session + summary | Start fresh when old tool results are stale |

### When to Resume vs Start Fresh

| Situation | Action |
|---|---|
| Prior context is mostly still valid | \`--resume\` the session |
| Files have changed since last session | Resume but **tell the agent what changed** |
| Tool results are stale (API data changed) | Start a **new session** with injected summary |

### Crash Recovery with Manifests

For long-running multi-agent workflows:
- Each agent **exports state** to a known location (\`manifest.json\`)
- On resume, the coordinator **loads the manifest** and injects state into agent prompts
- This enables picking up where you left off after crashes

\`\`\`json
// manifest.json
{
  "phase": "synthesis",
  "completed_agents": ["web_search", "doc_analysis"],
  "pending_agents": ["synthesis"],
  "findings": { ... },
  "last_updated": "2025-03-15T10:30:00Z"
}
\`\`\`

---

## Practice Questions — Domain 1

**Q1:** Your agent skips \`get_customer\` 12% of the time and goes straight to \`lookup_order\`. What's the most effective fix?

A) Add "always call get_customer first" to the system prompt
B) Add few-shot examples showing the correct order
C) Add a programmatic prerequisite blocking \`lookup_order\` until \`get_customer\` completes
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

**Answer: B** — Multiple Task calls in one coordinator response = parallel execution.`,
  '2': `# Course 2: Tool Design & MCP Integration

> **Exam Weight: 18%** — Second largest domain combined with Domain 1 = 45% of the exam.

---

## Module 2.1 — Designing Effective Tool Interfaces

### Tool Descriptions Are Everything

Tool descriptions are the **primary mechanism** Claude uses to decide which tool to call. This is one of the most heavily tested concepts.

**The problem:** Minimal descriptions make tools indistinguishable.

\`\`\`json
// ❌ BAD — minimal descriptions
{
  "name": "analyze_content",
  "description": "Analyzes content"
},
{
  "name": "analyze_document",
  "description": "Analyzes documents"
}
\`\`\`

Claude can't reliably choose between these — they sound the same.

### What a Good Tool Description Includes

A complete tool description should cover:

1. **Purpose** — What this tool does specifically
2. **Input formats** — What data formats it accepts
3. **Example queries** — When you'd use this tool
4. **Boundaries** — What it does NOT do
5. **Alternatives** — When to use a different tool instead

\`\`\`json
// ✅ GOOD — detailed description
{
  "name": "extract_web_results",
  "description": "Extracts structured data from web search result pages.
    Input: A URL to a search results page (Google, Bing, DuckDuckGo).
    Output: JSON array of {title, url, snippet} for each result.
    Use this for: Processing search engine result pages.
    Do NOT use for: Analyzing individual web articles (use analyze_article instead),
    or processing PDF/Word documents (use extract_document_data instead).
    Example: extract_web_results('https://google.com/search?q=...')"
}
\`\`\`

### Fixing Overlapping Tools

When two tools have near-identical descriptions, you have three options:

| Strategy | When to Use |
|---|---|
| **Rename + update description** | Tools serve different purposes but have confusing names |
| **Split into specific tools** | A generic tool does too many things |
| **Consolidate** | Two tools do essentially the same thing |

**Example — Splitting a generic tool:**

\`\`\`
❌ analyze_document (does everything)
    ↓ Split into:
✅ extract_data_points (structured extraction)
✅ summarize_content (narrative summary)
✅ verify_claim_against_source (fact checking)
\`\`\`

### System Prompt Keyword Interference

System prompt wording can override tool descriptions:

\`\`\`
# ❌ BAD — keyword "analyze" biases toward analyze_content
System prompt: "When users ask you to analyze something, carefully examine..."

# Result: Claude always picks analyze_content, even for documents
\`\`\`

**Fix:** Review system prompts for keyword-sensitive instructions that create unintended tool associations.

---

## Module 2.2 — Structured Error Responses

### The \`isError\` Flag

MCP tools communicate failures using the \`isError\` flag on the tool result. The \`isError\` boolean is part of the **MCP specification**. The fields below (\`errorCategory\`, \`isRetryable\`, etc.) are **recommended design patterns** you build on top of MCP — they are not built-in protocol fields, but they are the pattern tested on the exam.

\`\`\`json
{
  "isError": true,
  "content": [
    {
      "type": "text",
      "text": "{\\"errorCategory\\": \\"transient\\", \\"isRetryable\\": true, \\"message\\": \\"Database connection timed out after 30s\\", \\"attempted\\": \\"SELECT * FROM orders WHERE id = 12345\\"}"
    }
  ]
}
\`\`\`

### Four Error Categories

| Category | Meaning | Action | Retryable? |
|---|---|---|---|
| **Transient** | Timeout, service unavailable | Retry after delay | ✅ Yes |
| **Validation** | Bad input format, missing field | Fix the input, retry | ✅ Yes |
| **Business** | Policy violation (e.g., refund > limit) | Explain to user, escalate | ❌ No |
| **Permission** | Unauthorized access | Escalate to human/admin | ❌ No |

### Anti-Pattern: Generic Errors

\`\`\`json
// ❌ BAD — generic error
{"isError": true, "content": "Operation failed"}

// The agent can't decide: Should it retry? Escalate? Tell the user?
\`\`\`

\`\`\`json
// ✅ GOOD — structured error
{
  "isError": true,
  "content": {
    "errorCategory": "business",
    "isRetryable": false,
    "message": "Refund denied: order is outside 30-day return window",
    "customer_explanation": "Your order from January 5th is past the 30-day return period that ended February 4th."
  }
}
\`\`\`

### Key Distinction: Empty Results vs Errors

\`\`\`json
// This is NOT an error — the search worked, there are just no matches
{"isError": false, "content": {"results": [], "query": "order #99999"}}

// This IS an error — the search itself failed
{"isError": true, "content": {"errorCategory": "transient", "message": "Search API unavailable"}}
\`\`\`

### Error Propagation in Multi-Agent Systems

Subagents should:
1. Handle **transient errors locally** (retry within the subagent)
2. Propagate to coordinator **only what can't be resolved locally**
3. Include **partial results** and **what was attempted**

\`\`\`json
// Subagent error response to coordinator
{
  "status": "partial_failure",
  "successful_queries": ["AI music revenue", "AI art market"],
  "failed_queries": [
    {
      "query": "AI film production statistics",
      "error": "API rate limited",
      "retries_attempted": 3,
      "partial_results": ["Found 2 of expected 5 sources"],
      "alternatives": ["Try academic database search instead"]
    }
  ]
}
\`\`\`

---

## Module 2.3 — Tool Distribution and \`tool_choice\`

### The "Too Many Tools" Problem

| Tool Count | Effect |
|---|---|
| 4–5 tools per agent | ✅ Reliable selection |
| 10+ tools | ⚠️ Increasing misrouting |
| 18+ tools | ❌ Significantly degraded reliability |

### Scoped Tool Access

Each subagent should only get tools relevant to its role:

\`\`\`python
web_search_agent = AgentDefinition(
    name="web_search",
    allowedTools=["web_search", "fetch_url"],  # Only search tools
)

synthesis_agent = AgentDefinition(
    name="synthesis",
    allowedTools=["verify_fact"],  # Scoped cross-role tool for 85% of cases
)
\`\`\`

**Why?** A synthesis agent with access to \`web_search\` will start doing its own searching instead of synthesizing.

### \`tool_choice\` Configuration

| Setting | Behavior | Use Case |
|---|---|---|
| \`"auto"\` | Model decides whether to call a tool or respond with text | Default — most flexible |
| \`"any"\` | Model MUST call a tool (but chooses which one) | Guarantee structured output |
| \`{"type": "tool", "name": "X"}\` | Model MUST call tool X specifically | Force a specific tool first |

**Example — Forcing metadata extraction first:**

\`\`\`python
# First turn: force extract_metadata
response = client.messages.create(
    tools=tools,
    tool_choice={"type": "tool", "name": "extract_metadata"},
    messages=messages
)

# Subsequent turns: auto mode for remaining processing
response = client.messages.create(
    tools=tools,
    tool_choice="auto",
    messages=messages
)
\`\`\`

---

## Module 2.4 — MCP Server Configuration

### Two Scopes

| Scope | Config File | Shared? | Use Case |
|---|---|---|---|
| **Project** | \`.mcp.json\` (in repo root) | ✅ Version controlled | Team tooling (Jira, GitHub, DB) |
| **User** | \`~/.claude.json\` | ❌ Personal only | Experiments, personal tools |

### Environment Variables for Secrets

\`\`\`json
// .mcp.json — never commit actual tokens!
{
  "mcpServers": {
    "github": {
      "command": "mcp-server-github",
      "args": [],
      "env": {
        "GITHUB_TOKEN": "\${GITHUB_TOKEN}"  // ✅ Expanded from environment
      }
    }
  }
}
\`\`\`

### Simultaneous MCP Servers

All configured MCP servers are discovered at connection time and available **simultaneously**. No need to "activate" or "switch between" them.

### MCP Resources vs Tools

| MCP Concept | Purpose | Example |
|---|---|---|
| **Tools** | Perform actions, modify state | \`create_issue\`, \`process_refund\` |
| **Resources** | Read-only data exposure | Issue summaries, DB schemas, doc hierarchy |

Resources reduce **exploratory tool calls** — the agent can see what data is available without calling a tool first.

### Enhancing MCP Descriptions

Agents may prefer built-in tools (like \`Grep\`) over more capable MCP tools if the MCP descriptions are weak:

\`\`\`json
// ❌ Agent keeps using Grep instead of this
{"name": "search_codebase", "description": "Searches code"}

// ✅ Agent now prefers this over Grep
{"name": "search_codebase", "description": "Semantic code search across the entire repository.
  Unlike grep (literal pattern matching), this understands code semantics: finds related functions,
  follows type hierarchies, and understands import chains. Returns results ranked by relevance
  with code context snippets. Use this for: understanding code relationships, finding implementations
  of interfaces, tracing data flow. Use Grep instead for: exact string matching, regex patterns,
  finding specific error messages."}
\`\`\`

### Community vs Custom MCP Servers

**Prefer community MCP servers** for standard integrations (Jira, GitHub, Slack). Build **custom servers** only for team-specific workflows.

### MCP Resources — Content Catalogs

MCP servers can expose **resources** in addition to tools. Resources are read-only content catalogs that give agents visibility into available data **without making exploratory tool calls**.

| MCP Concept | Purpose | Example |
|---|---|---|
| **Tools** | Actions the agent can take | \`get_customer\`, \`process_refund\` |
| **Resources** | Data catalogs the agent can browse | Issue summaries, DB schemas, doc hierarchies |

\`\`\`python
# MCP server exposes resources
resources = [
    {
        "uri": "jira://project/SUPPORT/issues",
        "name": "Support Issues",
        "description": "All open support tickets with ID, status, and summary"
    },
    {
        "uri": "db://schema/customers",
        "name": "Customer Schema",
        "description": "Table structure: id, name, email, plan, created_at"
    }
]
\`\`\`

> **Exam focus:** Resources reduce exploratory tool calls. Instead of the agent calling \`list_tables\` → \`describe_table\` → \`describe_table\` (3 calls), it reads the DB schema resource directly (0 calls). This saves tokens and reduces latency.

**When to use resources vs tools:**
- **Resources**: Static or slowly-changing data (schemas, documentation, catalogs, configuration)
- **Tools**: Dynamic operations (queries, mutations, API calls)

---

## Module 2.5 — Built-in Tools

### The Six Built-in Tools

| Tool | Purpose | When to Use |
|---|---|---|
| **Grep** | Search file **contents** by pattern | Finding function callers, error messages, imports |
| **Glob** | Find files by **name/extension** pattern | \`**/*.test.tsx\`, \`src/**/*.py\` |
| **Read** | Load full file contents | Reading a file after finding it via Grep/Glob |
| **Write** | Write/overwrite entire file | Creating new files, full replacements |
| **Edit** | Targeted modification via unique text match | Changing specific code sections |
| **Bash** | Run shell commands | Build, test, install, arbitrary operations |

### Key Distinctions

**Grep vs Glob:**
- \`Grep\`: searches **inside files** (content) — "find all files containing \`processRefund\`"
- \`Glob\`: searches **file names/paths** — "find all files named \`*.test.tsx\`"

**Edit vs Read+Write:**
- \`Edit\`: Find unique text in a file and replace it — fast, surgical
- \`Read+Write\`: When Edit fails (text isn't unique), read the full file and write the modified version

### Incremental Investigation Pattern

Don't read all files upfront. Build understanding incrementally:

\`\`\`
1. Grep "processRefund"          → Find entry points
2. Read the main file found      → Understand the function
3. Grep "import.*processRefund"  → Find callers/importers
4. Read those files              → Trace the flow
\`\`\`

This is **more efficient** and **better for context management** than reading everything at once.

---

## Practice Questions — Domain 2

**Q1:** Two tools (\`get_customer\` and \`lookup_order\`) have minimal descriptions and accept similar identifier formats. Agents frequently pick the wrong one. What's the most effective **first step**?

A) Add few-shot examples showing correct tool selection
B) Expand each tool's description with formats, examples, boundaries
C) Implement a routing layer that pre-selects tools by keyword
D) Consolidate into a single \`lookup_entity\` tool

**Answer: B** — Tool descriptions are the root cause. Fix descriptions first before adding complexity.

---

**Q2:** A web search subagent times out. How should the failure flow back to the coordinator?

A) Return structured error (failure type, query, partial results, alternatives)
B) Retry with backoff, then return generic "search unavailable"
C) Return empty results marked as successful
D) Propagate the exception to terminate the workflow

**Answer: A** — Structured errors enable the coordinator to make intelligent recovery decisions.

---

**Q3:** Your synthesis agent needs to verify facts 85% of the time (simple lookups) and 15% (deep research). Currently it round-trips through the coordinator. What's the most effective fix?

A) Give it a scoped \`verify_fact\` tool; complex verifications stay with coordinator
B) Batch all verifications and send at end
C) Give synthesis agent full web search access
D) Have search agent pre-cache extra context

**Answer: A** — Scoped cross-role tool for the common case; preserve coordination for complex cases.

---

**Q4:** Which \`tool_choice\` setting guarantees the model calls a tool rather than responding with text?

A) \`"auto"\`
B) \`"any"\`
C) \`{"type": "tool", "name": "extract"}\`
D) Both B and C

**Answer: D** — \`"any"\` forces a tool call (model chooses which). Forced selection forces a specific tool. Both guarantee a tool is called.`,
  '3': `# Course 3: Claude Code Configuration & Workflows

> **Exam Weight: 20%** — Third-largest domain. Highly practical and testable.

---

## Module 3.1 — CLAUDE.md Configuration Hierarchy

### The Three Levels

\`\`\`
                                      Specificity / Priority on Conflict
                                              ▲
  subdirectory/CLAUDE.md              ← Most specific (WINS on conflict)  │
                                                                          │
  .claude/CLAUDE.md or root CLAUDE.md ← Project-level (shared via repo)   │
                                                                          │
  ~/.claude/CLAUDE.md                 ← User-level (personal, NOT shared) │
                                              ▼
\`\`\`

All levels are **loaded and merged** — they are additive, not replacements. When instructions conflict, the **most specific level wins** (directory-level overrides project-level, which overrides user-level).

### The Most Common Exam Trap

> **Scenario:** A new team member joins and doesn't get the team's coding conventions.
> **Root cause:** The instructions are in \`~/.claude/CLAUDE.md\` (user-level), not project-level.
> **Fix:** Move to \`.claude/CLAUDE.md\` (version controlled, shared via repo).

### The \`@import\` Syntax

Keep CLAUDE.md modular by importing external files:

\`\`\`markdown
# CLAUDE.md
Follow our coding standards defined in:
@./standards/coding-style.md
@./standards/testing-rules.md
@./standards/api-conventions.md
\`\`\`

- Maximum **5 nesting levels** for imports
- Paths are relative to the CLAUDE.md file location
- Keeps each file focused and maintainable

### \`.claude/rules/\` Directory

An alternative to one big CLAUDE.md — organize rules by topic:

\`\`\`
.claude/
  rules/
    testing.md           ← Testing conventions
    api-conventions.md   ← API design rules
    deployment.md        ← Deployment procedures
    security.md          ← Security requirements
\`\`\`

Each file can have **YAML frontmatter** for path-scoping (covered in Module 3.3).

### The \`/memory\` Command

Use \`/memory\` to **edit your user-level CLAUDE.md** — add or modify persistent memory entries that Claude remembers across sessions:

- **Add** new preferences, conventions, or project context
- **Modify** existing memory entries
- **Debug** why behavior differs between team members (different user-level memories)

---

## Module 3.2 — Custom Commands and Skills

### Commands vs Skills

| Feature | Commands | Skills |
|---|---|---|
| Location | \`.claude/commands/\` | \`.claude/skills/\` |
| Invocation | Slash command (\`/review\`) | On-demand or referenced |
| Configuration | Just a markdown file | SKILL.md with **frontmatter** |
| Isolation | Runs in main context | Can run in **forked context** |
| Tool restrictions | No | Yes (\`allowed-tools\`) |

### Project vs User Scope

| Scope | Commands | Skills |
|---|---|---|
| **Project** (shared) | \`.claude/commands/\` | \`.claude/skills/\` |
| **Personal** | \`~/.claude/commands/\` | \`~/.claude/skills/\` |

Project scope = version controlled = shared with team.
User scope = personal only = not shared.

### SKILL.md Frontmatter Options

\`\`\`yaml
---
context: fork          # Run in isolated context (prevents pollution)
allowed-tools:         # Restrict which tools the skill can use
  - Read
  - Write
  - Edit
argument-hint: "Provide the file path to analyze"  # Prompt for args
---

# My Skill
Instructions for what this skill does...
\`\`\`

### \`context: fork\` — The Key Feature

When a skill produces **verbose output** (e.g., codebase analysis, brainstorming), it can pollute the main conversation context with discovery data.

**Without fork:** Skill output stays in main context → eats token budget → degrades later responses.

**With \`context: fork\`:** Skill runs in an **isolated sub-agent context**. Only the skill's final summary returns to the main conversation.

### \`allowed-tools\` — Restricting Tool Access

\`\`\`yaml
allowed-tools:
  - Read
  - Grep
  - Glob
\`\`\`

This prevents a skill from using destructive tools (Write, Bash, Edit) when it only needs to read/analyze.

### \`argument-hint\` — Prompting for Parameters

When a developer invokes a skill without arguments:

\`\`\`yaml
argument-hint: "Provide the module name to analyze"
\`\`\`

Claude will prompt: "Which module would you like me to analyze?"

### Skills vs CLAUDE.md: When to Use Which

| Use Case | Mechanism |
|---|---|
| **Always loaded**, universal standards | CLAUDE.md |
| **On-demand**, task-specific workflow | Skill |
| Verbose output that shouldn't pollute context | Skill with \`context: fork\` |
| Restricted tool access needed | Skill with \`allowed-tools\` |

---

## Module 3.3 — Path-Specific Rules

### YAML Frontmatter with Glob Patterns

\`\`\`yaml
# .claude/rules/testing.md
---
paths:
  - "**/*.test.tsx"
  - "**/*.test.ts"
  - "**/*.spec.js"
---

# Testing Conventions
- Use React Testing Library, not Enzyme
- Mock API calls with MSW
- Each test file must have at least one snapshot test
\`\`\`

This file only loads when Claude is editing files matching those glob patterns.

### Rules vs Directory CLAUDE.md

| Scenario | Best Choice |
|---|---|
| Conventions for **scattered files** (tests everywhere) | \`.claude/rules/\` with globs |
| Conventions for a **specific directory** (\`src/api/\`) | Directory-level \`CLAUDE.md\` |

**Why?** Test files live alongside source code (\`Button.test.tsx\` next to \`Button.tsx\`). A directory-level CLAUDE.md can't cover test files spread across 50 directories. Glob patterns can.

### Examples

\`\`\`yaml
# .claude/rules/terraform.md
---
paths:
  - "terraform/**/*"
---
# Terraform rules...
\`\`\`

\`\`\`yaml
# .claude/rules/api.md
---
paths:
  - "src/api/**/*"
  - "src/routes/**/*"
---
# API conventions...
\`\`\`

---

## Module 3.4 — Plan Mode vs Direct Execution

### When to Use Plan Mode

| ✅ Plan Mode | ❌ Direct Execution |
|---|---|
| Large-scale changes (45+ files) | Single-file bug fix |
| Multiple valid approaches exist | Clear stack trace → obvious fix |
| Architectural decisions needed | Adding one validation check |
| Unfamiliar codebase | Well-understood code |
| Library migration | Simple refactor |
| Microservice restructuring | Documentation update |

### The Explore Subagent

For verbose discovery phases, use the **Explore subagent**:
- Isolates discovery output from the main conversation
- Returns a **summary** instead of raw data
- Prevents context window exhaustion during multi-phase tasks

### Combined Pattern

\`\`\`
1. Plan mode → Explore + design (context-efficient)
2. Direct execution → Implement the planned approach (focused)
\`\`\`

---

## Module 3.5 — Iterative Refinement

### Four Techniques

| Technique | When to Use |
|---|---|
| **Input/Output examples** | Prose descriptions produce inconsistent results |
| **Test-driven iteration** | Share test failures → Claude fixes → re-test |
| **Interview pattern** | Claude asks YOU questions before implementing |
| **Sequential vs parallel issues** | Interacting issues → one message. Independent → sequential |

### Input/Output Examples

When natural language is ambiguous, provide concrete examples:

\`\`\`markdown
Transform dates to ISO format:

Input: "March 5th, 2025"
Output: "2025-03-05"

Input: "5/3/25"
Output: "2025-03-05"

Input: "last Tuesday"
Output: null (cannot determine absolute date)
\`\`\`

2–3 examples are usually enough to resolve ambiguity.

### Test-Driven Iteration

\`\`\`
1. Write test suite (expected behavior, edge cases, performance)
2. Ask Claude to implement
3. Run tests → share failures with Claude
4. Claude fixes → re-test
5. Repeat until all tests pass
\`\`\`

### Interview Pattern

Instead of diving into implementation, have Claude **ask questions first**:

\`\`\`
"Before I implement the caching layer, I have some questions:
1. What's the expected cache invalidation strategy?
2. Should cache misses fall through to the database synchronously?
3. Are there any consistency requirements between cache and DB?
4. What's the expected cache hit ratio?"
\`\`\`

This surfaces considerations you might not have anticipated.

### Sequential vs Parallel Issue Resolution

- **Independent problems** → Fix one at a time (sequential messages)
- **Interacting problems** → Describe all in one message (fixes may conflict)

---

## Module 3.6 — CI/CD Integration

### The \`-p\` Flag

> **This is the single most tested CI/CD fact:** Use \`-p\` (or \`--print\`) for non-interactive mode.

\`\`\`bash
# ✅ Correct — non-interactive, prints to stdout, exits
claude -p "Analyze this PR for security issues"

# ❌ Wrong — hangs waiting for interactive input
claude "Analyze this PR for security issues"
\`\`\`

### Structured CI Output

\`\`\`bash
# JSON output with schema validation
claude -p "Review this PR" \\
  --output-format json \\
  --json-schema '{"type":"object","properties":{"findings":[...]}}'
\`\`\`

This produces **machine-parseable output** for automated posting as inline PR comments.

### Session Isolation for Reviews

> **Don't self-review.** The same session that generated code retains reasoning context, making it less likely to question its own decisions.

Use an **independent instance** (separate session) for code review.

### CI Best Practices

| Practice | How |
|---|---|
| Avoid duplicate PR comments | Include prior findings in context; ask for only new/unresolved issues |
| Avoid duplicate test suggestions | Provide existing test files in context |
| Improve test quality | Document testing standards and fixtures in CLAUDE.md |
| Handle re-reviews | Include previous review + new commits; report only new issues |

---

## Practice Questions — Domain 3

**Q1:** A new developer clones the repo but doesn't get the team's coding conventions applied. Where are the conventions most likely configured?

A) \`.claude/CLAUDE.md\` in the project
B) \`~/.claude/CLAUDE.md\` in the original developer's home directory
C) \`.claude/rules/conventions.md\` with path scoping
D) \`.claude/skills/SKILL.md\` with the conventions

**Answer: B** — User-level config isn't shared. Move to project-level \`.claude/CLAUDE.md\`.

---

**Q2:** Your CI pipeline runs \`claude "Review this PR"\` but the job hangs indefinitely. What's wrong?

A) Missing \`CLAUDE_HEADLESS=true\` environment variable
B) Need to add the \`-p\` flag for non-interactive mode
C) Need to redirect stdin from \`/dev/null\`
D) Need to add the \`--batch\` flag

**Answer: B** — \`-p\` is the documented way to run Claude Code in CI. The other options don't exist.

---

**Q3:** Test files are spread across the codebase (\`Button.test.tsx\` alongside \`Button.tsx\`). You want consistent test conventions everywhere. What's the best approach?

A) \`.claude/rules/testing.md\` with \`paths: ["**/*.test.tsx", "**/*.test.ts"]\`
B) Root CLAUDE.md with test conventions under a "Testing" header
C) \`.claude/skills/testing-skill/SKILL.md\` with test conventions
D) CLAUDE.md in each subdirectory containing test files

**Answer: A** — Glob patterns match scattered files regardless of directory. B relies on inference. C requires manual invocation. D is impractical for 50+ directories.

---

**Q4:** A skill produces verbose codebase analysis output that fills the context window. How do you prevent this from degrading later responses?

A) Add \`allowed-tools: [Read, Grep]\` to the SKILL.md frontmatter
B) Add \`context: fork\` to the SKILL.md frontmatter
C) Move the skill instructions to CLAUDE.md
D) Split the skill into multiple smaller skills

**Answer: B** — \`context: fork\` runs the skill in an isolated sub-agent context. Only the summary returns to the main conversation.`,
  '4': `# Course 4: Prompt Engineering & Structured Output

> **Exam Weight: 20%** — Equal weight with Domain 3. Heavy focus on practical patterns.

---

## Module 4.1 — Explicit Criteria (Reducing False Positives)

### The Problem with Vague Instructions

\`\`\`
❌ "Check that comments are accurate"
❌ "Be conservative in your findings"
❌ "Only report high-confidence findings"
\`\`\`

These instructions sound reasonable but **fail to improve precision**. Claude doesn't know what "accurate" or "conservative" means in your specific context.

### Explicit Criteria Pattern

Define **what to flag** AND **what to ignore**:

\`\`\`markdown
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
- **Critical**: \`user_input\` used directly in SQL query (SQL injection)
- **High**: Missing null check before \`.length\` on nullable array
- **Medium**: Async function missing error handling (try/catch)
- **Low**: Unused variable imported but not referenced
\`\`\`

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

\`\`\`markdown
## Examples

### Example 1: Report (genuine bug)
**Code:**
\\\`\\\`\\\`python
def get_user_age(user):
    return user["age"]  # KeyError if "age" missing
\\\`\\\`\\\`
**Finding:** Missing key check. \`user.get("age")\` or try/except needed.
**Severity:** High
**Reasoning:** Runtime crash in production. Not a style issue.

### Example 2: Skip (acceptable pattern)
**Code:**
\\\`\\\`\\\`python
# HACK: workaround for upstream API bug #1234
result = api.get_data(force_refresh=True)
\\\`\\\`\\\`
**Finding:** None — skip this.
**Reasoning:** The HACK comment references a specific upstream issue.
This is a documented workaround, not a code smell.
\`\`\`

### Key Properties

- **2–4 examples** is usually sufficient (not 8–10)
- Target **ambiguous** scenarios (not obvious ones)
- Examples enable **generalization** — Claude applies the judgment pattern to novel cases it hasn't seen
- Include examples for **varied document structures** (inline citations vs. bibliographies, narrative vs. tables)

### Few-Shot for Extraction Tasks

When extracting data from documents with varied formats:

\`\`\`markdown
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
\`\`\`

---

## Module 4.3 — Structured Output with \`tool_use\` and JSON Schemas

### Why \`tool_use\` Is the Best Approach

| Approach | Syntax Errors | Semantic Errors |
|---|---|---|
| "Return JSON in your response" | ❌ Common | ❌ Common |
| "Use this JSON format: ..." | ⚠️ Occasional | ❌ Common |
| **\`tool_use\` with JSON schema** | ✅ **Eliminated** | ⚠️ Still possible |

\`tool_use\` with schemas guarantees **schema-compliant** output. But it does NOT prevent semantic errors (e.g., line items that don't sum to the total).

### Implementation

\`\`\`python
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
\`\`\`

### Schema Design Best Practices

| Pattern | When | Example |
|---|---|---|
| \`required\` | Field is always present in source documents | \`invoice_number\` |
| \`["type", "null"]\` (nullable) | Field may not exist in source | \`payment_terms\` |
| \`enum\` | Fixed set of valid values | \`["USD", "EUR", "GBP"]\` |
| \`enum\` + \`"other"\` + detail | Extensible categories | \`currency\` with \`currency_detail\` |
| \`"unclear"\` enum value | Ambiguous cases | \`classification: "unclear"\` |

### Critical Rule: Nullable Fields Prevent Hallucination

If a field is \`required\` but the source document doesn't contain that information, Claude will **fabricate** a value to satisfy the schema.

**Fix:** Make it \`["string", "null"]\` and NOT required → Claude returns \`null\` instead of hallucinating.

### \`tool_choice\` for Structured Output

\`\`\`python
# Guarantee structured output (model MUST call a tool)
tool_choice = "any"  # Model chooses which extraction tool

# Force a SPECIFIC tool
tool_choice = {"type": "tool", "name": "extract_invoice"}

# Let model decide whether to extract or respond
tool_choice = "auto"  # Default — may return text instead
\`\`\`

### Format Normalization

Include normalization rules in prompts **alongside** strict schemas:

\`\`\`markdown
When extracting dates, normalize to ISO 8601:
- "March 5, 2025" → "2025-03-05"
- "5/3/25" → "2025-03-05" (assume US date format MM/DD/YY)
- "Q1 2025" → "2025-01-01" (use first day of quarter)

When extracting currencies, normalize to uppercase ISO codes:
- "$" → "USD", "€" → "EUR", "£" → "GBP"
\`\`\`

---

## Module 4.4 — Validation, Retry, and Feedback Loops

### Retry-with-Error-Feedback

When extraction fails validation, re-prompt with:
1. The **original document**
2. The **failed extraction**
3. The **specific validation error**

\`\`\`python
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
\`\`\`

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

\`\`\`json
{
  "stated_total": 1250.00,
  "calculated_total": 1275.00,
  "conflict_detected": true
}
\`\`\`

Extract BOTH the stated total and the calculated sum of line items. If they differ, flag the conflict instead of silently picking one.

### \`detected_pattern\` Field

Track what code constructs trigger findings for systematic analysis:

\`\`\`json
{
  "finding": "Potential null pointer dereference",
  "severity": "high",
  "location": "src/api/handler.ts:45",
  "detected_pattern": "optional_chain_missing",
  "suggested_fix": "Use optional chaining: user?.profile?.email"
}
\`\`\`

When developers dismiss findings, you can analyze which \`detected_pattern\` values have high dismissal rates and improve prompts for those patterns.

### Pydantic Validation

Use **Pydantic** (Python) for schema validation when processing \`tool_use\` outputs:

\`\`\`python
from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum

class Category(str, Enum):
    invoice = "invoice"
    receipt = "receipt"
    contract = "contract"
    other = "other"

class Extraction(BaseModel):
    title: str
    category: Category
    amount: Optional[float] = Field(None, description="Nullable if not in document")
    date: Optional[str] = None
    confidence: float = Field(ge=0.0, le=1.0)

# Validate tool_use output
try:
    result = Extraction(**tool_output)
except ValidationError as e:
    # Retry with specific errors attached
    retry_with_feedback(document, tool_output, str(e))
\`\`\`

> **Exam focus:** Pydantic catches **semantic validation errors** (wrong types, out-of-range values, missing required fields) that JSON schema alone misses. Tool use eliminates syntax errors; Pydantic eliminates semantic errors. Both together provide comprehensive validation.

| Validation Layer | Catches | Example |
|---|---|---|
| JSON Schema (tool_use) | Syntax: malformed JSON, wrong types | String where number expected |
| Pydantic | Semantic: invalid values, business rules | Amount = -500, date in future |
| Custom logic | Domain: cross-field consistency | Line items don't sum to total |

---

## Module 4.5 — Batch Processing

### Message Batches API

| Feature | Detail |
|---|---|
| **Cost savings** | 50% compared to synchronous API |
| **Processing window** | Up to 24 hours (no guaranteed latency) |
| **Multi-turn tool calling** | ❌ NOT supported |
| **Correlation** | \`custom_id\` field links requests to responses |

### When to Use Batch vs Synchronous

| Workflow | API |
|---|---|
| Pre-merge code review (blocking) | **Synchronous** — developer is waiting |
| Overnight technical debt report | **Batch** — nobody is waiting |
| Weekly audit of 10,000 documents | **Batch** — latency tolerance is high |
| Real-time customer support | **Synchronous** — customer is waiting |
| Nightly test generation | **Batch** — runs while team sleeps |

### Batch Failure Handling

\`\`\`python
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
\`\`\`

### SLA Calculations

If batch processing takes up to 24 hours, and your SLA requires results within 30 hours, you need to submit batches with enough buffer:

\`\`\`
SLA: 30 hours
Batch processing: up to 24 hours
Buffer needed: 30 - 24 = 6 hours
→ Submit batches at least every 6 hours
\`\`\`

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

\`\`\`
Pass 1: File A — local analysis
Pass 2: File B — local analysis
Pass 3: File C — local analysis
...
Pass N: Cross-file integration pass (data flow, API contracts)
\`\`\`

**Why?** Analyzing 14 files in one pass causes:
- ❌ Detailed feedback for some, superficial for others
- ❌ Obvious bugs missed
- ❌ Contradictory findings (flagging a pattern in one file, approving it in another)

### Confidence-Based Review Routing

\`\`\`json
{
  "finding": "Potential race condition in concurrent handler",
  "confidence": 0.65,
  "reasoning": "Two goroutines access shared state without synchronization"
}
\`\`\`

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

A) Add \`"default": "N/A"\` to the \`payment_terms\` field
B) Make \`payment_terms\` type \`["string", "null"]\` and remove from \`required\`
C) Add "do not fabricate" to the extraction prompt
D) Add validation that checks extracted terms against a known list

**Answer: B** — Nullable optional fields let Claude return \`null\` instead of making up values.

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

**Answer: B** — Per-file passes ensure consistent depth; integration pass catches cross-file issues. D would suppress detection of real bugs.`,
  '5': `# Course 5: Context Management & Reliability

> **Exam Weight: 15%** — Smallest domain, but concepts appear across all scenarios.

---

## Module 5.1 — Preserving Critical Information

### Progressive Summarization Risks

When context is compressed (e.g., via \`/compact\`), exact values get lost:

\`\`\`
❌ Before summarization: "Customer's order #ORD-4521 for $847.50 placed on 2025-01-15"
❌ After summarization:  "Customer had a recent order with an issue"
\`\`\`

Lost: order number, exact amount, exact date. These are critical for downstream processing.

### The "Case Facts" Block Solution

Extract transactional facts into a **persistent structured block** that lives outside summarized history:

\`\`\`markdown
## Case Facts (do not summarize)
- Customer ID: CUST-12345
- Order: #ORD-4521
- Amount: $847.50
- Order Date: 2025-01-15
- Issue: Damaged item received
- Status: Return requested
\`\`\`

This block is included in **every prompt**, separate from the conversation history, so facts survive summarization.

### The "Lost in the Middle" Effect

Models process information at the **beginning** and **end** of long inputs reliably. Information in the **middle** gets less attention.

\`\`\`
┌─────────────────────────────────────────┐
│▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░▓▓▓▓▓▓▓▓│
│ HIGH         LOW ATTENTION       HIGH   │
│ATTENTION                       ATTENTION│
└─────────────────────────────────────────┘
 Start ◄──── Middle ────► End
\`\`\`

**Fix:** Place key findings summaries at the **beginning** of aggregated inputs. Use explicit section headers to help the model navigate.

### Trimming Verbose Tool Outputs

Tool results like \`get_order\` may return 40+ fields when only 5 are relevant:

\`\`\`python
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
\`\`\`

### Context-Efficient Subagent Output

Subagents should return **structured summaries**, not raw data:

\`\`\`python
# ❌ BAD: Subagent returns verbose raw content (15 pages)
return full_search_results  # Fills coordinator's context

# ✅ GOOD: Subagent returns structured summary
return {
    "key_findings": ["AI music revenue grew 40% in 2025", ...],
    "sources": [{"url": "...", "title": "...", "date": "..."}],
    "relevance_score": 0.85,
    "coverage_gaps": ["No data found on AI in theater"]
}
\`\`\`

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

\`\`\`
Customer says "get me a manager" ──► ESCALATE IMMEDIATELY
                                      (don't try to resolve first)

Issue is within agent's capability ──► TRY TO RESOLVE
  BUT customer reiterates human request ──► THEN ESCALATE

Policy is silent on customer's request ──► ESCALATE
  (e.g., competitor price matching       (flag as policy gap)
   when policy only covers own-site)

Multiple customer matches found ──► ASK FOR MORE IDENTIFIERS
                                    (don't guess based on heuristics)
\`\`\`

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

\`\`\`
❌ Pick the most recent one (heuristic — might be wrong)
❌ Pick the one in the same city (assumption — might be wrong)
✅ Ask: "I found multiple accounts for John Smith. Can you provide
   your email address or phone number to help me find the right one?"
\`\`\`

---

## Module 5.3 — Error Propagation in Multi-Agent Systems

### Structured Error Context

When a subagent fails, return **rich context**, not generic errors:

\`\`\`json
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
\`\`\`

### Anti-Patterns

| Anti-Pattern | Why It's Bad |
|---|---|
| **Silent suppression** (return empty as success) | Coordinator thinks search found nothing; doesn't retry or use alternatives |
| **Terminate entire workflow** on one failure | Wastes successful subagent results; one failure shouldn't kill everything |
| **Generic error status** | Hides valuable context; coordinator can't make recovery decisions |

### Coverage Annotations

The synthesis output should annotate coverage quality:

\`\`\`markdown
## Research Report: AI in Creative Industries

### Visual Arts (FULL COVERAGE)
AI-generated art revenue... [3 sources, consistent findings]

### Music (PARTIAL COVERAGE)
Limited data available... [1 source — web search timed out for 2 additional queries]

### Film Production (NO COVERAGE)
⚠️ No sources found — web search subagent failed for all film-related queries.
Consider manual research or re-running with alternative search terms.
\`\`\`

---

## Module 5.4 — Large Codebase Exploration

### Context Degradation Problem

In extended exploration sessions, models start:
- Giving inconsistent answers
- Referencing "typical patterns" instead of specific classes discovered earlier
- Losing track of what's already been found

### Scratchpad Files

Use **external files** to persist findings across context boundaries:

\`\`\`python
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
\`\`\`

### Subagent Delegation for Context Isolation

Spawn subagents for specific questions to keep the main agent's context clean:

\`\`\`
Main Agent (coordinator — high-level understanding)
  ├── Subagent: "Find all test files" → returns: ["test list summary"]
  ├── Subagent: "Trace refund flow dependencies" → returns: ["flow summary"]
  └── Subagent: "Analyze payment module" → returns: ["module summary"]
\`\`\`

The main agent gets **1-line summaries** instead of the raw output from reading 15+ files.

### Crash Recovery with Manifests

For long multi-agent workflows:

\`\`\`json
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
\`\`\`

On resume, the coordinator loads the manifest and re-injects completed agent states into prompts.

### Using \`/compact\`

When context fills with verbose discovery output during long sessions:
- \`/compact\` compresses the conversation history
- **Risk:** Loses exact numbers, dates, percentages
- **Mitigation:** Extract key facts to a scratchpad BEFORE compacting

---

## Module 5.5a — Prompt Caching and Cost Optimization

### The \`cache_control\` Mechanism

The Anthropic API supports **prompt caching** to reduce costs and latency when you repeatedly send the same large content blocks (system prompts, long documents, tool definitions):

\`\`\`python
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
\`\`\`

### How It Works

| Concept | Detail |
|---|---|
| **What gets cached** | Content blocks marked with \`cache_control: {"type": "ephemeral"}\` |
| **Cache lifetime** | ~5 minutes (ephemeral) — refreshed on each use |
| **Cost savings** | Cached input tokens cost **90% less** than uncached |
| **Latency savings** | Cached content is processed faster (no re-encoding) |
| **What to cache** | System prompts, large documents, tool definitions, few-shot examples |

### Best Practices

\`\`\`python
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
\`\`\`

### When to Use Caching

| Scenario | Cache? | Why |
|---|---|---|
| Long system prompt reused across many requests | Yes | Same content, high repetition |
| Large document analyzed with multiple questions | Yes | Document is stable, questions vary |
| Tool definitions (many tools) | Yes | Tools don't change between calls |
| User messages | No | Different every time |
| Short system prompts (<1024 tokens) | No | Below minimum cacheable size |

### Exam Insight

> If a question asks about **reducing API costs for repeated large prompts**, the answer involves \`cache_control: {"type": "ephemeral"}\` on stable content blocks — not reducing prompt length or switching models.

---

## Module 5.5b — Human Review and Confidence Calibration

### The 97% Accuracy Trap

Aggregate accuracy can mask terrible performance on subsets:

\`\`\`
Overall accuracy: 97%  ← Looks great!

By document type:
- Invoices:     99%    ← Great
- Contracts:    98%    ← Great
- Handwritten:  40%    ← Terrible! Hidden by the aggregate
\`\`\`

### Stratified Sampling

Don't just random-sample. **Stratify by document type AND field:**

\`\`\`
Sample plan:
- 50 invoices → check: vendor, amount, date, line items
- 50 contracts → check: parties, terms, dates, clauses
- 50 handwritten → check: all fields (known weakness)
\`\`\`

### Confidence Calibration

1. Have the model output **field-level confidence scores**
2. Calibrate thresholds using a **labeled validation set**
3. Route based on calibrated confidence:

\`\`\`
High confidence (>0.95, calibrated) → Auto-approve
Medium confidence (0.7-0.95) → Spot-check queue
Low confidence (<0.7) → Human review required
Contradictory sources → Always human review
\`\`\`

### Accuracy Segmentation

Before reducing human review, verify accuracy is consistent **across all segments**:

\`\`\`python
accuracy_by_type = {
    "invoice": 0.99,
    "contract": 0.98,
    "receipt": 0.96,
    "handwritten_note": 0.40  # ← BLOCK: too low for automation
}

# Only automate types with >95% accuracy
automate = {t: a for t, a in accuracy_by_type.items() if a > 0.95}
\`\`\`

---

## Module 5.6 — Information Provenance

### What Is Provenance?

**Provenance** = knowing WHERE each claim came from. Without it, you can't verify or audit the output.

### Claim-Source Mappings

Every claim in a synthesis should be traceable to its source:

\`\`\`json
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
\`\`\`

### Handling Conflicting Sources

When two credible sources disagree:

\`\`\`markdown
❌ WRONG: "AI market is valued at $150B" (silently picked one)

✅ CORRECT: "AI market valuation varies by source:
    - Forbes (Jan 2025): $150B
    - McKinsey (Mar 2025): $180B
    Difference may reflect different scope definitions—Forbes
    covers software only while McKinsey includes hardware."
\`\`\`

**Rules:**
- Preserve **both values** with source attribution
- Include **publication/collection dates** (temporal differences aren't contradictions)
- Note methodological differences when known

### Temporal Data

Always require dates in structured outputs to prevent temporal confusion:

\`\`\`json
{
  "claim": "Global AI market size",
  "value_a": "$150B",
  "source_a_date": "2025-01-15",
  "value_b": "$180B",
  "source_b_date": "2025-03-01",
  "note": "Different measurement dates; may reflect market growth, not contradiction"
}
\`\`\`

### Coverage Annotations

Reports should indicate completeness:

\`\`\`markdown
## Findings

### Market Size (FULL COVERAGE — 5 sources)
Well-established consensus around $150-180B...

### Regulatory Impact (PARTIAL COVERAGE — 2 sources)
Limited data; EU AI Act analysis available but no US regulatory data found.

### Employment Effects (COVERAGE GAP)
No primary sources found. All claims are from secondary reports
citing the same unpublished study.
\`\`\`

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

**Q1:** After using \`/compact\`, the agent loses the customer's order number and refund amount. What should have been done?

A) Don't use \`/compact\` at all
B) Extract transactional facts to a persistent "case facts" block before \`/compact\`
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

**Answer: B** — Provenance must be built into the structured data flow from the start, not patched after.`,
  '6': `# Course 6: Exam Edge Cases & Traps

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

\`\`\`
Does the policy address the customer's request?
├── YES, and it ALLOWS it ──────► PROCESS the request
├── YES, and it DENIES it ──────► DENY with explanation
└── NO (policy is silent) ──────► ESCALATE (policy gap)
\`\`\`

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

\`\`\`python
def pre_tool_use_hook(tool_name, tool_input):
    if tool_name == "process_refund" and tool_input["amount"] > 500:
        return block_and_escalate()
    return allow()
\`\`\`

This blocks a single $600 refund. ✅

### The Gap: Split Transactions

A customer is owed $1,200 for three defective items ($400 + $350 + $450). The agent processes three separate refunds — **all below $500** — and the hook allows each one.

**Total refunded: $1,200** — far above the $500 policy intent.

### The Fix: Stateful Cumulative Tracking

\`\`\`python
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
                "message": f"Cumulative refund \${cumulative} exceeds $500 limit",
                "redirect": "escalate_to_human"
            }

        # Track the approved amount
        session_refund_totals[order_id] = cumulative
        return allow()
\`\`\`

### Exam Signal

If a question mentions:
- Multiple refunds for the same order
- Items processed individually that total more than the limit
- "Each below the threshold but total above"

→ **The answer involves cumulative/aggregate tracking**, not per-transaction hooks.

---

## Trap 3 — Session State Across Follow-Ups

### The Scenario

\`\`\`
Turn 1: Customer asks about order #8842
Turn 2: Agent calls get_customer → verifies identity ✅
Turn 3: Agent processes return for order #8842
Turn 4: Customer says "Also, what's my loyalty points balance?"
Turn 5: Agent calls get_customer AGAIN → redundant ❌
\`\`\`

### Why This Happens

The agent doesn't recognize that the customer verified in Turn 2 is the **same customer** in Turn 4. Without explicit guidance, it treats each new topic as a fresh interaction.

### The Fix

Add session state awareness to the system prompt:

\`\`\`markdown
## Session State Rules
- Once a customer is verified via \`get_customer\`, that verification
  is valid for the ENTIRE session. Do NOT re-verify for follow-up
  questions about the same customer.
- When handling follow-up requests, check if the customer was already
  verified earlier in the conversation before calling \`get_customer\`.
- Only re-verify if the customer explicitly provides different
  identifying information suggesting they're asking about a different
  account.
\`\`\`

### The Exam Distinction

| Situation | Action |
|---|---|
| Same customer, new question in same session | **Don't re-verify** — use existing verification |
| Different customer identifier provided | **Re-verify** — may be a different account |
| New session (no prior history) | **Verify** — fresh start |

### Why This Isn't the Same as "Maintaining Conversation History"

The Messages API is **stateless** — you send full conversation history each turn. The model CAN see that \`get_customer\` was called in Turn 2. The issue is that without explicit guidance, the model **defaults to re-verifying** because it treats verification as a per-request requirement rather than a per-session state.

---

## Trap 4 — Empty Results vs Tool Errors

### The Scenario

\`\`\`python
# Database is down for maintenance
order = lookup_order("ORD-5582")
# Returns: {"orders": [], "isError": false}
\`\`\`

The tool returns successfully (\`isError: false\`) with empty results — but the empty results are caused by a database outage, NOT by a non-existent order.

The agent tells the customer: **"Order #5582 doesn't exist."** ← WRONG

### The Distinction

| Situation | \`isError\` | \`results\` | Meaning |
|---|---|---|---|
| Order genuinely doesn't exist | \`false\` | \`[]\` | No matching order — valid result |
| Database is down | \`true\` | N/A | Tool itself failed — transient error |
| Invalid format provided | \`true\` | N/A | Bad input — validation error |

### The Fix: Tool Must Distinguish Internally

The tool implementation must differentiate between:

\`\`\`json
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
\`\`\`

### Exam Signal

If a question mentions:
- A tool returning empty results during known outages
- The agent incorrectly telling users something doesn't exist
- Maintenance windows causing incorrect behavior

→ **The answer involves distinguishing empty results (\`isError: false\`) from access failures (\`isError: true\`).**

---

## Trap 5 — \`tool_choice\` Workflow: Forced → Then Auto

### The Pattern

Some workflows need a **specific tool called first**, then flexibility afterward:

\`\`\`python
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
\`\`\`

### The Three Settings Side-by-Side

| Setting | Guarantee | Model Freedom | Use Case |
|---|---|---|---|
| \`"auto"\` | None — might return text only | Full freedom | Default behavior |
| \`"any"\` | Will call A tool (not text) | Chooses which tool | Guarantee structured output |
| \`{"type":"tool","name":"X"}\` | Will call tool X specifically | No choice | Mandatory first step |

### Key Exam Facts

- \`"auto"\` = model may **skip tools entirely** and respond with text (20% of cases in extraction scenarios)
- \`"any"\` = guarantees a tool call but the **model chooses which** — good when you have one extraction tool
- Forced selection = guarantees a **specific** tool — good for mandatory prerequisites
- You can **change \`tool_choice\` between turns** — forced on turn 1, auto on subsequent turns
- \`"required"\` does NOT exist as a \`tool_choice\` option

---

## Trap 6 — Edit Tool Fallback Chain

### Built-in Edit Tool: How It Works

The Edit tool finds a **unique text match** in the file and replaces it. If the text isn't unique (appears multiple times), the edit fails.

### The Fallback Chain

\`\`\`
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
\`\`\`

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

> "Find all test files" → **Glob** (\`**/*.test.tsx\`)
> "Find all files that call processRefund" → **Grep** (\`processRefund\`)

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

5. \`lookup_order\` returns \`{"orders": [], "isError": false}\` during DB maintenance. **What's wrong?**
   → Tool should return \`isError: true\` for transient failures, not empty success.

6. \`tool_choice: "auto"\` and model returns text instead of calling extraction tool. **Fix?**
   → Change to \`"any"\` or forced selection.

7. Edit fails — anchor text appears 4 times in file. **Next step?**
   → Try longer anchor. If still not unique, use Read + Write.

8. "Find all \`.test.tsx\` files" — **Grep or Glob?**
   → Glob (searching file names, not contents).

9. Two sources say AI market is $150B (Jan) and $180B (Mar). **How to synthesize?**
   → Preserve both with dates and source attribution.

10. Subagent timeout. Return \`{"error": "failed"}\`? **Good enough?**
    → No. Return structured context: failure type, partial results, alternatives.

**If you got all 10 right instantly → you're exam-ready.**

---

## Scenario Practice: Customer Support Agent

*You are building a customer support resolution agent using the Claude Agent SDK. The agent handles returns, billing disputes, and account issues through custom MCP tools (\`get_customer\`, \`lookup_order\`, \`process_refund\`, \`escalate_to_human\`). Your target is 80%+ first-contact resolution.*

**SP-1:** Production data shows that in 12% of cases, the agent skips \`get_customer\` and calls \`lookup_order\` using only the customer's stated name, occasionally leading to misidentified accounts and incorrect refunds. What change most effectively addresses this?

A) Add a programmatic prerequisite that blocks \`lookup_order\` and \`process_refund\` until \`get_customer\` has returned a verified customer ID
B) Enhance the system prompt to state that customer verification via \`get_customer\` is mandatory before any order operations
C) Add few-shot examples showing the agent always calling \`get_customer\` first
D) Implement a routing classifier that pre-selects tools per request type

**Answer: A** — When a specific tool sequence is required for critical business logic (like verifying identity before processing refunds), programmatic enforcement (hooks/prerequisites) provides deterministic guarantees that prompt-based approaches cannot. Options B and C rely on probabilistic LLM compliance, which is insufficient when errors have financial consequences. *(Domains: D1, D2)*

**SP-2:** Your agent achieves 55% first-contact resolution, well below the 80% target. Logs show it escalates straightforward cases (standard damage replacements with photo evidence) while attempting to handle complex policy exceptions autonomously. What's the most effective way to improve escalation calibration?

A) Add explicit escalation criteria to the system prompt with few-shot examples demonstrating when to escalate vs resolve autonomously
B) Have the agent self-report a confidence score (1-10) and escalate below a threshold
C) Deploy a separate classifier trained on historical tickets
D) Implement sentiment analysis to detect frustration and auto-escalate

**Answer: A** — Explicit criteria with few-shot examples directly addresses unclear decision boundaries. Option B fails because LLM self-reported confidence is poorly calibrated. Option C is over-engineered when prompt optimization hasn't been tried. Option D relies on sentiment which doesn't correlate with case complexity. *(Domains: D1, D5)*

---

## Scenario Practice: Code Generation with Claude Code

*You are using Claude Code for software development — code generation, refactoring, debugging, and documentation. You need to integrate it with custom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct execution.*

**SP-3:** You want to create a custom \`/review\` slash command that runs your team's standard code review checklist. It should be available to every developer when they clone the repo. Where should you create this command file?

A) In the \`.claude/commands/\` directory in the project repository
B) In \`~/.claude/commands/\` in each developer's home directory
C) In the \`CLAUDE.md\` file at the project root
D) In a \`.claude/config.json\` file with a \`commands\` array

**Answer: A** — Project-scoped custom commands in \`.claude/commands/\` are version-controlled and automatically available to all developers. Option B is for personal commands not shared via git. Option C is for project context, not command definitions. Option D doesn't exist. *(Domain: D3)*

**SP-4:** Your codebase has React components (functional style), API handlers (async/await), and test files spread throughout. You want Claude to automatically apply the correct conventions per file type. What's the most maintainable approach?

A) Create rule files in \`.claude/rules/\` with YAML frontmatter specifying glob patterns to conditionally apply conventions based on file paths
B) Consolidate all conventions in root CLAUDE.md under section headers
C) Create skills in \`.claude/skills/\` for each code type
D) Place a separate CLAUDE.md file in each subdirectory

**Answer: A** — \`.claude/rules/\` files with \`paths: ["**/*.test.tsx"]\` glob patterns automatically apply conventions based on file paths — essential for test files spread throughout. Option B relies on inference rather than explicit matching. Option C requires manual invocation. Option D can't handle files spread across many directories. *(Domain: D3)*

---

## Scenario Practice: Multi-Agent Research System

*You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates to specialized subagents: one searches the web, one analyzes documents, one synthesizes findings. The system must produce comprehensive, cited reports.*

**SP-5:** After running the system on "impact of AI on creative industries," the reports cover only visual arts (digital art, graphic design, photography), completely missing music, writing, and film. The coordinator decomposed the topic into three visual-arts-only subtasks. What is the most likely root cause?

A) The synthesis agent lacks instructions for identifying coverage gaps
B) The coordinator agent's task decomposition is too narrow, missing relevant domains
C) The web search agent's queries aren't comprehensive enough
D) The document analysis agent is filtering out non-visual sources

**Answer: B** — The coordinator's logs show it decomposed "creative industries" into only visual arts subtasks. Subagents executed their assigned tasks correctly — the problem is what they were assigned. Options A, C, and D blame downstream agents working correctly within their scope. *(Domains: D1, D5)*

**SP-6:** The web search subagent times out while researching a complex topic. Which error propagation approach best enables the coordinator to recover intelligently?

A) Return structured error context including failure type, attempted query, partial results, and potential alternative approaches
B) Implement automatic retry with exponential backoff, returning a generic "search unavailable" status after all retries are exhausted
C) Catch the timeout and return an empty result set marked as successful
D) Propagate the timeout exception directly to terminate the entire workflow

**Answer: A** — Structured error context gives the coordinator enough information to decide: retry with modified query, try an alternative approach, or proceed with partial results. Option B hides context behind a generic status. Option C suppresses the error. Option D kills the entire workflow unnecessarily. *(Domains: D1, D5)*

---

## Scenario Practice: Developer Productivity Tools

*You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers explore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive tasks. It uses built-in tools (Read, Write, Bash, Grep, Glob) and integrates with MCP servers.*

**SP-7:** The synthesis agent frequently needs to verify specific claims while combining findings. Currently, verification round-trips through the coordinator add 2-3 extra calls per task (40% latency increase). 85% of verifications are simple fact-checks (dates, names). What's the most effective approach?

A) Give the synthesis agent a scoped \`verify_fact\` tool for simple lookups, while complex verifications continue through the coordinator
B) Have the synthesis agent batch all verification needs and send them at once
C) Give the synthesis agent access to all web search tools directly
D) Have the web search agent proactively cache extra context around sources

**Answer: A** — Principle of least privilege: give the synthesis agent only what it needs for the 85% common case (simple fact verification) while preserving coordinator routing for the 15% complex cases. Option B creates blocking dependencies. Option C over-provisions. Option D relies on unpredictable anticipation. *(Domains: D1, D2)*

**SP-8:** You're assigned to restructure a monolithic application into microservices. This involves changes across dozens of files and requires decisions about service boundaries and module dependencies. Which approach should you take?

A) Enter plan mode to explore the codebase, understand dependencies, and design an implementation approach before making changes
B) Start with direct execution and make changes incrementally
C) Use direct execution with comprehensive upfront instructions
D) Begin in direct execution and only switch to plan mode if you encounter unexpected complexity

**Answer: A** — Plan mode is designed for complex tasks involving large-scale changes, multiple valid approaches, and architectural decisions. It enables safe exploration before committing to changes. Option B risks costly rework. Option C assumes you know the right structure. Option D ignores that the complexity is already stated in the requirements. *(Domains: D3, D1)*

---

## Scenario Practice: Claude Code for CI/CD

*You are integrating Claude Code into your CI/CD pipeline. The system runs automated code reviews, generates test cases, and provides feedback on pull requests. You need prompts that produce actionable feedback and minimize false positives.*

**SP-9:** Your pipeline script runs \`claude "Analyze this pull request for security issues"\` but the job hangs indefinitely. Logs indicate Claude Code is waiting for interactive input. What's the correct approach for automated pipelines?

A) Add the \`-p\` flag: \`claude -p "Analyze this pull request for security issues"\`
B) Set the environment variable \`CLAUDE_HEADLESS=true\`
C) Redirect stdin from /dev/null
D) Add the \`--batch\` flag

**Answer: A** — The \`-p\` (or \`--print\`) flag runs Claude Code in non-interactive mode. It processes the prompt, outputs results to stdout, and exits. The other options reference non-existent features or workarounds that don't address Claude Code's command syntax. *(Domain: D3)*

**SP-10:** A pull request modifies 14 files across the stock tracking module. Your single-pass review produces inconsistent results: detailed feedback for some files, superficial comments for others, and contradictory feedback — flagging a pattern as problematic in one file while approving it elsewhere. How should you restructure the review?

A) Split into focused passes: analyze each file individually for local issues, then run a separate integration pass examining cross-file data flow
B) Require developers to split large PRs into smaller submissions
C) Switch to a higher-tier model with a larger context window
D) Run three independent passes and only flag issues found in at least two

**Answer: A** — File-by-file analysis ensures consistent depth. A separate integration pass catches cross-file issues. This directly addresses attention dilution. Option B shifts burden to developers. Option C won't fix attention quality. Option D would suppress real bugs caught only once. *(Domains: D4, D3)*

---

## Scenario Practice: Structured Data Extraction

*You are building a structured data extraction system using Claude. The system extracts information from unstructured documents, validates output using JSON schemas, and maintains high accuracy. It must handle edge cases and integrate with downstream systems.*

**SP-11:** Your extraction system uses \`tool_use\` with JSON schemas for structured output. However, it fabricates values for fields that don't exist in the source document — inventing a "publication date" when the document doesn't contain one. What schema design change prevents this?

A) Make the field optional/nullable so the model can return \`null\` when information is absent
B) Add a validation step that checks extracted values against the source
C) Include format normalization rules in the prompt
D) Use a stricter JSON schema with exact type constraints

**Answer: A** — When a required field can't be found, the model fabricates a value to satisfy the schema. Making it optional (nullable) gives the model permission to return \`null\`, preventing hallucinated values. Option B is a downstream fix, not prevention. Options C and D don't address the root cause. *(Domain: D4)*

**SP-12:** Your team wants to reduce API costs. Real-time Claude calls power two workflows: (1) a blocking pre-merge check that must complete before developers can merge, and (2) a technical debt report generated overnight. Your manager proposes switching both to the Message Batches API for its 50% cost savings. How should you evaluate this?

A) Use batch processing for the technical debt reports only; keep real-time calls for pre-merge checks
B) Switch both workflows to batch processing with status polling
C) Keep real-time calls for both to avoid batch result ordering issues
D) Switch both to batch processing with a timeout fallback to real-time

**Answer: A** — The Message Batches API offers 50% savings but has processing times up to 24 hours with no guaranteed latency SLA. This makes it unsuitable for blocking pre-merge checks but ideal for overnight batch jobs like technical debt reports. Match each API to its appropriate use case. *(Domains: D4, D5)*`,
  'roadmap': `# Claude Certified Architect — Foundations: Study Roadmap

> **Target: Pass the exam (720/1000) in 2-3 weeks of focused study**
> **Materials: 6 Courses + 2 Mock Exams (120 questions) + Official Exam Guide**

---

## How This Certification Works

- **60 questions**, multiple choice (1 correct, 3 distractors), **120 minutes**
- **Scenario-based**: 4 out of 6 possible scenarios are picked at random
- **No penalty for guessing** — always answer every question
- **Passing score: 720/1000** (scaled)

---

## Phase 1: Foundation (Days 1-5)

> Goal: Build core understanding of the two heaviest domains (47% of exam)

### Day 1-2: Course 1 — Agentic Architecture & Orchestration (27%)

**File:** [Course 1](/course/1)

This is the **highest-weighted domain**. Start here, no exceptions.

| Priority | Task Statement | Key Concept |
|---|---|---|
| Critical | 1.1 — Agentic loops | \`stop_reason == "tool_use"\` vs \`"end_turn"\` |
| Critical | 1.2 — Multi-agent coordination | Hub-and-spoke, coordinator-subagent pattern |
| Critical | 1.3 — Subagent invocation & context passing | \`Task\` tool, \`allowedTools\`, isolated context |
| High | 1.4 — Multi-step workflows & handoffs | Hooks vs prompt-based enforcement |
| High | 1.5 — Agent SDK hooks | \`PostToolUse\` for interception & normalization |
| Medium | 1.6 — Task decomposition strategies | Prompt chaining vs dynamic decomposition |
| Medium | 1.7 — Session state & forking | \`--resume\`, \`fork_session\` |

**Study actions:**
1. Read the full course end-to-end
2. Memorize the \`stop_reason\` loop pattern — it appears in many questions
3. Understand why parsing text content for termination is an anti-pattern
4. Know the difference between hooks (deterministic) vs prompts (probabilistic)
5. Answer the 4 practice questions at the end, review wrong answers

---

### Day 3: Course 2 — Tool Design & MCP Integration (18%)

**File:** [Course 2](/course/2)

Builds directly on Course 1. Tool design is tightly coupled with agent architecture.

| Priority | Task Statement | Key Concept |
|---|---|---|
| Critical | 2.1 — Tool descriptions & boundaries | Descriptions drive tool selection, not names |
| Critical | 2.2 — Structured error responses | \`isError\` flag, \`errorCategory\`, \`isRetryable\` |
| High | 2.3 — Tool distribution & tool choice | 4-5 tools per agent, scoped access |
| High | 2.4 — MCP server configuration | Transport types, \`allowedTools\` filtering |
| Medium | 2.5 — Input validation & schema design | Flat parameters, enums over free text |

**Study actions:**
1. Read the full course
2. Memorize: overlapping tool descriptions cause misrouting
3. Know why too many tools (18+) degrade reliability
4. Know structured error patterns cold — multiple exam questions test this
5. Answer practice questions

---

## Phase 2: Practical Skills (Days 6-9)

> Goal: Master the two "practical" domains (40% of exam)

### Day 4-5: Course 3 — Claude Code Configuration & Workflows (20%)

**File:** [Course 3](/course/3)

Very practical and testable. Many questions are about config file specifics.

| Priority | Task Statement | Key Concept |
|---|---|---|
| Critical | 3.1 — CLAUDE.md hierarchy | Project vs user vs enterprise scope |
| Critical | 3.2 — Custom slash commands | \`.claude/commands/\` directory structure |
| High | 3.3 — Permission modes | Allowlists, \`--allowedTools\`, plan mode |
| High | 3.4 — MCP server configuration in Claude Code | \`claude_desktop_config.json\`, transport types |
| Medium | 3.5 — CI/CD integration | \`--print\`, \`-p\` flag, non-interactive mode |
| Medium | 3.6 — Plan mode | When to plan vs when to execute directly |

**Study actions:**
1. Read the full course
2. Know the CLAUDE.md file hierarchy and override behavior
3. Understand slash command file naming conventions
4. Know CI/CD flags and patterns
5. Answer practice questions

---

### Day 6-7: Course 4 — Prompt Engineering & Structured Output (20%)

**File:** [Course 4](/course/4)

Overlaps with Course 2 (tool descriptions) and Course 3 (CI prompts).

| Priority | Task Statement | Key Concept |
|---|---|---|
| Critical | 4.1 — System prompts for agents | Role, constraints, output format |
| Critical | 4.2 — Structured output with JSON schemas | \`response_format\`, schema enforcement |
| High | 4.3 — Few-shot examples | When to use, formatting patterns |
| High | 4.4 — Extraction prompts | Field-by-field instructions, edge cases |
| Medium | 4.5 — Prompt chaining for quality | Verification passes, self-evaluation |
| Medium | 4.6 — CI/CD prompt design | Actionable feedback, minimizing false positives |

**Study actions:**
1. Read the full course
2. Understand \`response_format\` vs prompt-only JSON enforcement
3. Know when few-shot helps vs when it wastes context
4. Know the extraction pattern: instructions > examples > edge case handling
5. Answer practice questions

---

## Phase 3: Tie It Together (Days 10-11)

> Goal: Master the final domain that connects everything

### Day 8: Course 5 — Context Management & Reliability (15%)

**File:** [Course 5](/course/5)

Lowest weight but ties all other domains together. Don't skip it.

| Priority | Task Statement | Key Concept |
|---|---|---|
| Critical | 5.1 — Context window management | Token limits, summarization strategies |
| Critical | 5.2 — Multi-turn conversation design | Message history, context injection |
| High | 5.3 — Escalation & human-in-the-loop | When to escalate vs when to deny |
| High | 5.4 — Self-evaluation & reliability | Confidence thresholds, verification loops |
| Medium | 5.5 — Caching & cost optimization | \`cache_control\`, prompt caching patterns |
| Medium | 5.6 — Error recovery & graceful degradation | Partial results, fallback strategies |

**Study actions:**
1. Read the full course
2. Understand context window tradeoffs deeply
3. Know the escalation decision framework
4. Know caching patterns (exam tests specific API details)
5. Answer practice questions

---

### Day 9: Course 6 — Exam Edge Cases & Traps (Supplementary)

**File:** [Course 6](/course/6)

Read this **after** Courses 1-5. It covers the 6 most common exam traps.

**Key traps to master:**
1. **"Policy Silent" vs "Policy Denies"** — opposite actions for similar-looking scenarios
2. **Hooks vs prompts** — when deterministic enforcement is required
3. **\`stop_reason\` anti-patterns** — text parsing, iteration caps as primary mechanism
4. **Tool count tradeoffs** — why fewer tools per agent is better
5. **Context passing between agents** — subagents don't inherit parent context
6. **Structured errors vs generic errors** — \`isRetryable\` and \`errorCategory\` specifics

---

## Phase 4: Practice Exams (Days 12-16)

> Goal: Test knowledge under exam conditions, identify weak areas, and close gaps

### Day 10-11: Mock Exam 1

**File:** [Mock Exam 1](/exam/1) — 60 questions, all 6 scenarios

| Step | Action | Time |
|---|---|---|
| 1 | Take the full exam under timed conditions (120 min) | 2 hours |
| 2 | Score yourself — mark each answer correct/incorrect | 30 min |
| 3 | For every wrong answer, identify which Task Statement it tests | 30 min |
| 4 | Re-read the relevant course section for each missed topic | 1-2 hours |
| 5 | Re-attempt wrong questions without looking at answers | 30 min |

**Passing benchmark:** If you score 45+/60, you are on track. Below 40, revisit Phase 1-2.

---

### Day 12-13: Mock Exam 2

**File:** [Mock Exam 2](/exam/2) — 60 new questions, different scenario mix

| Step | Action | Time |
|---|---|---|
| 1 | Take the full exam under timed conditions (120 min) | 2 hours |
| 2 | Score and analyze wrong answers by domain | 30 min |
| 3 | Compare your domain scores between Mock 1 and Mock 2 | 15 min |
| 4 | Target the domain with the lowest combined score | 1-2 hours |

**Key difference from Mock 1:** This exam emphasizes Developer Productivity and CI/CD scenarios, so it tests more Course 3 and Course 4 material.

---

## Phase 5: Final Review (Days 17-18)

> Goal: Consolidate knowledge and build exam-day confidence

### Day 14: Domain-Weighted Review

Allocate your final review time proportionally to exam weight:

| Domain | Weight | Review Time (3 hours) |
|---|---|---|
| D1: Agentic Architecture | 27% | 50 min |
| D3: Claude Code Config | 20% | 35 min |
| D4: Prompt Engineering | 20% | 35 min |
| D2: Tool Design & MCP | 18% | 30 min |
| D5: Context & Reliability | 15% | 30 min |

**Review method:** For each domain, re-read only the sections where you got mock exam questions wrong. Don't re-read material you already know.

---

### Day 15: Exam-Day Preparation

**Quick-fire checklist of must-know facts:**

- [ ] \`stop_reason == "tool_use"\` → continue loop; \`"end_turn"\` → exit loop; \`"max_tokens"\` → continue conversation
- [ ] Append assistant message ONCE before processing tool calls; batch tool results into ONE user message
- [ ] Iteration caps are fine as a SECONDARY safety net, not the primary mechanism
- [ ] Subagents do NOT inherit parent context — pass data explicitly in the prompt
- [ ] Hooks = deterministic enforcement; Prompts = probabilistic guidance
- [ ] 4-5 tools per agent is optimal; 18+ tools degrades selection reliability
- [ ] \`isError: true\` + \`errorCategory\` + \`isRetryable\` = recommended error design pattern (not MCP spec fields)
- [ ] CLAUDE.md hierarchy: all levels merged; most specific (directory-level) wins on conflict
- [ ] Custom slash commands live in \`.claude/commands/\`
- [ ] \`--print\` and \`-p\` flags for CI/CD non-interactive mode
- [ ] Policy silent on a request → escalate; Policy explicitly denies → deny
- [ ] \`fork_session\` for parallel exploration from a shared baseline
- [ ] \`cache_control: {"type": "ephemeral"}\` for caching stable content (system prompts, docs) — 90% cost savings
- [ ] Few-shot examples: useful for ambiguous formats, wasteful for simple extractions
- [ ] \`/memory\` edits user-level CLAUDE.md — not just a diagnostic command

---

## Exam-Day Strategy

1. **Read each scenario carefully** — context determines the correct answer
2. **Eliminate obvious distractors first** — usually 2 answers are clearly wrong
3. **Watch for "almost right" answers** — the exam loves subtle distinctions
4. **Budget 2 minutes per question** — flag hard ones and come back
5. **Never leave a question blank** — no penalty for guessing
6. **Trust the framework, not intuition** — the exam tests Anthropic's recommended patterns, not general best practices

---

## Quick Reference: Where to Find What

| Topic | Course | Task Statements |
|---|---|---|
| Agentic loop & stop_reason | Course 1 | 1.1 |
| Multi-agent coordination | Course 1 | 1.2, 1.3 |
| Hooks & enforcement | Course 1 | 1.4, 1.5 |
| Task decomposition | Course 1 | 1.6 |
| Session management | Course 1 | 1.7 |
| Tool descriptions & design | Course 2 | 2.1 |
| MCP error handling | Course 2 | 2.2 |
| Tool distribution | Course 2 | 2.3 |
| MCP server config | Course 2 | 2.4 |
| Input validation | Course 2 | 2.5 |
| CLAUDE.md files | Course 3 | 3.1 |
| Slash commands | Course 3 | 3.2 |
| Permissions | Course 3 | 3.3 |
| MCP in Claude Code | Course 3 | 3.4 |
| CI/CD integration | Course 3 | 3.5 |
| Plan mode | Course 3 | 3.6 |
| System prompts | Course 4 | 4.1 |
| JSON schemas | Course 4 | 4.2 |
| Few-shot examples | Course 4 | 4.3 |
| Extraction prompts | Course 4 | 4.4 |
| Prompt chaining | Course 4 | 4.5 |
| CI/CD prompts | Course 4 | 4.6 |
| Context windows | Course 5 | 5.1 |
| Multi-turn design | Course 5 | 5.2 |
| Escalation patterns | Course 5 | 5.3 |
| Self-evaluation | Course 5 | 5.4 |
| Caching & cost | Course 5 | 5.5 |
| Error recovery | Course 5 | 5.6 |
| Exam traps & edge cases | Course 6 | — |`,

  '7': `# Course 7: Claude Code Hands-On

> **Covers Domains 2 & 3** — Practical mastery of every Claude Code feature.

---

## Module 7.1 — Slash Commands

Slash commands are shortcuts that control Claude's behavior during an interactive session. They come in several types:

- **Built-in commands**: Provided by Claude Code (\`/help\`, \`/clear\`, \`/model\`)
- **Skills**: User-defined commands created as \`SKILL.md\` files (\`/optimize\`, \`/pr\`)
- **Plugin commands**: Commands from installed plugins (\`/frontend-design:frontend-design\`)
- **MCP prompts**: Commands from MCP servers (\`/mcp__github__list_prs\`)

> **Note**: Custom slash commands have been merged into skills. Files in \`.claude/commands/\` still work, but skills (\`.claude/skills/\`) are now the recommended approach.

### Built-in Commands Reference

There are **55+ built-in commands** and **5 bundled skills** available. Type \`/\` in Claude Code to see the full list.

| Command | Purpose |
|---------|---------|
| \`/add-dir <path>\` | Add working directory |
| \`/agents\` | Manage agent configurations |
| \`/branch [name]\` | Branch conversation into a new session |
| \`/clear\` | Clear conversation (aliases: \`/reset\`, \`/new\`) |
| \`/compact [instructions]\` | Compact conversation with optional focus |
| \`/config\` | Open Settings (alias: \`/settings\`) |
| \`/context\` | Visualize context usage as colored grid |
| \`/cost\` | Show token usage statistics |
| \`/diff\` | Interactive diff viewer for uncommitted changes |
| \`/doctor\` | Diagnose installation health |
| \`/effort [low\\|medium\\|high\\|max]\` | Set effort level. \`max\` requires Opus 4.6 |
| \`/export [filename]\` | Export conversation to file or clipboard |
| \`/init\` | Initialize \`CLAUDE.md\` |
| \`/mcp\` | Manage MCP servers and OAuth |
| \`/memory\` | Edit \`CLAUDE.md\`, toggle auto-memory |
| \`/model [model]\` | Select model with left/right arrows for effort |
| \`/permissions\` | View/update permissions |
| \`/plan [description]\` | Enter plan mode |
| \`/plugin\` | Manage plugins |
| \`/resume [session]\` | Resume conversation (alias: \`/continue\`) |
| \`/rewind\` | Rewind conversation and/or code (alias: \`/checkpoint\`) |
| \`/schedule [description]\` | Create/manage scheduled tasks |
| \`/skills\` | List available skills |
| \`/tasks\` | List/manage background tasks |
| \`/voice\` | Toggle push-to-talk voice dictation |

### Bundled Skills

| Skill | Purpose |
|-------|---------|
| \`/batch <instruction>\` | Orchestrate large-scale parallel changes using worktrees |
| \`/claude-api\` | Load Claude API reference for project language |
| \`/debug [description]\` | Enable debug logging |
| \`/loop [interval] <prompt>\` | Run prompt repeatedly on interval |
| \`/simplify [focus]\` | Review changed files for code quality |

### Custom Commands (Now Skills)

| Approach | Location | Status |
|----------|----------|--------|
| **Skills (Recommended)** | \`.claude/skills/<name>/SKILL.md\` | Current standard |
| **Legacy Commands** | \`.claude/commands/<name>.md\` | Still works |

If a skill and a command share the same name, the **skill takes precedence**.

### Frontmatter Reference

| Field | Purpose | Default |
|-------|---------|---------|
| \`name\` | Command name (becomes \`/name\`) | Directory name |
| \`description\` | Brief description (helps Claude know when to use it) | First paragraph |
| \`argument-hint\` | Expected arguments for auto-completion | None |
| \`allowed-tools\` | Tools the command can use without permission | Inherits |
| \`model\` | Specific model to use | Inherits |
| \`disable-model-invocation\` | If \`true\`, only user can invoke (not Claude) | \`false\` |
| \`user-invocable\` | If \`false\`, hide from \`/\` menu | \`true\` |
| \`context\` | Set to \`fork\` to run in isolated subagent | None |
| \`agent\` | Agent type when using \`context: fork\` | \`general-purpose\` |
| \`hooks\` | Skill-scoped hooks (PreToolUse, PostToolUse, Stop) | None |

### Arguments & Dynamic Context

\`\`\`yaml
---
name: commit
description: Create a git commit with context
allowed-tools: Bash(git *)
---

## Context
- Current git status: !\\\`git status\\\`
- Current git diff: !\\\`git diff HEAD\\\`
- Current branch: !\\\`git branch --show-current\\\`
- Recent commits: !\\\`git log --oneline -5\\\`

## Your task
Based on the above changes, create a single git commit.
\`\`\`

Usage: \`/commit fix auth bug\` → \`$ARGUMENTS\` becomes \`"fix auth bug"\`

### MCP Prompts as Commands

MCP servers can expose prompts as slash commands:

\`\`\`bash
/mcp__github__list_prs
/mcp__github__pr_review 456
\`\`\`

Permission syntax: \`mcp__github\` (entire server), \`mcp__github__*\` (wildcard), \`mcp__github__get_issue\` (specific tool).

---

## Module 7.2 — Memory & CLAUDE.md

Memory in Claude Code provides persistent context that carries across multiple sessions and conversations.

### Memory Commands Quick Reference

| Command | Purpose | When to Use |
|---------|---------|-------------|
| \`/init\` | Initialize project memory | Starting new project, first-time CLAUDE.md setup |
| \`/memory\` | Edit memory files in editor | Extensive updates, reorganization, reviewing content |
| \`#\` prefix | Quick single-line memory add | Adding quick rules during conversation |
| \`@path/to/file\` | Import external content | Referencing existing documentation in CLAUDE.md |

### Memory Hierarchy (in order of precedence)

1. **Managed Policy** — Organization-wide instructions
   - macOS: \`/Library/Application Support/ClaudeCode/CLAUDE.md\`
   - Linux/WSL: \`/etc/claude-code/CLAUDE.md\`

2. **Managed Drop-ins** — Alphabetically merged policy files (v2.1.83+)

3. **Project Memory** — Team-shared context (version controlled)
   - \`./.claude/CLAUDE.md\` or \`./CLAUDE.md\` (in repository root)

4. **Project Rules** — Modular, topic-specific project instructions
   - \`./.claude/rules/*.md\`

5. **User Memory** — Personal preferences (all projects)
   - \`~/.claude/CLAUDE.md\`

6. **User-Level Rules** — Personal rules (all projects)
   - \`~/.claude/rules/*.md\`

7. **Local Project Memory** — Personal project-specific preferences
   - \`./CLAUDE.local.md\`

8. **Auto Memory** — Claude's automatic notes and learnings
   - \`~/.claude/projects/<project>/memory/\`

### Modular Rules System

Path-specific rules with YAML frontmatter in \`.claude/rules/\`:

\`\`\`yaml
---
path: "src/api/**/*.ts"
---
All API endpoints must return typed responses.
Use Zod for input validation.
Never expose internal error details to clients.
\`\`\`

### Memory Imports

CLAUDE.md files support the \`@path/to/file\` syntax to include external content:

\`\`\`markdown
See @README.md for project overview
See @package.json for available npm commands
See @docs/architecture.md for system design
@~/.claude/my-project-instructions.md
\`\`\`

- Recursive imports supported (max depth 5)
- First-time imports from external locations trigger approval dialog
- Import directives are NOT evaluated inside code blocks

### Auto Memory

Auto memory records things Claude learns during conversations — stored in \`~/.claude/projects/<project>/memory/\`. Disable with: \`CLAUDE_CODE_DISABLE_AUTO_MEMORY=true\`

| Do | Don't |
|------|---------|
| Keep project standards in project CLAUDE.md | Put personal preferences in project CLAUDE.md |
| Use path-specific rules for directory conventions | Create overly broad rules |
| Use \`@\` imports to reference existing docs | Duplicate documentation content |
| Review and update memory periodically | Let memory become stale |

---

## Module 7.3 — Skills

Agent Skills are reusable, filesystem-based capabilities that extend Claude's functionality. They package domain-specific expertise into discoverable components that Claude automatically uses when relevant.

### Progressive Disclosure

| Level | When Loaded | Token Cost | Content |
|-------|------------|------------|---------|
| **Level 1: Metadata** | Always (at startup) | ~100 tokens per Skill | \`name\` and \`description\` from YAML frontmatter |
| **Level 2: Instructions** | When Skill is triggered | Under 5k tokens | SKILL.md body with instructions and guidance |
| **Level 3+: Resources** | As needed | Effectively unlimited | Bundled files executed via bash without loading into context |

This means you can install many Skills without context penalty.

### Skill Types & Locations

| Type | Location | Scope | Best For |
|------|----------|-------|----------|
| **Enterprise** | Managed settings | All org users | Organization-wide standards |
| **Personal** | \`~/.claude/skills/<name>/SKILL.md\` | Individual | Personal workflows |
| **Project** | \`.claude/skills/<name>/SKILL.md\` | Team | Team standards |
| **Plugin** | \`<plugin>/skills/<name>/SKILL.md\` | Where enabled | Bundled with plugins |

When skills share the same name, higher-priority locations win: **enterprise > personal > project**.

### Creating a Skill

\`\`\`yaml
---
name: code-review
description: Comprehensive code review with security and performance checks. Use when reviewing PRs or code changes.
allowed-tools: Read, Grep, Glob, Bash
user-invocable: true
---

## Instructions
Review the code for: security, performance, readability.

## Checklist
@templates/checklist.md
\`\`\`

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| \`name\` | Yes | Skill name (becomes \`/name\`) |
| \`description\` | Yes | When to use this skill (triggers auto-invocation) |
| \`allowed-tools\` | No | Restrict tool access |
| \`model\` | No | Model: \`sonnet\`, \`opus\`, \`haiku\` |
| \`user-invocable\` | No | Show in \`/\` menu (default: true) |
| \`disable-model-invocation\` | No | Prevent auto-triggering (default: false) |
| \`context\` | No | \`fork\` runs in isolated subagent context |
| \`agent\` | No | Agent type when using \`context: fork\` |
| \`effort\` | No | Reasoning effort level |

### String Substitutions

| Variable | Description |
|----------|-------------|
| \`$ARGUMENTS\` | Full argument string from user |
| \`$0\`, \`$1\`, ... | Individual arguments |
| \`\${CLAUDE_SESSION_ID}\` | Current session ID |
| \`\${CLAUDE_SKILL_DIR}\` | Absolute path to skill directory |
| \`!\\\`command\\\`\` | Shell command output (dynamic context) |

### Skills vs Other Features

| Feature | Invocation | Scope | Best For |
|---------|-----------|-------|----------|
| **Skills** | Auto or \`/name\` | Reusable | Repeated workflows |
| **Memory** | Always loaded | Persistent | Rules and preferences |
| **Subagents** | Delegated | Isolated | Complex subtasks |
| **Hooks** | Event-driven | Automatic | Validation, automation |

---

## Module 7.4 — Subagents

Subagents are specialized AI assistants that Claude Code can delegate tasks to. Each subagent has a separate context window and can be configured with specific tools and a custom system prompt.

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Context preservation** | Operates in separate context, preventing pollution of main conversation |
| **Specialized expertise** | Fine-tuned for specific domains with higher success rates |
| **Reusability** | Use across different projects and share with teams |
| **Flexible permissions** | Different tool access levels for different subagent types |
| **Scalability** | Multiple agents work on different aspects simultaneously |

### File Locations

| Priority | Type | Location | Scope |
|----------|------|----------|-------|
| 1 (highest) | **CLI-defined** | Via \`--agents\` flag (JSON) | Session only |
| 2 | **Project subagents** | \`.claude/agents/\` | Current project |
| 3 | **User subagents** | \`~/.claude/agents/\` | All projects |
| 4 (lowest) | **Plugin agents** | Plugin \`agents/\` directory | Via plugins |

### Configuration

Subagents are defined in YAML frontmatter followed by the system prompt in markdown:

\`\`\`yaml
---
name: security-reviewer
description: Reviews code for security vulnerabilities
tools: Read, Grep, Glob, Bash
model: opus
permissionMode: plan
maxTurns: 30
skills: security
memory: project
---

You are a security expert. Review code for OWASP Top 10 vulnerabilities.
Focus on: injection, auth, data exposure, XXE, access control.
\`\`\`

### Configuration Fields

| Field | Required | Description |
|-------|----------|-------------|
| \`name\` | Yes | Unique identifier (lowercase letters and hyphens) |
| \`description\` | Yes | When to invoke. Include "use PROACTIVELY" to encourage automatic invocation |
| \`tools\` | No | Comma-separated tools. Omit to inherit all. Supports \`Agent(agent_name)\` syntax |
| \`model\` | No | \`sonnet\`, \`opus\`, \`haiku\`, or \`inherit\` |
| \`permissionMode\` | No | \`default\`, \`acceptEdits\`, \`dontAsk\`, \`bypassPermissions\`, \`plan\` |
| \`maxTurns\` | No | Maximum agentic turns |
| \`skills\` | No | Skills to preload into context at startup |
| \`mcpServers\` | No | MCP servers to make available |
| \`memory\` | No | Persistent memory scope: \`user\`, \`project\`, or \`local\` |
| \`background\` | No | Set to \`true\` to always run as background task |
| \`effort\` | No | Reasoning effort: \`low\`, \`medium\`, \`high\`, \`max\` |
| \`isolation\` | No | Set to \`worktree\` for git worktree isolation |

### Built-in Subagents

| Agent | Model | Purpose |
|-------|-------|---------|
| **general-purpose** | Inherits | Complex, multi-step tasks |
| **Plan** | Inherits | Research for plan mode |
| **Explore** | Haiku | Read-only codebase exploration (quick/medium/very thorough) |
| **Bash** | Inherits | Terminal commands in separate context |
| **statusline-setup** | Sonnet | Configure status line |
| **Claude Code Guide** | Haiku | Answer Claude Code feature questions |

### Background Subagents

| Shortcut | Action |
|----------|--------|
| \`Ctrl+B\` | Send current agent to background |
| \`Ctrl+F\` | Kill all background agents |

### When to Use Subagents

| Scenario | Recommendation |
|----------|----------------|
| Simple file edits | Use main agent directly |
| Complex code review | Spawn code-reviewer subagent |
| Multi-file refactor | Spawn implementation subagent |
| Research question | Use built-in Explore agent |
| Security audit | Spawn security-reviewer with plan mode |
| Parallel tasks | Spawn multiple subagents |

---

## Module 7.5 — MCP Integration

MCP (Model Context Protocol) is a standardized way for Claude to access external tools, APIs, and real-time data sources. Unlike Memory, MCP provides live access to changing data.

### Installation Methods

\`\`\`bash
# HTTP transport (recommended for remote)
claude mcp add --transport http notion https://mcp.notion.com/mcp

# HTTP with authentication
claude mcp add --transport http secure-api https://api.example.com/mcp \\
  --header "Authorization: Bearer your-token"

# Stdio transport (local tools)
claude mcp add --transport stdio myserver -- npx @myorg/mcp-server

# With environment variables
claude mcp add --transport stdio myserver --env KEY=value -- npx server
\`\`\`

| Protocol | Status | Use Case |
|----------|--------|----------|
| HTTP | Recommended | Remote servers, cloud APIs |
| Stdio | Supported | Local tools, CLI wrappers |
| SSE | Deprecated | Legacy servers |
| WebSocket | Supported | Real-time streaming |

### MCP Scopes

| Scope | Config File | Shared | Best For |
|-------|-------------|--------|----------|
| **Local** | \`~/.claude.json\` | No | Personal API keys |
| **Project** | \`.mcp.json\` | Yes (git) | Team-shared servers |
| **User** | \`~/.claude.json\` | No | Personal tools |

### MCP Tool Search

Automatic discovery of available MCP tools:

\`\`\`bash
export ENABLE_TOOL_SEARCH=auto  # auto | true | false
\`\`\`

### MCP Prompts as Slash Commands

\`\`\`bash
/mcp__github__list_prs
/mcp__github__pr_review 456
/mcp__jira__create_issue "Bug title" high
\`\`\`

### MCP Resources via @ Mentions

\`\`\`bash
@github:repo://owner/repo/contents/path
@filesystem:file:///path/to/data
\`\`\`

### MCP Output Limits

| Threshold | Behavior |
|-----------|----------|
| 10K characters | Warning logged |
| 25K characters | Default max (truncated) |
| 50K characters | Written to disk, path provided |

Configure with: \`MAX_MCP_OUTPUT_TOKENS\` environment variable.

### Context Bloat Solution

MCP tools can return large payloads that waste tokens. Solution: use MCP tools as **code APIs** — have Claude write code that calls the MCP tool and processes results locally, instead of piping raw data through the context window.

---

## Module 7.6 — Hooks

Hooks are automated actions (shell commands, HTTP webhooks, LLM prompts, or subagent evaluations) that execute automatically when specific events occur in Claude Code.

### Configuration

\`\`\`json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/validate.py",
            "timeout": 60
          }
        ]
      }
    ]
  }
}
\`\`\`

Configuration files (priority order):
- \`~/.claude/settings.json\` — User settings (all projects)
- \`.claude/settings.json\` — Project settings (shareable)
- \`.claude/settings.local.json\` — Local project settings (not committed)
- Managed policy — Organization-wide
- Plugin hooks — Plugin-scoped
- Skill/Agent frontmatter — Component lifetime

### Matcher Patterns

| Pattern | Description | Example |
|---------|-------------|---------|
| Exact string | Matches specific tool | \`"Write"\` |
| Regex pattern | Matches multiple tools | \`"Edit\\|Write"\` |
| Wildcard | Matches all tools | \`"*"\` |
| MCP tools | Server and tool pattern | \`"mcp__memory__.*"\` |

### Hook Types

| Type | Description | Use Case |
|------|-------------|----------|
| **command** | Shell command (JSON stdin/stdout) | Validation scripts, formatting |
| **http** | Webhook (POST JSON, receive JSON) | External integrations |
| **prompt** | LLM-evaluated prompt | Intelligent task completion |
| **agent** | Subagent spawned for evaluation | Complex multi-step checks |

### 25 Hook Events

| Event | When Triggered | Can Block | Common Use |
|-------|---------------|-----------|------------|
| **SessionStart** | Session begins/resumes | No | Environment setup |
| **InstructionsLoaded** | CLAUDE.md loaded | No | Modify instructions |
| **UserPromptSubmit** | User submits prompt | Yes | Validate prompts |
| **PreToolUse** | Before tool execution | Yes (allow/deny/ask) | Validate inputs |
| **PermissionRequest** | Permission dialog shown | Yes | Auto-approve/deny |
| **PostToolUse** | After tool succeeds | No | Add context, feedback |
| **PostToolUseFailure** | Tool execution fails | No | Error handling |
| **SubagentStart** | Subagent spawned | No | Subagent setup |
| **SubagentStop** | Subagent finishes | Yes | Subagent validation |
| **Stop** | Claude finishes responding | Yes | Task completion check |
| **TaskCompleted** | Task marked complete | Yes | Post-task actions |
| **FileChanged** | Watched file changes | No | File monitoring |
| **WorktreeCreate** | Worktree being created | Yes | Worktree initialization |
| **SessionEnd** | Session terminates | No | Cleanup, logging |

### Exit Codes

| Code | Meaning |
|------|---------|
| **0** | Success — continue, parse JSON stdout |
| **2** | Blocking error — block the operation |
| **Other** | Non-blocking error — log and continue |

### PreToolUse Output Control

\`\`\`json
{
  "permissionDecision": "allow",
  "permissionDecisionReason": "Command is safe"
}
\`\`\`

Values: \`"allow"\`, \`"deny"\`, \`"ask"\`

---

## Module 7.7 — Plugins

Plugins are complete feature bundles that package slash commands, subagents, MCP servers, hooks, and skills into a single installable unit.

### Plugin Types

| Type | Scope | Authority |
|------|-------|-----------|
| **Official** | Global | Anthropic |
| **Community** | Public | Community developers |
| **Organization** | Internal | Your company |
| **Personal** | Individual | You |

### Plugin Structure

\`\`\`
my-plugin/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── commands/                 # Slash commands
├── agents/                   # Subagents
├── skills/                   # Skills
├── hooks/                    # Hook scripts
├── mcp/                      # MCP configs
└── README.md
\`\`\`

### Plugin CLI Commands

\`\`\`bash
claude plugin install <name>       # From marketplace
claude plugin install github:user/repo  # From GitHub
claude --plugin-dir ./my-plugin    # Local development
claude plugin uninstall <name>
claude plugin list
claude plugin enable <name>
claude plugin disable <name>
claude plugin validate
\`\`\`

### Plugin Features Comparison

| Feature | Slash Command | Skill | Subagent | Plugin |
|---------|---------------|-------|----------|--------|
| Installation | Manual copy | Manual copy | Manual config | One command |
| Setup Time | 5 min | 10 min | 15 min | 2 min |
| Versioning | Manual | Manual | Manual | Automatic |
| Updates | Manual | Manual | Manual | Auto-available |
| Marketplace | No | No | No | Yes |

### Plugin Security

Plugin subagents CANNOT have:
- \`hooks\`
- \`mcpServers\`
- \`permissionMode\`

These are restricted for security — only the plugin manifest can define hooks and MCP servers at the plugin level.

---

## Module 7.8 — Checkpoints & Rewind

Checkpoints allow you to save conversation state and rewind to previous points, enabling safe experimentation.

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Checkpoint** | Snapshot of conversation state including messages, files, and context |
| **Rewind** | Return to a previous checkpoint, discarding subsequent changes |
| **Branch Point** | Checkpoint from which multiple approaches are explored |

### Accessing Checkpoints

- Press \`Esc\` twice to open the checkpoint interface
- Use \`/rewind\` command (alias: \`/checkpoint\`)

### Rewind Options

1. **Restore code and conversation** — Revert both files and messages
2. **Restore conversation** — Rewind messages only, keep current code
3. **Restore code** — Revert file changes only, keep conversation
4. **Summarize from here** — Compress conversation from this point forward
5. **Never mind** — Cancel

### Automatic Checkpoints

- **Every user prompt** — A new checkpoint is created with each user input
- **Persistent** — Checkpoints persist across sessions
- **Auto-cleaned** — Automatically cleaned up after 30 days

### Use Cases

| Scenario | Workflow |
|----------|----------|
| **Exploring Approaches** | Save → Try A → Save → Rewind → Try B → Compare |
| **Safe Refactoring** | Save → Refactor → Test → If fail: Rewind |
| **A/B Testing** | Save → Design A → Save → Rewind → Design B |
| **Mistake Recovery** | Notice issue → Rewind to last good state |

### Checkpoints vs Git

| Feature | Git | Checkpoints |
|---------|-----|-------------|
| Scope | File system | Conversation + files |
| Persistence | Permanent | 30 days |
| Granularity | Commits | Every prompt |
| Speed | Slower | Instant |

### Limitations

- Bash command side-effects are NOT tracked (e.g., \`npm install\`)
- External system changes are NOT tracked
- Not a replacement for version control

---

## Module 7.9 — Advanced Features

### Permission Modes

| Mode | Behavior |
|------|----------|
| \`default\` | Ask for risky operations |
| \`acceptEdits\` | Auto-accept file edits, ask for bash |
| \`plan\` | Read-only analysis, no writes |
| \`auto\` | Auto-accept most operations (safety classifier) |
| \`dontAsk\` | Skip confirmations |
| \`bypassPermissions\` | No restrictions (dangerous) |

### Planning Mode

Deep reasoning before execution:

\`\`\`bash
claude --permission-mode plan "design the auth system"
/plan design a caching strategy
\`\`\`

### Extended Thinking

\`\`\`bash
claude --effort high "optimize this algorithm"
claude --effort max "design system architecture"  # Opus 4.6 only
export MAX_THINKING_TOKENS=16000
\`\`\`

### Auto Mode

Autonomous operation with background safety classifier:

\`\`\`bash
claude --enable-auto-mode
claude --permission-mode auto "implement the feature"
\`\`\`

### Headless Mode (Print)

Non-interactive mode for CI/CD and automation:

\`\`\`bash
claude -p "review this code" --output-format json
cat file.py | claude -p "find bugs" > report.txt
claude -p --max-turns 1 "analyze" > out.json
\`\`\`

### Background Tasks & Scheduling

\`\`\`bash
# Press Ctrl+B to send current task to background
# Press Ctrl+F to kill all background tasks
/loop 5m /pulse    # Run /pulse every 5 minutes
/schedule "run tests every morning at 9am"
\`\`\`

### Git Worktrees

Isolated parallel development:

\`\`\`bash
claude -w  # Start in isolated worktree
\`\`\`

### Channels

Multi-channel communication:

\`\`\`bash
claude --channels discord,telegram
\`\`\`

### Sandboxing

- macOS: Apple Seatbelt
- Linux: Docker containers
- Both: File system restrictions, network filtering

---

## Module 7.10 — CLI Reference

### CLI Commands

| Command | Description | Example |
|---------|-------------|---------|
| \`claude\` | Start interactive REPL | \`claude\` |
| \`claude "query"\` | Start REPL with initial prompt | \`claude "explain this project"\` |
| \`claude -p "query"\` | Print mode — query then exit | \`claude -p "explain this function"\` |
| \`cat file \\| claude -p "query"\` | Process piped content | \`cat logs.txt \\| claude -p "explain"\` |
| \`claude -c\` | Continue most recent conversation | \`claude -c\` |
| \`claude -r "session" "query"\` | Resume session by ID or name | \`claude -r "auth-refactor" "finish"\` |
| \`claude mcp\` | Configure MCP servers | \`claude mcp add ...\` |
| \`claude agents\` | List all configured subagents | \`claude agents\` |
| \`claude plugin\` | Manage plugins | \`claude plugin install my-plugin\` |

### Core Flags

| Flag | Description | Example |
|------|-------------|---------|
| \`-p, --print\` | Print response without interactive mode | \`claude -p "query"\` |
| \`-c, --continue\` | Load most recent conversation | \`claude --continue\` |
| \`-r, --resume\` | Resume specific session by ID or name | \`claude --resume auth-refactor\` |
| \`-w, --worktree\` | Start in isolated git worktree | \`claude -w\` |
| \`-n, --name\` | Session display name | \`claude -n "auth-refactor"\` |
| \`--model\` | Set model (sonnet, opus, haiku) | \`claude --model opus\` |
| \`--effort\` | Set effort level (low/medium/high/max) | \`claude --effort high\` |
| \`--output-format\` | Output: text, json, stream-json | \`claude -p --output-format json\` |
| \`--tools\` | Restrict available tools | \`claude --tools "Read,Grep,Glob"\` |
| \`--permission-mode\` | Set permission level | \`claude --permission-mode plan\` |
| \`--bare\` | Minimal mode (skip hooks, skills, plugins) | \`claude --bare\` |
| \`--enable-auto-mode\` | Unlock auto permission mode | \`claude --enable-auto-mode\` |
| \`--channels\` | Subscribe to MCP channel plugins | \`claude --channels discord\` |

### Model Selection

\`\`\`bash
claude --model opus "complex architecture task"
claude --model sonnet "implement this feature"
claude --model haiku -p "format this JSON"
\`\`\`

| Model | ID | Context Window |
|-------|-----|----------------|
| Opus 4.6 | claude-opus-4-6 | 1M tokens |
| Sonnet 4.6 | claude-sonnet-4-6 | 1M tokens |
| Haiku 4.5 | claude-haiku-4-5 | 1M tokens |

### Output Formats

\`\`\`bash
claude -p "query"                                  # Plain text
claude -p --output-format json "query"            # Full JSON
claude -p --output-format stream-json "query"     # Streaming JSON
claude -p --json-schema '{"type":"object"}' "q"   # Validated JSON
\`\`\`

### System Prompt Customization

\`\`\`bash
claude --system-prompt "You are a Python expert"
claude --system-prompt-file ./prompt.txt "query"  # Print mode only
claude --append-system-prompt "Always use TypeScript"
\`\`\`

### Tool & Permission Management

\`\`\`bash
claude --tools "Read,Grep,Glob" -p "find TODOs"
claude --allowedTools "Bash(git status:*)" "Bash(git log:*)"
claude --disallowedTools "Bash(rm -rf:*)" "Bash(git push --force:*)"
\`\`\`

### CI/CD Integration

\`\`\`yaml
# GitHub Actions example
- name: Code Review
  run: |
    claude -p --output-format json \\
      --max-turns 1 \\
      "Review changes for security and performance" \\
      > review.json
\`\`\`

### Key Environment Variables

| Variable | Purpose |
|----------|---------|
| \`ANTHROPIC_API_KEY\` | API authentication |
| \`ANTHROPIC_MODEL\` | Default model |
| \`MAX_THINKING_TOKENS\` | Extended thinking budget |
| \`CLAUDE_CODE_EFFORT_LEVEL\` | Default effort level |
| \`ENABLE_TOOL_SEARCH\` | MCP tool discovery |
| \`CLAUDE_CODE_DISABLE_AUTO_MEMORY\` | Disable auto memory |
| \`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS\` | Enable agent teams |

---

## Cross-Reference: Features → Exam Domains

| Feature | Primary Domain | Also Tested In |
|---------|---------------|----------------|
| Slash Commands | D3 | — |
| Memory & CLAUDE.md | D3 | D5 (context preservation) |
| Skills | D3 | D2 (tool distribution) |
| Subagents | D1 (multi-agent) | D3 (configuration) |
| MCP | D2 (tools) | D3 (configuration) |
| Hooks | D3 | D1 (enforcement patterns) |
| Plugins | D3 | D2 (tool distribution) |
| Checkpoints | D3 | D5 (context management) |
| Advanced Features | D3 | D1 (auto mode, planning) |
| CLI | D3 | D4 (headless prompting) |`,
};
