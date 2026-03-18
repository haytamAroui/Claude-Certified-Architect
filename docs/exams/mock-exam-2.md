# Claude Certified Architect — Foundations: Mock Exam 2

> **Time Limit: 120 minutes · 60 Questions · Passing Score: 720/1000**
> **Format: Multiple choice — 1 correct answer, 3 distractors**
> **No penalty for guessing — answer every question**

---

## Scenario Selection

This exam uses the other two official scenarios not covered in Mock Exam 1:

| # | Scenario | Primary Domains | Questions |
|---|---|---|---|
| 1 | Developer Productivity with Claude | D2, D3, D1 | Q1–Q15 |
| 2 | Claude Code for Continuous Integration | D3, D4 | Q16–Q30 |
| 3 | Customer Support Resolution Agent *(new questions)* | D1, D2, D5 | Q31–Q45 |
| 4 | Structured Data Extraction *(new questions)* | D4, D5 | Q46–Q60 |

---

# Scenario 1: Developer Productivity with Claude

*You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers explore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive tasks. It uses the built-in tools (Read, Write, Edit, Bash, Grep, Glob) and integrates with Model Context Protocol (MCP) servers.*

---

**Question 1**
A developer asks the agent to "find all files that call the `processPayment` function in the codebase." Which built-in tool is appropriate?

A) Glob — it searches for file patterns like `**/*.ts` to find all TypeScript files, which can then be filtered for the function.

B) Grep — it searches file contents for patterns, making it the correct tool to find all files containing `processPayment`.

C) Read — read each source file in the project and search for the function call.

D) Bash — run `find . -name "*.ts"` to locate TypeScript files containing the function.

---

**Question 2**
The agent needs to update a function signature in `src/api/payments.ts`. It tries using the Edit tool with this anchor text: `function process(` but fails because three functions in the file start with `function process(`. What is the correct fallback?

A) Use Bash to run a `sed` command that replaces the specific line number.

B) Use Read to load the full file contents, then use Write to write the modified version back.

C) Use Edit with a longer anchor text that is unique within the file.

D) Both B and C are valid approaches; try C first and fall back to B if uniqueness can't be achieved.

---

**Question 3**
A developer asks the agent to understand a legacy payment processing module. The agent reads all 47 files in the module upfront, consuming most of the context window. Subsequent questions about the module get vague, generic answers. What's the better approach?

A) Start by reading all files but use `/compact` after each question to free up context.

B) Build understanding incrementally: start with Grep to find entry points, then use Read to follow imports and trace flows — only reading files as needed.

C) Ask the developer to identify the specific files that are relevant before research begins.

D) Split the module into smaller submodules and analyze each in a separate session.

---

**Question 4**
The agent needs to trace how the `calculateDiscount` function is used across the codebase. It is exported from `src/utils/pricing.ts`, but other modules re-export it through wrapper modules. What's the correct investigation strategy?

A) Grep for `calculateDiscount` across the entire codebase — this will find all callers regardless of re-exports.

B) Read `src/utils/pricing.ts` to understand the function, then Grep for `calculateDiscount` and also identify all exported names from wrapper modules, then Grep for each re-exported name across the codebase.

C) Use Glob to find all files importing from `pricing.ts`, then read each one.

D) Use Bash to generate a dependency graph and analyze it programmatically.

---

**Question 5**
Your team has both a Jira MCP server and a custom internal deployment MCP server. The Jira integration is standard; the deployment server is team-specific. How should you configure them?

A) Both in `.mcp.json` — project-scoped and version-controlled.

B) Jira in `~/.claude.json` (user-level), deployment in `.mcp.json` (project-level).

C) Use the community Jira MCP server configured in `.mcp.json`. Configure the custom deployment server in `.mcp.json` too, since both are team tools.

D) Both in `~/.claude.json` to avoid polluting the project repository.

---

**Question 6**
Your team has an MCP server with a `search_issues` tool that provides semantic search across Jira tickets. However, the agent keeps using the built-in Grep tool to search for issue numbers in local files instead. What's the most likely cause?

A) The MCP server isn't properly connected — check the `.mcp.json` configuration.

B) The MCP tool's description is too minimal. Enhance it to explain capabilities, typical queries, output format, and when to use it versus Grep.

C) Built-in tools always take priority over MCP tools. This can't be changed.

D) Add `"preferred": true` to the MCP tool configuration to prioritize it.

---

**Question 7**
You want to expose your internal API documentation hierarchy (100+ endpoints, organized by service) to the agent so it can answer developer questions about APIs without making exploratory tool calls. What MCP concept should you use?

A) Configure 100 individual MCP tools — one per API endpoint.

B) Expose the API documentation as an MCP **resource** — a read-only content catalog that gives the agent visibility into available data.

C) Include all API documentation in the CLAUDE.md file.

D) Create a `list_apis` MCP tool that the agent calls to discover available endpoints.

---

**Question 8**
A developer on your team created a personal `/quick-test` command for running their preferred test workflow. Another developer wants a different test workflow. How should this be managed?

A) Both developers put their commands in `.claude/commands/` with different names.

B) Each developer creates their personal command in `~/.claude/commands/` — user-scoped commands that don't affect teammates.

C) Create a single configurable command in `.claude/commands/` that accepts a parameter to select the workflow.

D) The second developer forks the repository to maintain their own command set.

---

**Question 9**
Your development agent has an agentic loop that processes tool calls. Currently, the loop checks whether the response contains a `TextBlock` to determine if Claude is done. During complex tasks with interleaved text and tool calls, the agent sometimes stops prematurely. Why?

A) The temperature is too low, causing the model to generate text too early.

B) Checking for `TextBlock` is an anti-pattern. Claude responses can contain both text AND tool calls simultaneously. The correct signal is `stop_reason == "end_turn"`.

C) The model's `max_tokens` is too low, causing it to end the response before finishing its tool calls.

D) The system prompt needs to instruct the model to never produce text until all tool calls are complete.

---

**Question 10**
The developer productivity agent has 18 tools: 6 built-in (Read, Write, Edit, Bash, Grep, Glob) plus 12 MCP tools for Jira, GitHub, CI/CD, documentation, monitoring, and alerting. Tool selection reliability is poor. How should you restructure?

A) Keep all 18 tools but add detailed descriptions and few-shot examples showing correct tool selection.

B) Create specialized subagents with scoped tool sets: a code exploration agent (Read, Grep, Glob), a code modification agent (Write, Edit, Bash), and a DevOps agent (Jira, GitHub, CI/CD, monitoring tools). The coordinator routes tasks to the appropriate subagent.

C) Prioritize MCP tools over built-in tools in the system prompt to reduce confusion.

D) Remove the least-used MCP tools until you have 10 or fewer total.

---

**Question 11**
Your agent is exploring a large codebase to understand the refund processing flow. After reading 25 files, context starts degrading — the agent references "typical patterns" instead of specific classes it discovered. What should you do?

A) Start a new session and re-read the most important files.

B) Have the agent maintain a scratchpad file recording key findings. Re-read the scratchpad for subsequent questions instead of re-discovering information.

C) Use `/compact` to free up context space and continue exploration.

D) Increase the model's context window by using a higher-tier model.

---

**Question 12**
You want to compare two refactoring approaches — one using the Strategy pattern and one using the Builder pattern — from the same codebase analysis baseline. What feature enables this?

A) Run the agent twice with different system prompts.

B) Use `fork_session` to create independent branches from the shared analysis baseline, exploring each pattern in its own branch.

C) Create two separate agents with different `AgentDefinition` configurations.

D) Use `--resume` to return to the analysis point and try the second approach.

---

**Question 13**
Your agent's agentic loop has been running tool calls for a code exploration task. The loop condition is:

```python
for i in range(20):
    response = client.messages.create(...)
    if response.stop_reason == "end_turn":
        break
    # ... process tool calls
```

What's wrong with this implementation?

A) Nothing — this is the correct pattern with a safety limit.

B) The iteration cap (`range(20)`) as a primary stopping mechanism is an anti-pattern. If the model needs 21 iterations to complete, it will stop prematurely. Use `stop_reason` as the primary mechanism; if you must have a safety limit, make it very generous and log a warning when hit.

C) `"end_turn"` is the wrong signal. It should check for `"stop"`.

D) The loop should check for tool calls in the content blocks, not the `stop_reason`.

---

**Question 14**
Your development agent spawns a subagent to investigate "Which test files cover the refund module?". The subagent returns: `"Based on typical Node.js project structures, test files are usually in a __tests__ directory."` The subagent didn't actually search the codebase. Why?

A) The subagent doesn't have access to the Grep and Glob tools needed to search the codebase.

B) The subagent inherited the coordinator's context, which doesn't include the codebase files.

C) The subagent's system prompt doesn't instruct it to use tools for investigation.

D) Both A and C are likely contributing factors. Ensure the subagent's `allowedTools` includes search tools AND its prompt instructs it to investigate rather than guess.

---

**Question 15**
A developer resumes a session from yesterday using `--resume investigation`. Since yesterday, three critical files in the codebase have been refactored. The agent continues analyzing based on stale information. What's the solution?

A) Always start a new session instead of resuming.

B) After resuming, inform the agent about the specific files that changed so it can re-analyze those files rather than re-exploring the entire codebase.

C) Run Bash to `git diff` and pipe the results into the agent context.

D) Use `/compact` after resuming to force the agent to re-read everything.

---

# Scenario 2: Claude Code for Continuous Integration

*You are integrating Claude Code into your CI/CD pipeline. The system runs automated code reviews, generates test cases, and provides feedback on pull requests. You need to design prompts that provide actionable feedback and minimize false positives.*

---

**Question 16**
Your CI review prompt says: "Review this code and report any issues you find. Be thorough." The output varies wildly between runs — sometimes a detailed 20-finding report, sometimes 3 superficial comments. What's the root cause?

A) The model needs a higher temperature for consistent creative output.

B) The instructions are too vague. "Be thorough" doesn't define what to look for. Replace with explicit criteria specifying which issue types to report (bugs, security) versus skip (style, naming).

C) The model's `max_tokens` varies between runs, limiting output length.

D) Add `--deterministic` flag to the Claude Code CLI for consistent output.

---

**Question 17**
Your automated code review flags "unused import" in 70% of Python files, but developers dismiss most of these because the imports are used in type annotations behind `if TYPE_CHECKING:` blocks. This has eroded trust in all review findings. What's the fix?

A) Lower the confidence threshold to only report high-confidence findings.

B) Temporarily disable the "unused import" category to restore developer trust while refining the prompt to handle `TYPE_CHECKING` patterns correctly.

C) Add "be more conservative" to the review prompt.

D) Require developers to add `# noqa` comments to all type-checking imports.

---

**Question 18**
You want to define explicit severity levels for your CI review. Currently, the agent inconsistently classifies findings as "high" or "low." How do you achieve consistent classification?

A) Add "Only report high-severity issues" to the prompt.

B) Define explicit severity criteria with **concrete code examples** for each level: Critical (SQL injection, RCE), High (null dereference, data loss), Medium (missing error handling), Low (unused variable).

C) Add `severity_threshold: high` to the output schema.

D) Use a separate classifier model to re-classify the agent's findings.

---

**Question 19**
Your CI pipeline generates test cases for new code. It suggests tests that already exist in the test suite, and suggests testing patterns that conflict with your team's testing standards. How do you fix both issues?

A) Post-filter the generated tests to remove duplicates.

B) Provide existing test files in context to avoid duplicate suggestions, and document testing standards/conventions/available fixtures in CLAUDE.md.

C) Run the generated tests and discard any that fail due to conflicts.

D) Limit test generation to only uncovered functions identified by a coverage tool.

---

**Question 20**
A pull request modifies the authentication module across 8 files. Your review prompt uses few-shot examples that demonstrate reviewing a single-file utility change. The review misses cross-file security implications (a middleware bypassing auth checks due to incorrect import). What architectural change addresses this?

A) Add more few-shot examples covering multi-file reviews.

B) Split into per-file local analysis passes plus a separate cross-file integration pass that specifically examines data flow, import chains, and authentication pathways between files.

C) Use a larger context window model.

D) Route all authentication-related PRs to human reviewers instead.

---

**Question 21**
Your CI pipeline posts Claude Code review comments on every PR. After a developer pushes fixes in response to the first review, the re-review posts the same findings again alongside new ones. Developers complain about duplicate comment spam. What's the fix?

A) Delete all previous review comments before each new review run.

B) Include the prior review findings in context when re-running, and instruct Claude to report only new or still-unaddressed issues.

C) Only review the diff between the latest commit and the previous review.

D) Use PR labels to track which findings have been addressed.

---

**Question 22**
You need your CI review to output findings as structured JSON that can be programmatically posted as inline PR comments at specific line numbers. What's the correct CLI invocation?

A) `claude -p "Review this PR" --json`

B) `claude -p "Review this PR" --output-format json --json-schema '{"type":"object","properties":{"findings":{"type":"array","items":{"type":"object","properties":{"file":{"type":"string"},"line":{"type":"integer"},"severity":{"type":"string"},"message":{"type":"string"}}}}}}'`

C) `claude "Review this PR" --output-format json`

D) `claude -p "Review this PR" | jq '.findings'`

---

**Question 23**
Your team uses Claude Code to generate unit tests during CI. The generated tests are syntactically correct but test trivial cases (e.g., `expect(true).toBe(true)`) instead of meaningful behavior. What improves quality?

A) Add "Write meaningful tests" to the prompt.

B) Document testing standards, what constitutes a valuable test, and available test fixtures in CLAUDE.md. Provide concrete examples of good vs bad tests.

C) Increase the model's temperature for more creative test generation.

D) Use a separate model to review and filter generated tests.

---

**Question 24**
Your CI code review is configured with a `CLAUDE.md` that includes review criteria. But a specific subpackage `packages/legacy-api/` has different standards (it uses callbacks instead of async/await, and that's intentional). How should you configure this?

A) Add an exception note to the root CLAUDE.md: "In packages/legacy-api/, callbacks are acceptable."

B) Create `.claude/rules/legacy-api.md` with `paths: ["packages/legacy-api/**/*"]` containing the specific conventions for this package, or create a `packages/legacy-api/CLAUDE.md` with the local standards.

C) Instruct reviewers to ignore findings from the legacy-api package.

D) Exclude the `packages/legacy-api/` directory from CI reviews entirely.

---

**Question 25**
Your CI pipeline reviews a PR and produces findings. The same session is then asked to review its own findings for accuracy. It marks all findings as accurate. An independent human review reveals 3 of 12 findings are false positives. Why?

A) The model needs explicit instructions to be self-critical.

B) The model retains reasoning context from the initial review, biasing it toward confirming its own decisions. Use an independent Claude instance (separate session) for review validation.

C) The model's temperature should be higher for the self-review pass.

D) The original review prompt is too lenient, so the self-review inherits the same leniency.

---

**Question 26**
Your CI review prompt includes: "When unsure about a finding, report it with a note about your uncertainty." This results in high false positive rates as the agent reports many uncertain findings that are incorrect. What's the better approach?

A) Add "Only report findings you're at least 90% confident about."

B) Replace uncertainty-based reporting with explicit categorical criteria: define exactly what constitutes a reportable issue (bugs, security, data loss) versus what to skip (style, naming, uncertain patterns).

C) Add a confidence score field and filter findings below 0.8 in post-processing.

D) Have the agent run a second pass to verify its uncertain findings.

---

**Question 27**
Your CI pipeline needs to run Claude Code non-interactively but occasionally the `-p` flag conflicts with CI-specific requirements. Which of the following statements about `-p` is correct?

A) `-p` reads input from a file instead of stdin.

B) `-p` (or `--print`) runs Claude Code in non-interactive mode: it processes the prompt, outputs the result to stdout, and exits without waiting for user input.

C) `-p` enables parallel processing of multiple prompts.

D) `-p` formats the output for printing to a physical printer.

---

**Question 28**
You need Claude Code to both generate tests AND review code on each PR. A colleague suggests using a single Claude session for both tasks to "share context." What's the issue?

A) A single session can't run two different prompts.

B) There's no issue — shared context improves both tasks.

C) Using the same session for generation and review introduces self-review bias. The generator's reasoning context makes the reviewer less likely to find issues in its own generated tests. Use separate, independent sessions.

D) The combined context might exceed the model's token limit.

---

**Question 29**
Your CI review analyzes one large file (2,000 lines) and flags a function on line 450 as problematic. The same function pattern appears on line 1,100, but the review doesn't flag it. What explains this inconsistency?

A) The model's random seed varies between inference calls.

B) The model's attention is non-uniform across long inputs — the "lost-in-the-middle" effect. Content near the middle of a long document gets less attention. Structure the review to ensure coverage across all file sections.

C) The model's `max_tokens` ended before it could analyze the second instance.

D) The model only reviews the first half of files exceeding a certain length.

---

**Question 30**
Your CI review prompt includes 12 few-shot examples showing various bug types. Adding 3 more examples demonstrating that certain patterns are **acceptable** (not bugs) reduced false positives by 40% without missing real bugs. Why were these "non-bug" examples so effective?

A) More examples always improve accuracy by giving the model more training data.

B) Few-shot examples showing acceptable patterns (non-bugs) help the model distinguish genuine issues from acceptable patterns, enabling generalization to novel cases rather than matching only pre-specified bug patterns.

C) The non-bug examples increased the model's context window, giving it more room for analysis.

D) The examples reduced the model's temperature, making it more conservative.

---

# Scenario 3: Customer Support Resolution Agent

*You are building a customer support resolution agent using the Claude Agent SDK. The agent handles returns, billing disputes, and account issues. It has MCP tools (`get_customer`, `lookup_order`, `process_refund`, `update_account`, `escalate_to_human`). Your target is 80%+ first-contact resolution.*

---

**Question 31**
Your agent loop appends each tool result to the conversation messages and sends them back to Claude for the next iteration. A colleague suggests optimizing by only sending the latest tool result instead of the full conversation history. What's wrong with this optimization?

A) Nothing — sending only the latest result reduces token costs.

B) The full conversation history must be sent in subsequent API requests so Claude can reason about accumulated context. Without prior results, the model loses track of what's already been investigated and may repeat actions.

C) Only the system prompt and latest result are needed — the model's internal memory handles the rest.

D) You can omit tool results but must keep assistant messages.

---

**Question 32**
Your agent handles a customer's return request correctly: verifies identity, checks eligibility, processes the refund. But when the customer adds "also, what's my loyalty points balance?" as a follow-up, the agent starts a new identity verification instead of using the already-verified customer record. What's the issue?

A) The agent's system prompt doesn't instruct it to maintain session state across follow-up questions.

B) The agent's conversation history includes the verified customer data, but the prompt doesn't guide it to recognize that prior verification applies to follow-up questions about the same customer. Add instructions for maintaining verified state within a session.

C) Each new customer question should trigger re-verification for security purposes.

D) The `get_customer` tool cache has expired between the two requests.

---

**Question 33**
Your coordinator agent handles complex cases by delegating billing inquiries to a billing subagent and shipping inquiries to a shipping subagent. The billing subagent encounters a transient database error when looking up invoice records. It retries 3 times, then returns to the coordinator:

```json
{"status": "error", "message": "Service unavailable"}
```

The coordinator tells the customer: "I can't help with billing right now." What should the subagent return instead?

A) The raw database error log with stack trace for debugging.

B) Structured error context: `{"status": "partial_failure", "errorCategory": "transient", "attempted": "lookup invoice #4521", "retries": 3, "partial_results": ["invoice found in cache: $284.50 due 2025-04-01"], "alternatives": ["retry in 5 minutes", "check cached records"]}`.

C) A generic message: `{"status": "error", "isRetryable": true}`.

D) The subagent should keep retrying indefinitely until the database becomes available.

---

**Question 34**
A customer writes: "Order #5582 hasn't arrived. It's been two weeks." The agent calls `lookup_order` and gets:

```json
{"order_id": "5582", "status": 3, "carrier": "USPS", 
 "tracking": "9400111...", "ship_date": 1709251200,
 "estimated_delivery": 1709856000, "items": [...],
 "internal_notes": "Flagged for weight discrepancy",
 "warehouse_id": "WH-47", "picking_station": "A-14",
 "audit_log": [... 40 entries ...]}
```

This 40+ field response accumulates across multiple order lookups, filling the context. What's the fix?

A) Increase the model's max context window.

B) Implement a `PostToolUse` hook that trims `lookup_order` results to only customer-relevant fields: `order_id`, `status`, `carrier`, `tracking`, `ship_date`, `estimated_delivery`, `items`.

C) Instruct the model to ignore irrelevant fields in the prompt.

D) Store full results in a database and give the model only a reference ID.

---

**Question 35**
The agent handles a complex return and mentions: "Your refund of $347.50 for order #8842 has been processed." But looking at the actual order, the amount was $374.50. The agent transposed the digits from a previous order lookup earlier in the session. What pattern prevents this?

A) Double-check all amounts using a calculator tool before stating them.

B) Extract transactional facts (amounts, order numbers, dates) into a persistent "case facts" block that is included in every prompt, separate from the summarizable conversation history.

C) Use lower temperature to reduce hallucination.

D) Always re-call `lookup_order` immediately before stating any amounts.

---

**Question 36**
Your support agent needs to handle: "I was charged twice for order #3311 and I also need to change my shipping address for order #3400." The system prompt says: "Handle one issue at a time." But the customer clearly has two distinct issues. What's the right behavior?

A) Follow the system prompt exactly — address only the first issue and ask the customer to submit the second issue separately.

B) Decompose the request into two distinct items. Since these are independent issues, address them sequentially (double charge first, address change second) and synthesize a unified response.

C) Decompose into two items and investigate both in parallel since they're independent.

D) Escalate because multi-issue requests exceed the agent's scope.

---

**Question 37**
Your agent now uses hooks to enforce a $500 refund limit. A customer is owed $1,200 for three defective items in a single order ($400, $350, $450). The agent attempts to process three separate refunds of $400, $350, and $450 — all below the $500 limit. Is this a problem?

A) No — each individual refund is below the threshold, so the hooks correctly allow them.

B) Yes — the hook should track cumulative refund amounts per order/customer, not just per-transaction amounts. $1,200 total for one order likely exceeds the policy intent even if individual items don't.

C) No — the $500 limit applies per-transaction only; cumulative tracking is the responsibility of the business system.

D) Yes — the agent should process a single $1,200 refund, which the hook would correctly block.

---

**Question 38**
A customer says: "I'm frustrated with your company, but I think you can fix this. My order arrived late." The agent should:

A) Escalate immediately because the customer expressed frustration.

B) Acknowledge the frustration, then investigate and attempt to resolve the late delivery issue — the customer indicated they want the AI to help.

C) Use sentiment analysis to determine whether the frustration level warrants escalation.

D) Transfer to a human agent because any negative emotion suggests the AI can't handle the situation.

---

**Question 39**
Which `tool_choice` configuration should you use when the agent's first action in every conversation MUST be to call `get_customer` for identity verification?

A) `tool_choice: "auto"` — let the model decide based on the user's message.

B) `tool_choice: "any"` — force the model to call a tool, but let it choose which one.

C) `tool_choice: {"type": "tool", "name": "get_customer"}` — force the model to call `get_customer` specifically.

D) `tool_choice: "required"` — a special mode that requires a specific tool sequence.

---

**Question 40**
Your `update_account` tool returns different errors for different failure modes, but all use the same format: `{"success": false, "error": "Update failed"}`. This prevents the agent from distinguishing between a locked account (needs manager unlock), an invalid email format (needs correction), and a system timeout (needs retry). How should the tool be improved?

A) Add error codes (500, 400, 403) matching HTTP conventions.

B) Return structured error metadata: `{"isError": true, "errorCategory": "validation|permission|transient", "isRetryable": true|false, "message": "...", "customer_explanation": "..."}`.

C) Return different error messages for each failure type (but keep the same `success: false` format).

D) Log errors server-side and have the agent check an error log endpoint.

---

**Question 41**
After deploying the agent, metrics show it escalates 45% of cases — far above the 20% target. Analysis reveals it escalates all billing disputes regardless of complexity, even straightforward ones like duplicate charges with clear evidence. What's the most effective fix?

A) Remove the `escalate_to_human` tool to force the agent to handle everything.

B) Add explicit escalation criteria with few-shot examples to the system prompt, showing when to escalate (policy gaps, customer insistence) versus resolve autonomously (clear-cut duplicate charges, standard returns).

C) Implement a separate routing model that pre-classifies cases as "agent-handleable" or "needs human."

D) Have the agent self-report a confidence score and only escalate below a threshold.

---

**Question 42**
Your agent receives tool results accumulating across a 20-turn conversation. By turn 15, the context window is 85% full with verbose order lookups and account data. The agent's responses become increasingly unreliable. What's the best mitigation?

A) Set a hard limit of 10 turns per conversation.

B) Use `/compact` at turn 10 to compress the history, but first extract critical case facts (IDs, amounts, dates, statuses) into a persistent block that survives compression.

C) Discard tool results older than 5 turns.

D) Route long conversations to human agents after 12 turns.

---

**Question 43**
A customer provides their name as "Alex Chen" and says their phone number is "555-0142." The `get_customer` tool returns:

```json
{"matches": [
  {"id": "C-1001", "name": "Alex Chen", "phone": "555-0142", "email": "alex@work.com"},
  {"id": "C-1002", "name": "Alex Chen", "phone": "555-0142", "email": "alexc@home.com"}
]}
```

Both records match on name AND phone. How should the agent proceed?

A) Select C-1001 because it appears first in the results.

B) Select the one with the most recent activity.

C) Ask the customer for an additional identifier — in this case, their email address — to disambiguate between the two accounts.

D) Merge the two records and proceed with the combined information.

---

**Question 44**
The agent receives: "I heard you guys do price matching. Can you match what Amazon has for this product?" Your price adjustment policy states: "We will match prices from our own website promotions. No other price matching is offered." What should the agent do?

A) Deny the request, citing the policy: "We only match our own website promotions."

B) Attempt the competitor price match since the customer's request seems reasonable and similar.

C) Escalate to a human agent because the policy is ambiguous about competitor price matching.

D) Ask the customer for the Amazon listing URL to evaluate whether a match is possible.

---

**Question 45**
Your coordinator agent needs to pass a verified customer record to a billing subagent. Which approach correctly preserves the information?

A) Tell the billing subagent: "The customer has been verified. Look up their billing history."

B) Include the complete verified customer data in the billing subagent's Task prompt: `"Verified customer: ID C-1001, name Alex Chen, email alex@work.com. Investigate billing dispute for order #5582, amount $284.50, charged on 2025-02-15."`

C) Store the customer data in a shared memory object that both agents can access.

D) Have the billing subagent re-call `get_customer` to verify independently.

---

# Scenario 4: Structured Data Extraction

*You are building a structured data extraction system using Claude. The system extracts information from contracts, medical records, and financial statements. It validates output using JSON schemas and routes low-confidence extractions to human reviewers.*

---

**Question 46**
Your extraction schema marks `effective_date` as `required` with type `"string"`. For contracts that are undated (surprisingly common in draft contracts), Claude fabricates a plausible date. You also notice Claude invents a `governing_law` value when the contract is silent on jurisdiction. What single schema design principle fixes both issues?

A) Add validation rules that check extracted dates against a reasonable range.

B) Make fields that may be absent from source documents optional with nullable types (`["string", "null"]`) and remove them from `required`. This prevents the model from fabricating values to satisfy schema constraints.

C) Add "Do not hallucinate" to the extraction prompt.

D) Implement a post-extraction verification step that checks all dates against the document.

---

**Question 47**
Your financial statement extraction tool uses `tool_choice: "auto"`. The model processes 80% of documents correctly but returns conversational text for 20%: "This appears to be a financial statement from..." without calling the extraction tool. Changing to `tool_choice: "any"` resolves this. However, you now have a new problem: you have two extraction tools (`extract_income_statement` and `extract_balance_sheet`) and the model sometimes picks the wrong one. What's the best overall configuration?

A) Keep `tool_choice: "any"` and improve both tool descriptions to make them clearly distinguishable.

B) Use `tool_choice: "auto"` with stronger prompt instructions.

C) Create a single combined `extract_financial_data` tool that handles both document types.

D) Use forced tool selection to always call `extract_income_statement` first.

---

**Question 48**
Your extraction pipeline processes medical records. For the field `blood_pressure`, some documents contain "120/80 mmHg," some contain "BP normal," and some don't mention blood pressure at all. How should you design the schema?

A) `"blood_pressure": {"type": "string"}` — accept any text and normalize later.

B) `"blood_pressure": {"type": ["string", "null"]}` (nullable) with format normalization rules in the prompt: "Normalize to 'systolic/diastolic mmHg' format. If described as 'normal' without values, use 'normal'. If not mentioned, return null."

C) `"blood_pressure_systolic": {"type": "integer"}, "blood_pressure_diastolic": {"type": "integer"}` — separate numeric fields.

D) `"blood_pressure": {"type": "string", "enum": ["normal", "elevated", "high", "critical"]}` — categorize instead of extracting raw values.

---

**Question 49**
After extraction, Pydantic validation catches: `"contract_value"` is `"approximately $2.5 million"` but the schema expects a numeric field. You retry, providing the original document, the failed extraction, and the specific error. Claude corrects to `2500000.00`. After adding format normalization rules to the prompt ("Convert currency descriptions to numeric: '$2.5 million' → 2500000"), the same error stops appearing in new documents. What does this demonstrate?

A) Retries always fix format errors eventually.

B) The most effective approach combines validation-retry for immediate correction AND prompt refinement to prevent the error category from recurring, reducing iterative resubmission costs.

C) Format normalization rules alone are sufficient; retries are unnecessary.

D) Pydantic validation should be replaced with Claude-based validation.

---

**Question 50**
You extract data from two types of documents: formal contracts (structured, consistent formatting) and informal agreements (emails, handwritten notes, varied layouts). Overall accuracy is 95%. Stakeholders are satisfied. However, your operations team reports frequent errors in informal agreements causing downstream failures. What happened?

A) The model needs additional training on informal documents.

B) The 95% aggregate accuracy masks poor performance on informal agreements. You need stratified accuracy analysis by document type — the formal contract accuracy may be 99%+ while informal agreements may be 70%.

C) Informal agreements shouldn't be processed by the extraction system.

D) The downstream system needs better error handling for malformed data.

---

**Question 51**
Your self-correction pipeline extracts data, validates it, and retries on failure. For a lease agreement, the extraction includes `monthly_rent: 2500` but the lease actually states "twenty-five hundred per month for the first year, increasing to three thousand in year two." What additional schema field would capture this complexity?

A) `"rent_notes": {"type": "string"}` for free-text context.

B) Design a structured rent schedule: `"rent_schedule": {"type": "array", "items": {"type": "object", "properties": {"period": {"type": "string"}, "monthly_amount": {"type": "number"}, "start_date": {"type": ["string", "null"]}, "end_date": {"type": ["string", "null"]}}}}`.

C) Add `"rent_is_variable": {"type": "boolean"}`.

D) Add `"rent_range": {"type": "object", "properties": {"min": {"type": "number"}, "max": {"type": "number"}}}`.

---

**Question 52**
Your batch job processes 1,000 contracts overnight using the Batches API. 950 succeed. Of the 50 failures, 30 are `context_limit_exceeded` (very long contracts), 15 are extraction validation failures, and 5 are transient API errors. What's the correct recovery strategy?

A) Resubmit all 1,000 contracts with a more concise prompt.

B) Handle each failure category separately: chunk the 30 oversized contracts, refine the prompt for the 15 validation failures (test on a sample first), and simply resubmit the 5 transient errors. Identify all by `custom_id`.

C) Resubmit only the 50 failures with the same prompt and hope for different results.

D) Switch all 50 failures to synchronous processing.

---

**Question 53**
Your extraction system has been running for 3 months with 98% accuracy on high-confidence extractions routed to auto-approval. Your quality team suggests stopping human review of high-confidence extractions entirely. What should you do first?

A) Agree — 98% over 3 months proves the system is reliable.

B) Implement stratified random sampling of high-confidence extractions to continuously measure error rates and detect novel error patterns. Don't eliminate human review; reduce it while maintaining ongoing validation.

C) Add a second Claude instance to review high-confidence extractions instead of humans.

D) Increase the confidence threshold to 99.5% before auto-approving.

---

**Question 54**
A contract extraction produces: `"governing_law": "State of California"` but a parallel extraction from a rider amendment to the same contract says: `"governing_law": "State of New York"`. The rider supersedes the original contract. How should your system handle this?

A) Use the original contract's value since it's the primary document.

B) Use the rider's value since it was processed more recently.

C) Preserve both values with source attribution, annotate the conflict, and include document dates so a reviewer can determine which takes precedence. Flag the extraction as needing human verification.

D) Concatenate: `"governing_law": "State of California; State of New York"`.

---

**Question 55**
Your extraction prompt produces clean output for invoices but struggles with contracts that have footnotes referencing key terms. For example, a contract body says "standard terms" but footnote 3 defines specific non-standard payment terms. The extraction misses the footnote data. What prompting technique fixes this?

A) Add "Check footnotes" to the system prompt.

B) Add 2-3 few-shot examples showing correct extraction from documents where critical data appears in footnotes, appendices, and sidebar annotations — demonstrating that the model should search the entire document structure.

C) Pre-process the document to inline all footnotes into the body text.

D) Create a separate "footnote extraction" pass.

---

**Question 56**
You process both income statements and balance sheets. Your single extraction prompt handles both, but frequently places balance sheet data into income statement fields and vice versa. Claude generates valid JSON that passes schema validation but with incorrect field mappings. What type of error is this?

A) Schema syntax error — fixable by making the schema more strict.

B) Semantic validation error — `tool_use` with schemas eliminates syntax errors but NOT semantic errors like values in wrong fields. Implement a separate validation step for cross-field consistency.

C) Prompt engineering error — the prompt needs more explicit field definitions.

D) Both B and C — fix the semantic validation AND improve the prompt.

---

**Question 57**
Your team processes 5,000 documents weekly. A pre-merge CI check blocks developers until compliance documents are extracted and validated. A weekly compliance audit extracts data from historical documents for regulatory review. Your manager proposes using the Batch API for both workflows. What's correct?

A) Use Batch API for both — the 50% savings applies to both workflows.

B) Use synchronous API for the pre-merge check (developers are blocking) and Batch API for the weekly audit (latency-tolerant, cost-sensitive).

C) Use Batch API for the pre-merge check with aggressive polling for fast results.

D) Use synchronous API for both to guarantee consistent processing.

---

**Question 58**
Your extraction of `total_contract_value` works by extracting both the stated total and independently summing all line items. In 5% of documents, the stated total and calculated sum differ. Your system currently discards these documents. What's a better approach?

A) Always use the stated total — it's what the original document says.

B) Always use the calculated sum — it's mathematically correct.

C) Design the schema to extract both `stated_total` and `calculated_total`, add `conflict_detected: boolean`, and route conflicts to human review with both values and the discrepancy amount.

D) Average the two values.

---

**Question 59**
Your extraction system needs to output field-level confidence scores for routing to human review. After deployment, you find that extractions marked "0.95 confidence" are wrong 30% of the time. What's needed?

A) Lower the auto-approval threshold to 0.99.

B) Calibrate confidence thresholds using a labeled validation set. Out-of-the-box model confidence is not well-calibrated; you need to measure actual accuracy at each confidence level and set thresholds based on empirical data.

C) Replace model confidence with a rule-based confidence system.

D) Remove confidence scoring and send all extractions to human review.

---

**Question 60**
Your synthesis report combines data from 15 extracted contracts into a portfolio summary. Sources are compressed into a paragraph summary during aggregation. A stakeholder asks "Where did the $2.3M total come from?" and no one can trace it to specific contracts. What architectural change prevents this?

A) Include all raw extraction data in the final report.

B) Require the aggregation step to maintain claim-source mappings: each figure in the summary must be traceable to specific contracts with contract IDs, page references, and extraction dates.

C) Add a disclaimer that figures are approximations.

D) Store raw extractions in a separate database for manual lookup.

---

# — END OF QUESTIONS —

---
---
---

# Answer Key

> Each correct answer = 16.67 points (1000/60). **Passing: 43/60 correct (720).**

---

## Scenario 1: Developer Productivity with Claude

| Q | Answer | Domain | Explanation |
|---|---|---|---|
| 1 | **B** | D2 | Grep searches file **contents** for patterns. Glob searches file **names/paths**. The question asks to find files calling a function — that's content search = Grep. Read (C) is inefficient at scale. Bash (D) works but isn't the intended built-in tool. |
| 2 | **D** | D2 | When Edit fails due to non-unique anchor text, try a longer unique anchor first (C). If uniqueness can't be achieved, fall back to Read + Write (B). Both are valid approaches. D correctly identifies both. `sed` (A) is fragile for code modifications. |
| 3 | **B** | D2 | Incremental investigation: Grep → find entry points → Read to follow imports → trace flows. Reading all 47 files upfront floods the context. `/compact` (A) loses details. Asking the developer (C) defeats the purpose of the agent. |
| 4 | **B** | D2 | Wrapper modules re-export under different names. Simple Grep (A) misses these. The correct strategy: read the source, identify re-exports, then Grep for each re-exported name. Glob (C) finds importers of the module but not re-exported callers. |
| 5 | **C** | D2 | Use community MCP server for standard integrations (Jira). Configure both in project-scoped `.mcp.json` since both are team tools. User-level (B, D) for team tools prevents sharing. Hardcoded tokens (A) is a security issue. |
| 6 | **B** | D2 | Minimal MCP tool descriptions cause agents to prefer familiar built-in tools. Enhance the description to explain capabilities, outputs, and when to use it vs Grep. Built-in tools don't inherently take priority (C). `"preferred"` flag (D) doesn't exist. |
| 7 | **B** | D2 | MCP **resources** expose read-only content catalogs (documentation, schemas) without requiring tool calls. 100 individual tools (A) is impractical. CLAUDE.md (C) would be enormous. A discovery tool (D) adds a tool call when passive exposure suffices. |
| 8 | **B** | D3 | Personal commands go in user-scoped `~/.claude/commands/`. Project-scoped `.claude/commands/` (A) would force one developer's preference on all. Forking (D) is extreme. A configurable command (C) adds unnecessary complexity for personal preference. |
| 9 | **B** | D1 | Checking for `TextBlock` is an anti-pattern — responses can contain both text and tool calls. The correct signal is `stop_reason == "end_turn"`. Low temperature (A), max_tokens (C), and prompt instructions (D) don't address the fundamental issue. |
| 10 | **B** | D1 | 18 tools degrades selection reliability. Create specialized subagents with scoped tool sets (4-5 per agent). Better descriptions (A) help but don't solve the 18-tool cognitive load. Removing tools (D) loses functionality. System prompt priority (C) is unreliable. |
| 11 | **B** | D5 | Scratchpad files persist findings across context boundaries. The agent writes key findings to a file and re-reads it instead of re-discovering. New session (A) loses all context. `/compact` (C) helps but doesn't prevent future degradation. |
| 12 | **B** | D1 | `fork_session` creates independent branches from a shared baseline. Running twice (A) lacks shared context. `--resume` (D) doesn't create branches — it continues linearly. Different agents (C) don't share the existing analysis. |
| 13 | **B** | D1 | The code already uses `stop_reason == "end_turn"` as the primary mechanism, which is correct. The issue is that `range(20)` acts as a tight cap that could prematurely terminate a legitimate exploration needing 21+ iterations. Safety limits are valid as a **secondary safeguard** but should be generous (e.g., 50+) with a warning logged when hit. `"stop"` (C) isn't a valid stop_reason. Checking content blocks (D) is also an anti-pattern. |
| 14 | **D** | D1 | Two issues: the subagent needs the right tools AND proper instructions. Without Grep/Glob in `allowedTools`, it can't search. Without investigation instructions, it defaults to knowledge-based guessing. Both A and C contribute. |
| 15 | **B** | D1 | After resuming, inform the agent about specific file changes for targeted re-analysis. Always starting fresh (A) wastes prior work. Git diff (C) helps but should be combined with targeted guidance. `/compact` (D) doesn't trigger re-reading. |

## Scenario 2: Claude Code for Continuous Integration

| Q | Answer | Domain | Explanation |
|---|---|---|---|
| 16 | **B** | D4 | Vague instructions ("be thorough") produce inconsistent output. Explicit criteria defining what to report vs skip is the fix. Temperature (A) isn't the issue. `max_tokens` (C) doesn't vary. `--deterministic` (D) doesn't exist. |
| 17 | **B** | D4 | High false positives in one category damage trust in ALL categories. Disable the noisy category, fix its prompt separately, re-enable when accuracy is acceptable. Confidence thresholds (A) and "be conservative" (C) are too vague. `# noqa` (D) burdens developers. |
| 18 | **B** | D4 | Explicit severity criteria with concrete code examples for each level. "Only report high-severity" (A) is vague. Schema thresholds (C) don't improve classification. A separate classifier (D) adds complexity without fixing the root cause. |
| 19 | **B** | D3 | Provide existing tests in context to avoid duplicates. Document standards, conventions, and fixtures in CLAUDE.md for quality. Post-filtering (A) is reactive. Running and discarding (C) is wasteful. Coverage tools (D) don't address convention compliance. |
| 20 | **B** | D4 | Multi-pass review: per-file local analysis + cross-file integration pass. Single-file examples (A) don't demonstrate cross-file analysis. Larger context (C) doesn't fix attention dilution. Human-only review (D) doesn't scale. |
| 21 | **B** | D3 | Include prior findings in context, ask for only new/unresolved issues. Deleting comments (A) loses history. Diff-only review (C) misses issues from earlier code. PR labels (D) require manual tracking. |
| 22 | **B** | D3 | `claude -p "..." --output-format json --json-schema '{...}'` is the correct CLI invocation. Other flag combinations (A, C, D) are incorrect. Note: `-p` is required for CI (non-interactive). |
| 23 | **B** | D3 | Document testing standards, valuable test criteria, and available fixtures in CLAUDE.md with concrete good/bad examples. "Write meaningful tests" (A) is too vague. Temperature (C) doesn't improve test quality. A review model (D) adds latency. |
| 24 | **B** | D3 | Path-specific rules in `.claude/rules/` or a directory-level CLAUDE.md for the legacy package. Root CLAUDE.md exceptions (A) become messy at scale. Ignoring findings (C) and excluding directories (D) lose review value. |
| 25 | **B** | D3 | Self-review bias — the model retains reasoning context. Use an independent instance. Instructions to be self-critical (A) don't overcome retained context bias. Temperature (C) and prompt leniency (D) aren't the root cause. |
| 26 | **B** | D4 | Explicit categorical criteria over confidence-based filtering. "90% confident" (A) is uncalibrated and vague. Post-processing filters (C) and second passes (D) add complexity without fixing the root cause. |
| 27 | **B** | D3 | `-p` / `--print` = non-interactive mode. Processes prompt, outputs to stdout, exits. The other descriptions (A, C, D) are incorrect. |
| 28 | **C** | D3 | Self-review bias affects both generation and review in the same session. The generator's reasoning context makes the reviewer less critical. Use separate, independent sessions. Context sharing (B) is the problem, not a benefit. |
| 29 | **B** | D5 | Lost-in-the-middle effect: content near the middle of long inputs gets less attention. Structure the review to ensure coverage across all sections (e.g., chunking or multi-pass). Random seed (A), max_tokens (C), and length limits (D) aren't the mechanism. |
| 30 | **B** | D4 | Few-shot examples showing acceptable patterns help the model distinguish genuine issues from non-issues, enabling generalization to novel cases. It's not about data volume (A), context size (C), or temperature (D). |

## Scenario 3: Customer Support Resolution Agent

| Q | Answer | Domain | Explanation |
|---|---|---|---|
| 31 | **B** | D1 | Full conversation history must be sent so Claude reasons about accumulated context. Without prior results, the model repeats investigations and loses track of the case. This is how the Messages API works — it's stateless. |
| 32 | **B** | D1 | The conversation history contains the verification, but the agent needs guidance to recognize that a verified customer doesn't need re-verification for follow-up questions. Add session state management instructions. Re-verification (C) is unnecessary friction. |
| 33 | **B** | D2 | Structured error context with category, partial results, retries attempted, and alternatives. Generic errors (C) prevent intelligent recovery. Stack traces (A) aren't useful for the coordinator. Infinite retries (D) cause hangs. |
| 34 | **B** | D5 | PostToolUse hook trims results to relevant fields. 40+ fields per lookup (including internal audit logs) rapidly fills context. Larger context (A) doesn't fix the waste. Prompt instructions (C) are probabilistic. Database references (D) add complexity. |
| 35 | **B** | D5 | Persistent case facts block prevents detail transposition. Exact amounts, IDs, and dates in a structured block that's included in every prompt, surviving any compression. Calculator tools (A) and re-lookups (D) are reactive, not preventive. |
| 36 | **B** | D1 | Decompose multi-issue requests into distinct items. Since double charge and address change are independent, address sequentially. Refusing the second issue (A) is poor service. Parallel investigation (C) pairs with D1 multi-concern decomposition but sequential is better for independent items. |
| 37 | **B** | D1 | Cumulative refund tracking is needed. Individual-transaction hooks miss split-refund circumvention. The $500 policy likely applies to total exposure, not per-item. The hook should track cumulative amounts per order or customer session. |
| 38 | **B** | D5 | The customer expressed frustration BUT indicated willingness to let the agent help ("I think you can fix this"). Acknowledge frustration, investigate. Sentiment escalation (A, C, D) is unreliable — the customer's words override sentiment signals. |
| 39 | **C** | D2 | Forced tool selection (`{"type": "tool", "name": "get_customer"}`) guarantees a specific tool is called. `"auto"` (A) lets the model skip it. `"any"` (B) lets the model choose any tool. `"required"` (D) doesn't exist. |
| 40 | **B** | D2 | Structured error metadata with `errorCategory`, `isRetryable`, and `customer_explanation` enables appropriate agent responses. HTTP codes (A) lack context. Same-format errors (C) don't fix distinguishability. Error logs (D) are async and slow. |
| 41 | **B** | D5 | Explicit escalation criteria with few-shot examples fix over-escalation. Removing the tool (A) removes a safety valve. Routing models (C) add complexity. Self-confidence (D) is poorly calibrated. |
| 42 | **B** | D5 | Extract critical facts before `/compact` so they survive compression. Hard turn limits (A) and discarding results (C) are too aggressive. Routing to humans (D) fails the 80% resolution target. |
| 43 | **C** | D5 | Both name and phone match two accounts — need additional identifiers (email). First-result (A) and recency (B) are heuristics that may be wrong. Merging records (D) is a data integrity violation. |
| 44 | **A** | D5 | The policy explicitly states — "No other price matching is offered." This is NOT a policy gap (unlike Mock 1 Q15 where the policy was silent). Here, the policy directly addresses the request. Denial is correct. Escalation (C) is for gaps, not for clearly denied requests. |
| 45 | **B** | D1 | Subagents have isolated context. Pass complete verified data in the Task prompt. Vague instructions (A) leave the subagent without critical data. Shared memory (C) doesn't exist in the SDK pattern. Re-verification (D) wastes a tool call. |

## Scenario 4: Structured Data Extraction

| Q | Answer | Domain | Explanation |
|---|---|---|---|
| 46 | **B** | D4 | Nullable optional fields prevent fabrication for both `effective_date` and `governing_law`. When information is absent, Claude returns `null`. Validation (A) catches but doesn't prevent. Prompt instructions (C) are probabilistic. Post-verification (D) is reactive. |
| 47 | **A** | D4 | `tool_choice: "any"` guarantees a tool call. The wrong-tool problem is solved by improving descriptions. Better descriptions are the primary mechanism for tool selection. Combined tool (C) loses type-specific extraction logic. Forced selection (D) doesn't handle varying document types. |
| 48 | **B** | D4 | Nullable field + format normalization rules handles all three cases: structured values, descriptive values ("normal"), and absence (null). Plain string (A) pushes normalization downstream. Separate integers (C) can't handle "normal." Enum (D) loses actual values. |
| 49 | **B** | D4 | Validation-retry for immediate correction + prompt refinement to prevent the error category from recurring. Both mechanisms together optimize quality and cost. Retries alone (A) fix individual cases but not the pattern. Rules alone (C) don't handle edge cases. |
| 50 | **B** | D5 | Aggregate accuracy masks per-type performance. 95% overall might be 99% formal + 70% informal. Stratified analysis by document type reveals hidden failures. Additional training (A) isn't applicable. Excluding documents (C) loses business value. |
| 51 | **B** | D4 | A structured rent schedule array captures multi-period variable amounts. Single field (existing) loses the year-two increase. Free-text notes (A) aren't structured. Boolean flag (C) indicates variability but doesn't capture amounts. Range (D) loses temporal information. |
| 52 | **B** | D4 | Handle each failure category differently: chunk oversized, refine prompt for validation errors (test on sample), resubmit transient errors. Use `custom_id` to identify each. Resubmitting all (A, C) is wasteful. Synchronous (D) doesn't fix the underlying issues. |
| 53 | **B** | D5 | Stratified random sampling for ongoing validation. Never eliminate human review entirely — reduce it while maintaining ongoing measurement. 3 months of 98% doesn't guarantee future performance. Novel patterns could emerge. AI review (C) has its own biases. |
| 54 | **C** | D5 | Preserve both values with source attribution and dates. The rider may supersede, but that's a legal determination — the extraction system should preserve both and flag the conflict. Picking either (A, B) makes assumptions. Concatenation (D) is meaningless. |
| 55 | **B** | D4 | Few-shot examples showing extraction from footnotes, appendices, and sidebars. Demonstrates that critical data can appear anywhere in document structure. Simple instructions (A) are less effective than examples. Pre-processing (C) and separate passes (D) add complexity. |
| 56 | **D** | D4 | Both semantic validation (cross-field consistency checks) AND better prompting (explicit field definitions with examples) address this. Schema syntax is correct — the error is semantic (wrong fields). Either B or C alone is partial. |
| 57 | **B** | D4 | Blocking pre-merge = synchronous (developers wait). Weekly audit = batch (latency-tolerant, cost-sensitive). Batch for blocking (A, C) risks 24h delays for developers. Synchronous for everything (D) wastes 50% on the audit. |
| 58 | **C** | D4 | Extract both values, flag conflict, route to human review. Always using one value (A, B) risks errors. Averaging (D) is nonsensical for financial data. Preserving both with a conflict flag enables informed human decisions. |
| 59 | **B** | D5 | Model confidence is not well-calibrated out of the box. Calibrate using labeled validation sets — measure actual accuracy at each stated confidence level, then set empirically-grounded thresholds. Arbitrary threshold changes (A) don't fix calibration. |
| 60 | **B** | D5 | Claim-source mappings maintain provenance through aggregation. Every figure must be traceable to specific contracts. Raw data dumps (A) are unreadable. Disclaimers (C) are evasions. Separate databases (D) require manual lookup. |

---

## Score Interpretation

| Score | Result | Recommendation |
|---|---|---|
| 55-60 (917-1000) | **Exceptional** | Ready for the exam |
| 48-54 (800-900) | **Strong Pass** | Review missed topics, then sit the exam |
| 43-47 (720-783) | **Pass** | Focus study on weak domains, retake mock |
| 36-42 (600-700) | **Near Miss** | Review courses for weak domains, retake in 1 week |
| 25-35 (417-583) | **Needs Work** | Complete all 5 courses thoroughly, retake in 2 weeks |
| <25 (<417) | **Early Stage** | Start with Course 1, work through sequentially |

---

## Domain Score Tracker

| Domain | Questions | Your Score | /Total | % |
|---|---|---|---|---|
| D1: Agentic Architecture | 9,10,12,13,14,15,31,32,36,37,45 | __ | /16 | __% |
| D2: Tool Design & MCP | 1,2,3,4,5,6,7,33,39,40 | __ | /11 | __% |
| D3: Claude Code Config | 8,19,21,22,23,24,25,27,28 | __ | /12 | __% |
| D4: Prompt Engineering | 16,17,18,20,26,30,46,47,48,49,51,52,55,56,57,58 | __ | /12 | __% |
| D5: Context Management | 11,29,34,35,38,41,42,43,44,50,53,54,59,60 | __ | /9 | __% |
| **TOTAL** | | __ | **/60** | __% |
