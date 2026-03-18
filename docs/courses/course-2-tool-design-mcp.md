# Course 2: Tool Design & MCP Integration

> **Exam Weight: 18%** — Second largest domain combined with Domain 1 = 45% of the exam.

---

## Module 2.1 — Designing Effective Tool Interfaces

### Tool Descriptions Are Everything

Tool descriptions are the **primary mechanism** Claude uses to decide which tool to call. This is one of the most heavily tested concepts.

**The problem:** Minimal descriptions make tools indistinguishable.

```json
// ❌ BAD — minimal descriptions
{
  "name": "analyze_content",
  "description": "Analyzes content"
},
{
  "name": "analyze_document",
  "description": "Analyzes documents"
}
```

Claude can't reliably choose between these — they sound the same.

### What a Good Tool Description Includes

A complete tool description should cover:

1. **Purpose** — What this tool does specifically
2. **Input formats** — What data formats it accepts
3. **Example queries** — When you'd use this tool
4. **Boundaries** — What it does NOT do
5. **Alternatives** — When to use a different tool instead

```json
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
```

### Fixing Overlapping Tools

When two tools have near-identical descriptions, you have three options:

| Strategy | When to Use |
|---|---|
| **Rename + update description** | Tools serve different purposes but have confusing names |
| **Split into specific tools** | A generic tool does too many things |
| **Consolidate** | Two tools do essentially the same thing |

**Example — Splitting a generic tool:**

```
❌ analyze_document (does everything)
    ↓ Split into:
✅ extract_data_points (structured extraction)
✅ summarize_content (narrative summary)
✅ verify_claim_against_source (fact checking)
```

### System Prompt Keyword Interference

System prompt wording can override tool descriptions:

```
# ❌ BAD — keyword "analyze" biases toward analyze_content
System prompt: "When users ask you to analyze something, carefully examine..."

# Result: Claude always picks analyze_content, even for documents
```

**Fix:** Review system prompts for keyword-sensitive instructions that create unintended tool associations.

---

## Module 2.2 — Structured Error Responses

### The `isError` Flag

MCP tools communicate failures using the `isError` flag on the tool result. The `isError` boolean is part of the **MCP specification**. The fields below (`errorCategory`, `isRetryable`, etc.) are **recommended design patterns** you build on top of MCP — they are not built-in protocol fields, but they are the pattern tested on the exam.

```json
{
  "isError": true,
  "content": [
    {
      "type": "text",
      "text": "{\"errorCategory\": \"transient\", \"isRetryable\": true, \"message\": \"Database connection timed out after 30s\", \"attempted\": \"SELECT * FROM orders WHERE id = 12345\"}"
    }
  ]
}
```

### Four Error Categories

| Category | Meaning | Action | Retryable? |
|---|---|---|---|
| **Transient** | Timeout, service unavailable | Retry after delay | ✅ Yes |
| **Validation** | Bad input format, missing field | Fix the input, retry | ✅ Yes |
| **Business** | Policy violation (e.g., refund > limit) | Explain to user, escalate | ❌ No |
| **Permission** | Unauthorized access | Escalate to human/admin | ❌ No |

### Anti-Pattern: Generic Errors

```json
// ❌ BAD — generic error
{"isError": true, "content": "Operation failed"}

// The agent can't decide: Should it retry? Escalate? Tell the user?
```

```json
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
```

### Key Distinction: Empty Results vs Errors

```json
// This is NOT an error — the search worked, there are just no matches
{"isError": false, "content": {"results": [], "query": "order #99999"}}

// This IS an error — the search itself failed
{"isError": true, "content": {"errorCategory": "transient", "message": "Search API unavailable"}}
```

### Error Propagation in Multi-Agent Systems

Subagents should:
1. Handle **transient errors locally** (retry within the subagent)
2. Propagate to coordinator **only what can't be resolved locally**
3. Include **partial results** and **what was attempted**

```json
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
```

---

## Module 2.3 — Tool Distribution and `tool_choice`

### The "Too Many Tools" Problem

| Tool Count | Effect |
|---|---|
| 4–5 tools per agent | ✅ Reliable selection |
| 10+ tools | ⚠️ Increasing misrouting |
| 18+ tools | ❌ Significantly degraded reliability |

### Scoped Tool Access

Each subagent should only get tools relevant to its role:

```python
web_search_agent = AgentDefinition(
    name="web_search",
    allowedTools=["web_search", "fetch_url"],  # Only search tools
)

synthesis_agent = AgentDefinition(
    name="synthesis",
    allowedTools=["verify_fact"],  # Scoped cross-role tool for 85% of cases
)
```

**Why?** A synthesis agent with access to `web_search` will start doing its own searching instead of synthesizing.

### `tool_choice` Configuration

| Setting | Behavior | Use Case |
|---|---|---|
| `"auto"` | Model decides whether to call a tool or respond with text | Default — most flexible |
| `"any"` | Model MUST call a tool (but chooses which one) | Guarantee structured output |
| `{"type": "tool", "name": "X"}` | Model MUST call tool X specifically | Force a specific tool first |

**Example — Forcing metadata extraction first:**

```python
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
```

---

## Module 2.4 — MCP Server Configuration

### Two Scopes

| Scope | Config File | Shared? | Use Case |
|---|---|---|---|
| **Project** | `.mcp.json` (in repo root) | ✅ Version controlled | Team tooling (Jira, GitHub, DB) |
| **User** | `~/.claude.json` | ❌ Personal only | Experiments, personal tools |

### Environment Variables for Secrets

```json
// .mcp.json — never commit actual tokens!
{
  "mcpServers": {
    "github": {
      "command": "mcp-server-github",
      "args": [],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"  // ✅ Expanded from environment
      }
    }
  }
}
```

### Simultaneous MCP Servers

All configured MCP servers are discovered at connection time and available **simultaneously**. No need to "activate" or "switch between" them.

### MCP Resources vs Tools

| MCP Concept | Purpose | Example |
|---|---|---|
| **Tools** | Perform actions, modify state | `create_issue`, `process_refund` |
| **Resources** | Read-only data exposure | Issue summaries, DB schemas, doc hierarchy |

Resources reduce **exploratory tool calls** — the agent can see what data is available without calling a tool first.

### Enhancing MCP Descriptions

Agents may prefer built-in tools (like `Grep`) over more capable MCP tools if the MCP descriptions are weak:

```json
// ❌ Agent keeps using Grep instead of this
{"name": "search_codebase", "description": "Searches code"}

// ✅ Agent now prefers this over Grep
{"name": "search_codebase", "description": "Semantic code search across the entire repository. 
  Unlike grep (literal pattern matching), this understands code semantics: finds related functions, 
  follows type hierarchies, and understands import chains. Returns results ranked by relevance 
  with code context snippets. Use this for: understanding code relationships, finding implementations 
  of interfaces, tracing data flow. Use Grep instead for: exact string matching, regex patterns, 
  finding specific error messages."}
```

### Community vs Custom MCP Servers

**Prefer community MCP servers** for standard integrations (Jira, GitHub, Slack). Build **custom servers** only for team-specific workflows.

---

## Module 2.5 — Built-in Tools

### The Six Built-in Tools

| Tool | Purpose | When to Use |
|---|---|---|
| **Grep** | Search file **contents** by pattern | Finding function callers, error messages, imports |
| **Glob** | Find files by **name/extension** pattern | `**/*.test.tsx`, `src/**/*.py` |
| **Read** | Load full file contents | Reading a file after finding it via Grep/Glob |
| **Write** | Write/overwrite entire file | Creating new files, full replacements |
| **Edit** | Targeted modification via unique text match | Changing specific code sections |
| **Bash** | Run shell commands | Build, test, install, arbitrary operations |

### Key Distinctions

**Grep vs Glob:**
- `Grep`: searches **inside files** (content) — "find all files containing `processRefund`"
- `Glob`: searches **file names/paths** — "find all files named `*.test.tsx`"

**Edit vs Read+Write:**
- `Edit`: Find unique text in a file and replace it — fast, surgical
- `Read+Write`: When Edit fails (text isn't unique), read the full file and write the modified version

### Incremental Investigation Pattern

Don't read all files upfront. Build understanding incrementally:

```
1. Grep "processRefund"          → Find entry points
2. Read the main file found      → Understand the function
3. Grep "import.*processRefund"  → Find callers/importers
4. Read those files              → Trace the flow
```

This is **more efficient** and **better for context management** than reading everything at once.

---

## Practice Questions — Domain 2

**Q1:** Two tools (`get_customer` and `lookup_order`) have minimal descriptions and accept similar identifier formats. Agents frequently pick the wrong one. What's the most effective **first step**?

A) Add few-shot examples showing correct tool selection
B) Expand each tool's description with formats, examples, boundaries
C) Implement a routing layer that pre-selects tools by keyword
D) Consolidate into a single `lookup_entity` tool

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

A) Give it a scoped `verify_fact` tool; complex verifications stay with coordinator
B) Batch all verifications and send at end
C) Give synthesis agent full web search access
D) Have search agent pre-cache extra context

**Answer: A** — Scoped cross-role tool for the common case; preserve coordination for complex cases.

---

**Q4:** Which `tool_choice` setting guarantees the model calls a tool rather than responding with text?

A) `"auto"`
B) `"any"` 
C) `{"type": "tool", "name": "extract"}`
D) Both B and C

**Answer: D** — `"any"` forces a tool call (model chooses which). Forced selection forces a specific tool. Both guarantee a tool is called.
