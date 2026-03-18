# Claude Certified Architect — Foundations: Mock Exam

> **Time Limit: 120 minutes · 60 Questions · Passing Score: 720/1000**
> **Format: Multiple choice — 1 correct answer, 3 distractors**
> **No penalty for guessing — answer every question**

---

## Domain Distribution

| Domain | Weight | Questions |
|---|---|---|
| D1: Agentic Architecture & Orchestration | 27% | 16 |
| D2: Tool Design & MCP Integration | 18% | 11 |
| D3: Claude Code Configuration & Workflows | 20% | 12 |
| D4: Prompt Engineering & Structured Output | 20% | 12 |
| D5: Context Management & Reliability | 15% | 9 |

---

# Scenario 1: Customer Support Resolution Agent

*You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-ambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems through custom MCP tools (`get_customer`, `lookup_order`, `process_refund`, `escalate_to_human`). Your target is 80%+ first-contact resolution while knowing when to escalate.*

---

**Question 1**
Your agentic loop implementation uses the following termination logic:

```python
if "I've completed" in response.content[0].text:
    break
```

The agent occasionally runs indefinitely or terminates mid-investigation. What is the correct approach?

A) Add a maximum iteration counter (e.g., `max_iterations=10`) as the primary stopping mechanism to prevent infinite loops.

B) Check `response.stop_reason == "end_turn"` to terminate the loop, and continue when `stop_reason == "tool_use"`.

C) Check whether the response contains any `TextBlock` content, as this indicates the model has produced its final answer.

D) Parse the response for keywords like "done," "complete," or "finished" to determine when the agent has concluded its work.

---

**Question 2**
After deploying the agent, logs reveal that 15% of refunds are processed without customer identity verification. The system prompt clearly states: "Always verify customer identity using `get_customer` before processing any refund." What change provides the strongest reliability guarantee?

A) Add 5 few-shot examples showing the agent calling `get_customer` before every refund, covering various customer request patterns.

B) Implement a `PreToolUse` hook that blocks `process_refund` unless a verified customer ID from `get_customer` exists in the session state.

C) Rewrite the system prompt with stronger language: "CRITICAL: You MUST call get_customer before process_refund. Failure to do so is a policy violation."

D) Add a validation layer that checks tool call sequences after each turn and sends a corrective prompt if `get_customer` was skipped.

---

**Question 3**
A customer writes: "I need to return order #8842 because the screen is cracked, AND I want to dispute the charge on order #7791 because it was unauthorized." How should the agent handle this?

A) Process both issues sequentially in the same turn, completing the return before starting the billing dispute.

B) Decompose the message into two distinct issues, investigate each in parallel using shared customer context, then synthesize a unified response.

C) Ask the customer which issue they'd like to address first, then handle them one at a time across separate turns.

D) Escalate immediately because multi-issue requests exceed the agent's complexity threshold.

---

**Question 4**
Your `PostToolUse` hook receives order data from the `lookup_order` tool. The tool returns timestamps as Unix integers, status as numeric codes (1=pending, 2=shipped, 3=delivered), and amounts without currency indicators. What should the hook do?

A) Pass the raw data through unchanged — the model can interpret numeric codes and Unix timestamps on its own.

B) Normalize timestamps to ISO 8601, map status codes to human-readable strings, and add the currency symbol from the customer's locale.

C) Convert the data into a natural language summary paragraph to make it easier for the model to understand.

D) Store the raw data in a side channel and provide only the fields the model needs for the current query.

---

**Question 5**
The `get_customer` and `lookup_order` tools both accept an identifier parameter and have nearly identical descriptions: "Retrieves information using the provided identifier." Agents frequently call the wrong tool. What is the most effective first step?

A) Implement a routing classifier that analyzes the user's message and pre-selects the appropriate tool based on keyword detection.

B) Expand each tool's description to include accepted input formats, example queries, expected outputs, boundaries, and when to use it versus the other tool.

C) Consolidate both tools into a single `lookup` tool that internally routes to the correct backend based on the identifier format.

D) Add 8-10 few-shot examples to the system prompt showing correct tool selection for various queries.

---

**Question 6**
The `process_refund` tool fails with a generic error: `{"isError": true, "content": "Operation failed"}`. The agent responds to the customer: "I'm sorry, something went wrong. Please try again later." What improvement to the tool's error response would most help the agent?

A) Include a detailed stack trace so the agent can diagnose the technical issue and explain it to the customer.

B) Return structured metadata: `errorCategory` (transient/validation/business/permission), `isRetryable`, and a `customer_explanation` field.

C) Return an HTTP status code (e.g., 500, 403) so the agent can look up the standard meaning.

D) Include a `suggested_action` field with exactly what the agent should say to the customer verbatim.

---

**Question 7**
A customer says: "I want to speak to a manager. This is ridiculous." The agent's current behavior is to first investigate the issue and attempt resolution before offering escalation. What should the agent do?

A) Investigate the issue quickly and present the resolution. If the customer reiterates their request, then escalate.

B) Escalate immediately. When a customer explicitly requests a human agent, honor the request without attempting investigation first.

C) Perform sentiment analysis and determine that the customer's frustration level warrants escalation.

D) Offer to resolve the issue and explain that wait times for human agents are currently long, to encourage the customer to continue with the AI.

---

**Question 8**
A `get_customer` call for "Sarah Johnson" returns three matching records in your system. How should the agent proceed?

A) Select the record with the most recent activity, as it is most likely the active customer.

B) Ask the customer for an additional identifier (email, phone number, or account number) to disambiguate.

C) Present all three records and ask the customer which one is theirs.

D) Select the record in the same geographic region as the customer's IP address.

---

**Question 9**
Your agent needs to: (1) verify customer identity, (2) look up order details, (3) check return eligibility, and (4) process the refund. Steps must happen in this exact order for compliance. Currently, steps are listed in the system prompt instructions. What architecture ensures 100% compliance with this sequence?

A) Number the steps clearly in the system prompt and add "CRITICAL: Follow this exact sequence" at the top.

B) Use few-shot examples demonstrating the correct step sequence across multiple scenarios.

C) Implement programmatic prerequisite gates that block each downstream tool call until its prerequisite has completed successfully.

D) Use `tool_choice` forced selection to call tools in the correct order across sequential turns.

---

**Question 10**
When the agent must escalate to a human, the human agent will handle the case in a separate system without access to the AI conversation transcript. What information must the escalation include?

A) A link to the full AI conversation transcript so the human agent can review the discussion.

B) A structured handoff summary including customer ID, order details, root cause analysis, refund amount, and recommended action.

C) The customer's last message and the AI agent's last response.

D) Only the customer ID — the human agent can look up everything else in the CRM.

---

**Question 11**
You want to add the `process_refund` tool to the agent but ensure refunds above $500 are automatically routed to a human approver. The compliance team requires 100% enforcement. Which approach is correct?

A) Add the policy to the system prompt: "For refunds above $500, always use `escalate_to_human` instead of `process_refund`."

B) Implement a `PreToolUse` hook that intercepts `process_refund` calls, checks the amount, and redirects amounts over $500 to human escalation.

C) Configure two versions of the tool: `process_refund_small` (≤$500) and `process_refund_large` (>$500, requires human approval).

D) Use few-shot examples showing the agent escalating high-value refunds while processing low-value ones autonomously.

---

**Question 12**
During a long support session with multiple order lookups, the agent starts confusing details from earlier orders with the current one, citing incorrect amounts and dates. What is the root cause and fix?

A) The model's temperature is too high, causing hallucinated details. Lower the temperature parameter.

B) Verbose tool results are accumulating in context. Implement a `PostToolUse` hook to trim each `lookup_order` result to only the relevant fields.

C) The model needs a larger context window. Upgrade to a higher-tier model.

D) The agent should clear its conversation history after each resolved issue.

---

**Question 13**
The `lookup_order` tool sometimes returns empty results (`{"orders": []}`) when the customer provides a valid order number. Investigation reveals this happens during database maintenance windows. The agent currently treats this as "no order found" and tells the customer their order doesn't exist. How should the error handling be improved?

A) Add retry logic with exponential backoff inside the tool, returning results once the database is available.

B) Distinguish between a successful query returning no matches (`isError: false`, empty results = no matching order) and an access failure (`isError: true`, `errorCategory: "transient"`, `isRetryable: true` = database unavailable).

C) Cache order data locally so the agent can serve results even when the database is down.

D) Add a message to the system prompt: "If `lookup_order` returns empty, inform the customer that the system may be temporarily unavailable."

---

**Question 14**
Your support agent has access to 18 MCP tools covering customer data, orders, refunds, billing, shipping, product catalog, knowledge base, and escalation. Tool selection accuracy has dropped to 60%. What's the most effective architectural change?

A) Add detailed descriptions to all 18 tools and add few-shot examples for the most commonly confused pairs.

B) Reduce the agent's tool set to 4-5 core tools relevant to its primary function, routing specialized tasks to dedicated subagents with their own scoped tool sets.

C) Implement a tool routing classifier that analyzes each message and pre-selects the 3 most relevant tools.

D) Organize tools into categories in the system prompt and instruct the agent to first identify the category, then select the tool.

---

**Question 15**
A customer escalation policy states: "Escalate when the customer's request falls outside documented policies." A customer asks for a competitor price match. Your price adjustment policy covers only matching your own website's lower prices. What should the agent do?

A) Deny the request because competitor price matching isn't in the policy.

B) Attempt the price match since the customer's request is reasonable and similar to an existing policy.

C) Escalate to a human agent because the policy is silent on competitor price matching — this is a policy gap.

D) Ask the customer to provide a link to the competitor's price for verification before deciding.

---

# Scenario 2: Multi-Agent Research System

*You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates to specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one generates reports. The system researches topics and produces comprehensive, cited reports.*

---

**Question 16**
Your coordinator agent's `AgentDefinition` has `allowedTools: ["web_search", "analyze_document"]`. When the coordinator tries to spawn a subagent using the `Task` tool, it fails silently. What is the problem?

A) The coordinator needs `allowedTools: ["Task"]` (or a list that includes `"Task"`) to be able to spawn subagents.

B) The `Task` tool must be explicitly registered in the `.mcp.json` configuration file.

C) Subagent definitions must be loaded into the coordinator's system prompt before they can be invoked.

D) The coordinator needs a `spawn_subagent` flag set to `true` in its `AgentDefinition`.

---

**Question 17**
The web search subagent finds 12 relevant articles about renewable energy policy. You need to pass these results to the synthesis subagent. How should you transfer this context?

A) Store the results in a shared database and give the synthesis subagent the database query to retrieve them.

B) Include the complete search results directly in the synthesis subagent's `Task` prompt, with content separated from metadata (source URLs, dates, document names).

C) The synthesis subagent automatically inherits the coordinator's context, which includes the web search results.

D) Save the results to a file and instruct the synthesis subagent to read the file using the Read tool.

---

**Question 18**
You want the web search and document analysis subagents to execute simultaneously on different aspects of a research topic. How should you implement parallel execution?

A) Use Python threading to spawn both subagents in separate threads from your application code.

B) Have the coordinator emit multiple `Task` tool calls in a single response — one for each subagent.

C) Configure `parallel: true` in each subagent's `AgentDefinition`.

D) Have the coordinator send the first Task call, wait for it to complete, then send the second.

---

**Question 19**
After researching "global food security challenges," the final report discusses only crop production, omitting supply chain disruption, climate adaptation, and nutritional equity. Coordinator logs show it decomposed the topic into: "wheat production trends," "rice yield forecasting," and "corn production technology." What is the root cause?

A) The web search subagent's queries were too narrow and only returned crop-specific results.

B) The coordinator's task decomposition was too narrow, assigning subtasks that only covered one dimension of the topic.

C) The synthesis subagent failed to identify coverage gaps and request additional research on missing areas.

D) The document analysis subagent filtered out non-production-related sources.

---

**Question 20**
The synthesis subagent needs to verify simple facts (dates, names, statistics) 85% of the time during synthesis. Currently, each verification round-trips through the coordinator to the web search subagent, adding 40% latency. What's the best fix?

A) Give the synthesis subagent access to all web search tools so it can verify anything directly.

B) Give the synthesis subagent a scoped `verify_fact` tool for simple lookups, while complex verifications continue routing through the coordinator.

C) Have the web search subagent proactively cache extra context around each source to anticipate verification needs.

D) Have the synthesis subagent batch all verification requests and submit them at the end of its pass.

---

**Question 21**
The web search subagent encounters a timeout while searching for academic papers on AI ethics. It has found 3 of the expected 8 sources before the timeout. How should it report this to the coordinator?

A) Return a generic error: `{"status": "error", "message": "Search timed out"}`

B) Return an empty result set marked as successful to avoid disrupting the workflow.

C) Return structured error context: `{"status": "partial_failure", "failure_type": "timeout", "partial_results": [...3 sources...], "attempted_query": "...", "alternatives": ["try academic database", "narrow search scope"]}`

D) Throw an exception that terminates the entire research workflow.

---

**Question 22**
Your synthesis subagent has access to 15 tools including web search, document analysis, file operations, and database queries. Despite clear synthesis instructions, it frequently attempts its own web searches instead of synthesizing the provided findings. What's the issue?

A) The system prompt needs stronger instructions to "only synthesize, never search."

B) The subagent has too many tools outside its specialization. Restrict its tool set to synthesis-relevant tools only (e.g., `verify_fact`, `format_report`).

C) The synthesis instructions should be moved from the system prompt to a skill file.

D) Add few-shot examples showing the synthesis subagent using only synthesis tools.

---

**Question 23**
Two credible sources provide conflicting statistics: Forbes reports the AI market at $150B (January 2025) and McKinsey reports $180B (March 2025). How should the synthesis subagent handle this?

A) Average the two values and report: "The AI market is valued at approximately $165B."

B) Use the more recent source (McKinsey, March 2025) as the authoritative figure.

C) Preserve both values with source attribution— noting dates and potential methodological differences — and structure the report to distinguish established from contested findings.

D) Flag this as a data quality issue and exclude the statistic from the report entirely.

---

**Question 24**
The document analysis subagent returns findings as unstructured prose: "There's interesting research showing AI market growth. Several studies confirm this trend." Downstream synthesis loses all source attribution. What change to the subagent's output format fixes this?

A) Add "include citations" to the document analysis subagent's system prompt.

B) Require the subagent to output structured claim-source mappings: each finding includes a claim, evidence excerpt, source URL/name, page number, and publication date.

C) Have the coordinator extract citations from the prose output before passing to synthesis.

D) Post-process the synthesis output with a separate citation-extraction step.

---

**Question 25**
The coordinator needs to resume a research workflow after a system crash. The web search and document analysis phases completed before the crash, but synthesis hadn't started. How should crash recovery be implemented?

A) Re-run the entire workflow from scratch since partial state may be corrupted.

B) Save a `manifest.json` where each agent exports structured state. On resume, the coordinator loads the manifest and injects completed agent states into prompts.

C) Use `--resume` to automatically restore the coordinator's conversation context from before the crash.

D) Implement a message queue that replays unprocessed tasks from a persistent log.

---

**Question 26**
Your coordinator dynamically selects which subagents to invoke based on the query. For the query "Compare renewable energy costs in Europe," it invokes all four subagents (web search, document analysis, synthesis, report generation) sequentially as a fixed pipeline. What's the problem?

A) Nothing — a sequential pipeline is the correct approach for comprehensive research.

B) The coordinator should analyze query requirements and dynamically select only the needed subagents, rather than always routing through the full pipeline.

C) The pipeline should run in parallel instead of sequentially.

D) The report generation subagent should be merged with the synthesis subagent.

---

**Question 27**
Your research reports have grown too long, and stakeholders complain they can't find key findings. The coordinator currently concatenates raw subagent outputs into one document. What structural improvement addresses this?

A) Set a maximum word count for each subagent's output.

B) Place key findings summaries at the beginning of the aggregated output, with detailed results in clearly-labeled sections, to mitigate the lost-in-the-middle effect.

C) Use `/compact` to condense the report before delivering it.

D) Have each subagent rank its findings by importance and only include the top 5.

---

**Question 28**
You need to configure an MCP server for your research pipeline that requires a GitHub API token. The project is worked on by a team of 5 researchers. Where should you configure the MCP server and how should you handle the token?

A) In each researcher's `~/.claude.json` with the token hardcoded.

B) In the project's `.mcp.json` with `"env": {"GITHUB_TOKEN": "${GITHUB_TOKEN}"}` — each researcher sets the environment variable locally.

C) In the project's `.mcp.json` with the token committed directly in the configuration file.

D) In a separate `tokens.json` file that is `.gitignore`-ed and referenced by `.mcp.json`.

---

**Question 29**
The coordinator spawns a synthesis subagent with the prompt: "Synthesize the research findings." The subagent produces a vague, generic synthesis that doesn't reference the specific findings from the search and analysis phases. What's wrong?

A) The synthesis subagent needs a more detailed system prompt with specific synthesis instructions.

B) The subagent has isolated context — it did not receive the search and analysis findings. The coordinator must explicitly pass the findings directly in the Task prompt.

C) The synthesis subagent needs access to the Read tool to load the findings from a shared file.

D) The coordinator should re-run the search and analysis subagents within the synthesis context.

---

**Question 30**
You want to explore two different synthesis approaches (narrative-style vs data-driven) from the same set of search and analysis results. What feature enables this?

A) Run the synthesis subagent twice with different system prompts.

B) Use `fork_session` to create two independent branches from the shared analysis baseline, each exploring a different approach.

C) Create two separate synthesis subagents with different `AgentDefinition` configurations.

D) Use `--resume` to go back to the pre-synthesis point and try a different approach.

---

# Scenario 3: Code Generation with Claude Code

*You are using Claude Code to accelerate software development. Your team uses it for code generation, refactoring, debugging, and documentation. You need to integrate it into your development workflow with custom commands, CLAUDE.md configurations, and understand when to use plan mode vs direct execution.*

---

**Question 31**
A senior developer has configured team coding standards in `~/.claude/CLAUDE.md`. A new hire clones the repository but doesn't get these standards applied. What's the issue?

A) The new hire needs to install the Claude Code extension first.

B) User-level `~/.claude/CLAUDE.md` is personal and not shared via version control. Team standards should be in the project-level `.claude/CLAUDE.md`.

C) The new hire needs to run `/memory` to manually load the standards.

D) The new hire's Claude Code version is outdated and doesn't support the CLAUDE.md hierarchy.

---

**Question 32**
Your monorepo has three packages: a React frontend, a Python API, and a Terraform infrastructure module. Each has different coding conventions and each package has its own maintainer with domain expertise. What's the best way to organize CLAUDE.md?

A) Put all conventions in the root CLAUDE.md, organized by headers for each package.

B) Create a root CLAUDE.md with shared standards and use `@import` in each package's CLAUDE.md to selectively include relevant standards files based on the maintainer's domain knowledge.

C) Create separate CLAUDE.md files in each package subdirectory with the full set of conventions duplicated.

D) Use `.claude/rules/` with one monolithic rules file containing all conventions.

---

**Question 33**
Test files in your project are co-located with source code (`Button.test.tsx` alongside `Button.tsx`, `api.test.py` alongside `api.py`) spread across 40+ directories. All test files should follow the same testing conventions. What's the most maintainable configuration?

A) Create a CLAUDE.md file in every directory that contains test files.

B) Create a `.claude/rules/testing.md` file with YAML frontmatter: `paths: ["**/*.test.tsx", "**/*.test.ts", "**/*.test.py"]`.

C) Put testing conventions in the root CLAUDE.md under a "Testing" header.

D) Create a testing skill in `.claude/skills/testing/SKILL.md`.

---

**Question 34**
Your team's `/analyze` skill produces verbose codebase exploration output (300+ lines of file listings, import traces, and dependency graphs) that fills the context window. After running the skill, subsequent Claude responses are degraded. What configuration change fixes this?

A) Add `allowed-tools: [Read, Grep, Glob]` to the SKILL.md frontmatter to limit the skill's tool access.

B) Add `context: fork` to the SKILL.md frontmatter so the skill runs in an isolated sub-agent context, returning only a summary to the main session.

C) Split the skill into smaller sub-skills that each produce less output.

D) Add `max-output: 50` to the SKILL.md frontmatter to limit output lines.

---

**Question 35**
You need a custom `/deploy` command that is available to all team members who clone the repo. Where should you create the command file?

A) `.claude/commands/deploy.md` in the project repository.

B) `~/.claude/commands/deploy.md` on each developer's machine.

C) `.claude/skills/deploy/SKILL.md` in the project repository.

D) Add a "deploy" section to the root CLAUDE.md.

---

**Question 36**
Your team lead wants Claude to ask developers for the target environment name whenever the `/deploy` skill is invoked without arguments. Which SKILL.md frontmatter option enables this?

A) `required-args: ["environment"]`

B) `argument-hint: "Specify the target environment (staging, production)"`

C) `prompt: "Which environment should I deploy to?"`

D) `interactive: true`

---

**Question 37**
You need to restructure a monolithic application into microservices. The change will affect 45+ files and requires decisions about service boundaries, API contracts, and database partitioning. Which approach is correct?

A) Use direct execution to start making changes and let the architecture emerge from the implementation.

B) Enter plan mode to explore the codebase, understand dependencies, and design the approach before making changes.

C) Use direct execution with a detailed upfront specification of exactly how each service should be structured.

D) Start with direct execution and only switch to plan mode if unexpected complexity arises.

---

**Question 38**
During a complex investigation of a legacy codebase, the Explore subagent reads 200+ files and generates verbose output about class hierarchies, database schemas, and API endpoints. How should you handle this information?

A) Keep all Explore output in the main conversation for completeness.

B) The Explore subagent isolates verbose discovery output and returns a summary to the main agent, preserving the main session's context window.

C) Manually copy the relevant findings and start a new session.

D) Use `/compact` immediately after the Explore subagent finishes.

---

**Question 39**
Your CI pipeline runs:
```bash
claude "Review this PR for security vulnerabilities"
```
The job hangs indefinitely in the pipeline. What's wrong?

A) The command needs `CLAUDE_HEADLESS=true` set as an environment variable.

B) The command is missing the `-p` flag. It should be: `claude -p "Review this PR for security vulnerabilities"`.

C) stdin needs to be redirected: `claude "..." < /dev/null`.

D) The command needs the `--batch` flag for CI environments.

---

**Question 40**
Your CI pipeline generates PR review comments using Claude Code. After a developer pushes fixes based on the first review, the second review run duplicates all previous findings plus new ones, flooding the PR with redundant comments. What's the fix?

A) Clear the review history between runs so each review starts fresh.

B) Include the prior review findings in context and instruct Claude to report only new or still-unaddressed issues.

C) Add `--incremental` flag to only analyze changed files.

D) Use a separate Claude session for each review run with explicit instructions to only check the new commits.

---

**Question 41**
You want Claude Code to produce machine-parseable structured output for your CI pipeline so review findings can be automatically posted as inline PR comments. What CLI flags should you use?

A) `claude -p "..." --format json`

B) `claude -p "..." --output-format json --json-schema '{"type":"object",...}'`

C) `claude -p "..." --json`

D) `claude -p "..." --structured-output`

---

**Question 42**
The same Claude Code session that generated a feature's code is asked to review its own changes. The review finds no issues despite obvious problems that an independent reviewer would catch. Why?

A) The model's temperature is too low for review tasks, making it overly agreeable.

B) The model retains reasoning context from generation, making it biased toward confirming its own decisions. Use an independent review instance without prior reasoning context.

C) The system prompt doesn't explicitly instruct the model to be critical of its own code.

D) Code generation and code review require different model configurations (temperature, max_tokens).

---

# Scenario 4: Structured Data Extraction

*You are building a structured data extraction system using Claude. The system extracts information from unstructured documents (invoices, contracts, reports), validates output using JSON schemas, and maintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.*

---

**Question 43**
Your extraction prompt instructs: "Extract the payment terms from each invoice." For invoices that don't contain payment terms, Claude fabricates plausible values like "Net 30" to fill the required field. What schema change fixes this?

A) Add a validation rule that checks extracted payment terms against a known list.

B) Change the `payment_terms` field from `required` with type `"string"` to optional with type `["string", "null"]`, allowing the model to return `null` when the information is absent.

C) Add "Do not fabricate information" to the extraction prompt.

D) Add a default value of "N/A" to the `payment_terms` field.

---

**Question 44**
You need Claude to classify each invoice into a category. Most invoices fall into "Office Supplies," "Software," "Professional Services," or "Travel." Occasionally, unusual categories appear (e.g., "Laboratory Equipment"). How should you design the schema field?

A) `"category": {"type": "string"}` — free-form text.

B) `"category": {"type": "string", "enum": ["Office Supplies", "Software", "Professional Services", "Travel"]}` — strict enum.

C) `"category": {"type": "string", "enum": ["Office Supplies", "Software", "Professional Services", "Travel", "other"]}` with a sibling `"category_detail": {"type": ["string", "null"]}` — enum with "other" + detail.

D) `"categories": {"type": "array", "items": {"type": "string"}}` — allow multiple categories.

---

**Question 45**
Your extraction tool uses `tool_choice: "auto"`. In 20% of cases, Claude returns a conversational text response ("This invoice appears to be from...") instead of calling the extraction tool. How do you fix this?

A) Add stronger instructions to the system prompt: "Always use the extraction tool."

B) Change to `tool_choice: "any"` to guarantee the model calls a tool (it still chooses which).

C) Add more few-shot examples showing the model calling the extraction tool.

D) Change `tool_choice` to forced selection: `{"type": "tool", "name": "extract_invoice"}`.

---

**Question 46**
Your JSON schema enforces correct syntax via `tool_use`, but extracted invoices sometimes have line items that don't sum to the stated total ($1,250 stated, but line items sum to $1,275). What type of error is this, and can `tool_use` prevent it?

A) This is a schema syntax error. Using strict JSON schemas with `tool_use` will prevent it.

B) This is a semantic validation error. `tool_use` eliminates syntax errors but NOT semantic errors. Implement a separate validation step that checks arithmetic consistency.

C) This is a data quality error in the source document. No extraction system can fix source data issues.

D) Add arithmetic validation rules directly into the JSON schema definition.

---

**Question 47**
Pydantic validation catches an error: the extracted `invoice_date` is "March 5" (no year). You retry by sending Claude all of the following: the original document, the failed extraction, and the specific error message ("invoice_date must be ISO 8601 format with year"). Claude corrects it to "2025-03-05". In which of these situations would this retry approach be **ineffective**?

A) The extracted date is in the wrong format (DD/MM/YYYY instead of ISO 8601).

B) The invoice total is missing a decimal point ($1250 instead of $12.50).

C) The payment terms are listed in a separate attachment document that was not provided to Claude.

D) A line item description is truncated due to a long product name.

---

**Question 48**
Your code review prompts produce detailed instructions: "Review for bugs, security issues, code quality, performance, accessibility, documentation completeness, test coverage, naming conventions, and style consistency." The output is inconsistent — detailed for some categories, superficial for others. What's the fix?

A) Add "be thorough in every category" to the prompt.

B) Define explicit criteria specifying which issues to report (bugs, security) versus skip (minor style), with concrete code examples for each severity level.

C) Increase the model's `max_tokens` to allow more complete output.

D) Run the review multiple times and combine the results.

---

**Question 49**
Your extraction system handles invoices well but fails on handwritten receipts — dates are missed, amounts are extracted incorrectly, and merchant names are garbled. Adding 5 handwritten receipt examples to the extraction prompt significantly improves accuracy for similar receipts. What prompting technique is this?

A) Chain-of-thought prompting

B) Few-shot prompting — targeted examples for a problematic document type that demonstrate correct extraction from varied formats

C) Zero-shot prompting with enhanced instructions

D) Self-consistency prompting

---

**Question 50**
Your manager wants to batch-process 10,000 contracts using the Message Batches API. What's the correct approach before submitting the full batch?

A) Submit all 10,000 immediately to take advantage of the 50% cost savings.

B) Test the extraction prompt on a sample of 50 documents first, analyze error patterns, refine the prompt, then submit the full batch.

C) Split into 100 batches of 100 documents each, submitting them sequentially.

D) Run the first 100 synchronously, then switch to batch for the remaining 9,900.

---

**Question 51**
A batch processing job for 500 legal documents completes. 480 succeed, but 20 fail — all with `context_limit_exceeded` errors. Each failed document is 150+ pages. What's the recovery strategy?

A) Resubmit the 20 failed documents with a higher `max_tokens` parameter.

B) Identify the 20 failures by `custom_id`, chunk each oversized document into smaller sections, and resubmit only the failed documents.

C) Resubmit the entire batch of 500 documents with a more concise extraction prompt.

D) Switch the 20 failed documents to synchronous processing, which has a larger context window.

---

**Question 52**
Your team's overnight compliance report is run using the synchronous Claude API. Each month, it processes 5,000 documents at significant cost. No one reads the results until the next morning. How could you optimize this?

A) Keep using synchronous API — consistency is more important than cost savings.

B) Switch to the Message Batches API for 50% cost savings. The 24-hour processing window is acceptable since no one reads results until morning.

C) Process documents in parallel streams using multiple synchronous API calls.

D) Reduce the number of documents processed by sampling.

---

**Question 53**
Extraction of required fields from invoices sometimes returns empty strings for `vendor_name` — but only for invoices with non-standard layouts (header at the bottom, vendor info in a sidebar). Adding few-shot examples of these non-standard layouts fixes the problem. Why?

A) The few-shot examples increase the model's confidence in non-standard layouts.

B) Few-shot examples demonstrate correct handling of varied document structures, enabling the model to generalize extraction patterns to novel layouts rather than only matching the standard format.

C) More examples always improve extraction accuracy regardless of the type of error.

D) The examples provide the model with the specific vendor names to extract.

---

**Question 54**
Your self-correction pipeline extracts `stated_total` and independently calculates `calculated_total` from line items. When they differ, it flags `conflict_detected: true`. Which additional schema design further improves reliability?

A) Add `confidence_score` as a float field for the overall extraction.

B) Add `"unclear"` as an enum option for ambiguous fields and require `ambiguity_reason` when used.

C) Add `verification_needed: true/false` as a top-level field.

D) Add `extraction_method: "auto"` to track how each field was extracted.

---

# — END OF QUESTIONS —

---
---
---

# Answer Key

> Scroll down only after completing the exam. Score yourself: each correct answer = 16.67 points (1000 / 60).
> **Passing score: 720 → You need at least 43/60 correct.**

---

## Scenario 1: Customer Support Resolution Agent

| Q | Answer | Domain | Explanation |
|---|---|---|---|
| 1 | **B** | D1 | The agentic loop must check `stop_reason`. `"tool_use"` → continue. `"end_turn"` → stop. Parsing text (A, D) is an anti-pattern. Iteration caps are fine as a **secondary safety net** but not as the primary stopping mechanism. Checking for TextBlock (C) is unreliable — responses can contain both text and tool calls. |
| 2 | **B** | D1 | Hooks provide 100% deterministic enforcement. Prompt-based approaches (A, C) have a non-zero failure rate — 15% failure is proof. Post-hoc validation (D) catches errors after the fact but doesn't prevent them. |
| 3 | **B** | D1 | Multi-concern requests should be decomposed into distinct items, investigated in parallel using shared context, then synthesized. Sequential (A) is slower than needed. Asking (C) adds unnecessary friction. Escalating (D) contradicts the 80% resolution target. |
| 4 | **B** | D1 | PostToolUse hooks normalize heterogeneous data formats (timestamps, status codes, currencies) before the model processes them. Raw data (A) forces the model to interpret ambiguous formats. Natural language (C) loses structure. Side channels (D) aren't how hooks work. |
| 5 | **B** | D2 | Tool descriptions are the primary selection mechanism. Minimal descriptions are the root cause. Fix descriptions first (low effort, high leverage). Routing classifiers (A) are over-engineered. Consolidation (C) is valid but more effort than a "first step." Few-shot examples (D) add token overhead without fixing the root cause. |
| 6 | **B** | D2 | Structured error metadata (errorCategory, isRetryable, customer_explanation) lets the agent make appropriate recovery decisions. Stack traces (A) are too technical for customers. HTTP codes (C) lack context. Verbatim scripts (D) are too rigid. |
| 7 | **B** | D5 | When a customer explicitly requests a human, honor immediately. Don't investigate first (A), use sentiment (C), or try to retain (D). This is a tested escalation pattern. |
| 8 | **B** | D5 | Multiple matches require disambiguation. Ask for additional identifiers (email, phone). Don't guess based on recency (A), IP address (D), or expose all records (C — privacy risk). |
| 9 | **C** | D1 | Critical compliance sequences require programmatic enforcement — prerequisite gates block downstream tools until prerequisites complete. Prompt instructions (A, B) have non-zero failure rates. `tool_choice` (D) only controls the first tool per turn, not multi-step sequences. |
| 10 | **B** | D1 | Human agents without transcript access need a self-contained structured handoff: customer ID, root cause, amounts, recommended action. Transcript links (A) assume access. Last message (C) and ID only (D) are insufficient. |
| 11 | **B** | D1 | 100% enforcement requires a PreToolUse hook. Prompts (A) and examples (D) are probabilistic. Two tool variants (C) don't enforce the policy — the agent could still call the wrong one. |
| 12 | **B** | D5 | Verbose tool outputs accumulate and consume context. A PostToolUse hook trims each result to relevant fields, preventing confusion. Temperature (A), model size (C), and history clearing (D) don't address the root cause. |
| 13 | **B** | D2 | The tool must distinguish between "no matches found" (valid result, `isError: false`) and "database unavailable" (transient error, `isError: true`, retryable). Retry logic (A) helps but doesn't fix the reporting. Caching (C) and prompt changes (D) don't address the core issue. |
| 14 | **B** | D2 | 18 tools degrades selection reliability. Reduce to 4-5 core tools per agent and route specialized tasks to dedicated subagents with scoped tools. Better descriptions (A) help but don't solve the fundamental cognitive load problem at 18 tools. Routing classifiers (C) add complexity. |
| 15 | **C** | D5 | When policy is silent on the customer's request, escalate — this is a policy gap. Don't deny (A — may lose a valid customer), don't attempt (B — no policy authority), don't proceed (D — still no policy). |

## Scenario 2: Multi-Agent Research System

| Q | Answer | Domain | Explanation |
|---|---|---|---|
| 16 | **A** | D1 | The coordinator's `allowedTools` must include `"Task"` to spawn subagents. Without it, the Task tool call fails. `.mcp.json` (B), system prompts (C), and flags (D) are not the mechanism for enabling subagent spawning. |
| 17 | **B** | D1 | Subagents have isolated context — they don't inherit the coordinator's history. Findings must be passed explicitly in the Task prompt. Shared databases (A) and files (D) add unnecessary complexity. Automatic inheritance (C) is incorrect — this is a key exam concept. |
| 18 | **B** | D1 | Parallel execution is achieved by emitting multiple Task calls in a single coordinator response. Python threading (A) is application-level, not SDK-level. `parallel: true` (C) doesn't exist. Sequential calls (D) are by definition not parallel. |
| 19 | **B** | D1 | The coordinator decomposed a broad topic ("food security") into narrow subtasks (only crop production). Subagents worked correctly within their assigned scope. The root cause is the coordinator's decomposition, not downstream agents (A, C, D). |
| 20 | **B** | D2 | Scoped cross-role tool for the 85% common case. Full tool access (A) violates separation of concerns. Caching (C) can't predict needs. Batching (D) creates blocking dependencies. |
| 21 | **C** | D2 | Structured error context enables intelligent coordinator recovery. Generic errors (A) hide context. Silent suppression (B) prevents recovery. Terminating (D) wastes partial results. |
| 22 | **B** | D2 | Too many tools outside its specialization leads to misuse. Restrict the tool set. Prompt instructions (A) are probabilistic. Skills (C) don't solve tool distribution. Few-shot (D) helps but doesn't address the root cause. |
| 23 | **C** | D5 | Preserve both values with attribution, dates, and methodological notes. Averaging (A), picking newer (B), and excluding (D) all lose information. |
| 24 | **B** | D5 | Structured claim-source mappings preserve provenance through the pipeline. Prompt instructions (A) are vague. Post-processing (C, D) cannot recover information that was lost during analysis. |
| 25 | **B** | D1 | Structured manifests enable crash recovery. Re-running everything (A) is wasteful. `--resume` (C) may not persist agent state across crashes. Message queues (D) are over-engineered for this pattern. |
| 26 | **B** | D1 | The coordinator should dynamically select subagents based on query requirements, not always use the full pipeline. Some queries don't need all four subagents. |
| 27 | **B** | D5 | Lost-in-the-middle: place key findings at the beginning, use clear section headers. Word limits (A) lose information. `/compact` (C) is for conversation history, not reports. Top-5 only (D) is arbitrary. |
| 28 | **B** | D2 | Project-scoped `.mcp.json` for team sharing + environment variable expansion for secrets. User-scoped (A) isn't shared. Committing tokens (C) is a security risk. Separate tokens file (D) isn't the standard pattern. |
| 29 | **B** | D1 | Subagent context isolation. The coordinator must pass findings explicitly in the Task prompt. Better system prompts (A) won't help if the findings data isn't there. File reading (C) and re-running (D) add unnecessary complexity. |
| 30 | **B** | D1 | `fork_session` creates independent branches from a shared analysis baseline — each fork has a full copy of the context at the fork point. Running twice (A) can work if you pass the same findings explicitly, but doesn't preserve the full conversational context. Different AgentDefinitions (C) create independent agents without shared history. `--resume` (D) continues linearly, it doesn't branch. |

## Scenario 3: Code Generation with Claude Code

| Q | Answer | Domain | Explanation |
|---|---|---|---|
| 31 | **B** | D3 | User-level `~/.claude/CLAUDE.md` is personal and not version-controlled. Team standards belong in project-level `.claude/CLAUDE.md`. Extension installation (A), `/memory` (C), and version (D) are not the issue. |
| 32 | **B** | D3 | Root CLAUDE.md for shared standards + separate CLAUDE.md in each package directory that references shared standards (via `@import` or by relying on the merge behavior where all levels are loaded). Single monolithic file (A) forces irrelevant conventions on every context. Full duplication (C) creates maintenance burden. One rules file (D) loses package-specific context. |
| 33 | **B** | D3 | Glob patterns in `.claude/rules/` match scattered files by type regardless of directory. Per-directory CLAUDE.md (A) is impractical at 40+ directories. Root CLAUDE.md (C) loads always, even when not editing tests. Skills (D) require manual invocation. |
| 34 | **B** | D3 | `context: fork` isolates skill output in a sub-agent context. Only the summary returns. `allowed-tools` (A) limits what the skill can do, not its output impact. Splitting (C) doesn't fix context pollution. `max-output` (D) doesn't exist. |
| 35 | **A** | D3 | Project-scoped commands in `.claude/commands/` are version-controlled and shared. `~/.claude/commands/` (B) is personal. Skills (C) serve a different purpose. CLAUDE.md (D) isn't for command definitions. |
| 36 | **B** | D3 | `argument-hint` frontmatter provides a description of expected arguments, prompting the user when the skill is invoked without them. The other options (`required-args`, `prompt`, `interactive`) are not valid SKILL.md frontmatter fields. Note: verify against current Claude Code docs as skill frontmatter options may evolve. |
| 37 | **B** | D3 | Plan mode for complex, multi-file architectural decisions. Direct execution (A, C) risks costly rework. Starting with direct execution (D) ignores the stated complexity. |
| 38 | **B** | D3 | The Explore subagent isolates verbose discovery output and returns a summary. Keeping everything (A) exhausts context. Manual copying (C) and `/compact` (D) are reactive workarounds, not architectural solutions. |
| 39 | **B** | D3 | `-p` (or `--print`) is the documented way to run Claude Code non-interactively. `CLAUDE_HEADLESS` (A), stdin redirect (C), and `--batch` (D) are not valid Claude Code features. |
| 40 | **B** | D3 | Include prior findings in context and ask for only new/unresolved issues. Clearing history (A) loses context. `--incremental` (C) doesn't exist. Separate sessions (D) don't have prior review context. |
| 41 | **B** | D3 | `--output-format json` and `--json-schema` are the correct CLI flags. The other flag combinations (A, C, D) don't exist. |
| 42 | **B** | D3 | Self-review bias: the model retains reasoning context from generation. Use an independent instance. Temperature (A), explicit instructions (C), and different configs (D) don't eliminate the bias from retained context. |

## Scenario 4: Structured Data Extraction

| Q | Answer | Domain | Explanation |
|---|---|---|---|
| 43 | **B** | D4 | Nullable optional fields prevent hallucination. When information is absent, Claude returns `null` instead of fabricating. Validation (A) catches but doesn't prevent. Prompt instructions (C) are probabilistic. Default values (D) mask missing data. |
| 44 | **C** | D4 | `enum` with `"other"` + detail string balances structured categories with extensibility. Free-form (A) loses structure. Strict enum (B) fails on unusual categories. Multiple categories (D) changes the semantics. |
| 45 | **D** | D4 | Forced tool selection guarantees a specific tool is called. `"any"` (B) guarantees a tool call but the model chooses which one — correct only if there's one extraction tool. For a single-tool scenario, both B and D work, but D is most precise. Prompt instructions (A) and few-shot (C) are probabilistic. |
| 46 | **B** | D4 | Semantic errors (incorrect arithmetic) are NOT prevented by `tool_use`. `tool_use` eliminates syntax errors only. A separate validation step is needed. Schema-level arithmetic rules (D) aren't supported in JSON Schema. |
| 47 | **C** | D4 | Retries fail when information is absent from the provided source. If payment terms are in a separate attachment not given to Claude, no amount of retrying will find them. Format errors (A), decimal errors (B), and truncation (D) can all be fixed via retry. |
| 48 | **B** | D4 | Explicit criteria with concrete examples for each severity level achieve consistency. Vague instructions (A) don't improve precision. More tokens (C) and repeated runs (D) don't address the root cause. |
| 49 | **B** | D4 | Few-shot prompting: targeted examples for problematic document types that demonstrate correct extraction from varied formats. This enables generalization to novel similar documents. |
| 50 | **B** | D4 | Test on a sample first, refine the prompt, then submit the full batch. Submitting all immediately (A) risks costly failures. Sequential batches (C) and hybrid approaches (D) don't address prompt quality. |
| 51 | **B** | D4 | Identify failures by `custom_id`, chunk oversized documents, resubmit only failures. Don't resubmit all 500 (C). `max_tokens` (A) isn't the cause of context limit errors. Synchronous API (D) doesn't have a larger context window. |
| 52 | **B** | D4 | Non-blocking overnight workload with no latency requirement = ideal for Batch API (50% savings). Synchronous (A) wastes money. Parallel streams (C) cost the same. Sampling (D) reduces accuracy. |
| 53 | **B** | D4 | Few-shot examples demonstrate varied document structures, enabling generalization. It's not about confidence (A), quantity of examples (C), or specific values (D). |
| 54 | **B** | D4 | `"unclear"` enum with `ambiguity_reason` handles genuinely ambiguous cases without forcing the model to guess. Confidence scores (A) are poorly calibrated. Boolean flags (C) lack granularity. Extraction method tracking (D) doesn't improve accuracy. |

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

After marking your answers, count correct answers per domain:

| Domain | Questions | Your Score | /Total | % |
|---|---|---|---|---|
| D1: Agentic Architecture | 1,2,3,4,9,10,11,16,17,18,19,25,26,29,30 + Q6 partial | __ | /16 | __% |
| D2: Tool Design & MCP | 5,6,13,14,20,21,22,28 | __ | /11 | __% |
| D3: Claude Code Config | 31,32,33,34,35,36,37,38,39,40,41,42 | __ | /12 | __% |
| D4: Prompt Engineering | 43,44,45,46,47,48,49,50,51,52,53,54 | __ | /12 | __% |
| D5: Context Management | 7,8,12,15,23,24,27 | __ | /9 | __% |
| **TOTAL** | | __ | **/60** | __% |
