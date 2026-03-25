export interface ExamQuestion {
  text: string
  domain?: string
  scenario?: string
  options: { letter: string; text: string }[]
  correct: string
  explanation: string
}

const scenario1Exam1 =
  "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-ambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems through custom MCP tools (`get_customer`, `lookup_order`, `process_refund`, `escalate_to_human`). Your target is 80%+ first-contact resolution while knowing when to escalate."

const scenario2Exam1 =
  "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates to specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one generates reports. The system researches topics and produces comprehensive, cited reports."

const scenario3Exam1 =
  "You are using Claude Code to accelerate software development. Your team uses it for code generation, refactoring, debugging, and documentation. You need to integrate it into your development workflow with custom commands, CLAUDE.md configurations, and understand when to use plan mode vs direct execution."

const scenario4Exam1 =
  "You are building a structured data extraction system using Claude. The system extracts information from unstructured documents (invoices, contracts, reports), validates output using JSON schemas, and maintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems."

const scenario1Exam2 =
  "You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers explore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive tasks. It uses the built-in tools (Read, Write, Edit, Bash, Grep, Glob) and integrates with Model Context Protocol (MCP) servers."

const scenario2Exam2 =
  "You are integrating Claude Code into your CI/CD pipeline. The system runs automated code reviews, generates test cases, and provides feedback on pull requests. You need to design prompts that provide actionable feedback and minimize false positives."

const scenario3Exam2 =
  "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles returns, billing disputes, and account issues. It has MCP tools (`get_customer`, `lookup_order`, `process_refund`, `update_account`, `escalate_to_human`). Your target is 80%+ first-contact resolution."

const scenario4Exam2 =
  "You are building a structured data extraction system using Claude. The system extracts information from contracts, medical records, and financial statements. It validates output using JSON schemas and routes low-confidence extractions to human reviewers."

const scenario1Exam4 =
  "You are building a legal document review agent using the Claude Agent SDK. The agent helps law firms analyze contracts, identify risky clauses, extract key terms, and compare documents against standard templates. It uses built-in tools (Read, Write, Edit, Bash, Grep, Glob) and integrates with Model Context Protocol (MCP) servers for legal databases, case law repositories, and document management systems."

const scenario2Exam4 =
  "You are building a supply chain management agent using the Claude Agent SDK. The agent helps operations teams track inventory levels, predict stockouts, manage supplier relationships, and optimize reorder points. It has MCP tools (`check_inventory`, `predict_demand`, `contact_supplier`, `create_purchase_order`, `track_shipment`). Your target is 95%+ inventory accuracy and 90%+ on-time fulfillment."

const scenario3Exam4 =
  "You are building an educational content creation agent using the Claude Agent SDK. The agent helps educators generate lesson plans, create assessments, adapt content for different learning levels, and align materials with curriculum standards. It has MCP tools (`search_standards`, `generate_lesson`, `create_assessment`, `adapt_content`, `validate_alignment`). Your target is 85%+ educator satisfaction and 90%+ standards alignment accuracy."

const scenario4Exam4 =
  "You are building a real estate analysis system using Claude. The system extracts information from property listings, appraisal reports, and market analyses. It validates output using JSON schemas, flags potential valuation issues, and routes high-risk findings to human appraisers."

const scenario1Exam3 =
  "You are building an enterprise knowledge management agent using the Claude Agent SDK. The agent helps employees find internal documentation, answer policy questions, locate subject matter experts, and summarize meeting notes. It uses built-in tools (Read, Write, Edit, Bash, Grep, Glob) and integrates with Model Context Protocol (MCP) servers for Confluence, SharePoint, and internal directory services."

const scenario2Exam3 =
  "You are building an AI-powered shopping assistant using the Claude Agent SDK. The agent helps customers find products, compare features, check inventory, apply discounts, and process orders. It has MCP tools (`search_products`, `check_inventory`, `apply_discount`, `create_order`, `get_recommendations`). Your target is 75%+ conversion rate on assisted sessions."

const scenario3Exam3 =
  "You are building a patient intake assistant using the Claude Agent SDK. The agent handles appointment scheduling, symptom triage, insurance verification, and pre-visit questionnaires. It has MCP tools (`check_availability`, `book_appointment`, `verify_insurance`, `collect_symptoms`, `escalate_to_clinician`). Your target is 90%+ patient satisfaction with intake experience."

const scenario4Exam3 =
  "You are building a compliance monitoring system using Claude. The system extracts information from regulatory filings, transaction records, and audit reports. It validates output using JSON schemas, flags potential violations, and routes high-risk findings to human compliance officers."

export const examData: Record<string, ExamQuestion[]> = {
  "1": [
    // Scenario 1: Customer Support Resolution Agent (Q1-Q15)
    {
      text: 'Your agentic loop implementation uses the following termination logic:\n\n```python\nif "I\'ve completed" in response.content[0].text:\n    break\n```\n\nThe agent occasionally runs indefinitely or terminates mid-investigation. What is the correct approach?',
      domain: "D1",
      scenario: scenario1Exam1,
      options: [
        { letter: "A", text: "Add a maximum iteration counter (e.g., `max_iterations=10`) as the primary stopping mechanism to prevent infinite loops." },
        { letter: "B", text: 'Check `response.stop_reason == "end_turn"` to terminate the loop, and continue when `stop_reason == "tool_use"`.' },
        { letter: "C", text: "Check whether the response contains any `TextBlock` content, as this indicates the model has produced its final answer." },
        { letter: "D", text: 'Parse the response for keywords like "done," "complete," or "finished" to determine when the agent has concluded its work.' },
      ],
      correct: "B",
      explanation:
        'The agentic loop must check `stop_reason`. `"tool_use"` \u2192 continue. `"end_turn"` \u2192 stop. Parsing text (A, D) is an anti-pattern. Iteration caps are fine as a secondary safety net but not as the primary stopping mechanism. Checking for TextBlock (C) is unreliable \u2014 responses can contain both text and tool calls.',
    },
    {
      text: 'After deploying the agent, logs reveal that 15% of refunds are processed without customer identity verification. The system prompt clearly states: "Always verify customer identity using `get_customer` before processing any refund." What change provides the strongest reliability guarantee?',
      domain: "D1",
      scenario: scenario1Exam1,
      options: [
        { letter: "A", text: "Add 5 few-shot examples showing the agent calling `get_customer` before every refund, covering various customer request patterns." },
        { letter: "B", text: "Implement a `PreToolUse` hook that blocks `process_refund` unless a verified customer ID from `get_customer` exists in the session state." },
        { letter: "C", text: 'Rewrite the system prompt with stronger language: "CRITICAL: You MUST call get_customer before process_refund. Failure to do so is a policy violation."' },
        { letter: "D", text: "Add a validation layer that checks tool call sequences after each turn and sends a corrective prompt if `get_customer` was skipped." },
      ],
      correct: "B",
      explanation:
        "Hooks provide 100% deterministic enforcement. Prompt-based approaches (A, C) have a non-zero failure rate \u2014 15% failure is proof. Post-hoc validation (D) catches errors after the fact but doesn't prevent them.",
    },
    {
      text: 'A customer writes: "I need to return order #8842 because the screen is cracked, AND I want to dispute the charge on order #7791 because it was unauthorized." How should the agent handle this?',
      domain: "D1",
      scenario: scenario1Exam1,
      options: [
        { letter: "A", text: "Process both issues sequentially in the same turn, completing the return before starting the billing dispute." },
        { letter: "B", text: "Decompose the message into two distinct issues, investigate each in parallel using shared customer context, then synthesize a unified response." },
        { letter: "C", text: "Ask the customer which issue they'd like to address first, then handle them one at a time across separate turns." },
        { letter: "D", text: "Escalate immediately because multi-issue requests exceed the agent's complexity threshold." },
      ],
      correct: "B",
      explanation:
        "Multi-concern requests should be decomposed into distinct items, investigated in parallel using shared context, then synthesized. Sequential (A) is slower than needed. Asking (C) adds unnecessary friction. Escalating (D) contradicts the 80% resolution target.",
    },
    {
      text: "Your `PostToolUse` hook receives order data from the `lookup_order` tool. The tool returns timestamps as Unix integers, status as numeric codes (1=pending, 2=shipped, 3=delivered), and amounts without currency indicators. What should the hook do?",
      domain: "D1",
      scenario: scenario1Exam1,
      options: [
        { letter: "A", text: "Pass the raw data through unchanged \u2014 the model can interpret numeric codes and Unix timestamps on its own." },
        { letter: "B", text: "Normalize timestamps to ISO 8601, map status codes to human-readable strings, and add the currency symbol from the customer's locale." },
        { letter: "C", text: "Convert the data into a natural language summary paragraph to make it easier for the model to understand." },
        { letter: "D", text: "Store the raw data in a side channel and provide only the fields the model needs for the current query." },
      ],
      correct: "B",
      explanation:
        "PostToolUse hooks normalize heterogeneous data formats (timestamps, status codes, currencies) before the model processes them. Raw data (A) forces the model to interpret ambiguous formats. Natural language (C) loses structure. Side channels (D) aren't how hooks work.",
    },
    {
      text: 'The `get_customer` and `lookup_order` tools both accept an identifier parameter and have nearly identical descriptions: "Retrieves information using the provided identifier." Agents frequently call the wrong tool. What is the most effective first step?',
      domain: "D2",
      scenario: scenario1Exam1,
      options: [
        { letter: "A", text: "Implement a routing classifier that analyzes the user's message and pre-selects the appropriate tool based on keyword detection." },
        { letter: "B", text: "Expand each tool's description to include accepted input formats, example queries, expected outputs, boundaries, and when to use it versus the other tool." },
        { letter: "C", text: "Consolidate both tools into a single `lookup` tool that internally routes to the correct backend based on the identifier format." },
        { letter: "D", text: "Add 8-10 few-shot examples to the system prompt showing correct tool selection for various queries." },
      ],
      correct: "B",
      explanation:
        'Tool descriptions are the primary selection mechanism. Minimal descriptions are the root cause. Fix descriptions first (low effort, high leverage). Routing classifiers (A) are over-engineered. Consolidation (C) is valid but more effort than a "first step." Few-shot examples (D) add token overhead without fixing the root cause.',
    },
    {
      text: "The `process_refund` tool fails with a generic error: `{\"isError\": true, \"content\": \"Operation failed\"}`. The agent responds to the customer: \"I'm sorry, something went wrong. Please try again later.\" What improvement to the tool's error response would most help the agent?",
      domain: "D2",
      scenario: scenario1Exam1,
      options: [
        { letter: "A", text: "Include a detailed stack trace so the agent can diagnose the technical issue and explain it to the customer." },
        { letter: "B", text: "Return structured metadata: `errorCategory` (transient/validation/business/permission), `isRetryable`, and a `customer_explanation` field." },
        { letter: "C", text: "Return an HTTP status code (e.g., 500, 403) so the agent can look up the standard meaning." },
        { letter: "D", text: "Include a `suggested_action` field with exactly what the agent should say to the customer verbatim." },
      ],
      correct: "B",
      explanation:
        "Structured error metadata (errorCategory, isRetryable, customer_explanation) lets the agent make appropriate recovery decisions. Stack traces (A) are too technical for customers. HTTP codes (C) lack context. Verbatim scripts (D) are too rigid.",
    },
    {
      text: 'A customer says: "I want to speak to a manager. This is ridiculous." The agent\'s current behavior is to first investigate the issue and attempt resolution before offering escalation. What should the agent do?',
      domain: "D5",
      scenario: scenario1Exam1,
      options: [
        { letter: "A", text: "Investigate the issue quickly and present the resolution. If the customer reiterates their request, then escalate." },
        { letter: "B", text: "Escalate immediately. When a customer explicitly requests a human agent, honor the request without attempting investigation first." },
        { letter: "C", text: "Perform sentiment analysis and determine that the customer's frustration level warrants escalation." },
        { letter: "D", text: "Offer to resolve the issue and explain that wait times for human agents are currently long, to encourage the customer to continue with the AI." },
      ],
      correct: "B",
      explanation:
        "When a customer explicitly requests a human, honor immediately. Don't investigate first (A), use sentiment (C), or try to retain (D). This is a tested escalation pattern.",
    },
    {
      text: 'A `get_customer` call for "Sarah Johnson" returns three matching records in your system. How should the agent proceed?',
      domain: "D5",
      scenario: scenario1Exam1,
      options: [
        { letter: "A", text: "Select the record with the most recent activity, as it is most likely the active customer." },
        { letter: "B", text: "Ask the customer for an additional identifier (email, phone number, or account number) to disambiguate." },
        { letter: "C", text: "Present all three records and ask the customer which one is theirs." },
        { letter: "D", text: "Select the record in the same geographic region as the customer's IP address." },
      ],
      correct: "B",
      explanation:
        "Multiple matches require disambiguation. Ask for additional identifiers (email, phone). Don't guess based on recency (A), IP address (D), or expose all records (C \u2014 privacy risk).",
    },
    {
      text: "Your agent needs to: (1) verify customer identity, (2) look up order details, (3) check return eligibility, and (4) process the refund. Steps must happen in this exact order for compliance. Currently, steps are listed in the system prompt instructions. What architecture ensures 100% compliance with this sequence?",
      domain: "D1",
      scenario: scenario1Exam1,
      options: [
        { letter: "A", text: 'Number the steps clearly in the system prompt and add "CRITICAL: Follow this exact sequence" at the top.' },
        { letter: "B", text: "Use few-shot examples demonstrating the correct step sequence across multiple scenarios." },
        { letter: "C", text: "Implement programmatic prerequisite gates that block each downstream tool call until its prerequisite has completed successfully." },
        { letter: "D", text: "Use `tool_choice` forced selection to call tools in the correct order across sequential turns." },
      ],
      correct: "C",
      explanation:
        "Critical compliance sequences require programmatic enforcement \u2014 prerequisite gates block downstream tools until prerequisites complete. Prompt instructions (A, B) have non-zero failure rates. `tool_choice` (D) only controls the first tool per turn, not multi-step sequences.",
    },
    {
      text: "When the agent must escalate to a human, the human agent will handle the case in a separate system without access to the AI conversation transcript. What information must the escalation include?",
      domain: "D1",
      scenario: scenario1Exam1,
      options: [
        { letter: "A", text: "A link to the full AI conversation transcript so the human agent can review the discussion." },
        { letter: "B", text: "A structured handoff summary including customer ID, order details, root cause analysis, refund amount, and recommended action." },
        { letter: "C", text: "The customer's last message and the AI agent's last response." },
        { letter: "D", text: "Only the customer ID \u2014 the human agent can look up everything else in the CRM." },
      ],
      correct: "B",
      explanation:
        "Human agents without transcript access need a self-contained structured handoff: customer ID, root cause, amounts, recommended action. Transcript links (A) assume access. Last message (C) and ID only (D) are insufficient.",
    },
    {
      text: "You want to add the `process_refund` tool to the agent but ensure refunds above $500 are automatically routed to a human approver. The compliance team requires 100% enforcement. Which approach is correct?",
      domain: "D1",
      scenario: scenario1Exam1,
      options: [
        { letter: "A", text: 'Add the policy to the system prompt: "For refunds above $500, always use `escalate_to_human` instead of `process_refund`."' },
        { letter: "B", text: "Implement a `PreToolUse` hook that intercepts `process_refund` calls, checks the amount, and redirects amounts over $500 to human escalation." },
        { letter: "C", text: "Configure two versions of the tool: `process_refund_small` (\u2264$500) and `process_refund_large` (>$500, requires human approval)." },
        { letter: "D", text: "Use few-shot examples showing the agent escalating high-value refunds while processing low-value ones autonomously." },
      ],
      correct: "B",
      explanation:
        "100% enforcement requires a PreToolUse hook. Prompts (A) and examples (D) are probabilistic. Two tool variants (C) don't enforce the policy \u2014 the agent could still call the wrong one.",
    },
    {
      text: "During a long support session with multiple order lookups, the agent starts confusing details from earlier orders with the current one, citing incorrect amounts and dates. What is the root cause and fix?",
      domain: "D5",
      scenario: scenario1Exam1,
      options: [
        { letter: "A", text: "The model's temperature is too high, causing hallucinated details. Lower the temperature parameter." },
        { letter: "B", text: "Verbose tool results are accumulating in context. Implement a `PostToolUse` hook to trim each `lookup_order` result to only the relevant fields." },
        { letter: "C", text: "The model needs a larger context window. Upgrade to a higher-tier model." },
        { letter: "D", text: "The agent should clear its conversation history after each resolved issue." },
      ],
      correct: "B",
      explanation:
        "Verbose tool outputs accumulate and consume context. A PostToolUse hook trims each result to relevant fields, preventing confusion. Temperature (A), model size (C), and history clearing (D) don't address the root cause.",
    },
    {
      text: "The `lookup_order` tool sometimes returns empty results (`{\"orders\": []}`) when the customer provides a valid order number. Investigation reveals this happens during database maintenance windows. The agent currently treats this as \"no order found\" and tells the customer their order doesn't exist. How should the error handling be improved?",
      domain: "D2",
      scenario: scenario1Exam1,
      options: [
        { letter: "A", text: "Add retry logic with exponential backoff inside the tool, returning results once the database is available." },
        { letter: "B", text: 'Distinguish between a successful query returning no matches (`isError: false`, empty results = no matching order) and an access failure (`isError: true`, `errorCategory: "transient"`, `isRetryable: true` = database unavailable).' },
        { letter: "C", text: "Cache order data locally so the agent can serve results even when the database is down." },
        { letter: "D", text: 'Add a message to the system prompt: "If `lookup_order` returns empty, inform the customer that the system may be temporarily unavailable."' },
      ],
      correct: "B",
      explanation:
        'The tool must distinguish between "no matches found" (valid result, `isError: false`) and "database unavailable" (transient error, `isError: true`, retryable). Retry logic (A) helps but doesn\'t fix the reporting. Caching (C) and prompt changes (D) don\'t address the core issue.',
    },
    {
      text: "Your support agent has access to 18 MCP tools covering customer data, orders, refunds, billing, shipping, product catalog, knowledge base, and escalation. Tool selection accuracy has dropped to 60%. What's the most effective architectural change?",
      domain: "D2",
      scenario: scenario1Exam1,
      options: [
        { letter: "A", text: "Add detailed descriptions to all 18 tools and add few-shot examples for the most commonly confused pairs." },
        { letter: "B", text: "Reduce the agent's tool set to 4-5 core tools relevant to its primary function, routing specialized tasks to dedicated subagents with their own scoped tool sets." },
        { letter: "C", text: "Implement a tool routing classifier that analyzes each message and pre-selects the 3 most relevant tools." },
        { letter: "D", text: "Organize tools into categories in the system prompt and instruct the agent to first identify the category, then select the tool." },
      ],
      correct: "B",
      explanation:
        "18 tools degrades selection reliability. Reduce to 4-5 core tools per agent and route specialized tasks to dedicated subagents with scoped tools. Better descriptions (A) help but don't solve the fundamental cognitive load problem at 18 tools. Routing classifiers (C) add complexity.",
    },
    {
      text: 'A customer escalation policy states: "Escalate when the customer\'s request falls outside documented policies." A customer asks for a competitor price match. Your price adjustment policy covers only matching your own website\'s lower prices. What should the agent do?',
      domain: "D5",
      scenario: scenario1Exam1,
      options: [
        { letter: "A", text: "Deny the request because competitor price matching isn't in the policy." },
        { letter: "B", text: "Attempt the price match since the customer's request is reasonable and similar to an existing policy." },
        { letter: "C", text: "Escalate to a human agent because the policy is silent on competitor price matching \u2014 this is a policy gap." },
        { letter: "D", text: "Ask the customer to provide a link to the competitor's price for verification before deciding." },
      ],
      correct: "C",
      explanation:
        "When policy is silent on the customer's request, escalate \u2014 this is a policy gap. Don't deny (A \u2014 may lose a valid customer), don't attempt (B \u2014 no policy authority), don't proceed (D \u2014 still no policy).",
    },
    // Scenario 2: Multi-Agent Research System (Q16-Q30)
    {
      text: "Your coordinator agent's `AgentDefinition` has `allowedTools: [\"web_search\", \"analyze_document\"]`. When the coordinator tries to spawn a subagent using the `Task` tool, it fails silently. What is the problem?",
      domain: "D1",
      scenario: scenario2Exam1,
      options: [
        { letter: "A", text: 'The coordinator needs `allowedTools: ["Task"]` (or a list that includes `"Task"`) to be able to spawn subagents.' },
        { letter: "B", text: "The `Task` tool must be explicitly registered in the `.mcp.json` configuration file." },
        { letter: "C", text: "Subagent definitions must be loaded into the coordinator's system prompt before they can be invoked." },
        { letter: "D", text: 'The coordinator needs a `spawn_subagent` flag set to `true` in its `AgentDefinition`.' },
      ],
      correct: "A",
      explanation:
        'The coordinator\'s `allowedTools` must include `"Task"` to spawn subagents. Without it, the Task tool call fails. `.mcp.json` (B), system prompts (C), and flags (D) are not the mechanism for enabling subagent spawning.',
    },
    {
      text: "The web search subagent finds 12 relevant articles about renewable energy policy. You need to pass these results to the synthesis subagent. How should you transfer this context?",
      domain: "D1",
      scenario: scenario2Exam1,
      options: [
        { letter: "A", text: "Store the results in a shared database and give the synthesis subagent the database query to retrieve them." },
        { letter: "B", text: "Include the complete search results directly in the synthesis subagent's `Task` prompt, with content separated from metadata (source URLs, dates, document names)." },
        { letter: "C", text: "The synthesis subagent automatically inherits the coordinator's context, which includes the web search results." },
        { letter: "D", text: "Save the results to a file and instruct the synthesis subagent to read the file using the Read tool." },
      ],
      correct: "B",
      explanation:
        "Subagents have isolated context \u2014 they don't inherit the coordinator's history. Findings must be passed explicitly in the Task prompt. Shared databases (A) and files (D) add unnecessary complexity. Automatic inheritance (C) is incorrect \u2014 this is a key exam concept.",
    },
    {
      text: "You want the web search and document analysis subagents to execute simultaneously on different aspects of a research topic. How should you implement parallel execution?",
      domain: "D1",
      scenario: scenario2Exam1,
      options: [
        { letter: "A", text: "Use Python threading to spawn both subagents in separate threads from your application code." },
        { letter: "B", text: "Have the coordinator emit multiple `Task` tool calls in a single response \u2014 one for each subagent." },
        { letter: "C", text: "Configure `parallel: true` in each subagent's `AgentDefinition`." },
        { letter: "D", text: "Have the coordinator send the first Task call, wait for it to complete, then send the second." },
      ],
      correct: "B",
      explanation:
        "Parallel execution is achieved by emitting multiple Task calls in a single coordinator response. Python threading (A) is application-level, not SDK-level. `parallel: true` (C) doesn't exist. Sequential calls (D) are by definition not parallel.",
    },
    {
      text: 'After researching "global food security challenges," the final report discusses only crop production, omitting supply chain disruption, climate adaptation, and nutritional equity. Coordinator logs show it decomposed the topic into: "wheat production trends," "rice yield forecasting," and "corn production technology." What is the root cause?',
      domain: "D1",
      scenario: scenario2Exam1,
      options: [
        { letter: "A", text: "The web search subagent's queries were too narrow and only returned crop-specific results." },
        { letter: "B", text: "The coordinator's task decomposition was too narrow, assigning subtasks that only covered one dimension of the topic." },
        { letter: "C", text: "The synthesis subagent failed to identify coverage gaps and request additional research on missing areas." },
        { letter: "D", text: "The document analysis subagent filtered out non-production-related sources." },
      ],
      correct: "B",
      explanation:
        'The coordinator decomposed a broad topic ("food security") into narrow subtasks (only crop production). Subagents worked correctly within their assigned scope. The root cause is the coordinator\'s decomposition, not downstream agents (A, C, D).',
    },
    {
      text: "The synthesis subagent needs to verify simple facts (dates, names, statistics) 85% of the time during synthesis. Currently, each verification round-trips through the coordinator to the web search subagent, adding 40% latency. What's the best fix?",
      domain: "D2",
      scenario: scenario2Exam1,
      options: [
        { letter: "A", text: "Give the synthesis subagent access to all web search tools so it can verify anything directly." },
        { letter: "B", text: "Give the synthesis subagent a scoped `verify_fact` tool for simple lookups, while complex verifications continue routing through the coordinator." },
        { letter: "C", text: "Have the web search subagent proactively cache extra context around each source to anticipate verification needs." },
        { letter: "D", text: "Have the synthesis subagent batch all verification requests and submit them at the end of its pass." },
      ],
      correct: "B",
      explanation:
        "Scoped cross-role tool for the 85% common case. Full tool access (A) violates separation of concerns. Caching (C) can't predict needs. Batching (D) creates blocking dependencies.",
    },
    {
      text: "The web search subagent encounters a timeout while searching for academic papers on AI ethics. It has found 3 of the expected 8 sources before the timeout. How should it report this to the coordinator?",
      domain: "D2",
      scenario: scenario2Exam1,
      options: [
        { letter: "A", text: 'Return a generic error: `{"status": "error", "message": "Search timed out"}`' },
        { letter: "B", text: "Return an empty result set marked as successful to avoid disrupting the workflow." },
        { letter: "C", text: 'Return structured error context: `{"status": "partial_failure", "failure_type": "timeout", "partial_results": [...3 sources...], "attempted_query": "...", "alternatives": ["try academic database", "narrow search scope"]}`' },
        { letter: "D", text: "Throw an exception that terminates the entire research workflow." },
      ],
      correct: "C",
      explanation:
        "Structured error context enables intelligent coordinator recovery. Generic errors (A) hide context. Silent suppression (B) prevents recovery. Terminating (D) wastes partial results.",
    },
    {
      text: "Your synthesis subagent has access to 15 tools including web search, document analysis, file operations, and database queries. Despite clear synthesis instructions, it frequently attempts its own web searches instead of synthesizing the provided findings. What's the issue?",
      domain: "D2",
      scenario: scenario2Exam1,
      options: [
        { letter: "A", text: 'The system prompt needs stronger instructions to "only synthesize, never search."' },
        { letter: "B", text: "The subagent has too many tools outside its specialization. Restrict its tool set to synthesis-relevant tools only (e.g., `verify_fact`, `format_report`)." },
        { letter: "C", text: "The synthesis instructions should be moved from the system prompt to a skill file." },
        { letter: "D", text: "Add few-shot examples showing the synthesis subagent using only synthesis tools." },
      ],
      correct: "B",
      explanation:
        "Too many tools outside its specialization leads to misuse. Restrict the tool set. Prompt instructions (A) are probabilistic. Skills (C) don't solve tool distribution. Few-shot (D) helps but doesn't address the root cause.",
    },
    {
      text: 'Two credible sources provide conflicting statistics: Forbes reports the AI market at $150B (January 2025) and McKinsey reports $180B (March 2025). How should the synthesis subagent handle this?',
      domain: "D5",
      scenario: scenario2Exam1,
      options: [
        { letter: "A", text: 'Average the two values and report: "The AI market is valued at approximately $165B."' },
        { letter: "B", text: "Use the more recent source (McKinsey, March 2025) as the authoritative figure." },
        { letter: "C", text: "Preserve both values with source attribution\u2014 noting dates and potential methodological differences \u2014 and structure the report to distinguish established from contested findings." },
        { letter: "D", text: "Flag this as a data quality issue and exclude the statistic from the report entirely." },
      ],
      correct: "C",
      explanation:
        "Preserve both values with attribution, dates, and methodological notes. Averaging (A), picking newer (B), and excluding (D) all lose information.",
    },
    {
      text: "The document analysis subagent returns findings as unstructured prose: \"There's interesting research showing AI market growth. Several studies confirm this trend.\" Downstream synthesis loses all source attribution. What change to the subagent's output format fixes this?",
      domain: "D5",
      scenario: scenario2Exam1,
      options: [
        { letter: "A", text: "Add \"include citations\" to the document analysis subagent's system prompt." },
        { letter: "B", text: "Require the subagent to output structured claim-source mappings: each finding includes a claim, evidence excerpt, source URL/name, page number, and publication date." },
        { letter: "C", text: "Have the coordinator extract citations from the prose output before passing to synthesis." },
        { letter: "D", text: "Post-process the synthesis output with a separate citation-extraction step." },
      ],
      correct: "B",
      explanation:
        "Structured claim-source mappings preserve provenance through the pipeline. Prompt instructions (A) are vague. Post-processing (C, D) cannot recover information that was lost during analysis.",
    },
    {
      text: "The coordinator needs to resume a research workflow after a system crash. The web search and document analysis phases completed before the crash, but synthesis hadn't started. How should crash recovery be implemented?",
      domain: "D1",
      scenario: scenario2Exam1,
      options: [
        { letter: "A", text: "Re-run the entire workflow from scratch since partial state may be corrupted." },
        { letter: "B", text: "Save a `manifest.json` where each agent exports structured state. On resume, the coordinator loads the manifest and injects completed agent states into prompts." },
        { letter: "C", text: "Use `--resume` to automatically restore the coordinator's conversation context from before the crash." },
        { letter: "D", text: "Implement a message queue that replays unprocessed tasks from a persistent log." },
      ],
      correct: "B",
      explanation:
        "Structured manifests enable crash recovery. Re-running everything (A) is wasteful. `--resume` (C) may not persist agent state across crashes. Message queues (D) are over-engineered for this pattern.",
    },
    {
      text: 'Your coordinator dynamically selects which subagents to invoke based on the query. For the query "Compare renewable energy costs in Europe," it invokes all four subagents (web search, document analysis, synthesis, report generation) sequentially as a fixed pipeline. What\'s the problem?',
      domain: "D1",
      scenario: scenario2Exam1,
      options: [
        { letter: "A", text: "Nothing \u2014 a sequential pipeline is the correct approach for comprehensive research." },
        { letter: "B", text: "The coordinator should analyze query requirements and dynamically select only the needed subagents, rather than always routing through the full pipeline." },
        { letter: "C", text: "The pipeline should run in parallel instead of sequentially." },
        { letter: "D", text: "The report generation subagent should be merged with the synthesis subagent." },
      ],
      correct: "B",
      explanation:
        "The coordinator should dynamically select subagents based on query requirements, not always use the full pipeline. Some queries don't need all four subagents.",
    },
    {
      text: "Your research reports have grown too long, and stakeholders complain they can't find key findings. The coordinator currently concatenates raw subagent outputs into one document. What structural improvement addresses this?",
      domain: "D5",
      scenario: scenario2Exam1,
      options: [
        { letter: "A", text: "Set a maximum word count for each subagent's output." },
        { letter: "B", text: "Place key findings summaries at the beginning of the aggregated output, with detailed results in clearly-labeled sections, to mitigate the lost-in-the-middle effect." },
        { letter: "C", text: "Use `/compact` to condense the report before delivering it." },
        { letter: "D", text: "Have each subagent rank its findings by importance and only include the top 5." },
      ],
      correct: "B",
      explanation:
        "Lost-in-the-middle: place key findings at the beginning, use clear section headers. Word limits (A) lose information. `/compact` (C) is for conversation history, not reports. Top-5 only (D) is arbitrary.",
    },
    {
      text: "You need to configure an MCP server for your research pipeline that requires a GitHub API token. The project is worked on by a team of 5 researchers. Where should you configure the MCP server and how should you handle the token?",
      domain: "D2",
      scenario: scenario2Exam1,
      options: [
        { letter: "A", text: "In each researcher's `~/.claude.json` with the token hardcoded." },
        { letter: "B", text: "In the project's `.mcp.json` with `\"env\": {\"GITHUB_TOKEN\": \"${GITHUB_TOKEN}\"}` \u2014 each researcher sets the environment variable locally." },
        { letter: "C", text: "In the project's `.mcp.json` with the token committed directly in the configuration file." },
        { letter: "D", text: "In a separate `tokens.json` file that is `.gitignore`-ed and referenced by `.mcp.json`." },
      ],
      correct: "B",
      explanation:
        "Project-scoped `.mcp.json` for team sharing + environment variable expansion for secrets. User-scoped (A) isn't shared. Committing tokens (C) is a security risk. Separate tokens file (D) isn't the standard pattern.",
    },
    {
      text: 'The coordinator spawns a synthesis subagent with the prompt: "Synthesize the research findings." The subagent produces a vague, generic synthesis that doesn\'t reference the specific findings from the search and analysis phases. What\'s wrong?',
      domain: "D1",
      scenario: scenario2Exam1,
      options: [
        { letter: "A", text: "The synthesis subagent needs a more detailed system prompt with specific synthesis instructions." },
        { letter: "B", text: "The subagent has isolated context \u2014 it did not receive the search and analysis findings. The coordinator must explicitly pass the findings directly in the Task prompt." },
        { letter: "C", text: "The synthesis subagent needs access to the Read tool to load the findings from a shared file." },
        { letter: "D", text: "The coordinator should re-run the search and analysis subagents within the synthesis context." },
      ],
      correct: "B",
      explanation:
        "Subagent context isolation. The coordinator must pass findings explicitly in the Task prompt. Better system prompts (A) won't help if the findings data isn't there. File reading (C) and re-running (D) add unnecessary complexity.",
    },
    {
      text: "You want to explore two different synthesis approaches (narrative-style vs data-driven) from the same set of search and analysis results. What feature enables this?",
      domain: "D1",
      scenario: scenario2Exam1,
      options: [
        { letter: "A", text: "Run the synthesis subagent twice with different system prompts." },
        { letter: "B", text: "Use `fork_session` to create two independent branches from the shared analysis baseline, each exploring a different approach." },
        { letter: "C", text: "Create two separate synthesis subagents with different `AgentDefinition` configurations." },
        { letter: "D", text: "Use `--resume` to go back to the pre-synthesis point and try a different approach." },
      ],
      correct: "B",
      explanation:
        "`fork_session` creates independent branches from a shared analysis baseline \u2014 each fork has a full copy of the context at the fork point. Running twice (A) can work if you pass the same findings explicitly, but doesn't preserve the full conversational context. Different AgentDefinitions (C) create independent agents without shared history. `--resume` (D) continues linearly, it doesn't branch.",
    },
    // Scenario 3: Code Generation with Claude Code (Q31-Q42)
    {
      text: "A senior developer has configured team coding standards in `~/.claude/CLAUDE.md`. A new hire clones the repository but doesn't get these standards applied. What's the issue?",
      domain: "D3",
      scenario: scenario3Exam1,
      options: [
        { letter: "A", text: "The new hire needs to install the Claude Code extension first." },
        { letter: "B", text: "User-level `~/.claude/CLAUDE.md` is personal and not shared via version control. Team standards should be in the project-level `.claude/CLAUDE.md`." },
        { letter: "C", text: "The new hire needs to run `/memory` to manually load the standards." },
        { letter: "D", text: "The new hire's Claude Code version is outdated and doesn't support the CLAUDE.md hierarchy." },
      ],
      correct: "B",
      explanation:
        "User-level `~/.claude/CLAUDE.md` is personal and not version-controlled. Team standards belong in project-level `.claude/CLAUDE.md`. Extension installation (A), `/memory` (C), and version (D) are not the issue.",
    },
    {
      text: "Your monorepo has three packages: a React frontend, a Python API, and a Terraform infrastructure module. Each has different coding conventions and each package has its own maintainer with domain expertise. What's the best way to organize CLAUDE.md?",
      domain: "D3",
      scenario: scenario3Exam1,
      options: [
        { letter: "A", text: "Put all conventions in the root CLAUDE.md, organized by headers for each package." },
        { letter: "B", text: "Create a root CLAUDE.md with shared standards and use `@import` in each package's CLAUDE.md to selectively include relevant standards files based on the maintainer's domain knowledge." },
        { letter: "C", text: "Create separate CLAUDE.md files in each package subdirectory with the full set of conventions duplicated." },
        { letter: "D", text: "Use `.claude/rules/` with one monolithic rules file containing all conventions." },
      ],
      correct: "B",
      explanation:
        "Root CLAUDE.md for shared standards + separate CLAUDE.md in each package directory that references shared standards (via `@import` or by relying on the merge behavior where all levels are loaded). Single monolithic file (A) forces irrelevant conventions on every context. Full duplication (C) creates maintenance burden. One rules file (D) loses package-specific context.",
    },
    {
      text: "Test files in your project are co-located with source code (`Button.test.tsx` alongside `Button.tsx`, `api.test.py` alongside `api.py`) spread across 40+ directories. All test files should follow the same testing conventions. What's the most maintainable configuration?",
      domain: "D3",
      scenario: scenario3Exam1,
      options: [
        { letter: "A", text: "Create a CLAUDE.md file in every directory that contains test files." },
        { letter: "B", text: 'Create a `.claude/rules/testing.md` file with YAML frontmatter: `paths: ["**/*.test.tsx", "**/*.test.ts", "**/*.test.py"]`.' },
        { letter: "C", text: 'Put testing conventions in the root CLAUDE.md under a "Testing" header.' },
        { letter: "D", text: "Create a testing skill in `.claude/skills/testing/SKILL.md`." },
      ],
      correct: "B",
      explanation:
        "Glob patterns in `.claude/rules/` match scattered files by type regardless of directory. Per-directory CLAUDE.md (A) is impractical at 40+ directories. Root CLAUDE.md (C) loads always, even when not editing tests. Skills (D) require manual invocation.",
    },
    {
      text: "Your team's `/analyze` skill produces verbose codebase exploration output (300+ lines of file listings, import traces, and dependency graphs) that fills the context window. After running the skill, subsequent Claude responses are degraded. What configuration change fixes this?",
      domain: "D3",
      scenario: scenario3Exam1,
      options: [
        { letter: "A", text: "Add `allowed-tools: [Read, Grep, Glob]` to the SKILL.md frontmatter to limit the skill's tool access." },
        { letter: "B", text: "Add `context: fork` to the SKILL.md frontmatter so the skill runs in an isolated sub-agent context, returning only a summary to the main session." },
        { letter: "C", text: "Split the skill into smaller sub-skills that each produce less output." },
        { letter: "D", text: "Add `max-output: 50` to the SKILL.md frontmatter to limit output lines." },
      ],
      correct: "B",
      explanation:
        "`context: fork` isolates skill output in a sub-agent context. Only the summary returns. `allowed-tools` (A) limits what the skill can do, not its output impact. Splitting (C) doesn't fix context pollution. `max-output` (D) doesn't exist.",
    },
    {
      text: "You need a custom `/deploy` command that is available to all team members who clone the repo. Where should you create the command file?",
      domain: "D3",
      scenario: scenario3Exam1,
      options: [
        { letter: "A", text: "`.claude/commands/deploy.md` in the project repository." },
        { letter: "B", text: "`~/.claude/commands/deploy.md` on each developer's machine." },
        { letter: "C", text: "`.claude/skills/deploy/SKILL.md` in the project repository." },
        { letter: "D", text: 'Add a "deploy" section to the root CLAUDE.md.' },
      ],
      correct: "A",
      explanation:
        "Project-scoped commands in `.claude/commands/` are version-controlled and shared. `~/.claude/commands/` (B) is personal. Skills (C) serve a different purpose. CLAUDE.md (D) isn't for command definitions.",
    },
    {
      text: "Your team lead wants Claude to ask developers for the target environment name whenever the `/deploy` skill is invoked without arguments. Which SKILL.md frontmatter option enables this?",
      domain: "D3",
      scenario: scenario3Exam1,
      options: [
        { letter: "A", text: '`required-args: ["environment"]`' },
        { letter: "B", text: '`argument-hint: "Specify the target environment (staging, production)"`' },
        { letter: "C", text: '`prompt: "Which environment should I deploy to?"`' },
        { letter: "D", text: "`interactive: true`" },
      ],
      correct: "B",
      explanation:
        "`argument-hint` frontmatter provides a description of expected arguments, prompting the user when the skill is invoked without them. The other options (`required-args`, `prompt`, `interactive`) are not valid SKILL.md frontmatter fields.",
    },
    {
      text: "You need to restructure a monolithic application into microservices. The change will affect 45+ files and requires decisions about service boundaries, API contracts, and database partitioning. Which approach is correct?",
      domain: "D3",
      scenario: scenario3Exam1,
      options: [
        { letter: "A", text: "Use direct execution to start making changes and let the architecture emerge from the implementation." },
        { letter: "B", text: "Enter plan mode to explore the codebase, understand dependencies, and design the approach before making changes." },
        { letter: "C", text: "Use direct execution with a detailed upfront specification of exactly how each service should be structured." },
        { letter: "D", text: "Start with direct execution and only switch to plan mode if unexpected complexity arises." },
      ],
      correct: "B",
      explanation:
        "Plan mode for complex, multi-file architectural decisions. Direct execution (A, C) risks costly rework. Starting with direct execution (D) ignores the stated complexity.",
    },
    {
      text: "During a complex investigation of a legacy codebase, the Explore subagent reads 200+ files and generates verbose output about class hierarchies, database schemas, and API endpoints. How should you handle this information?",
      domain: "D3",
      scenario: scenario3Exam1,
      options: [
        { letter: "A", text: "Keep all Explore output in the main conversation for completeness." },
        { letter: "B", text: "The Explore subagent isolates verbose discovery output and returns a summary to the main agent, preserving the main session's context window." },
        { letter: "C", text: "Manually copy the relevant findings and start a new session." },
        { letter: "D", text: "Use `/compact` immediately after the Explore subagent finishes." },
      ],
      correct: "B",
      explanation:
        "The Explore subagent isolates verbose discovery output and returns a summary. Keeping everything (A) exhausts context. Manual copying (C) and `/compact` (D) are reactive workarounds, not architectural solutions.",
    },
    {
      text: "Your CI pipeline runs:\n```bash\nclaude \"Review this PR for security vulnerabilities\"\n```\nThe job hangs indefinitely in the pipeline. What's wrong?",
      domain: "D3",
      scenario: scenario3Exam1,
      options: [
        { letter: "A", text: "The command needs `CLAUDE_HEADLESS=true` set as an environment variable." },
        { letter: "B", text: 'The command is missing the `-p` flag. It should be: `claude -p "Review this PR for security vulnerabilities"`.' },
        { letter: "C", text: "stdin needs to be redirected: `claude \"...\" < /dev/null`." },
        { letter: "D", text: "The command needs the `--batch` flag for CI environments." },
      ],
      correct: "B",
      explanation:
        "`-p` (or `--print`) is the documented way to run Claude Code non-interactively. `CLAUDE_HEADLESS` (A), stdin redirect (C), and `--batch` (D) are not valid Claude Code features.",
    },
    {
      text: "Your CI pipeline generates PR review comments using Claude Code. After a developer pushes fixes based on the first review, the second review run duplicates all previous findings plus new ones, flooding the PR with redundant comments. What's the fix?",
      domain: "D3",
      scenario: scenario3Exam1,
      options: [
        { letter: "A", text: "Clear the review history between runs so each review starts fresh." },
        { letter: "B", text: "Include the prior review findings in context and instruct Claude to report only new or still-unaddressed issues." },
        { letter: "C", text: "Add `--incremental` flag to only analyze changed files." },
        { letter: "D", text: "Use a separate Claude session for each review run with explicit instructions to only check the new commits." },
      ],
      correct: "B",
      explanation:
        "Include prior findings in context and ask for only new/unresolved issues. Clearing history (A) loses context. `--incremental` (C) doesn't exist. Separate sessions (D) don't have prior review context.",
    },
    {
      text: "You want Claude Code to produce machine-parseable structured output for your CI pipeline so review findings can be automatically posted as inline PR comments. What CLI flags should you use?",
      domain: "D3",
      scenario: scenario3Exam1,
      options: [
        { letter: "A", text: '`claude -p "..." --format json`' },
        { letter: "B", text: "`claude -p \"...\" --output-format json --json-schema '{\"type\":\"object\",...}'`" },
        { letter: "C", text: '`claude -p "..." --json`' },
        { letter: "D", text: '`claude -p "..." --structured-output`' },
      ],
      correct: "B",
      explanation:
        "`--output-format json` and `--json-schema` are the correct CLI flags. The other flag combinations (A, C, D) don't exist.",
    },
    {
      text: "The same Claude Code session that generated a feature's code is asked to review its own changes. The review finds no issues despite obvious problems that an independent reviewer would catch. Why?",
      domain: "D3",
      scenario: scenario3Exam1,
      options: [
        { letter: "A", text: "The model's temperature is too low for review tasks, making it overly agreeable." },
        { letter: "B", text: "The model retains reasoning context from generation, making it biased toward confirming its own decisions. Use an independent review instance without prior reasoning context." },
        { letter: "C", text: "The system prompt doesn't explicitly instruct the model to be critical of its own code." },
        { letter: "D", text: "Code generation and code review require different model configurations (temperature, max_tokens)." },
      ],
      correct: "B",
      explanation:
        "Self-review bias: the model retains reasoning context from generation. Use an independent instance. Temperature (A), explicit instructions (C), and different configs (D) don't eliminate the bias from retained context.",
    },
    // Scenario 4: Structured Data Extraction (Q43-Q54)
    {
      text: "Your extraction prompt instructs: \"Extract the payment terms from each invoice.\" For invoices that don't contain payment terms, Claude fabricates plausible values like \"Net 30\" to fill the required field. What schema change fixes this?",
      domain: "D4",
      scenario: scenario4Exam1,
      options: [
        { letter: "A", text: "Add a validation rule that checks extracted payment terms against a known list." },
        { letter: "B", text: "Change the `payment_terms` field from `required` with type `\"string\"` to optional with type `[\"string\", \"null\"]`, allowing the model to return `null` when the information is absent." },
        { letter: "C", text: "Add \"Do not fabricate information\" to the extraction prompt." },
        { letter: "D", text: "Add a default value of \"N/A\" to the `payment_terms` field." },
      ],
      correct: "B",
      explanation:
        "Nullable optional fields prevent hallucination. When information is absent, Claude returns `null` instead of fabricating. Validation (A) catches but doesn't prevent. Prompt instructions (C) are probabilistic. Default values (D) mask missing data.",
    },
    {
      text: "You need Claude to classify each invoice into a category. Most invoices fall into \"Office Supplies,\" \"Software,\" \"Professional Services,\" or \"Travel.\" Occasionally, unusual categories appear (e.g., \"Laboratory Equipment\"). How should you design the schema field?",
      domain: "D4",
      scenario: scenario4Exam1,
      options: [
        { letter: "A", text: '`"category": {"type": "string"}` \u2014 free-form text.' },
        { letter: "B", text: '`"category": {"type": "string", "enum": ["Office Supplies", "Software", "Professional Services", "Travel"]}` \u2014 strict enum.' },
        { letter: "C", text: '`"category": {"type": "string", "enum": ["Office Supplies", "Software", "Professional Services", "Travel", "other"]}` with a sibling `"category_detail": {"type": ["string", "null"]}` \u2014 enum with "other" + detail.' },
        { letter: "D", text: '`"categories": {"type": "array", "items": {"type": "string"}}` \u2014 allow multiple categories.' },
      ],
      correct: "C",
      explanation:
        "`enum` with `\"other\"` + detail string balances structured categories with extensibility. Free-form (A) loses structure. Strict enum (B) fails on unusual categories. Multiple categories (D) changes the semantics.",
    },
    {
      text: "Your extraction tool uses `tool_choice: \"auto\"`. In 20% of cases, Claude returns a conversational text response (\"This invoice appears to be from...\") instead of calling the extraction tool. How do you fix this?",
      domain: "D4",
      scenario: scenario4Exam1,
      options: [
        { letter: "A", text: "Add stronger instructions to the system prompt: \"Always use the extraction tool.\"" },
        { letter: "B", text: "Change to `tool_choice: \"any\"` to guarantee the model calls a tool (it still chooses which)." },
        { letter: "C", text: "Add more few-shot examples showing the model calling the extraction tool." },
        { letter: "D", text: "Change `tool_choice` to forced selection: `{\"type\": \"tool\", \"name\": \"extract_invoice\"}`." },
      ],
      correct: "D",
      explanation:
        "Forced tool selection guarantees a specific tool is called. `\"any\"` (B) guarantees a tool call but the model chooses which one \u2014 correct only if there's one extraction tool. For a single-tool scenario, both B and D work, but D is most precise. Prompt instructions (A) and few-shot (C) are probabilistic.",
    },
    {
      text: "Your JSON schema enforces correct syntax via `tool_use`, but extracted invoices sometimes have line items that don't sum to the stated total ($1,250 stated, but line items sum to $1,275). What type of error is this, and can `tool_use` prevent it?",
      domain: "D4",
      scenario: scenario4Exam1,
      options: [
        { letter: "A", text: "This is a schema syntax error. Using strict JSON schemas with `tool_use` will prevent it." },
        { letter: "B", text: "This is a semantic validation error. `tool_use` eliminates syntax errors but NOT semantic errors. Implement a separate validation step that checks arithmetic consistency." },
        { letter: "C", text: "This is a data quality error in the source document. No extraction system can fix source data issues." },
        { letter: "D", text: "Add arithmetic validation rules directly into the JSON schema definition." },
      ],
      correct: "B",
      explanation:
        "Semantic errors (incorrect arithmetic) are NOT prevented by `tool_use`. `tool_use` eliminates syntax errors only. A separate validation step is needed. Schema-level arithmetic rules (D) aren't supported in JSON Schema.",
    },
    {
      text: "Pydantic validation catches an error: the extracted `invoice_date` is \"March 5\" (no year). You retry by sending Claude all of the following: the original document, the failed extraction, and the specific error message (\"invoice_date must be ISO 8601 format with year\"). Claude corrects it to \"2025-03-05\". In which of these situations would this retry approach be **ineffective**?",
      domain: "D4",
      scenario: scenario4Exam1,
      options: [
        { letter: "A", text: "The extracted date is in the wrong format (DD/MM/YYYY instead of ISO 8601)." },
        { letter: "B", text: "The invoice total is missing a decimal point ($1250 instead of $12.50)." },
        { letter: "C", text: "The payment terms are listed in a separate attachment document that was not provided to Claude." },
        { letter: "D", text: "A line item description is truncated due to a long product name." },
      ],
      correct: "C",
      explanation:
        "Retries fail when information is absent from the provided source. If payment terms are in a separate attachment not given to Claude, no amount of retrying will find them. Format errors (A), decimal errors (B), and truncation (D) can all be fixed via retry.",
    },
    {
      text: "Your code review prompts produce detailed instructions: \"Review for bugs, security issues, code quality, performance, accessibility, documentation completeness, test coverage, naming conventions, and style consistency.\" The output is inconsistent \u2014 detailed for some categories, superficial for others. What's the fix?",
      domain: "D4",
      scenario: scenario4Exam1,
      options: [
        { letter: "A", text: "Add \"be thorough in every category\" to the prompt." },
        { letter: "B", text: "Define explicit criteria specifying which issues to report (bugs, security) versus skip (minor style), with concrete code examples for each severity level." },
        { letter: "C", text: "Increase the model's `max_tokens` to allow more complete output." },
        { letter: "D", text: "Run the review multiple times and combine the results." },
      ],
      correct: "B",
      explanation:
        "Explicit criteria with concrete examples for each severity level achieve consistency. Vague instructions (A) don't improve precision. More tokens (C) and repeated runs (D) don't address the root cause.",
    },
    {
      text: "Your extraction system handles invoices well but fails on handwritten receipts \u2014 dates are missed, amounts are extracted incorrectly, and merchant names are garbled. Adding 5 handwritten receipt examples to the extraction prompt significantly improves accuracy for similar receipts. What prompting technique is this?",
      domain: "D4",
      scenario: scenario4Exam1,
      options: [
        { letter: "A", text: "Chain-of-thought prompting" },
        { letter: "B", text: "Few-shot prompting \u2014 targeted examples for a problematic document type that demonstrate correct extraction from varied formats" },
        { letter: "C", text: "Zero-shot prompting with enhanced instructions" },
        { letter: "D", text: "Self-consistency prompting" },
      ],
      correct: "B",
      explanation:
        "Few-shot prompting: targeted examples for problematic document types that demonstrate correct extraction from varied formats. This enables generalization to novel similar documents.",
    },
    {
      text: "Your manager wants to batch-process 10,000 contracts using the Message Batches API. What's the correct approach before submitting the full batch?",
      domain: "D4",
      scenario: scenario4Exam1,
      options: [
        { letter: "A", text: "Submit all 10,000 immediately to take advantage of the 50% cost savings." },
        { letter: "B", text: "Test the extraction prompt on a sample of 50 documents first, analyze error patterns, refine the prompt, then submit the full batch." },
        { letter: "C", text: "Split into 100 batches of 100 documents each, submitting them sequentially." },
        { letter: "D", text: "Run the first 100 synchronously, then switch to batch for the remaining 9,900." },
      ],
      correct: "B",
      explanation:
        "Test on a sample first, refine the prompt, then submit the full batch. Submitting all immediately (A) risks costly failures. Sequential batches (C) and hybrid approaches (D) don't address prompt quality.",
    },
    {
      text: "A batch processing job for 500 legal documents completes. 480 succeed, but 20 fail \u2014 all with `context_limit_exceeded` errors. Each failed document is 150+ pages. What's the recovery strategy?",
      domain: "D4",
      scenario: scenario4Exam1,
      options: [
        { letter: "A", text: "Resubmit the 20 failed documents with a higher `max_tokens` parameter." },
        { letter: "B", text: "Identify the 20 failures by `custom_id`, chunk each oversized document into smaller sections, and resubmit only the failed documents." },
        { letter: "C", text: "Resubmit the entire batch of 500 documents with a more concise extraction prompt." },
        { letter: "D", text: "Switch the 20 failed documents to synchronous processing, which has a larger context window." },
      ],
      correct: "B",
      explanation:
        "Identify failures by `custom_id`, chunk oversized documents, resubmit only failures. Don't resubmit all 500 (C). `max_tokens` (A) isn't the cause of context limit errors. Synchronous API (D) doesn't have a larger context window.",
    },
    {
      text: "Your team's overnight compliance report is run using the synchronous Claude API. Each month, it processes 5,000 documents at significant cost. No one reads the results until the next morning. How could you optimize this?",
      domain: "D4",
      scenario: scenario4Exam1,
      options: [
        { letter: "A", text: "Keep using synchronous API \u2014 consistency is more important than cost savings." },
        { letter: "B", text: "Switch to the Message Batches API for 50% cost savings. The 24-hour processing window is acceptable since no one reads results until morning." },
        { letter: "C", text: "Process documents in parallel streams using multiple synchronous API calls." },
        { letter: "D", text: "Reduce the number of documents processed by sampling." },
      ],
      correct: "B",
      explanation:
        "Non-blocking overnight workload with no latency requirement = ideal for Batch API (50% savings). Synchronous (A) wastes money. Parallel streams (C) cost the same. Sampling (D) reduces accuracy.",
    },
    {
      text: "Extraction of required fields from invoices sometimes returns empty strings for `vendor_name` \u2014 but only for invoices with non-standard layouts (header at the bottom, vendor info in a sidebar). Adding few-shot examples of these non-standard layouts fixes the problem. Why?",
      domain: "D4",
      scenario: scenario4Exam1,
      options: [
        { letter: "A", text: "The few-shot examples increase the model's confidence in non-standard layouts." },
        { letter: "B", text: "Few-shot examples demonstrate correct handling of varied document structures, enabling the model to generalize extraction patterns to novel layouts rather than only matching the standard format." },
        { letter: "C", text: "More examples always improve extraction accuracy regardless of the type of error." },
        { letter: "D", text: "The examples provide the model with the specific vendor names to extract." },
      ],
      correct: "B",
      explanation:
        "Few-shot examples demonstrate varied document structures, enabling generalization. It's not about confidence (A), quantity of examples (C), or specific values (D).",
    },
    {
      text: "Your self-correction pipeline extracts `stated_total` and independently calculates `calculated_total` from line items. When they differ, it flags `conflict_detected: true`. Which additional schema design further improves reliability?",
      domain: "D4",
      scenario: scenario4Exam1,
      options: [
        { letter: "A", text: "Add `confidence_score` as a float field for the overall extraction." },
        { letter: "B", text: "Add `\"unclear\"` as an enum option for ambiguous fields and require `ambiguity_reason` when used." },
        { letter: "C", text: "Add `verification_needed: true/false` as a top-level field." },
        { letter: "D", text: "Add `extraction_method: \"auto\"` to track how each field was extracted." },
      ],
      correct: "B",
      explanation:
        "`\"unclear\"` enum with `ambiguity_reason` handles genuinely ambiguous cases without forcing the model to guess. Confidence scores (A) are poorly calibrated. Boolean flags (C) lack granularity. Extraction method tracking (D) doesn't improve accuracy.",
    },
    // Q55-Q60: Additional questions to reach 60
    {
      text: "Your coordinator agent dynamically selects which subagents to invoke based on the customer's issue type. For a billing dispute, it always invokes all four subagents (lookup, billing, refund, escalation) even when only the billing subagent is needed. What's the root cause?",
      domain: "D1",
      scenario: scenario1Exam1,
      options: [
        { letter: "A", text: "The coordinator's system prompt lists all subagents as required for every request." },
        { letter: "B", text: "The coordinator should dynamically select subagents based on the query requirements, not always invoke the full pipeline. Add routing logic that matches issue types to relevant subagents." },
        { letter: "C", text: "The subagents should self-select by checking whether they're needed before executing." },
        { letter: "D", text: "Use a separate routing model to pre-classify which subagents are needed." },
      ],
      correct: "B",
      explanation:
        "The coordinator should dynamically select subagents based on query requirements, not always use the full pipeline. Some queries don't need all subagents. Self-selection (C) wastes spawning overhead. Routing models (D) add unnecessary complexity.",
    },
    {
      text: "Your agent uses an MCP server for payment processing. The `process_refund` tool's description says: \"Processes a refund.\" The agent frequently calls it for balance inquiries because it doesn't understand the tool's scope. What's the fix?",
      domain: "D2",
      scenario: scenario1Exam1,
      options: [
        { letter: "A", text: "Add few-shot examples showing when to use each payment tool." },
        { letter: "B", text: "Enhance the tool description to be specific: \"Processes a monetary refund to the customer's original payment method. Requires: order_id, refund_amount, reason. Do NOT use for balance lookups, payment status checks, or transaction history.\"" },
        { letter: "C", text: "Remove the tool and handle refunds manually." },
        { letter: "D", text: "Rename the tool to `issue_monetary_refund` so the name is more specific." },
      ],
      correct: "B",
      explanation:
        "Tool descriptions are the primary selection mechanism. Minimal descriptions are the root cause. Detailed descriptions with explicit scope, required parameters, and anti-use-cases fix selection. Renaming (D) helps but descriptions matter more. Few-shot (A) adds token overhead.",
    },
    {
      text: "Your MCP server exposes a `get_customer` tool that returns all customer data including payment methods, SSN, and internal notes. The agent sometimes includes sensitive data in customer-facing responses. What's the best architectural fix?",
      domain: "D2",
      scenario: scenario1Exam1,
      options: [
        { letter: "A", text: "Add \"Never share sensitive data\" to the system prompt." },
        { letter: "B", text: "Implement a PostToolUse hook that strips sensitive fields (SSN, payment methods, internal notes) from `get_customer` results before they enter the model's context." },
        { letter: "C", text: "Create a separate `get_customer_safe` tool that only returns non-sensitive fields." },
        { letter: "D", text: "Both B and C are valid approaches. A PostToolUse hook (B) works as a guardrail on existing tools; a scoped tool (C) prevents sensitive data from ever reaching the model." },
      ],
      correct: "D",
      explanation:
        "Both approaches are valid. A PostToolUse hook strips sensitive data as a guardrail. A scoped tool prevents sensitive data from reaching the model at all. Prompt instructions (A) are probabilistic and unreliable for security-critical data filtering.",
    },
    {
      text: "Your agent uses project-scoped `.mcp.json` for MCP server configuration. A developer adds their personal API key directly in `.mcp.json` and commits it. What's the correct configuration pattern?",
      domain: "D2",
      scenario: scenario1Exam1,
      options: [
        { letter: "A", text: "Store API keys in the system prompt where they're only in memory." },
        { letter: "B", text: "Use environment variable expansion in `.mcp.json` (e.g., `$API_KEY`) so secrets are resolved at runtime from the developer's environment, not committed to version control." },
        { letter: "C", text: "Move all MCP configuration to `~/.claude.json` (user-level) to avoid committing secrets." },
        { letter: "D", text: "Encrypt the API key in `.mcp.json` using a shared team encryption key." },
      ],
      correct: "B",
      explanation:
        "Environment variable expansion in `.mcp.json` keeps secrets out of version control while maintaining project-scoped, team-shared configuration. User-level config (C) prevents team sharing. System prompt storage (A) is not a configuration mechanism. Encryption (D) adds unnecessary complexity.",
    },
    {
      text: "Your extraction system processes 500 invoices nightly. Confidence scores route extractions: high confidence (\u226590%) to auto-approval, low confidence (<90%) to human review. After 3 months, you discover that 12% of auto-approved extractions contain errors. What's the issue?",
      domain: "D5",
      scenario: scenario4Exam1,
      options: [
        { letter: "A", text: "The 90% threshold is too low \u2014 increase it to 99%." },
        { letter: "B", text: "Model confidence is not well-calibrated out of the box. Calibrate thresholds using a labeled validation set \u2014 measure actual accuracy at each stated confidence level, then set empirically-grounded thresholds." },
        { letter: "C", text: "Replace confidence scoring with rule-based validation." },
        { letter: "D", text: "Remove auto-approval entirely and send all extractions to human review." },
      ],
      correct: "B",
      explanation:
        "Out-of-the-box model confidence is poorly calibrated \u2014 stated 90% confidence may correspond to only 88% actual accuracy. Calibrate using labeled data. Arbitrary threshold changes (A) don't fix calibration. Rule-based validation (C) and full human review (D) are overreactions.",
    },
    {
      text: "Your agent maintains a long-running support session with a customer. After 20 turns of troubleshooting, the agent starts giving contradictory advice \u2014 recommending steps it previously said to avoid. The customer loses trust. What's the architectural fix?",
      domain: "D5",
      scenario: scenario1Exam1,
      options: [
        { letter: "A", text: "Limit all support sessions to 10 turns maximum." },
        { letter: "B", text: "Have the agent maintain a scratchpad file recording key decisions, steps taken, and steps explicitly ruled out. Re-read the scratchpad each turn to maintain consistency across the session." },
        { letter: "C", text: "Use `/compact` after every 5 turns to keep context small." },
        { letter: "D", text: "Increase the model's context window to prevent information loss." },
      ],
      correct: "B",
      explanation:
        "A scratchpad file persists key decisions and ruled-out steps across context boundaries, preventing contradictions. Turn limits (A) frustrate customers. Frequent `/compact` (C) loses important context. Larger context (D) delays but doesn't solve degradation.",
    },
  ],
  "2": [
    // Scenario 1: Developer Productivity with Claude (Q1-Q15)
    {
      text: "A developer asks the agent to \"find all files that call the `processPayment` function in the codebase.\" Which built-in tool is appropriate?",
      domain: "D2",
      scenario: scenario1Exam2,
      options: [
        { letter: "A", text: "Glob \u2014 it searches for file patterns like `**/*.ts` to find all TypeScript files, which can then be filtered for the function." },
        { letter: "B", text: "Grep \u2014 it searches file contents for patterns, making it the correct tool to find all files containing `processPayment`." },
        { letter: "C", text: "Read \u2014 read each source file in the project and search for the function call." },
        { letter: "D", text: "Bash \u2014 run `find . -name \"*.ts\"` to locate TypeScript files containing the function." },
      ],
      correct: "B",
      explanation:
        "Grep searches file contents for patterns. Glob searches file names/paths. The question asks to find files calling a function \u2014 that's content search = Grep. Read (C) is inefficient at scale. Bash (D) works but isn't the intended built-in tool.",
    },
    {
      text: "The agent needs to update a function signature in `src/api/payments.ts`. It tries using the Edit tool with this anchor text: `function process(` but fails because three functions in the file start with `function process(`. What is the correct fallback?",
      domain: "D2",
      scenario: scenario1Exam2,
      options: [
        { letter: "A", text: "Use Bash to run a `sed` command that replaces the specific line number." },
        { letter: "B", text: "Use Read to load the full file contents, then use Write to write the modified version back." },
        { letter: "C", text: "Use Edit with a longer anchor text that is unique within the file." },
        { letter: "D", text: "Both B and C are valid approaches; try C first and fall back to B if uniqueness can't be achieved." },
      ],
      correct: "D",
      explanation:
        "When Edit fails due to non-unique anchor text, try a longer unique anchor first (C). If uniqueness can't be achieved, fall back to Read + Write (B). Both are valid approaches. D correctly identifies both. `sed` (A) is fragile for code modifications.",
    },
    {
      text: "A developer asks the agent to understand a legacy payment processing module. The agent reads all 47 files in the module upfront, consuming most of the context window. Subsequent questions about the module get vague, generic answers. What's the better approach?",
      domain: "D2",
      scenario: scenario1Exam2,
      options: [
        { letter: "A", text: "Start by reading all files but use `/compact` after each question to free up context." },
        { letter: "B", text: "Build understanding incrementally: start with Grep to find entry points, then use Read to follow imports and trace flows \u2014 only reading files as needed." },
        { letter: "C", text: "Ask the developer to identify the specific files that are relevant before research begins." },
        { letter: "D", text: "Split the module into smaller submodules and analyze each in a separate session." },
      ],
      correct: "B",
      explanation:
        "Incremental investigation: Grep \u2192 find entry points \u2192 Read to follow imports \u2192 trace flows. Reading all 47 files upfront floods the context. `/compact` (A) loses details. Asking the developer (C) defeats the purpose of the agent.",
    },
    {
      text: "The agent needs to trace how the `calculateDiscount` function is used across the codebase. It is exported from `src/utils/pricing.ts`, but other modules re-export it through wrapper modules. What's the correct investigation strategy?",
      domain: "D2",
      scenario: scenario1Exam2,
      options: [
        { letter: "A", text: "Grep for `calculateDiscount` across the entire codebase \u2014 this will find all callers regardless of re-exports." },
        { letter: "B", text: "Read `src/utils/pricing.ts` to understand the function, then Grep for `calculateDiscount` and also identify all exported names from wrapper modules, then Grep for each re-exported name across the codebase." },
        { letter: "C", text: "Use Glob to find all files importing from `pricing.ts`, then read each one." },
        { letter: "D", text: "Use Bash to generate a dependency graph and analyze it programmatically." },
      ],
      correct: "B",
      explanation:
        "Wrapper modules re-export under different names. Simple Grep (A) misses these. The correct strategy: read the source, identify re-exports, then Grep for each re-exported name. Glob (C) finds importers of the module but not re-exported callers.",
    },
    {
      text: "Your team has both a Jira MCP server and a custom internal deployment MCP server. The Jira integration is standard; the deployment server is team-specific. How should you configure them?",
      domain: "D2",
      scenario: scenario1Exam2,
      options: [
        { letter: "A", text: "Both in `.mcp.json` \u2014 project-scoped and version-controlled." },
        { letter: "B", text: "Jira in `~/.claude.json` (user-level), deployment in `.mcp.json` (project-level)." },
        { letter: "C", text: "Use the community Jira MCP server configured in `.mcp.json`. Configure the custom deployment server in `.mcp.json` too, since both are team tools." },
        { letter: "D", text: "Both in `~/.claude.json` to avoid polluting the project repository." },
      ],
      correct: "C",
      explanation:
        "Use community MCP server for standard integrations (Jira). Configure both in project-scoped `.mcp.json` since both are team tools. User-level (B, D) for team tools prevents sharing.",
    },
    {
      text: "Your team has an MCP server with a `search_issues` tool that provides semantic search across Jira tickets. However, the agent keeps using the built-in Grep tool to search for issue numbers in local files instead. What's the most likely cause?",
      domain: "D2",
      scenario: scenario1Exam2,
      options: [
        { letter: "A", text: "The MCP server isn't properly connected \u2014 check the `.mcp.json` configuration." },
        { letter: "B", text: "The MCP tool's description is too minimal. Enhance it to explain capabilities, typical queries, output format, and when to use it versus Grep." },
        { letter: "C", text: "Built-in tools always take priority over MCP tools. This can't be changed." },
        { letter: "D", text: "Add `\"preferred\": true` to the MCP tool configuration to prioritize it." },
      ],
      correct: "B",
      explanation:
        "Minimal MCP tool descriptions cause agents to prefer familiar built-in tools. Enhance the description to explain capabilities, outputs, and when to use it vs Grep. Built-in tools don't inherently take priority (C). `\"preferred\"` flag (D) doesn't exist.",
    },
    {
      text: "You want to expose your internal API documentation hierarchy (100+ endpoints, organized by service) to the agent so it can answer developer questions about APIs without making exploratory tool calls. What MCP concept should you use?",
      domain: "D2",
      scenario: scenario1Exam2,
      options: [
        { letter: "A", text: "Configure 100 individual MCP tools \u2014 one per API endpoint." },
        { letter: "B", text: "Expose the API documentation as an MCP **resource** \u2014 a read-only content catalog that gives the agent visibility into available data." },
        { letter: "C", text: "Include all API documentation in the CLAUDE.md file." },
        { letter: "D", text: "Create a `list_apis` MCP tool that the agent calls to discover available endpoints." },
      ],
      correct: "B",
      explanation:
        "MCP resources expose read-only content catalogs (documentation, schemas) without requiring tool calls. 100 individual tools (A) is impractical. CLAUDE.md (C) would be enormous. A discovery tool (D) adds a tool call when passive exposure suffices.",
    },
    {
      text: "A developer on your team created a personal `/quick-test` command for running their preferred test workflow. Another developer wants a different test workflow. How should this be managed?",
      domain: "D3",
      scenario: scenario1Exam2,
      options: [
        { letter: "A", text: "Both developers put their commands in `.claude/commands/` with different names." },
        { letter: "B", text: "Each developer creates their personal command in `~/.claude/commands/` \u2014 user-scoped commands that don't affect teammates." },
        { letter: "C", text: "Create a single configurable command in `.claude/commands/` that accepts a parameter to select the workflow." },
        { letter: "D", text: "The second developer forks the repository to maintain their own command set." },
      ],
      correct: "B",
      explanation:
        "Personal commands go in user-scoped `~/.claude/commands/`. Project-scoped `.claude/commands/` (A) would force one developer's preference on all. Forking (D) is extreme. A configurable command (C) adds unnecessary complexity for personal preference.",
    },
    {
      text: "Your development agent has an agentic loop that processes tool calls. Currently, the loop checks whether the response contains a `TextBlock` to determine if Claude is done. During complex tasks with interleaved text and tool calls, the agent sometimes stops prematurely. Why?",
      domain: "D1",
      scenario: scenario1Exam2,
      options: [
        { letter: "A", text: "The temperature is too low, causing the model to generate text too early." },
        { letter: "B", text: "Checking for `TextBlock` is an anti-pattern. Claude responses can contain both text AND tool calls simultaneously. The correct signal is `stop_reason == \"end_turn\"`." },
        { letter: "C", text: "The model's `max_tokens` is too low, causing it to end the response before finishing its tool calls." },
        { letter: "D", text: "The system prompt needs to instruct the model to never produce text until all tool calls are complete." },
      ],
      correct: "B",
      explanation:
        "Checking for `TextBlock` is an anti-pattern \u2014 responses can contain both text and tool calls. The correct signal is `stop_reason == \"end_turn\"`. Low temperature (A), max_tokens (C), and prompt instructions (D) don't address the fundamental issue.",
    },
    {
      text: "The developer productivity agent has 18 tools: 6 built-in (Read, Write, Edit, Bash, Grep, Glob) plus 12 MCP tools for Jira, GitHub, CI/CD, documentation, monitoring, and alerting. Tool selection reliability is poor. How should you restructure?",
      domain: "D1",
      scenario: scenario1Exam2,
      options: [
        { letter: "A", text: "Keep all 18 tools but add detailed descriptions and few-shot examples showing correct tool selection." },
        { letter: "B", text: "Create specialized subagents with scoped tool sets: a code exploration agent (Read, Grep, Glob), a code modification agent (Write, Edit, Bash), and a DevOps agent (Jira, GitHub, CI/CD, monitoring tools). The coordinator routes tasks to the appropriate subagent." },
        { letter: "C", text: "Prioritize MCP tools over built-in tools in the system prompt to reduce confusion." },
        { letter: "D", text: "Remove the least-used MCP tools until you have 10 or fewer total." },
      ],
      correct: "B",
      explanation:
        "18 tools degrades selection reliability. Create specialized subagents with scoped tool sets (4-5 per agent). Better descriptions (A) help but don't solve the 18-tool cognitive load. Removing tools (D) loses functionality. System prompt priority (C) is unreliable.",
    },
    {
      text: "Your agent is exploring a large codebase to understand the refund processing flow. After reading 25 files, context starts degrading \u2014 the agent references \"typical patterns\" instead of specific classes it discovered. What should you do?",
      domain: "D5",
      scenario: scenario1Exam2,
      options: [
        { letter: "A", text: "Start a new session and re-read the most important files." },
        { letter: "B", text: "Have the agent maintain a scratchpad file recording key findings. Re-read the scratchpad for subsequent questions instead of re-discovering information." },
        { letter: "C", text: "Use `/compact` to free up context space and continue exploration." },
        { letter: "D", text: "Increase the model's context window by using a higher-tier model." },
      ],
      correct: "B",
      explanation:
        "Scratchpad files persist findings across context boundaries. The agent writes key findings to a file and re-reads it instead of re-discovering. New session (A) loses all context. `/compact` (C) helps but doesn't prevent future degradation.",
    },
    {
      text: "You want to compare two refactoring approaches \u2014 one using the Strategy pattern and one using the Builder pattern \u2014 from the same codebase analysis baseline. What feature enables this?",
      domain: "D1",
      scenario: scenario1Exam2,
      options: [
        { letter: "A", text: "Run the agent twice with different system prompts." },
        { letter: "B", text: "Use `fork_session` to create independent branches from the shared analysis baseline, exploring each pattern in its own branch." },
        { letter: "C", text: "Create two separate agents with different `AgentDefinition` configurations." },
        { letter: "D", text: "Use `--resume` to return to the analysis point and try the second approach." },
      ],
      correct: "B",
      explanation:
        "`fork_session` creates independent branches from a shared baseline. Running twice (A) lacks shared context. `--resume` (D) doesn't create branches \u2014 it continues linearly. Different agents (C) don't share the existing analysis.",
    },
    {
      text: "Your agent's agentic loop has been running tool calls for a code exploration task. The loop condition is:\n\n```python\nfor i in range(20):\n    response = client.messages.create(...)\n    if response.stop_reason == \"end_turn\":\n        break\n    # ... process tool calls\n```\n\nWhat's wrong with this implementation?",
      domain: "D1",
      scenario: scenario1Exam2,
      options: [
        { letter: "A", text: "Nothing \u2014 this is the correct pattern with a safety limit." },
        { letter: "B", text: "The iteration cap (`range(20)`) as a primary stopping mechanism is an anti-pattern. If the model needs 21 iterations to complete, it will stop prematurely. Use `stop_reason` as the primary mechanism; if you must have a safety limit, make it very generous and log a warning when hit." },
        { letter: "C", text: '`"end_turn"` is the wrong signal. It should check for `"stop"`.' },
        { letter: "D", text: "The loop should check for tool calls in the content blocks, not the `stop_reason`." },
      ],
      correct: "B",
      explanation:
        "The code already uses `stop_reason == \"end_turn\"` as the primary mechanism, which is correct. The issue is that `range(20)` acts as a tight cap that could prematurely terminate a legitimate exploration needing 21+ iterations. Safety limits are valid as a secondary safeguard but should be generous (e.g., 50+) with a warning logged when hit.",
    },
    {
      text: "Your development agent spawns a subagent to investigate \"Which test files cover the refund module?\". The subagent returns: `\"Based on typical Node.js project structures, test files are usually in a __tests__ directory.\"` The subagent didn't actually search the codebase. Why?",
      domain: "D1",
      scenario: scenario1Exam2,
      options: [
        { letter: "A", text: "The subagent doesn't have access to the Grep and Glob tools needed to search the codebase." },
        { letter: "B", text: "The subagent inherited the coordinator's context, which doesn't include the codebase files." },
        { letter: "C", text: "The subagent's system prompt doesn't instruct it to use tools for investigation." },
        { letter: "D", text: "Both A and C are likely contributing factors. Ensure the subagent's `allowedTools` includes search tools AND its prompt instructs it to investigate rather than guess." },
      ],
      correct: "D",
      explanation:
        "Two issues: the subagent needs the right tools AND proper instructions. Without Grep/Glob in `allowedTools`, it can't search. Without investigation instructions, it defaults to knowledge-based guessing. Both A and C contribute.",
    },
    {
      text: "A developer resumes a session from yesterday using `--resume investigation`. Since yesterday, three critical files in the codebase have been refactored. The agent continues analyzing based on stale information. What's the solution?",
      domain: "D1",
      scenario: scenario1Exam2,
      options: [
        { letter: "A", text: "Always start a new session instead of resuming." },
        { letter: "B", text: "After resuming, inform the agent about the specific files that changed so it can re-analyze those files rather than re-exploring the entire codebase." },
        { letter: "C", text: "Run Bash to `git diff` and pipe the results into the agent context." },
        { letter: "D", text: "Use `/compact` after resuming to force the agent to re-read everything." },
      ],
      correct: "B",
      explanation:
        "After resuming, inform the agent about specific file changes for targeted re-analysis. Always starting fresh (A) wastes prior work. Git diff (C) helps but should be combined with targeted guidance. `/compact` (D) doesn't trigger re-reading.",
    },
    // Scenario 2: Claude Code for Continuous Integration (Q16-Q30)
    {
      text: "Your CI review prompt says: \"Review this code and report any issues you find. Be thorough.\" The output varies wildly between runs \u2014 sometimes a detailed 20-finding report, sometimes 3 superficial comments. What's the root cause?",
      domain: "D4",
      scenario: scenario2Exam2,
      options: [
        { letter: "A", text: "The model needs a higher temperature for consistent creative output." },
        { letter: "B", text: "The instructions are too vague. \"Be thorough\" doesn't define what to look for. Replace with explicit criteria specifying which issue types to report (bugs, security) versus skip (style, naming)." },
        { letter: "C", text: "The model's `max_tokens` varies between runs, limiting output length." },
        { letter: "D", text: "Add `--deterministic` flag to the Claude Code CLI for consistent output." },
      ],
      correct: "B",
      explanation:
        "Vague instructions (\"be thorough\") produce inconsistent output. Explicit criteria defining what to report vs skip is the fix. Temperature (A) isn't the issue. `max_tokens` (C) doesn't vary. `--deterministic` (D) doesn't exist.",
    },
    {
      text: "Your automated code review flags \"unused import\" in 70% of Python files, but developers dismiss most of these because the imports are used in type annotations behind `if TYPE_CHECKING:` blocks. This has eroded trust in all review findings. What's the fix?",
      domain: "D4",
      scenario: scenario2Exam2,
      options: [
        { letter: "A", text: "Lower the confidence threshold to only report high-confidence findings." },
        { letter: "B", text: "Temporarily disable the \"unused import\" category to restore developer trust while refining the prompt to handle `TYPE_CHECKING` patterns correctly." },
        { letter: "C", text: "Add \"be more conservative\" to the review prompt." },
        { letter: "D", text: "Require developers to add `# noqa` comments to all type-checking imports." },
      ],
      correct: "B",
      explanation:
        "High false positives in one category damage trust in ALL categories. Disable the noisy category, fix its prompt separately, re-enable when accuracy is acceptable. Confidence thresholds (A) and \"be conservative\" (C) are too vague. `# noqa` (D) burdens developers.",
    },
    {
      text: "You want to define explicit severity levels for your CI review. Currently, the agent inconsistently classifies findings as \"high\" or \"low.\" How do you achieve consistent classification?",
      domain: "D4",
      scenario: scenario2Exam2,
      options: [
        { letter: "A", text: "Add \"Only report high-severity issues\" to the prompt." },
        { letter: "B", text: "Define explicit severity criteria with **concrete code examples** for each level: Critical (SQL injection, RCE), High (null dereference, data loss), Medium (missing error handling), Low (unused variable)." },
        { letter: "C", text: "Add `severity_threshold: high` to the output schema." },
        { letter: "D", text: "Use a separate classifier model to re-classify the agent's findings." },
      ],
      correct: "B",
      explanation:
        "Explicit severity criteria with concrete code examples for each level. \"Only report high-severity\" (A) is vague. Schema thresholds (C) don't improve classification. A separate classifier (D) adds complexity without fixing the root cause.",
    },
    {
      text: "Your CI pipeline generates test cases for new code. It suggests tests that already exist in the test suite, and suggests testing patterns that conflict with your team's testing standards. How do you fix both issues?",
      domain: "D3",
      scenario: scenario2Exam2,
      options: [
        { letter: "A", text: "Post-filter the generated tests to remove duplicates." },
        { letter: "B", text: "Provide existing test files in context to avoid duplicate suggestions, and document testing standards/conventions/available fixtures in CLAUDE.md." },
        { letter: "C", text: "Run the generated tests and discard any that fail due to conflicts." },
        { letter: "D", text: "Limit test generation to only uncovered functions identified by a coverage tool." },
      ],
      correct: "B",
      explanation:
        "Provide existing tests in context to avoid duplicates. Document standards, conventions, and fixtures in CLAUDE.md for quality. Post-filtering (A) is reactive. Running and discarding (C) is wasteful. Coverage tools (D) don't address convention compliance.",
    },
    {
      text: "A pull request modifies the authentication module across 8 files. Your review prompt uses few-shot examples that demonstrate reviewing a single-file utility change. The review misses cross-file security implications (a middleware bypassing auth checks due to incorrect import). What architectural change addresses this?",
      domain: "D4",
      scenario: scenario2Exam2,
      options: [
        { letter: "A", text: "Add more few-shot examples covering multi-file reviews." },
        { letter: "B", text: "Split into per-file local analysis passes plus a separate cross-file integration pass that specifically examines data flow, import chains, and authentication pathways between files." },
        { letter: "C", text: "Use a larger context window model." },
        { letter: "D", text: "Route all authentication-related PRs to human reviewers instead." },
      ],
      correct: "B",
      explanation:
        "Multi-pass review: per-file local analysis + cross-file integration pass. Single-file examples (A) don't demonstrate cross-file analysis. Larger context (C) doesn't fix attention dilution. Human-only review (D) doesn't scale.",
    },
    {
      text: "Your CI pipeline posts Claude Code review comments on every PR. After a developer pushes fixes in response to the first review, the re-review posts the same findings again alongside new ones. Developers complain about duplicate comment spam. What's the fix?",
      domain: "D3",
      scenario: scenario2Exam2,
      options: [
        { letter: "A", text: "Delete all previous review comments before each new review run." },
        { letter: "B", text: "Include the prior review findings in context when re-running, and instruct Claude to report only new or still-unaddressed issues." },
        { letter: "C", text: "Only review the diff between the latest commit and the previous review." },
        { letter: "D", text: "Use PR labels to track which findings have been addressed." },
      ],
      correct: "B",
      explanation:
        "Include prior findings in context, ask for only new/unresolved issues. Deleting comments (A) loses history. Diff-only review (C) misses issues from earlier code. PR labels (D) require manual tracking.",
    },
    {
      text: "You need your CI review to output findings as structured JSON that can be programmatically posted as inline PR comments at specific line numbers. What's the correct CLI invocation?",
      domain: "D3",
      scenario: scenario2Exam2,
      options: [
        { letter: "A", text: "`claude -p \"Review this PR\" --json`" },
        { letter: "B", text: "`claude -p \"Review this PR\" --output-format json --json-schema '{\"type\":\"object\",\"properties\":{\"findings\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"file\":{\"type\":\"string\"},\"line\":{\"type\":\"integer\"},\"severity\":{\"type\":\"string\"},\"message\":{\"type\":\"string\"}}}}}}'`" },
        { letter: "C", text: "`claude \"Review this PR\" --output-format json`" },
        { letter: "D", text: "`claude -p \"Review this PR\" | jq '.findings'`" },
      ],
      correct: "B",
      explanation:
        "`claude -p \"...\" --output-format json --json-schema '{...}'` is the correct CLI invocation. Other flag combinations (A, C, D) are incorrect. Note: `-p` is required for CI (non-interactive).",
    },
    {
      text: "Your team uses Claude Code to generate unit tests during CI. The generated tests are syntactically correct but test trivial cases (e.g., `expect(true).toBe(true)`) instead of meaningful behavior. What improves quality?",
      domain: "D3",
      scenario: scenario2Exam2,
      options: [
        { letter: "A", text: "Add \"Write meaningful tests\" to the prompt." },
        { letter: "B", text: "Document testing standards, what constitutes a valuable test, and available test fixtures in CLAUDE.md. Provide concrete examples of good vs bad tests." },
        { letter: "C", text: "Increase the model's temperature for more creative test generation." },
        { letter: "D", text: "Use a separate model to review and filter generated tests." },
      ],
      correct: "B",
      explanation:
        "Document testing standards, valuable test criteria, and available fixtures in CLAUDE.md with concrete good/bad examples. \"Write meaningful tests\" (A) is too vague. Temperature (C) doesn't improve test quality. A review model (D) adds latency.",
    },
    {
      text: "Your CI code review is configured with a `CLAUDE.md` that includes review criteria. But a specific subpackage `packages/legacy-api/` has different standards (it uses callbacks instead of async/await, and that's intentional). How should you configure this?",
      domain: "D3",
      scenario: scenario2Exam2,
      options: [
        { letter: "A", text: "Add an exception note to the root CLAUDE.md: \"In packages/legacy-api/, callbacks are acceptable.\"" },
        { letter: "B", text: "Create `.claude/rules/legacy-api.md` with `paths: [\"packages/legacy-api/**/*\"]` containing the specific conventions for this package, or create a `packages/legacy-api/CLAUDE.md` with the local standards." },
        { letter: "C", text: "Instruct reviewers to ignore findings from the legacy-api package." },
        { letter: "D", text: "Exclude the `packages/legacy-api/` directory from CI reviews entirely." },
      ],
      correct: "B",
      explanation:
        "Path-specific rules in `.claude/rules/` or a directory-level CLAUDE.md for the legacy package. Root CLAUDE.md exceptions (A) become messy at scale. Ignoring findings (C) and excluding directories (D) lose review value.",
    },
    {
      text: "Your CI pipeline reviews a PR and produces findings. The same session is then asked to review its own findings for accuracy. It marks all findings as accurate. An independent human review reveals 3 of 12 findings are false positives. Why?",
      domain: "D3",
      scenario: scenario2Exam2,
      options: [
        { letter: "A", text: "The model needs explicit instructions to be self-critical." },
        { letter: "B", text: "The model retains reasoning context from the initial review, biasing it toward confirming its own decisions. Use an independent Claude instance (separate session) for review validation." },
        { letter: "C", text: "The model's temperature should be higher for the self-review pass." },
        { letter: "D", text: "The original review prompt is too lenient, so the self-review inherits the same leniency." },
      ],
      correct: "B",
      explanation:
        "Self-review bias \u2014 the model retains reasoning context. Use an independent instance. Instructions to be self-critical (A) don't overcome retained context bias. Temperature (C) and prompt leniency (D) aren't the root cause.",
    },
    {
      text: "Your CI review prompt includes: \"When unsure about a finding, report it with a note about your uncertainty.\" This results in high false positive rates as the agent reports many uncertain findings that are incorrect. What's the better approach?",
      domain: "D4",
      scenario: scenario2Exam2,
      options: [
        { letter: "A", text: "Add \"Only report findings you're at least 90% confident about.\"" },
        { letter: "B", text: "Replace uncertainty-based reporting with explicit categorical criteria: define exactly what constitutes a reportable issue (bugs, security, data loss) versus what to skip (style, naming, uncertain patterns)." },
        { letter: "C", text: "Add a confidence score field and filter findings below 0.8 in post-processing." },
        { letter: "D", text: "Have the agent run a second pass to verify its uncertain findings." },
      ],
      correct: "B",
      explanation:
        "Explicit categorical criteria over confidence-based filtering. \"90% confident\" (A) is uncalibrated and vague. Post-processing filters (C) and second passes (D) add complexity without fixing the root cause.",
    },
    {
      text: "Your CI pipeline needs to run Claude Code non-interactively but occasionally the `-p` flag conflicts with CI-specific requirements. Which of the following statements about `-p` is correct?",
      domain: "D3",
      scenario: scenario2Exam2,
      options: [
        { letter: "A", text: "`-p` reads input from a file instead of stdin." },
        { letter: "B", text: "`-p` (or `--print`) runs Claude Code in non-interactive mode: it processes the prompt, outputs the result to stdout, and exits without waiting for user input." },
        { letter: "C", text: "`-p` enables parallel processing of multiple prompts." },
        { letter: "D", text: "`-p` formats the output for printing to a physical printer." },
      ],
      correct: "B",
      explanation:
        "`-p` / `--print` = non-interactive mode. Processes prompt, outputs to stdout, exits. The other descriptions (A, C, D) are incorrect.",
    },
    {
      text: "You need Claude Code to both generate tests AND review code on each PR. A colleague suggests using a single Claude session for both tasks to \"share context.\" What's the issue?",
      domain: "D3",
      scenario: scenario2Exam2,
      options: [
        { letter: "A", text: "A single session can't run two different prompts." },
        { letter: "B", text: "There's no issue \u2014 shared context improves both tasks." },
        { letter: "C", text: "Using the same session for generation and review introduces self-review bias. The generator's reasoning context makes the reviewer less likely to find issues in its own generated tests. Use separate, independent sessions." },
        { letter: "D", text: "The combined context might exceed the model's token limit." },
      ],
      correct: "C",
      explanation:
        "Self-review bias affects both generation and review in the same session. The generator's reasoning context makes the reviewer less critical. Use separate, independent sessions. Context sharing (B) is the problem, not a benefit.",
    },
    {
      text: "Your CI review analyzes one large file (2,000 lines) and flags a function on line 450 as problematic. The same function pattern appears on line 1,100, but the review doesn't flag it. What explains this inconsistency?",
      domain: "D5",
      scenario: scenario2Exam2,
      options: [
        { letter: "A", text: "The model's random seed varies between inference calls." },
        { letter: "B", text: "The model's attention is non-uniform across long inputs \u2014 the \"lost-in-the-middle\" effect. Content near the middle of a long document gets less attention. Structure the review to ensure coverage across all file sections." },
        { letter: "C", text: "The model's `max_tokens` ended before it could analyze the second instance." },
        { letter: "D", text: "The model only reviews the first half of files exceeding a certain length." },
      ],
      correct: "B",
      explanation:
        "Lost-in-the-middle effect: content near the middle of long inputs gets less attention. Structure the review to ensure coverage across all sections (e.g., chunking or multi-pass). Random seed (A), max_tokens (C), and length limits (D) aren't the mechanism.",
    },
    {
      text: "Your CI review prompt includes 12 few-shot examples showing various bug types. Adding 3 more examples demonstrating that certain patterns are **acceptable** (not bugs) reduced false positives by 40% without missing real bugs. Why were these \"non-bug\" examples so effective?",
      domain: "D4",
      scenario: scenario2Exam2,
      options: [
        { letter: "A", text: "More examples always improve accuracy by giving the model more training data." },
        { letter: "B", text: "Few-shot examples showing acceptable patterns (non-bugs) help the model distinguish genuine issues from acceptable patterns, enabling generalization to novel cases rather than matching only pre-specified bug patterns." },
        { letter: "C", text: "The non-bug examples increased the model's context window, giving it more room for analysis." },
        { letter: "D", text: "The examples reduced the model's temperature, making it more conservative." },
      ],
      correct: "B",
      explanation:
        "Few-shot examples showing acceptable patterns help the model distinguish genuine issues from non-issues, enabling generalization to novel cases. It's not about data volume (A), context size (C), or temperature (D).",
    },
    // Scenario 3: Customer Support Resolution Agent (Q31-Q45)
    {
      text: "Your agent loop appends each tool result to the conversation messages and sends them back to Claude for the next iteration. A colleague suggests optimizing by only sending the latest tool result instead of the full conversation history. What's wrong with this optimization?",
      domain: "D1",
      scenario: scenario3Exam2,
      options: [
        { letter: "A", text: "Nothing \u2014 sending only the latest result reduces token costs." },
        { letter: "B", text: "The full conversation history must be sent in subsequent API requests so Claude can reason about accumulated context. Without prior results, the model loses track of what's already been investigated and may repeat actions." },
        { letter: "C", text: "Only the system prompt and latest result are needed \u2014 the model's internal memory handles the rest." },
        { letter: "D", text: "You can omit tool results but must keep assistant messages." },
      ],
      correct: "B",
      explanation:
        "Full conversation history must be sent so Claude reasons about accumulated context. Without prior results, the model repeats investigations and loses track of the case. This is how the Messages API works \u2014 it's stateless.",
    },
    {
      text: "Your agent handles a customer's return request correctly: verifies identity, checks eligibility, processes the refund. But when the customer adds \"also, what's my loyalty points balance?\" as a follow-up, the agent starts a new identity verification instead of using the already-verified customer record. What's the issue?",
      domain: "D1",
      scenario: scenario3Exam2,
      options: [
        { letter: "A", text: "The agent's system prompt doesn't instruct it to maintain session state across follow-up questions." },
        { letter: "B", text: "The agent's conversation history includes the verified customer data, but the prompt doesn't guide it to recognize that prior verification applies to follow-up questions about the same customer. Add instructions for maintaining verified state within a session." },
        { letter: "C", text: "Each new customer question should trigger re-verification for security purposes." },
        { letter: "D", text: "The `get_customer` tool cache has expired between the two requests." },
      ],
      correct: "B",
      explanation:
        "The conversation history contains the verification, but the agent needs guidance to recognize that a verified customer doesn't need re-verification for follow-up questions. Add session state management instructions. Re-verification (C) is unnecessary friction.",
    },
    {
      text: "Your coordinator agent handles complex cases by delegating billing inquiries to a billing subagent and shipping inquiries to a shipping subagent. The billing subagent encounters a transient database error when looking up invoice records. It retries 3 times, then returns to the coordinator:\n\n```json\n{\"status\": \"error\", \"message\": \"Service unavailable\"}\n```\n\nThe coordinator tells the customer: \"I can't help with billing right now.\" What should the subagent return instead?",
      domain: "D2",
      scenario: scenario3Exam2,
      options: [
        { letter: "A", text: "The raw database error log with stack trace for debugging." },
        { letter: "B", text: "Structured error context: `{\"status\": \"partial_failure\", \"errorCategory\": \"transient\", \"attempted\": \"lookup invoice #4521\", \"retries\": 3, \"partial_results\": [\"invoice found in cache: $284.50 due 2025-04-01\"], \"alternatives\": [\"retry in 5 minutes\", \"check cached records\"]}`." },
        { letter: "C", text: "A generic message: `{\"status\": \"error\", \"isRetryable\": true}`." },
        { letter: "D", text: "The subagent should keep retrying indefinitely until the database becomes available." },
      ],
      correct: "B",
      explanation:
        "Structured error context with category, partial results, retries attempted, and alternatives. Generic errors (C) prevent intelligent recovery. Stack traces (A) aren't useful for the coordinator. Infinite retries (D) cause hangs.",
    },
    {
      text: "A customer writes: \"Order #5582 hasn't arrived. It's been two weeks.\" The agent calls `lookup_order` and gets:\n\n```json\n{\"order_id\": \"5582\", \"status\": 3, \"carrier\": \"USPS\", \n \"tracking\": \"9400111...\", \"ship_date\": 1709251200,\n \"estimated_delivery\": 1709856000, \"items\": [...],\n \"internal_notes\": \"Flagged for weight discrepancy\",\n \"warehouse_id\": \"WH-47\", \"picking_station\": \"A-14\",\n \"audit_log\": [... 40 entries ...]}\n```\n\nThis 40+ field response accumulates across multiple order lookups, filling the context. What's the fix?",
      domain: "D5",
      scenario: scenario3Exam2,
      options: [
        { letter: "A", text: "Increase the model's max context window." },
        { letter: "B", text: "Implement a `PostToolUse` hook that trims `lookup_order` results to only customer-relevant fields: `order_id`, `status`, `carrier`, `tracking`, `ship_date`, `estimated_delivery`, `items`." },
        { letter: "C", text: "Instruct the model to ignore irrelevant fields in the prompt." },
        { letter: "D", text: "Store full results in a database and give the model only a reference ID." },
      ],
      correct: "B",
      explanation:
        "PostToolUse hook trims results to relevant fields. 40+ fields per lookup (including internal audit logs) rapidly fills context. Larger context (A) doesn't fix the waste. Prompt instructions (C) are probabilistic. Database references (D) add complexity.",
    },
    {
      text: "The agent handles a complex return and mentions: \"Your refund of $347.50 for order #8842 has been processed.\" But looking at the actual order, the amount was $374.50. The agent transposed the digits from a previous order lookup earlier in the session. What pattern prevents this?",
      domain: "D5",
      scenario: scenario3Exam2,
      options: [
        { letter: "A", text: "Double-check all amounts using a calculator tool before stating them." },
        { letter: "B", text: "Extract transactional facts (amounts, order numbers, dates) into a persistent \"case facts\" block that is included in every prompt, separate from the summarizable conversation history." },
        { letter: "C", text: "Use lower temperature to reduce hallucination." },
        { letter: "D", text: "Always re-call `lookup_order` immediately before stating any amounts." },
      ],
      correct: "B",
      explanation:
        "Persistent case facts block prevents detail transposition. Exact amounts, IDs, and dates in a structured block that's included in every prompt, surviving any compression. Calculator tools (A) and re-lookups (D) are reactive, not preventive.",
    },
    {
      text: "Your support agent needs to handle: \"I was charged twice for order #3311 and I also need to change my shipping address for order #3400.\" The system prompt says: \"Handle one issue at a time.\" But the customer clearly has two distinct issues. What's the right behavior?",
      domain: "D1",
      scenario: scenario3Exam2,
      options: [
        { letter: "A", text: "Follow the system prompt exactly \u2014 address only the first issue and ask the customer to submit the second issue separately." },
        { letter: "B", text: "Decompose the request into two distinct items. Since these are independent issues, address them sequentially (double charge first, address change second) and synthesize a unified response." },
        { letter: "C", text: "Decompose into two items and investigate both in parallel since they're independent." },
        { letter: "D", text: "Escalate because multi-issue requests exceed the agent's scope." },
      ],
      correct: "B",
      explanation:
        "Decompose multi-issue requests into distinct items. Since double charge and address change are independent, address sequentially. Refusing the second issue (A) is poor service. Parallel investigation (C) pairs with D1 multi-concern decomposition but sequential is better for independent items.",
    },
    {
      text: "Your agent now uses hooks to enforce a $500 refund limit. A customer is owed $1,200 for three defective items in a single order ($400, $350, $450). The agent attempts to process three separate refunds of $400, $350, and $450 \u2014 all below the $500 limit. Is this a problem?",
      domain: "D1",
      scenario: scenario3Exam2,
      options: [
        { letter: "A", text: "No \u2014 each individual refund is below the threshold, so the hooks correctly allow them." },
        { letter: "B", text: "Yes \u2014 the hook should track cumulative refund amounts per order/customer, not just per-transaction amounts. $1,200 total for one order likely exceeds the policy intent even if individual items don't." },
        { letter: "C", text: "No \u2014 the $500 limit applies per-transaction only; cumulative tracking is the responsibility of the business system." },
        { letter: "D", text: "Yes \u2014 the agent should process a single $1,200 refund, which the hook would correctly block." },
      ],
      correct: "B",
      explanation:
        "Cumulative refund tracking is needed. Individual-transaction hooks miss split-refund circumvention. The $500 policy likely applies to total exposure, not per-item. The hook should track cumulative amounts per order or customer session.",
    },
    {
      text: "A customer says: \"I'm frustrated with your company, but I think you can fix this. My order arrived late.\" The agent should:",
      domain: "D5",
      scenario: scenario3Exam2,
      options: [
        { letter: "A", text: "Escalate immediately because the customer expressed frustration." },
        { letter: "B", text: "Acknowledge the frustration, then investigate and attempt to resolve the late delivery issue \u2014 the customer indicated they want the AI to help." },
        { letter: "C", text: "Use sentiment analysis to determine whether the frustration level warrants escalation." },
        { letter: "D", text: "Transfer to a human agent because any negative emotion suggests the AI can't handle the situation." },
      ],
      correct: "B",
      explanation:
        "The customer expressed frustration BUT indicated willingness to let the agent help (\"I think you can fix this\"). Acknowledge frustration, investigate. Sentiment escalation (A, C, D) is unreliable \u2014 the customer's words override sentiment signals.",
    },
    {
      text: "Which `tool_choice` configuration should you use when the agent's first action in every conversation MUST be to call `get_customer` for identity verification?",
      domain: "D2",
      scenario: scenario3Exam2,
      options: [
        { letter: "A", text: "`tool_choice: \"auto\"` \u2014 let the model decide based on the user's message." },
        { letter: "B", text: "`tool_choice: \"any\"` \u2014 force the model to call a tool, but let it choose which one." },
        { letter: "C", text: "`tool_choice: {\"type\": \"tool\", \"name\": \"get_customer\"}` \u2014 force the model to call `get_customer` specifically." },
        { letter: "D", text: "`tool_choice: \"required\"` \u2014 a special mode that requires a specific tool sequence." },
      ],
      correct: "C",
      explanation:
        "Forced tool selection (`{\"type\": \"tool\", \"name\": \"get_customer\"}`) guarantees a specific tool is called. `\"auto\"` (A) lets the model skip it. `\"any\"` (B) lets the model choose any tool. `\"required\"` (D) doesn't exist.",
    },
    {
      text: "Your `update_account` tool returns different errors for different failure modes, but all use the same format: `{\"success\": false, \"error\": \"Update failed\"}`. This prevents the agent from distinguishing between a locked account (needs manager unlock), an invalid email format (needs correction), and a system timeout (needs retry). How should the tool be improved?",
      domain: "D2",
      scenario: scenario3Exam2,
      options: [
        { letter: "A", text: "Add error codes (500, 400, 403) matching HTTP conventions." },
        { letter: "B", text: "Return structured error metadata: `{\"isError\": true, \"errorCategory\": \"validation|permission|transient\", \"isRetryable\": true|false, \"message\": \"...\", \"customer_explanation\": \"...\"}`." },
        { letter: "C", text: "Return different error messages for each failure type (but keep the same `success: false` format)." },
        { letter: "D", text: "Log errors server-side and have the agent check an error log endpoint." },
      ],
      correct: "B",
      explanation:
        "Structured error metadata with `errorCategory`, `isRetryable`, and `customer_explanation` enables appropriate agent responses. HTTP codes (A) lack context. Same-format errors (C) don't fix distinguishability. Error logs (D) are async and slow.",
    },
    {
      text: "After deploying the agent, metrics show it escalates 45% of cases \u2014 far above the 20% target. Analysis reveals it escalates all billing disputes regardless of complexity, even straightforward ones like duplicate charges with clear evidence. What's the most effective fix?",
      domain: "D5",
      scenario: scenario3Exam2,
      options: [
        { letter: "A", text: "Remove the `escalate_to_human` tool to force the agent to handle everything." },
        { letter: "B", text: "Add explicit escalation criteria with few-shot examples to the system prompt, showing when to escalate (policy gaps, customer insistence) versus resolve autonomously (clear-cut duplicate charges, standard returns)." },
        { letter: "C", text: "Implement a separate routing model that pre-classifies cases as \"agent-handleable\" or \"needs human.\"" },
        { letter: "D", text: "Have the agent self-report a confidence score and only escalate below a threshold." },
      ],
      correct: "B",
      explanation:
        "Explicit escalation criteria with few-shot examples fix over-escalation. Removing the tool (A) removes a safety valve. Routing models (C) add complexity. Self-confidence (D) is poorly calibrated.",
    },
    {
      text: "Your agent receives tool results accumulating across a 20-turn conversation. By turn 15, the context window is 85% full with verbose order lookups and account data. The agent's responses become increasingly unreliable. What's the best mitigation?",
      domain: "D5",
      scenario: scenario3Exam2,
      options: [
        { letter: "A", text: "Set a hard limit of 10 turns per conversation." },
        { letter: "B", text: "Use `/compact` at turn 10 to compress the history, but first extract critical case facts (IDs, amounts, dates, statuses) into a persistent block that survives compression." },
        { letter: "C", text: "Discard tool results older than 5 turns." },
        { letter: "D", text: "Route long conversations to human agents after 12 turns." },
      ],
      correct: "B",
      explanation:
        "Extract critical facts before `/compact` so they survive compression. Hard turn limits (A) and discarding results (C) are too aggressive. Routing to humans (D) fails the 80% resolution target.",
    },
    {
      text: "A customer provides their name as \"Alex Chen\" and says their phone number is \"555-0142.\" The `get_customer` tool returns:\n\n```json\n{\"matches\": [\n  {\"id\": \"C-1001\", \"name\": \"Alex Chen\", \"phone\": \"555-0142\", \"email\": \"alex@work.com\"},\n  {\"id\": \"C-1002\", \"name\": \"Alex Chen\", \"phone\": \"555-0142\", \"email\": \"alexc@home.com\"}\n]}\n```\n\nBoth records match on name AND phone. How should the agent proceed?",
      domain: "D5",
      scenario: scenario3Exam2,
      options: [
        { letter: "A", text: "Select C-1001 because it appears first in the results." },
        { letter: "B", text: "Select the one with the most recent activity." },
        { letter: "C", text: "Ask the customer for an additional identifier \u2014 in this case, their email address \u2014 to disambiguate between the two accounts." },
        { letter: "D", text: "Merge the two records and proceed with the combined information." },
      ],
      correct: "C",
      explanation:
        "Both name and phone match two accounts \u2014 need additional identifiers (email). First-result (A) and recency (B) are heuristics that may be wrong. Merging records (D) is a data integrity violation.",
    },
    {
      text: "The agent receives: \"I heard you guys do price matching. Can you match what Amazon has for this product?\" Your price adjustment policy states: \"We will match prices from our own website promotions. No other price matching is offered.\" What should the agent do?",
      domain: "D5",
      scenario: scenario3Exam2,
      options: [
        { letter: "A", text: "Deny the request, citing the policy: \"We only match our own website promotions.\"" },
        { letter: "B", text: "Attempt the competitor price match since the customer's request seems reasonable and similar." },
        { letter: "C", text: "Escalate to a human agent because the policy is ambiguous about competitor price matching." },
        { letter: "D", text: "Ask the customer for the Amazon listing URL to evaluate whether a match is possible." },
      ],
      correct: "A",
      explanation:
        "The policy explicitly states \u2014 \"No other price matching is offered.\" This is NOT a policy gap (unlike Mock 1 Q15 where the policy was silent). Here, the policy directly addresses the request. Denial is correct. Escalation (C) is for gaps, not for clearly denied requests.",
    },
    {
      text: "Your coordinator agent needs to pass a verified customer record to a billing subagent. Which approach correctly preserves the information?",
      domain: "D1",
      scenario: scenario3Exam2,
      options: [
        { letter: "A", text: "Tell the billing subagent: \"The customer has been verified. Look up their billing history.\"" },
        { letter: "B", text: "Include the complete verified customer data in the billing subagent's Task prompt: `\"Verified customer: ID C-1001, name Alex Chen, email alex@work.com. Investigate billing dispute for order #5582, amount $284.50, charged on 2025-02-15.\"`" },
        { letter: "C", text: "Store the customer data in a shared memory object that both agents can access." },
        { letter: "D", text: "Have the billing subagent re-call `get_customer` to verify independently." },
      ],
      correct: "B",
      explanation:
        "Subagents have isolated context. Pass complete verified data in the Task prompt. Vague instructions (A) leave the subagent without critical data. Shared memory (C) doesn't exist in the SDK pattern. Re-verification (D) wastes a tool call.",
    },
    // Scenario 4: Structured Data Extraction (Q46-Q60)
    {
      text: "Your extraction schema marks `effective_date` as `required` with type `\"string\"`. For contracts that are undated (surprisingly common in draft contracts), Claude fabricates a plausible date. You also notice Claude invents a `governing_law` value when the contract is silent on jurisdiction. What single schema design principle fixes both issues?",
      domain: "D4",
      scenario: scenario4Exam2,
      options: [
        { letter: "A", text: "Add validation rules that check extracted dates against a reasonable range." },
        { letter: "B", text: "Make fields that may be absent from source documents optional with nullable types (`[\"string\", \"null\"]`) and remove them from `required`. This prevents the model from fabricating values to satisfy schema constraints." },
        { letter: "C", text: "Add \"Do not hallucinate\" to the extraction prompt." },
        { letter: "D", text: "Implement a post-extraction verification step that checks all dates against the document." },
      ],
      correct: "B",
      explanation:
        "Nullable optional fields prevent fabrication for both `effective_date` and `governing_law`. When information is absent, Claude returns `null`. Validation (A) catches but doesn't prevent. Prompt instructions (C) are probabilistic. Post-verification (D) is reactive.",
    },
    {
      text: "Your financial statement extraction tool uses `tool_choice: \"auto\"`. The model processes 80% of documents correctly but returns conversational text for 20%: \"This appears to be a financial statement from...\" without calling the extraction tool. Changing to `tool_choice: \"any\"` resolves this. However, you now have a new problem: you have two extraction tools (`extract_income_statement` and `extract_balance_sheet`) and the model sometimes picks the wrong one. What's the best overall configuration?",
      domain: "D4",
      scenario: scenario4Exam2,
      options: [
        { letter: "A", text: "Keep `tool_choice: \"any\"` and improve both tool descriptions to make them clearly distinguishable." },
        { letter: "B", text: "Use `tool_choice: \"auto\"` with stronger prompt instructions." },
        { letter: "C", text: "Create a single combined `extract_financial_data` tool that handles both document types." },
        { letter: "D", text: "Use forced tool selection to always call `extract_income_statement` first." },
      ],
      correct: "A",
      explanation:
        "`tool_choice: \"any\"` guarantees a tool call. The wrong-tool problem is solved by improving descriptions. Better descriptions are the primary mechanism for tool selection. Combined tool (C) loses type-specific extraction logic. Forced selection (D) doesn't handle varying document types.",
    },
    {
      text: "Your extraction pipeline processes medical records. For the field `blood_pressure`, some documents contain \"120/80 mmHg,\" some contain \"BP normal,\" and some don't mention blood pressure at all. How should you design the schema?",
      domain: "D4",
      scenario: scenario4Exam2,
      options: [
        { letter: "A", text: "`\"blood_pressure\": {\"type\": \"string\"}` \u2014 accept any text and normalize later." },
        { letter: "B", text: "`\"blood_pressure\": {\"type\": [\"string\", \"null\"]}` (nullable) with format normalization rules in the prompt: \"Normalize to 'systolic/diastolic mmHg' format. If described as 'normal' without values, use 'normal'. If not mentioned, return null.\"" },
        { letter: "C", text: "`\"blood_pressure_systolic\": {\"type\": \"integer\"}, \"blood_pressure_diastolic\": {\"type\": \"integer\"}` \u2014 separate numeric fields." },
        { letter: "D", text: "`\"blood_pressure\": {\"type\": \"string\", \"enum\": [\"normal\", \"elevated\", \"high\", \"critical\"]}` \u2014 categorize instead of extracting raw values." },
      ],
      correct: "B",
      explanation:
        "Nullable field + format normalization rules handles all three cases: structured values, descriptive values (\"normal\"), and absence (null). Plain string (A) pushes normalization downstream. Separate integers (C) can't handle \"normal.\" Enum (D) loses actual values.",
    },
    {
      text: "After extraction, Pydantic validation catches: `\"contract_value\"` is `\"approximately $2.5 million\"` but the schema expects a numeric field. You retry, providing the original document, the failed extraction, and the specific error. Claude corrects to `2500000.00`. After adding format normalization rules to the prompt (\"Convert currency descriptions to numeric: '$2.5 million' \u2192 2500000\"), the same error stops appearing in new documents. What does this demonstrate?",
      domain: "D4",
      scenario: scenario4Exam2,
      options: [
        { letter: "A", text: "Retries always fix format errors eventually." },
        { letter: "B", text: "The most effective approach combines validation-retry for immediate correction AND prompt refinement to prevent the error category from recurring, reducing iterative resubmission costs." },
        { letter: "C", text: "Format normalization rules alone are sufficient; retries are unnecessary." },
        { letter: "D", text: "Pydantic validation should be replaced with Claude-based validation." },
      ],
      correct: "B",
      explanation:
        "Validation-retry for immediate correction + prompt refinement to prevent the error category from recurring. Both mechanisms together optimize quality and cost. Retries alone (A) fix individual cases but not the pattern. Rules alone (C) don't handle edge cases.",
    },
    {
      text: "You extract data from two types of documents: formal contracts (structured, consistent formatting) and informal agreements (emails, handwritten notes, varied layouts). Overall accuracy is 95%. Stakeholders are satisfied. However, your operations team reports frequent errors in informal agreements causing downstream failures. What happened?",
      domain: "D5",
      scenario: scenario4Exam2,
      options: [
        { letter: "A", text: "The model needs additional training on informal documents." },
        { letter: "B", text: "The 95% aggregate accuracy masks poor performance on informal agreements. You need stratified accuracy analysis by document type \u2014 the formal contract accuracy may be 99%+ while informal agreements may be 70%." },
        { letter: "C", text: "Informal agreements shouldn't be processed by the extraction system." },
        { letter: "D", text: "The downstream system needs better error handling for malformed data." },
      ],
      correct: "B",
      explanation:
        "Aggregate accuracy masks per-type performance. 95% overall might be 99% formal + 70% informal. Stratified analysis by document type reveals hidden failures. Additional training (A) isn't applicable. Excluding documents (C) loses business value.",
    },
    {
      text: "Your self-correction pipeline extracts data, validates it, and retries on failure. For a lease agreement, the extraction includes `monthly_rent: 2500` but the lease actually states \"twenty-five hundred per month for the first year, increasing to three thousand in year two.\" What additional schema field would capture this complexity?",
      domain: "D4",
      scenario: scenario4Exam2,
      options: [
        { letter: "A", text: "`\"rent_notes\": {\"type\": \"string\"}` for free-text context." },
        { letter: "B", text: "Design a structured rent schedule: `\"rent_schedule\": {\"type\": \"array\", \"items\": {\"type\": \"object\", \"properties\": {\"period\": {\"type\": \"string\"}, \"monthly_amount\": {\"type\": \"number\"}, \"start_date\": {\"type\": [\"string\", \"null\"]}, \"end_date\": {\"type\": [\"string\", \"null\"]}}}}`." },
        { letter: "C", text: "Add `\"rent_is_variable\": {\"type\": \"boolean\"}`." },
        { letter: "D", text: "Add `\"rent_range\": {\"type\": \"object\", \"properties\": {\"min\": {\"type\": \"number\"}, \"max\": {\"type\": \"number\"}}}`." },
      ],
      correct: "B",
      explanation:
        "A structured rent schedule array captures multi-period variable amounts. Single field (existing) loses the year-two increase. Free-text notes (A) aren't structured. Boolean flag (C) indicates variability but doesn't capture amounts. Range (D) loses temporal information.",
    },
    {
      text: "Your batch job processes 1,000 contracts overnight using the Batches API. 950 succeed. Of the 50 failures, 30 are `context_limit_exceeded` (very long contracts), 15 are extraction validation failures, and 5 are transient API errors. What's the correct recovery strategy?",
      domain: "D4",
      scenario: scenario4Exam2,
      options: [
        { letter: "A", text: "Resubmit all 1,000 contracts with a more concise prompt." },
        { letter: "B", text: "Handle each failure category separately: chunk the 30 oversized contracts, refine the prompt for the 15 validation failures (test on a sample first), and simply resubmit the 5 transient errors. Identify all by `custom_id`." },
        { letter: "C", text: "Resubmit only the 50 failures with the same prompt and hope for different results." },
        { letter: "D", text: "Switch all 50 failures to synchronous processing." },
      ],
      correct: "B",
      explanation:
        "Handle each failure category differently: chunk oversized, refine prompt for validation errors (test on sample), resubmit transient errors. Use `custom_id` to identify each. Resubmitting all (A, C) is wasteful. Synchronous (D) doesn't fix the underlying issues.",
    },
    {
      text: "Your extraction system has been running for 3 months with 98% accuracy on high-confidence extractions routed to auto-approval. Your quality team suggests stopping human review of high-confidence extractions entirely. What should you do first?",
      domain: "D5",
      scenario: scenario4Exam2,
      options: [
        { letter: "A", text: "Agree \u2014 98% over 3 months proves the system is reliable." },
        { letter: "B", text: "Implement stratified random sampling of high-confidence extractions to continuously measure error rates and detect novel error patterns. Don't eliminate human review; reduce it while maintaining ongoing validation." },
        { letter: "C", text: "Add a second Claude instance to review high-confidence extractions instead of humans." },
        { letter: "D", text: "Increase the confidence threshold to 99.5% before auto-approving." },
      ],
      correct: "B",
      explanation:
        "Stratified random sampling for ongoing validation. Never eliminate human review entirely \u2014 reduce it while maintaining ongoing measurement. 3 months of 98% doesn't guarantee future performance. Novel patterns could emerge. AI review (C) has its own biases.",
    },
    {
      text: "A contract extraction produces: `\"governing_law\": \"State of California\"` but a parallel extraction from a rider amendment to the same contract says: `\"governing_law\": \"State of New York\"`. The rider supersedes the original contract. How should your system handle this?",
      domain: "D5",
      scenario: scenario4Exam2,
      options: [
        { letter: "A", text: "Use the original contract's value since it's the primary document." },
        { letter: "B", text: "Use the rider's value since it was processed more recently." },
        { letter: "C", text: "Preserve both values with source attribution, annotate the conflict, and include document dates so a reviewer can determine which takes precedence. Flag the extraction as needing human verification." },
        { letter: "D", text: "Concatenate: `\"governing_law\": \"State of California; State of New York\"`." },
      ],
      correct: "C",
      explanation:
        "Preserve both values with source attribution and dates. The rider may supersede, but that's a legal determination \u2014 the extraction system should preserve both and flag the conflict. Picking either (A, B) makes assumptions. Concatenation (D) is meaningless.",
    },
    {
      text: "Your extraction prompt produces clean output for invoices but struggles with contracts that have footnotes referencing key terms. For example, a contract body says \"standard terms\" but footnote 3 defines specific non-standard payment terms. The extraction misses the footnote data. What prompting technique fixes this?",
      domain: "D4",
      scenario: scenario4Exam2,
      options: [
        { letter: "A", text: "Add \"Check footnotes\" to the system prompt." },
        { letter: "B", text: "Add 2-3 few-shot examples showing correct extraction from documents where critical data appears in footnotes, appendices, and sidebar annotations \u2014 demonstrating that the model should search the entire document structure." },
        { letter: "C", text: "Pre-process the document to inline all footnotes into the body text." },
        { letter: "D", text: "Create a separate \"footnote extraction\" pass." },
      ],
      correct: "B",
      explanation:
        "Few-shot examples showing extraction from footnotes, appendices, and sidebars. Demonstrates that critical data can appear anywhere in document structure. Simple instructions (A) are less effective than examples. Pre-processing (C) and separate passes (D) add complexity.",
    },
    {
      text: "You process both income statements and balance sheets. Your single extraction prompt handles both, but frequently places balance sheet data into income statement fields and vice versa. Claude generates valid JSON that passes schema validation but with incorrect field mappings. What type of error is this?",
      domain: "D4",
      scenario: scenario4Exam2,
      options: [
        { letter: "A", text: "Schema syntax error \u2014 fixable by making the schema more strict." },
        { letter: "B", text: "Semantic validation error \u2014 `tool_use` with schemas eliminates syntax errors but NOT semantic errors like values in wrong fields. Implement a separate validation step for cross-field consistency." },
        { letter: "C", text: "Prompt engineering error \u2014 the prompt needs more explicit field definitions." },
        { letter: "D", text: "Both B and C \u2014 fix the semantic validation AND improve the prompt." },
      ],
      correct: "D",
      explanation:
        "Both semantic validation (cross-field consistency checks) AND better prompting (explicit field definitions with examples) address this. Schema syntax is correct \u2014 the error is semantic (wrong fields). Either B or C alone is partial.",
    },
    {
      text: "Your team processes 5,000 documents weekly. A pre-merge CI check blocks developers until compliance documents are extracted and validated. A weekly compliance audit extracts data from historical documents for regulatory review. Your manager proposes using the Batch API for both workflows. What's correct?",
      domain: "D4",
      scenario: scenario4Exam2,
      options: [
        { letter: "A", text: "Use Batch API for both \u2014 the 50% savings applies to both workflows." },
        { letter: "B", text: "Use synchronous API for the pre-merge check (developers are blocking) and Batch API for the weekly audit (latency-tolerant, cost-sensitive)." },
        { letter: "C", text: "Use Batch API for the pre-merge check with aggressive polling for fast results." },
        { letter: "D", text: "Use synchronous API for both to guarantee consistent processing." },
      ],
      correct: "B",
      explanation:
        "Blocking pre-merge = synchronous (developers wait). Weekly audit = batch (latency-tolerant, cost-sensitive). Batch for blocking (A, C) risks 24h delays for developers. Synchronous for everything (D) wastes 50% on the audit.",
    },
    {
      text: "Your extraction of `total_contract_value` works by extracting both the stated total and independently summing all line items. In 5% of documents, the stated total and calculated sum differ. Your system currently discards these documents. What's a better approach?",
      domain: "D4",
      scenario: scenario4Exam2,
      options: [
        { letter: "A", text: "Always use the stated total \u2014 it's what the original document says." },
        { letter: "B", text: "Always use the calculated sum \u2014 it's mathematically correct." },
        { letter: "C", text: "Design the schema to extract both `stated_total` and `calculated_total`, add `conflict_detected: boolean`, and route conflicts to human review with both values and the discrepancy amount." },
        { letter: "D", text: "Average the two values." },
      ],
      correct: "C",
      explanation:
        "Extract both values, flag conflict, route to human review. Always using one value (A, B) risks errors. Averaging (D) is nonsensical for financial data. Preserving both with a conflict flag enables informed human decisions.",
    },
    {
      text: "Your extraction system needs to output field-level confidence scores for routing to human review. After deployment, you find that extractions marked \"0.95 confidence\" are wrong 30% of the time. What's needed?",
      domain: "D5",
      scenario: scenario4Exam2,
      options: [
        { letter: "A", text: "Lower the auto-approval threshold to 0.99." },
        { letter: "B", text: "Calibrate confidence thresholds using a labeled validation set. Out-of-the-box model confidence is not well-calibrated; you need to measure actual accuracy at each confidence level and set thresholds based on empirical data." },
        { letter: "C", text: "Replace model confidence with a rule-based confidence system." },
        { letter: "D", text: "Remove confidence scoring and send all extractions to human review." },
      ],
      correct: "B",
      explanation:
        "Model confidence is not well-calibrated out of the box. Calibrate using labeled validation sets \u2014 measure actual accuracy at each stated confidence level, then set empirically-grounded thresholds. Arbitrary threshold changes (A) don't fix calibration.",
    },
    {
      text: "Your synthesis report combines data from 15 extracted contracts into a portfolio summary. Sources are compressed into a paragraph summary during aggregation. A stakeholder asks \"Where did the $2.3M total come from?\" and no one can trace it to specific contracts. What architectural change prevents this?",
      domain: "D5",
      scenario: scenario4Exam2,
      options: [
        { letter: "A", text: "Include all raw extraction data in the final report." },
        { letter: "B", text: "Require the aggregation step to maintain claim-source mappings: each figure in the summary must be traceable to specific contracts with contract IDs, page references, and extraction dates." },
        { letter: "C", text: "Add a disclaimer that figures are approximations." },
        { letter: "D", text: "Store raw extractions in a separate database for manual lookup." },
      ],
      correct: "B",
      explanation:
        "Claim-source mappings maintain provenance through aggregation. Every figure must be traceable to specific contracts. Raw data dumps (A) are unreadable. Disclaimers (C) are evasions. Separate databases (D) require manual lookup.",
    },
  ],
  "3": [
    // Scenario 1: Enterprise Knowledge Management System (Q1-Q15)
    {
      text: "Your knowledge management agent needs to find all documents mentioning \"remote work policy\" across the company's Confluence instance. Which approach is correct?",
      domain: "D2",
      scenario: scenario1Exam3,
      options: [
        { letter: "A", text: "Use Grep to search local files for \"remote work policy\" \u2014 this will find all relevant documents." },
        { letter: "B", text: "Use the Confluence MCP server's `search_pages` tool with appropriate query parameters \u2014 this searches the actual Confluence content repository." },
        { letter: "C", text: "Use Glob to find all `.md` files in the local repository that might contain policy information." },
        { letter: "D", text: "Ask employees to manually search Confluence and report findings to the agent." },
      ],
      correct: "B",
      explanation: "MCP server tools search the actual content repository. Grep (A) only searches local files. Glob (C) finds file patterns, not content. Manual search (D) defeats the agent's purpose.",
    },
    {
      text: "The agent needs to update a deprecated policy link in 50+ internal documentation pages. The Edit tool fails on several files due to varying anchor text patterns. What's the best strategy?",
      domain: "D2",
      scenario: scenario1Exam3,
      options: [
        { letter: "A", text: "Use Bash with `sed -i` to perform bulk find-and-replace across all files." },
        { letter: "B", text: "Read each file, identify the exact context around the deprecated link, then use Edit with file-specific anchor text that includes surrounding unique content." },
        { letter: "C", text: "Write a script that replaces all instances of the old URL with the new URL without reading file contents." },
        { letter: "D", text: "Skip the files where Edit fails and manually update them later." },
      ],
      correct: "B",
      explanation: "Read each file for exact context, then use file-specific anchor text. `sed` (A) is fragile for code/docs. Blind replacement (C) risks errors. Skipping files (D) leaves work incomplete.",
    },
    {
      text: "Your knowledge agent reads 100+ policy documents during initial setup, consuming most of the context window. When employees ask specific policy questions, the agent gives generic answers referencing \"company policies\" without citing specific documents. What's the better approach?",
      domain: "D2",
      scenario: scenario1Exam3,
      options: [
        { letter: "A", text: "Increase the model's context window by upgrading to a higher-tier plan." },
        { letter: "B", text: "Build a searchable index: use Grep to find relevant documents per query, then Read only those specific documents \u2014 avoid loading everything upfront." },
        { letter: "C", text: "Store all policy content in a database and have the agent query the database instead of reading files." },
        { letter: "D", text: "Use `/compact` after every employee question to free up context space." },
      ],
      correct: "B",
      explanation: "Incremental investigation: Grep \u2192 find relevant docs \u2192 Read only those. Loading everything upfront floods context. Larger context (A) doesn't fix the pattern. `/compact` (D) loses details.",
    },
    {
      text: "The agent needs to identify subject matter experts for \"cloud infrastructure\" topics. Your company has an MCP server with an `employee_directory` tool that returns skills and project history. However, the agent keeps suggesting employees based on job titles alone. What's the likely issue?",
      domain: "D2",
      scenario: scenario1Exam3,
      options: [
        { letter: "A", text: "The MCP server isn't properly authenticated \u2014 check the `.mcp.json` credentials." },
        { letter: "B", text: "The tool description doesn't emphasize using skills/project history over job titles. Enhance the description to guide proper field usage." },
        { letter: "C", text: "Built-in tools always take priority over MCP tools for employee lookups." },
        { letter: "D", text: "The agent needs to call `employee_directory` multiple times to get accurate results." },
      ],
      correct: "B",
      explanation: "Tool descriptions guide agent behavior. Enhance descriptions to emphasize skills/project history over job titles. Authentication (A) isn't the issue. Built-in tools don't take priority (C). Multiple calls (D) don't fix the selection issue.",
    },
    {
      text: "Your team wants to expose the company's API documentation (200+ endpoints across 15 services) to the knowledge agent. Developers should be able to ask \"How do I authenticate to the payments API?\" without the agent making exploratory tool calls. What MCP concept applies?",
      domain: "D2",
      scenario: scenario1Exam3,
      options: [
        { letter: "A", text: "Create 200 individual MCP tools \u2014 one per API endpoint." },
        { letter: "B", text: "Expose API documentation as MCP resources \u2014 read-only content catalogs that give the agent visibility without requiring tool calls." },
        { letter: "C", text: "Include all API documentation in the root CLAUDE.md file." },
        { letter: "D", text: "Create a `discover_api` MCP tool that the agent calls before answering each API question." },
      ],
      correct: "B",
      explanation: "MCP resources expose read-only content catalogs without tool calls. 200 individual tools (A) is impractical. CLAUDE.md (C) would be enormous. Discovery tool (D) adds unnecessary calls.",
    },
    {
      text: "A developer creates a personal `/find-expert` command that searches for colleagues based on their preferred criteria. Another team member wants different search criteria. How should this be managed?",
      domain: "D3",
      scenario: scenario1Exam3,
      options: [
        { letter: "A", text: "Both developers put their commands in `.claude/commands/` with different names." },
        { letter: "B", text: "Each developer creates their personal command in `~/.claude/commands/` \u2014 user-scoped commands that don't affect teammates." },
        { letter: "C", text: "Create a single configurable command in `.claude/commands/` that accepts parameters for search criteria." },
        { letter: "D", text: "The second developer must request the first developer to modify the existing command." },
      ],
      correct: "B",
      explanation: "Personal commands go in user-scoped `~/.claude/commands/`. Project-scoped (A) forces one preference on all. Configurable command (C) adds complexity. Modification requests (D) create dependency.",
    },
    {
      text: "Your knowledge agent's agentic loop processes tool calls and checks for `TextBlock` in responses to determine if Claude is done. During complex multi-document queries, the agent sometimes stops before completing all searches. Why?",
      domain: "D1",
      scenario: scenario1Exam3,
      options: [
        { letter: "A", text: "The temperature is too low, causing the model to generate text before finishing tool calls." },
        { letter: "B", text: "Checking for `TextBlock` is an anti-pattern. Claude responses can contain both text AND tool calls. The correct signal is `stop_reason == \"end_turn\"`." },
        { letter: "C", text: "The model's `max_tokens` is too low, truncating responses mid-execution." },
        { letter: "D", text: "The system prompt needs to instruct the model to complete all tool calls before generating any text." },
      ],
      correct: "B",
      explanation: "Checking for `TextBlock` is an anti-pattern \u2014 responses can contain both text and tool calls. Correct signal is `stop_reason == \"end_turn\"`. Temperature (A), max_tokens (C), and prompts (D) don't address the fundamental issue.",
    },
    {
      text: "Your knowledge agent has 22 tools: 6 built-in plus 16 MCP tools for Confluence, SharePoint, Slack, Jira, HR systems, and various databases. Tool selection is unreliable \u2014 the agent often picks wrong tools or makes unnecessary calls. How should you restructure?",
      domain: "D1",
      scenario: scenario1Exam3,
      options: [
        { letter: "A", text: "Keep all 22 tools but add comprehensive descriptions and 10+ few-shot examples for each tool." },
        { letter: "B", text: "Create specialized subagents: a documentation agent (Read, Grep, Confluence MCP), a people agent (directory MCP, Slack MCP), and a policy agent (SharePoint MCP, HR MCP). A coordinator routes queries appropriately." },
        { letter: "C", text: "Remove all MCP tools and rely only on built-in tools for consistency." },
        { letter: "D", text: "Prioritize built-in tools over MCP tools in the system prompt to reduce confusion." },
      ],
      correct: "B",
      explanation: "22 tools degrades selection reliability. Create specialized subagents with scoped tool sets (4-5 per agent). Better descriptions (A) help but don't solve cognitive load. Removing tools (C) loses functionality. Priority prompts (D) are unreliable.",
    },
    {
      text: "After researching 30 policy documents for an employee query, the agent's context is 90% full. Subsequent questions in the same session get increasingly vague. What should you implement?",
      domain: "D5",
      scenario: scenario1Exam3,
      options: [
        { letter: "A", text: "Start a new session for every employee question \u2014 this ensures fresh context." },
        { letter: "B", text: "Have the agent maintain a scratchpad file with key findings (document IDs, relevant excerpts, citations). Re-read the scratchpad for follow-ups instead of re-discovering information." },
        { letter: "C", text: "Use `/compact` immediately after each document is read to minimize context usage." },
        { letter: "D", text: "Upgrade to a model with a larger context window for all knowledge queries." },
      ],
      correct: "B",
      explanation: "Scratchpad files persist findings across context boundaries. New sessions (A) lose all context. `/compact` (C) helps but doesn't prevent degradation. Larger context (D) delays but doesn't solve the issue.",
    },
    {
      text: "You want to compare two knowledge organization approaches \u2014 one using topic-based categorization and one using department-based categorization \u2014 from the same document analysis baseline. What feature enables this?",
      domain: "D1",
      scenario: scenario1Exam3,
      options: [
        { letter: "A", text: "Run the agent twice with different system prompts and compare outputs." },
        { letter: "B", text: "Use `fork_session` to create independent branches from the shared document analysis, exploring each categorization approach in its own branch." },
        { letter: "C", text: "Create two separate agents with different `AgentDefinition` configurations." },
        { letter: "D", text: "Use `--resume` to return to the analysis point and try the second approach." },
      ],
      correct: "B",
      explanation: "`fork_session` creates independent branches from a shared baseline. Running twice (A) lacks shared context. `--resume` (D) continues linearly. Different agents (C) don't share analysis.",
    },
    {
      text: "Your agent's agentic loop has this structure:\n\n```python\nfor i in range(15):\n    response = client.messages.create(...)\n    if response.stop_reason == \"end_turn\":\n        break\n    # ... process tool calls\n```\n\nWhat's the concern with this implementation?",
      domain: "D1",
      scenario: scenario1Exam3,
      options: [
        { letter: "A", text: "Nothing \u2014 this is the correct pattern with appropriate safety limits." },
        { letter: "B", text: "The iteration cap (`range(15)`) could prematurely terminate legitimate explorations needing 16+ iterations. Use `stop_reason` as primary; if a safety limit is needed, make it generous (50+) and log warnings when hit." },
        { letter: "C", text: "`\"end_turn\"` is the wrong signal \u2014 it should check for `\"complete\"`." },
        { letter: "D", text: "The loop should check for tool calls in content blocks, not the `stop_reason`." },
      ],
      correct: "B",
      explanation: "The `range(15)` cap could terminate legitimate explorations needing 16+ iterations. Safety limits are valid as secondary safeguards but should be generous (50+) with warnings. `\"complete\"` (C) isn't valid. Content block checking (D) is an anti-pattern.",
    },
    {
      text: "Your coordinator agent spawns a subagent to find \"all security policies updated in the last 6 months.\" The subagent returns: \"Based on typical enterprise practices, security policies are usually updated quarterly.\" The subagent didn't actually search. Why?",
      domain: "D1",
      scenario: scenario1Exam3,
      options: [
        { letter: "A", text: "The subagent doesn't have access to the Grep and MCP search tools needed." },
        { letter: "B", text: "The subagent inherited the coordinator's context but lacks instructions to use tools for investigation." },
        { letter: "C", text: "The subagent's system prompt doesn't instruct it to use tools, AND `allowedTools` may not include search tools." },
        { letter: "D", text: "Both A and C are likely factors. Ensure `allowedTools` includes search tools AND the prompt instructs investigation rather than guessing." },
      ],
      correct: "D",
      explanation: "Two issues: subagent needs the right tools AND proper instructions. Without search tools in `allowedTools`, it can't search. Without investigation instructions, it defaults to guessing. Both contribute.",
    },
    {
      text: "An employee resumes a knowledge query session from yesterday using `--resume policy-research`. Since yesterday, 5 critical policy documents have been updated. The agent continues analyzing based on stale information. What's the solution?",
      domain: "D1",
      scenario: scenario1Exam3,
      options: [
        { letter: "A", text: "Never use `--resume` for knowledge queries \u2014 always start fresh." },
        { letter: "B", text: "After resuming, inform the agent about specific documents that changed so it can re-analyze those rather than re-exploring everything." },
        { letter: "C", text: "Run Bash to check file modification dates and pipe results into the agent context." },
        { letter: "D", text: "Use `/compact` after resuming to force the agent to re-read all documents." },
      ],
      correct: "B",
      explanation: "After resuming, inform the agent about specific document changes for targeted re-analysis. Never resuming (A) wastes prior work. File dates (C) help but need targeted guidance. `/compact` (D) doesn't trigger re-reading.",
    },
    {
      text: "Your knowledge agent uses MCP resources to expose company documentation. However, sensitive HR policies should only be visible to HR team members. How should you handle access control?",
      domain: "D2",
      scenario: scenario1Exam3,
      options: [
        { letter: "A", text: "Include all resources in MCP configuration \u2014 access control is handled by the underlying systems (Confluence, SharePoint permissions)." },
        { letter: "B", text: "Create separate MCP configurations per team \u2014 HR gets HR resources, Engineering gets engineering resources." },
        { letter: "C", text: "Add authentication checks to each MCP resource definition to verify user roles before exposing content." },
        { letter: "D", text: "Exclude sensitive resources from MCP entirely and handle them through a separate secure channel." },
      ],
      correct: "A",
      explanation: "Access control is handled by underlying systems (Confluence, SharePoint permissions). Separate configs (B) create maintenance overhead. Auth checks in resources (C) aren't standard MCP patterns. Excluding resources (D) loses functionality.",
    },
    {
      text: "Your knowledge agent successfully answers 85% of employee queries autonomously. For the remaining 15%, it should escalate to human experts. Currently, it escalates 40% of queries \u2014 many are straightforward questions it could answer. What's the fix?",
      domain: "D5",
      scenario: scenario1Exam3,
      options: [
        { letter: "A", text: "Remove the escalation tool to force the agent to answer everything." },
        { letter: "B", text: "Add explicit escalation criteria with few-shot examples to the system prompt: when to escalate (ambiguous queries, conflicting sources) vs. resolve autonomously (clear policy questions, documented procedures)." },
        { letter: "C", text: "Implement a separate routing model that pre-classifies queries as \"agent-handleable\" or \"needs human.\"" },
        { letter: "D", text: "Have the agent self-report confidence scores and only escalate below a threshold." },
      ],
      correct: "B",
      explanation: "Explicit escalation criteria with few-shot examples fix over-escalation. Removing the tool (A) removes a safety valve. Routing models (C) add complexity. Self-confidence (D) is poorly calibrated.",
    },
    // Scenario 2: E-commerce Product Recommendation Engine (Q16-Q30)
    {
      text: "Your recommendation prompt says: \"Help customers find products they'll love. Be helpful and thorough.\" The output varies wildly \u2014 sometimes detailed comparisons, sometimes single product suggestions. What's the root cause?",
      domain: "D4",
      scenario: scenario2Exam3,
      options: [
        { letter: "A", text: "The model needs a higher temperature for consistent creative output." },
        { letter: "B", text: "The instructions are too vague. Replace with explicit criteria: what information to gather (budget, use case, preferences), what comparisons to provide, what to recommend vs. skip." },
        { letter: "C", text: "The model's `max_tokens` varies between runs, limiting output length." },
        { letter: "D", text: "Add `--deterministic` flag to the Claude Code CLI for consistent output." },
      ],
      correct: "B",
      explanation: "Vague instructions produce inconsistent output. Explicit criteria defining what to gather and how to recommend is the fix. Temperature (A) isn't the issue. `max_tokens` (C) doesn't vary. `--deterministic` (D) doesn't exist.",
    },
    {
      text: "Your agent frequently recommends out-of-stock items because it searches products before checking inventory. Customers get frustrated when their selected items are unavailable. What's the fix?",
      domain: "D4",
      scenario: scenario2Exam3,
      options: [
        { letter: "A", text: "Add \"Check inventory before recommending\" to the prompt \u2014 this will ensure the agent remembers." },
        { letter: "B", text: "Restructure the tool flow: use a `search_and_check_inventory` combined tool, or enforce inventory checks via `tool_choice` sequencing before any recommendations are presented." },
        { letter: "C", text: "Display inventory status prominently in the UI so customers can see availability themselves." },
        { letter: "D", text: "Only recommend items that have been in stock for the past 30 days based on historical data." },
      ],
      correct: "B",
      explanation: "Restructure tool flow to enforce inventory checks before recommendations. Prompt instructions (A) are probabilistic. UI display (C) doesn't prevent the error. Historical data (D) doesn't reflect current stock.",
    },
    {
      text: "You need to define explicit discount eligibility rules for your shopping agent. Currently, the agent inconsistently applies discounts \u2014 sometimes stacking incompatible offers, sometimes missing valid combinations. How do you achieve consistent application?",
      domain: "D4",
      scenario: scenario2Exam3,
      options: [
        { letter: "A", text: "Add \"Apply all eligible discounts\" to the prompt." },
        { letter: "B", text: "Define explicit discount rules with concrete examples: which discounts stack (site-wide + category), which don't (two percentage-off offers), priority order, and edge cases." },
        { letter: "C", text: "Add `discount_rules` to the output schema for validation." },
        { letter: "D", text: "Use a separate pricing service to calculate discounts instead of having the agent determine them." },
      ],
      correct: "B",
      explanation: "Explicit discount rules with concrete examples for stacking, non-stacking, and priority. Vague instructions (A) don't fix inconsistency. Schema fields (C) don't improve classification. External service (D) removes agent capability.",
    },
    {
      text: "Your agent generates product comparison tables for customers. It sometimes includes products from different categories (comparing laptops to tablets) because the customer's query was ambiguous. How do you fix this?",
      domain: "D4",
      scenario: scenario2Exam3,
      options: [
        { letter: "A", text: "Post-filter comparison tables to remove mismatched categories." },
        { letter: "B", text: "When queries are ambiguous, have the agent ask clarifying questions before generating comparisons. Document this behavior in CLAUDE.md with examples of good clarification questions." },
        { letter: "C", text: "Only allow comparisons within the same top-level category regardless of customer intent." },
        { letter: "D", text: "Limit comparisons to a maximum of 3 products to reduce errors." },
      ],
      correct: "B",
      explanation: "Ask clarifying questions when queries are ambiguous. Document this in CLAUDE.md with examples. Post-filtering (A) is reactive. Category restrictions (C) limit helpfulness. Product limits (D) don't address the root cause.",
    },
    {
      text: "A customer asks about \"wireless headphones under $200\" across your catalog of 5,000+ audio products. Your agent searches the entire catalog and returns inconsistent results \u2014 some runs show 15 products, others show 8. What explains this?",
      domain: "D4",
      scenario: scenario2Exam3,
      options: [
        { letter: "A", text: "The model's random seed varies between inference calls." },
        { letter: "B", text: "The agent isn't using structured search parameters consistently. Ensure search queries use explicit filters (category, price range, features) rather than natural language that the MCP tool must interpret." },
        { letter: "C", text: "The inventory data changes between runs, affecting result counts." },
        { letter: "D", text: "The model only processes the first 100 products in the catalog due to token limits." },
      ],
      correct: "B",
      explanation: "Use explicit structured search parameters (category, price, features) rather than natural language that the MCP tool must interpret. Random seed (A) doesn't affect tool behavior. Inventory changes (C) don't explain run-to-run variance. Token limits (D) aren't the mechanism.",
    },
    {
      text: "Your shopping assistant posts product recommendations in chat. After a customer selects a product and you show additional accessories, the agent sometimes re-recommends the already-selected product alongside accessories. Customers complain about redundancy. What's the fix?",
      domain: "D3",
      scenario: scenario2Exam3,
      options: [
        { letter: "A", text: "Delete previous recommendations from the chat history before showing new ones." },
        { letter: "B", text: "Include the customer's selection history in context and instruct the agent to exclude already-selected items from new recommendations." },
        { letter: "C", text: "Only show accessories after purchase completion, not during the shopping session." },
        { letter: "D", text: "Use session storage to track selected items and filter them server-side." },
      ],
      correct: "B",
      explanation: "Include selection history in context and instruct exclusion of already-selected items. Deleting history (A) loses context. Post-purchase accessories (C) reduces sales opportunities. Server-side filtering (D) doesn't address agent behavior.",
    },
    {
      text: "You need your shopping agent to output product recommendations as structured JSON that can be rendered as rich product cards with images, prices, and \"Add to Cart\" buttons. What's the correct CLI invocation?",
      domain: "D3",
      scenario: scenario2Exam3,
      options: [
        { letter: "A", text: "`claude -p \"Recommend products\" --json`" },
        { letter: "B", text: "`claude -p \"Recommend products\" --output-format json --json-schema '{\"type\":\"object\",\"properties\":{\"recommendations\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"product_id\":{\"type\":\"string\"},\"name\":{\"type\":\"string\"},\"price\":{\"type\":\"number\"},\"image_url\":{\"type\":\"string\"}}}}}}'`" },
        { letter: "C", text: "`claude \"Recommend products\" --output-format json`" },
        { letter: "D", text: "`claude -p \"Recommend products\" | jq '.recommendations'`" },
      ],
      correct: "B",
      explanation: "`claude -p \"...\" --output-format json --json-schema '{...}'` is the correct CLI invocation. Other flag combinations (A, C, D) are incorrect.",
    },
    {
      text: "Your agent recommends products based on customer preferences, but the recommendations feel generic (\"popular items\") rather than personalized. What improves quality?",
      domain: "D3",
      scenario: scenario2Exam3,
      options: [
        { letter: "A", text: "Add \"Be more personalized\" to the prompt." },
        { letter: "B", text: "Document personalization criteria in CLAUDE.md: how to weigh purchase history, browsing behavior, stated preferences, and demographic signals. Provide examples of generic vs. personalized recommendations." },
        { letter: "C", text: "Increase the model's temperature for more creative recommendations." },
        { letter: "D", text: "Use a separate recommendation engine model and have the agent just format the output." },
      ],
      correct: "B",
      explanation: "Document personalization criteria in CLAUDE.md with examples of generic vs. personalized recommendations. Vague instructions (A) don't help. Temperature (C) doesn't improve quality. External engine (D) removes agent capability.",
    },
    {
      text: "Your shopping agent uses a `CLAUDE.md` with general product recommendation guidelines. But a specific category `electronics/premium-audio/` has different rules (requires age verification for certain products, special shipping restrictions). How should you configure this?",
      domain: "D3",
      scenario: scenario2Exam3,
      options: [
        { letter: "A", text: "Add an exception note to the root CLAUDE.md: \"In electronics/premium-audio/, age verification is required.\"" },
        { letter: "B", text: "Create `.claude/rules/premium-audio.md` with `paths: [\"electronics/premium-audio/**/*\"]` containing category-specific rules, or create `electronics/premium-audio/CLAUDE.md` with local standards." },
        { letter: "C", text: "Instruct the agent to always ask about age verification for electronics." },
        { letter: "D", text: "Exclude the `electronics/premium-audio/` category from AI-assisted shopping entirely." },
      ],
      correct: "B",
      explanation: "Path-specific rules in `.claude/rules/` or directory-level CLAUDE.md for category-specific requirements. Root exceptions (A) become messy. Always asking (C) creates friction. Excluding categories (D) loses business value.",
    },
    {
      text: "Your agent recommends products and then reviews its own recommendations for quality. It marks all recommendations as appropriate. An independent review reveals 4 of 15 recommendations don't match stated customer preferences. Why?",
      domain: "D3",
      scenario: scenario2Exam3,
      options: [
        { letter: "A", text: "The model needs explicit instructions to be self-critical." },
        { letter: "B", text: "The model retains reasoning context from the initial recommendation, biasing it toward confirming its own decisions. Use an independent Claude instance (separate session) for recommendation validation." },
        { letter: "C", text: "The model's temperature should be higher for the self-review pass." },
        { letter: "D", text: "The original recommendation prompt is too lenient, so the self-review inherits the same leniency." },
      ],
      correct: "B",
      explanation: "Self-review bias \u2014 the model retains reasoning context. Use an independent instance. Instructions (A) don't overcome retained context bias. Temperature (C) and prompt leniency (D) aren't the root cause.",
    },
    {
      text: "Your agent prompt includes: \"When unsure about product suitability, mention your uncertainty to the customer.\" This results in customers losing confidence as the agent frequently expresses doubt. What's the better approach?",
      domain: "D4",
      scenario: scenario2Exam3,
      options: [
        { letter: "A", text: "Add \"Never express uncertainty\" to the prompt." },
        { letter: "B", text: "Replace uncertainty-based communication with confident recommendations based on explicit matching criteria. If confidence is genuinely low (insufficient customer info), ask clarifying questions instead of expressing doubt." },
        { letter: "C", text: "Add a confidence score field and only show recommendations above 0.8 confidence." },
        { letter: "D", text: "Have the agent run a second pass to verify its recommendations before showing them." },
      ],
      correct: "B",
      explanation: "Replace uncertainty communication with confident recommendations based on explicit criteria. If confidence is low, ask clarifying questions instead of expressing doubt. \"Never express uncertainty\" (A) is too absolute. Confidence scores (C) and second passes (D) add complexity.",
    },
    {
      text: "Your shopping pipeline needs to run the agent non-interactively for batch product catalog updates. Which statement about `-p` is correct?",
      domain: "D3",
      scenario: scenario2Exam3,
      options: [
        { letter: "A", text: "`-p` reads input from a file instead of stdin." },
        { letter: "B", text: "`-p` (or `--print`) runs Claude Code in non-interactive mode: it processes the prompt, outputs the result to stdout, and exits without waiting for user input." },
        { letter: "C", text: "`-p` enables parallel processing of multiple product updates." },
        { letter: "D", text: "`-p` formats the output for printing to physical receipts." },
      ],
      correct: "B",
      explanation: "`-p` / `--print` = non-interactive mode. Processes prompt, outputs to stdout, exits. Other descriptions (A, C, D) are incorrect.",
    },
    {
      text: "You need the agent to both recommend products AND validate that recommendations comply with inventory and pricing rules. A colleague suggests using a single session for both to \"share context.\" What's the issue?",
      domain: "D3",
      scenario: scenario2Exam3,
      options: [
        { letter: "A", text: "A single session can't run two different prompts." },
        { letter: "B", text: "There's no issue \u2014 shared context improves both tasks." },
        { letter: "C", text: "Using the same session for recommendation and validation introduces self-review bias. Use separate, independent sessions for generation and validation." },
        { letter: "D", text: "The combined context might exceed the model's token limit." },
      ],
      correct: "C",
      explanation: "Self-review bias affects both recommendation and validation in the same session. Use separate, independent sessions. Context sharing (B) is the problem, not a benefit. Token limits (D) aren't the primary concern.",
    },
    {
      text: "Your agent analyzes a large product catalog file (3,000 lines) and recommends items from the first 500 lines and last 500 lines, but rarely from the middle section. What explains this pattern?",
      domain: "D5",
      scenario: scenario2Exam3,
      options: [
        { letter: "A", text: "The model's random seed varies between inference calls." },
        { letter: "B", text: "The model's attention is non-uniform across long inputs \u2014 the \"lost-in-the-middle\" effect. Content near the middle gets less attention. Structure searches to ensure coverage across all catalog sections." },
        { letter: "C", text: "The model's `max_tokens` ended before it could analyze the middle section." },
        { letter: "D", text: "The model only processes the first and last portions of files exceeding a certain length." },
      ],
      correct: "B",
      explanation: "Lost-in-the-middle effect: content near the middle of long inputs gets less attention. Structure searches to ensure coverage across all catalog sections. Random seed (A), max_tokens (C), and length limits (D) aren't the mechanism.",
    },
    {
      text: "Your recommendation prompt includes 10 few-shot examples showing good product matches. Adding 5 more examples showing \"near-miss\" products (why they don't match customer criteria) reduced inappropriate recommendations by 35%. Why were these \"non-match\" examples so effective?",
      domain: "D4",
      scenario: scenario2Exam3,
      options: [
        { letter: "A", text: "More examples always improve accuracy by giving the model more training data." },
        { letter: "B", text: "Few-shot examples showing non-matches help the model distinguish suitable from unsuitable products, enabling generalization to new products rather than matching only pre-specified patterns." },
        { letter: "C", text: "The non-match examples increased the model's context window, giving it more room for analysis." },
        { letter: "D", text: "The examples reduced the model's temperature, making it more conservative." },
      ],
      correct: "B",
      explanation: "Few-shot examples showing non-matches help the model distinguish suitable from unsuitable products, enabling generalization. It's not about data volume (A), context size (C), or temperature (D).",
    },
    // Scenario 3: Healthcare Patient Intake Assistant (Q31-Q45)
    {
      text: "Your agent loop appends each tool result to conversation messages and sends them back to Claude for the next iteration. A colleague suggests optimizing by only sending the latest tool result. What's wrong with this?",
      domain: "D1",
      scenario: scenario3Exam3,
      options: [
        { letter: "A", text: "Nothing \u2014 sending only the latest result reduces token costs." },
        { letter: "B", text: "The full conversation history must be sent in subsequent API requests so Claude can reason about accumulated context. Without prior results, the model loses track of what's been collected and may repeat questions." },
        { letter: "C", text: "Only the system prompt and latest result are needed \u2014 the model's internal memory handles the rest." },
        { letter: "D", text: "You can omit tool results but must keep assistant messages." },
      ],
      correct: "B",
      explanation: "Full conversation history must be sent so Claude reasons about accumulated context. Without prior results, the model repeats investigations. This is how the Messages API works \u2014 it's stateless.",
    },
    {
      text: "Your agent correctly collects patient symptoms and books an appointment. But when the patient adds \"also, can you check if my insurance covers this?\" as a follow-up, the agent asks for all patient information again instead of using already-collected data. What's the issue?",
      domain: "D1",
      scenario: scenario3Exam3,
      options: [
        { letter: "A", text: "The agent's system prompt doesn't instruct it to maintain session state across follow-up questions." },
        { letter: "B", text: "The conversation history includes the collected data, but the prompt doesn't guide the agent to recognize that prior information applies to follow-up questions. Add instructions for maintaining collected state within a session." },
        { letter: "C", text: "Each new patient question should trigger re-collection for accuracy purposes." },
        { letter: "D", text: "The insurance verification tool cache has expired between the two requests." },
      ],
      correct: "B",
      explanation: "The conversation history contains the collected data, but the agent needs guidance to recognize that prior information applies to follow-ups. Add session state management instructions. Re-collection (C) is unnecessary friction.",
    },
    {
      text: "Your coordinator agent handles complex cases by delegating insurance questions to an insurance subagent and scheduling to a scheduling subagent. The insurance subagent encounters a transient payer system error. It retries 3 times, then returns: `{\"status\": \"error\", \"message\": \"Service unavailable\"}`. The coordinator tells the patient: \"I can't verify your insurance.\" What should the subagent return instead?",
      domain: "D2",
      scenario: scenario3Exam3,
      options: [
        { letter: "A", text: "The raw error log with stack trace for debugging." },
        { letter: "B", text: "Structured error context: `{\"status\": \"partial_failure\", \"errorCategory\": \"transient\", \"attempted\": \"verify insurance for patient #12345\", \"retries\": 3, \"partial_results\": [\"insurance carrier identified: BlueCross\"], \"alternatives\": [\"retry in 10 minutes\", \"collect insurance card photo for manual verification\"]}`." },
        { letter: "C", text: "A generic message: `{\"status\": \"error\", \"isRetryable\": true}`." },
        { letter: "D", text: "The subagent should keep retrying indefinitely until the payer system becomes available." },
      ],
      correct: "B",
      explanation: "Structured error context with category, partial results, retries attempted, and alternatives. Generic errors (C) prevent intelligent recovery. Stack traces (A) aren't useful for the coordinator. Infinite retries (D) cause hangs.",
    },
    {
      text: "A patient provides symptom information. The `collect_symptoms` tool returns 50+ fields including internal coding, provider notes, and audit trails. This accumulates across multiple symptom collections, filling the context. What's the fix?",
      domain: "D5",
      scenario: scenario3Exam3,
      options: [
        { letter: "A", text: "Increase the model's max context window." },
        { letter: "B", text: "Implement a `PostToolUse` hook that trims `collect_symptoms` results to only patient-relevant fields: symptom description, severity, duration, affecting body systems." },
        { letter: "C", text: "Instruct the model to ignore irrelevant fields in the prompt." },
        { letter: "D", text: "Store full results in a database and give the model only a reference ID." },
      ],
      correct: "B",
      explanation: "`PostToolUse` hook trims results to relevant fields. 50+ fields per collection rapidly fills context. Larger context (A) doesn't fix the waste. Prompt instructions (C) are probabilistic. Database references (D) add complexity.",
    },
    {
      text: "The agent tells a patient: \"Your appointment is scheduled for 2:30 PM on March 20th.\" But the actual booking was for 3:30 PM. The agent transposed the time from a previous appointment lookup earlier in the session. What pattern prevents this?",
      domain: "D5",
      scenario: scenario3Exam3,
      options: [
        { letter: "A", text: "Double-check all times using a calendar tool before stating them." },
        { letter: "B", text: "Extract appointment facts (times, dates, provider names, locations) into a persistent \"visit details\" block included in every prompt, separate from summarizable conversation history." },
        { letter: "C", text: "Use lower temperature to reduce hallucination." },
        { letter: "D", text: "Always re-call `book_appointment` immediately before stating any appointment details." },
      ],
      correct: "B",
      explanation: "Persistent visit details block prevents detail transposition. Exact times, dates, and provider info in a structured block included in every prompt, surviving any compression. Calendar tools (A) and re-bookings (D) are reactive.",
    },
    {
      text: "Your intake agent needs to handle: \"I need to schedule a follow-up for my knee surgery, and I also have questions about my lab results from last week.\" The system prompt says: \"Handle one issue at a time.\" But the patient clearly has two distinct needs. What's the right behavior?",
      domain: "D1",
      scenario: scenario3Exam3,
      options: [
        { letter: "A", text: "Follow the system prompt exactly \u2014 address only scheduling and ask the patient to submit lab questions separately." },
        { letter: "B", text: "Decompose the request into two distinct items. Address them sequentially (scheduling first, then lab results) and synthesize a unified response confirming both are being handled." },
        { letter: "C", text: "Decompose into two items and investigate both in parallel since they're independent." },
        { letter: "D", text: "Escalate because multi-issue requests exceed the agent's scope." },
      ],
      correct: "B",
      explanation: "Decompose multi-issue requests into distinct items. Address sequentially and synthesize a unified response. Refusing the second issue (A) is poor service. Parallel investigation (C) is valid but sequential is better for independent items. Escalation (D) fails the satisfaction target.",
    },
    {
      text: "Your agent uses hooks to enforce that only licensed clinicians can book certain appointment types. A patient requests a \"specialist consultation\" which requires clinician approval. The agent attempts to book it directly three times \u2014 each attempt is blocked by the hook. Is this a problem?",
      domain: "D1",
      scenario: scenario3Exam3,
      options: [
        { letter: "A", text: "No \u2014 the agent is correctly attempting to fulfill the patient's request." },
        { letter: "B", text: "Yes \u2014 after the first hook rejection, the agent should recognize the restriction and either escalate to a clinician or explain the approval requirement to the patient. Repeated failed attempts waste resources and frustrate patients." },
        { letter: "C", text: "No \u2014 the hook should allow the booking after 3 attempts as a fallback." },
        { letter: "D", text: "Yes \u2014 the agent should bypass the hook for patient-requested appointments." },
      ],
      correct: "B",
      explanation: "After the first hook rejection, the agent should recognize the restriction and either escalate or explain the requirement. Repeated failed attempts waste resources and frustrate patients.",
    },
    {
      text: "A patient says: \"I'm worried this might be serious, but I trust you can help me figure out what to do.\" The agent should:",
      domain: "D5",
      scenario: scenario3Exam3,
      options: [
        { letter: "A", text: "Escalate immediately because the patient expressed worry about severity." },
        { letter: "B", text: "Acknowledge the concern, collect appropriate symptom information per triage protocol, and route to appropriate care level \u2014 the patient indicated they want the AI to help with initial assessment." },
        { letter: "C", text: "Use sentiment analysis to determine whether the worry level warrants immediate escalation." },
        { letter: "D", text: "Transfer to a human agent because any expression of worry suggests the AI can't handle the situation." },
      ],
      correct: "B",
      explanation: "The patient expressed worry BUT indicated willingness to let the agent help. Acknowledge concern, collect symptom information per triage protocol, route appropriately. Sentiment escalation (A, C, D) is unreliable \u2014 the patient's words override sentiment signals.",
    },
    {
      text: "Which `tool_choice` configuration should you use when the agent's first action in every intake conversation MUST be to collect patient ID for record lookup?",
      domain: "D2",
      scenario: scenario3Exam3,
      options: [
        { letter: "A", text: "`tool_choice: \"auto\"` \u2014 let the model decide based on the patient's message." },
        { letter: "B", text: "`tool_choice: \"any\"` \u2014 force the model to call a tool, but let it choose which one." },
        { letter: "C", text: "`tool_choice: {\"type\": \"tool\", \"name\": \"lookup_patient_record\"}` \u2014 force the model to call the specific lookup tool." },
        { letter: "D", text: "`tool_choice: \"required\"` \u2014 a special mode that requires a specific tool sequence." },
      ],
      correct: "C",
      explanation: "Forced tool selection (`{\"type\": \"tool\", \"name\": \"lookup_patient_record\"}`) guarantees a specific tool is called. `\"auto\"` (A) lets the model skip it. `\"any\"` (B) lets the model choose any tool. `\"required\"` (D) doesn't exist.",
    },
    {
      text: "Your `verify_insurance` tool returns different errors for different failure modes, but all use: `{\"success\": false, \"error\": \"Verification failed\"}`. This prevents distinguishing between invalid policy number (needs correction), coverage expired (needs renewal discussion), and system timeout (needs retry). How should the tool be improved?",
      domain: "D2",
      scenario: scenario3Exam3,
      options: [
        { letter: "A", text: "Add error codes (500, 400, 403) matching HTTP conventions." },
        { letter: "B", text: "Return structured error metadata: `{\"isError\": true, \"errorCategory\": \"validation|coverage|transient\", \"isRetryable\": true|false, \"message\": \"...\", \"patient_explanation\": \"...\"}`." },
        { letter: "C", text: "Return different error messages for each failure type (but keep the same `success: false` format)." },
        { letter: "D", text: "Log errors server-side and have the agent check an error log endpoint." },
      ],
      correct: "B",
      explanation: "Structured error metadata with `errorCategory`, `isRetryable`, and `patient_explanation` enables appropriate agent responses. HTTP codes (A) lack context. Same-format errors (C) don't fix distinguishability. Error logs (D) are async and slow.",
    },
    {
      text: "After deploying the agent, metrics show it escalates 55% of cases \u2014 far above the 25% target. Analysis reveals it escalates all symptom triage cases regardless of severity, even routine matters like prescription refills. What's the most effective fix?",
      domain: "D5",
      scenario: scenario3Exam3,
      options: [
        { letter: "A", text: "Remove the `escalate_to_clinician` tool to force the agent to handle everything." },
        { letter: "B", text: "Add explicit escalation criteria with few-shot examples to the system prompt: when to escalate (red flag symptoms, patient insistence, policy gaps) vs. handle autonomously (routine refills, appointment scheduling, insurance questions)." },
        { letter: "C", text: "Implement a separate routing model that pre-classifies cases as \"agent-handleable\" or \"needs clinician.\"" },
        { letter: "D", text: "Have the agent self-report a confidence score and only escalate below a threshold." },
      ],
      correct: "B",
      explanation: "Explicit escalation criteria with few-shot examples fix over-escalation. Removing the tool (A) removes a safety valve. Routing models (C) add complexity. Self-confidence (D) is poorly calibrated.",
    },
    {
      text: "Your agent receives tool results accumulating across a 25-turn intake conversation. By turn 18, the context window is 85% full with verbose insurance and symptom data. The agent's responses become unreliable. What's the best mitigation?",
      domain: "D5",
      scenario: scenario3Exam3,
      options: [
        { letter: "A", text: "Set a hard limit of 12 turns per conversation." },
        { letter: "B", text: "Use `/compact` at turn 12, but first extract critical visit facts (patient ID, appointment time, insurance status, chief complaint) into a persistent block that survives compression." },
        { letter: "C", text: "Discard tool results older than 6 turns." },
        { letter: "D", text: "Route long conversations to human staff after 15 turns." },
      ],
      correct: "B",
      explanation: "Extract critical facts before `/compact` so they survive compression. Hard turn limits (A) and discarding results (C) are too aggressive. Routing to humans (D) fails the satisfaction target.",
    },
    {
      text: "A patient provides their name as \"Jordan Smith\" and date of birth as \"1985-06-15.\" The `lookup_patient_record` tool returns two matching records with identical name and DOB. How should the agent proceed?",
      domain: "D5",
      scenario: scenario3Exam3,
      options: [
        { letter: "A", text: "Select the first record because it appears first in the results." },
        { letter: "B", text: "Select the one with the most recent visit history." },
        { letter: "C", text: "Ask the patient for an additional identifier \u2014 in this case, their phone number or medical record number \u2014 to disambiguate between the two accounts." },
        { letter: "D", text: "Merge the two records and proceed with the combined information." },
      ],
      correct: "C",
      explanation: "Both name and DOB match two accounts \u2014 need additional identifiers (phone or MRN). First-result (A) and recency (B) are heuristics that may be wrong. Merging records (D) is a data integrity violation.",
    },
    {
      text: "A patient asks: \"Can you prescribe medication for my migraine during this intake call?\" Your policy states: \"Prescriptions require a licensed clinician consultation. Intake agents can schedule these consultations but cannot prescribe.\" What should the agent do?",
      domain: "D5",
      scenario: scenario3Exam3,
      options: [
        { letter: "A", text: "Deny the request, citing the policy: \"Prescriptions require a clinician consultation. I can schedule that for you.\"" },
        { letter: "B", text: "Attempt to process the prescription since the patient's request seems reasonable and urgent." },
        { letter: "C", text: "Escalate to a clinician because the policy is ambiguous about prescription authority." },
        { letter: "D", text: "Ask the patient for their medication history to evaluate whether a prescription is appropriate." },
      ],
      correct: "A",
      explanation: "The policy explicitly states prescriptions require clinician consultation. This is NOT a policy gap \u2014 the policy directly addresses the request. Denial with offer to schedule is correct. Escalation (C) is for gaps, not clearly defined policies.",
    },
    {
      text: "Your coordinator agent needs to pass collected patient information to a scheduling subagent. Which approach correctly preserves the information?",
      domain: "D1",
      scenario: scenario3Exam3,
      options: [
        { letter: "A", text: "Tell the scheduling subagent: \"The patient has been verified. Schedule their appointment.\"" },
        { letter: "B", text: "Include the complete verified patient data in the scheduling subagent's Task prompt: `\"Verified patient: ID P-5678, name Jordan Smith, DOB 1985-06-15, insurance verified. Schedule follow-up for Dr. Chen, preferred times: weekday afternoons.\"`" },
        { letter: "C", text: "Store the patient data in a shared memory object that both agents can access." },
        { letter: "D", text: "Have the scheduling subagent re-call `lookup_patient_record` to verify independently." },
      ],
      correct: "B",
      explanation: "Subagents have isolated context. Pass complete verified data in the Task prompt. Vague instructions (A) leave the subagent without critical data. Shared memory (C) doesn't exist in the SDK pattern. Re-verification (D) wastes a tool call.",
    },
    // Scenario 4: Financial Compliance Monitoring System (Q46-Q60)
    {
      text: "Your extraction schema marks `filing_date` as `required` with type `\"string\"`. For filings that are undated (common in draft submissions), Claude fabricates a plausible date. You also notice Claude invents a `jurisdiction` value when the filing doesn't specify. What single schema design principle fixes both issues?",
      domain: "D4",
      scenario: scenario4Exam3,
      options: [
        { letter: "A", text: "Add validation rules that check extracted dates against a reasonable range." },
        { letter: "B", text: "Make fields that may be absent from source documents optional with nullable types (`[\"string\", \"null\"]`) and remove them from `required`. This prevents the model from fabricating values to satisfy schema constraints." },
        { letter: "C", text: "Add \"Do not hallucinate\" to the extraction prompt." },
        { letter: "D", text: "Implement a post-extraction verification step that checks all dates against the document." },
      ],
      correct: "B",
      explanation: "Nullable optional fields prevent fabrication for both `filing_date` and `jurisdiction`. When information is absent, Claude returns `null`. Validation (A) catches but doesn't prevent. Prompt instructions (C) are probabilistic. Post-verification (D) is reactive.",
    },
    {
      text: "Your compliance extraction tool uses `tool_choice: \"auto\"`. The model processes 75% of documents correctly but returns conversational text for 25% without calling the extraction tool. Changing to `tool_choice: \"any\"` resolves this. However, you now have two extraction tools (`extract_transaction_data` and `extract_filing_data`) and the model sometimes picks the wrong one. What's the best overall configuration?",
      domain: "D4",
      scenario: scenario4Exam3,
      options: [
        { letter: "A", text: "Keep `tool_choice: \"any\"` and improve both tool descriptions to make them clearly distinguishable." },
        { letter: "B", text: "Use `tool_choice: \"auto\"` with stronger prompt instructions." },
        { letter: "C", text: "Create a single combined `extract_compliance_data` tool that handles both document types." },
        { letter: "D", text: "Use forced tool selection to always call `extract_transaction_data` first." },
      ],
      correct: "A",
      explanation: "`tool_choice: \"any\"` guarantees a tool call. The wrong-tool problem is solved by improving descriptions. Better descriptions are the primary mechanism for tool selection. Combined tool (C) loses type-specific extraction logic. Forced selection (D) doesn't handle varying document types.",
    },
    {
      text: "Your extraction pipeline processes transaction records. For the field `transaction_type`, some documents contain \"wire transfer,\" some contain \"WT,\" and some don't specify the type at all. How should you design the schema?",
      domain: "D4",
      scenario: scenario4Exam3,
      options: [
        { letter: "A", text: "`\"transaction_type\": {\"type\": \"string\"}` \u2014 accept any text and normalize later." },
        { letter: "B", text: "`\"transaction_type\": {\"type\": [\"string\", \"null\"]}` (nullable) with format normalization rules in the prompt: \"Normalize to standard codes (WT=wire transfer, ACH=automated clearing house). If not specified, return null.\"" },
        { letter: "C", text: "`\"transaction_type_code\": {\"type\": \"string\"}, \"transaction_type_description\": {\"type\": \"string\"}` \u2014 separate fields for code and description." },
        { letter: "D", text: "`\"transaction_type\": {\"type\": \"string\", \"enum\": [\"wire_transfer\", \"ach\", \"check\", \"other\"]}` \u2014 categorize instead of extracting raw values." },
      ],
      correct: "B",
      explanation: "Nullable field + format normalization rules handles all three cases: structured values, abbreviations, and absence (null). Plain string (A) pushes normalization downstream. Separate fields (C) add complexity. Enum (D) can't handle unspecified types.",
    },
    {
      text: "After extraction, Pydantic validation catches: `transaction_amount` is `\"$2.5M\"` but the schema expects a numeric field. You retry, providing the original document, the failed extraction, and the specific error. Claude corrects to `2500000.00`. After adding format normalization rules to the prompt (\"Convert currency descriptions to numeric: '$2.5M' \u2192 2500000\"), the same error stops appearing. What does this demonstrate?",
      domain: "D4",
      scenario: scenario4Exam3,
      options: [
        { letter: "A", text: "Retries always fix format errors eventually." },
        { letter: "B", text: "The most effective approach combines validation-retry for immediate correction AND prompt refinement to prevent the error category from recurring, reducing iterative resubmission costs." },
        { letter: "C", text: "Format normalization rules alone are sufficient; retries are unnecessary." },
        { letter: "D", text: "Pydantic validation should be replaced with Claude-based validation." },
      ],
      correct: "B",
      explanation: "Validation-retry for immediate correction + prompt refinement to prevent the error category from recurring. Both mechanisms together optimize quality and cost. Retries alone (A) fix individual cases but not the pattern. Rules alone (C) don't handle edge cases.",
    },
    {
      text: "Your extraction system processes both formal regulatory filings (structured, consistent formatting) and informal internal memos (emails, handwritten notes, varied layouts). Overall accuracy is 96%. Stakeholders are satisfied. However, your audit team reports frequent errors in informal memos causing compliance gaps. What happened?",
      domain: "D5",
      scenario: scenario4Exam3,
      options: [
        { letter: "A", text: "The model needs additional training on informal documents." },
        { letter: "B", text: "The 96% aggregate accuracy masks poor performance on informal memos. You need stratified accuracy analysis by document type \u2014 formal filings may be 99%+ while informal memos may be 75%." },
        { letter: "C", text: "Informal memos shouldn't be processed by the extraction system." },
        { letter: "D", text: "The downstream compliance system needs better error handling for malformed data." },
      ],
      correct: "B",
      explanation: "Aggregate accuracy masks per-type performance. 96% overall might be 99% formal + 75% informal. Stratified analysis by document type reveals hidden failures. Additional training (A) isn't applicable. Excluding documents (C) loses business value.",
    },
    {
      text: "Your self-correction pipeline extracts data, validates it, and retries on failure. For a loan agreement, the extraction includes `interest_rate: 5.5` but the agreement states \"5.5% for the first 24 months, adjusting to prime + 2% thereafter.\" What additional schema field would capture this complexity?",
      domain: "D4",
      scenario: scenario4Exam3,
      options: [
        { letter: "A", text: "`\"rate_notes\": {\"type\": \"string\"}` for free-text context." },
        { letter: "B", text: "Design a structured rate schedule: `\"rate_schedule\": {\"type\": \"array\", \"items\": {\"type\": \"object\", \"properties\": {\"period\": {\"type\": \"string\"}, \"rate\": {\"type\": \"number\"}, \"rate_type\": {\"type\": \"string\"}, \"start_date\": {\"type\": [\"string\", \"null\"]}, \"end_date\": {\"type\": [\"string\", \"null\"]}}}}`." },
        { letter: "C", text: "Add `\"rate_is_variable\": {\"type\": \"boolean\"}`." },
        { letter: "D", text: "Add `\"rate_range\": {\"type\": \"object\", \"properties\": {\"min\": {\"type\": \"number\"}, \"max\": {\"type\": \"number\"}}}`." },
      ],
      correct: "B",
      explanation: "A structured rate schedule array captures multi-period variable rates. Single field (existing) loses the adjustment terms. Free-text notes (A) aren't structured. Boolean flag (C) indicates variability but doesn't capture amounts. Range (D) loses temporal information.",
    },
    {
      text: "Your batch job processes 2,000 compliance documents overnight using the Batches API. 1,900 succeed. Of the 100 failures, 60 are `context_limit_exceeded` (very long filings), 30 are extraction validation failures, and 10 are transient API errors. What's the correct recovery strategy?",
      domain: "D4",
      scenario: scenario4Exam3,
      options: [
        { letter: "A", text: "Resubmit all 2,000 documents with a more concise prompt." },
        { letter: "B", text: "Handle each failure category separately: chunk the 60 oversized documents, refine the prompt for the 30 validation failures (test on a sample first), and simply resubmit the 10 transient errors. Identify all by `custom_id`." },
        { letter: "C", text: "Resubmit only the 100 failures with the same prompt and hope for different results." },
        { letter: "D", text: "Switch all 100 failures to synchronous processing." },
      ],
      correct: "B",
      explanation: "Handle each failure category differently: chunk oversized, refine prompt for validation errors (test on sample), resubmit transient errors. Use `custom_id` to identify each. Resubmitting all (A, C) is wasteful. Synchronous (D) doesn't fix the underlying issues.",
    },
    {
      text: "Your extraction system has been running for 4 months with 97% accuracy on high-confidence extractions routed to auto-approval. Your compliance team suggests stopping human review of high-confidence extractions entirely. What should you do first?",
      domain: "D5",
      scenario: scenario4Exam3,
      options: [
        { letter: "A", text: "Agree \u2014 97% over 4 months proves the system is reliable." },
        { letter: "B", text: "Implement stratified random sampling of high-confidence extractions to continuously measure error rates and detect novel error patterns. Don't eliminate human review; reduce it while maintaining ongoing validation." },
        { letter: "C", text: "Add a second Claude instance to review high-confidence extractions instead of humans." },
        { letter: "D", text: "Increase the confidence threshold to 99.5% before auto-approving." },
      ],
      correct: "B",
      explanation: "Stratified random sampling for ongoing validation. Never eliminate human review entirely \u2014 reduce it while maintaining ongoing measurement. 4 months of 97% doesn't guarantee future performance. Novel patterns could emerge.",
    },
    {
      text: "A filing extraction produces: `regulatory_body: \"SEC\"` but a parallel extraction from an amendment to the same filing says: `regulatory_body: \"FINRA\"`. The amendment supersedes the original filing. How should your system handle this?",
      domain: "D5",
      scenario: scenario4Exam3,
      options: [
        { letter: "A", text: "Use the original filing's value since it's the primary document." },
        { letter: "B", text: "Use the amendment's value since it was processed more recently." },
        { letter: "C", text: "Preserve both values with source attribution, annotate the conflict, and include document dates so a reviewer can determine which takes precedence. Flag the extraction as needing human verification." },
        { letter: "D", text: "Concatenate: `\"regulatory_body\": \"SEC; FINRA\"`." },
      ],
      correct: "C",
      explanation: "Preserve both values with source attribution and dates. The amendment may supersede, but that's a compliance determination \u2014 the extraction system should preserve both and flag the conflict. Picking either (A, B) makes assumptions. Concatenation (D) is meaningless.",
    },
    {
      text: "Your extraction prompt produces clean output for standard filings but struggles with documents that have appendices referencing key terms. For example, a filing body says \"per attached Exhibit A\" but Exhibit A defines specific reporting requirements. The extraction misses the appendix data. What prompting technique fixes this?",
      domain: "D4",
      scenario: scenario4Exam3,
      options: [
        { letter: "A", text: "Add \"Check appendices\" to the system prompt." },
        { letter: "B", text: "Add 2-3 few-shot examples showing correct extraction from documents where critical data appears in appendices, exhibits, and footnotes \u2014 demonstrating that the model should search the entire document structure." },
        { letter: "C", text: "Pre-process the document to inline all appendices into the body text." },
        { letter: "D", text: "Create a separate \"appendix extraction\" pass." },
      ],
      correct: "B",
      explanation: "Few-shot examples showing extraction from appendices, exhibits, and footnotes. Demonstrates that critical data can appear anywhere in document structure. Simple instructions (A) are less effective than examples. Pre-processing (C) and separate passes (D) add complexity.",
    },
    {
      text: "You process both transaction records and regulatory filings. Your single extraction prompt handles both, but frequently places filing data into transaction fields and vice versa. Claude generates valid JSON that passes schema validation but with incorrect field mappings. What type of error is this?",
      domain: "D4",
      scenario: scenario4Exam3,
      options: [
        { letter: "A", text: "Schema syntax error \u2014 fixable by making the schema more strict." },
        { letter: "B", text: "Semantic validation error \u2014 `tool_use` with schemas eliminates syntax errors but NOT semantic errors like values in wrong fields. Implement a separate validation step for cross-field consistency." },
        { letter: "C", text: "Prompt engineering error \u2014 the prompt needs more explicit field definitions." },
        { letter: "D", text: "Both B and C \u2014 fix the semantic validation AND improve the prompt." },
      ],
      correct: "D",
      explanation: "Both semantic validation (cross-field consistency checks) AND better prompting (explicit field definitions with examples) address this. Schema syntax is correct \u2014 the error is semantic (wrong fields). Either B or C alone is partial.",
    },
    {
      text: "Your team processes 8,000 documents weekly. A pre-deployment compliance check blocks releases until regulatory documents are extracted and validated. A monthly compliance audit extracts data from historical documents for regulatory review. Your manager proposes using the Batch API for both workflows. What's correct?",
      domain: "D4",
      scenario: scenario4Exam3,
      options: [
        { letter: "A", text: "Use Batch API for both \u2014 the 50% savings applies to both workflows." },
        { letter: "B", text: "Use synchronous API for the pre-deployment check (blocking releases) and Batch API for the monthly audit (latency-tolerant, cost-sensitive)." },
        { letter: "C", text: "Use Batch API for the pre-deployment check with aggressive polling for fast results." },
        { letter: "D", text: "Use synchronous API for both to guarantee consistent processing." },
      ],
      correct: "B",
      explanation: "Blocking pre-deployment = synchronous (releases wait). Monthly audit = batch (latency-tolerant, cost-sensitive). Batch for blocking (A, C) risks 24h delays for releases. Synchronous for everything (D) wastes 50% on the audit.",
    },
    {
      text: "Your extraction of `total_transaction_value` works by extracting both the stated total and independently summing all line items. In 7% of documents, the stated total and calculated sum differ. Your system currently discards these documents. What's a better approach?",
      domain: "D4",
      scenario: scenario4Exam3,
      options: [
        { letter: "A", text: "Always use the stated total \u2014 it's what the original document says." },
        { letter: "B", text: "Always use the calculated sum \u2014 it's mathematically correct." },
        { letter: "C", text: "Design the schema to extract both `stated_total` and `calculated_total`, add `conflict_detected: boolean`, and route conflicts to human review with both values and the discrepancy amount." },
        { letter: "D", text: "Average the two values." },
      ],
      correct: "C",
      explanation: "Extract both values, flag conflict, route to human review. Always using one value (A, B) risks errors. Averaging (D) is nonsensical for financial data. Preserving both with a conflict flag enables informed human decisions.",
    },
    {
      text: "Your extraction system needs to output field-level confidence scores for routing to human review. After deployment, you find that extractions marked \"0.95 confidence\" are wrong 25% of the time. What's needed?",
      domain: "D5",
      scenario: scenario4Exam3,
      options: [
        { letter: "A", text: "Lower the auto-approval threshold to 0.99." },
        { letter: "B", text: "Calibrate confidence thresholds using a labeled validation set. Out-of-the-box model confidence is not well-calibrated; you need to measure actual accuracy at each confidence level and set thresholds based on empirical data." },
        { letter: "C", text: "Replace model confidence with a rule-based confidence system." },
        { letter: "D", text: "Remove confidence scoring and send all extractions to human review." },
      ],
      correct: "B",
      explanation: "Model confidence is not well-calibrated out of the box. Calibrate using labeled validation sets \u2014 measure actual accuracy at each stated confidence level, then set empirically-grounded thresholds. Arbitrary threshold changes (A) don't fix calibration.",
    },
    {
      text: "Your synthesis report combines data from 20 extracted filings into a compliance portfolio summary. Sources are compressed into a paragraph summary during aggregation. A regulator asks \"Where did the $15.3M figure come from?\" and no one can trace it to specific filings. What architectural change prevents this?",
      domain: "D5",
      scenario: scenario4Exam3,
      options: [
        { letter: "A", text: "Include all raw extraction data in the final report." },
        { letter: "B", text: "Require the aggregation step to maintain claim-source mappings: each figure in the summary must be traceable to specific filings with filing IDs, page references, and extraction dates." },
        { letter: "C", text: "Add a disclaimer that figures are approximations." },
        { letter: "D", text: "Store raw extractions in a separate database for manual lookup." },
      ],
      correct: "B",
      explanation: "Claim-source mappings maintain provenance through aggregation. Every figure must be traceable to specific filings. Raw data dumps (A) are unreadable. Disclaimers (C) are evasions. Separate databases (D) require manual lookup.",
    },
  ],
  "4": [
    // Scenario 1: Legal Document Review (Q1-Q15)
    {
      text: "Your legal agent needs to find all contracts containing \"indemnification\" clauses across a repository of 5,000+ legal documents. Which built-in tool is appropriate?",
      domain: "D2",
      scenario: scenario1Exam4,
      options: [
        { letter: "A", text: "Glob \u2014 it searches for file patterns like `**/*.pdf` to find all PDF documents, which can then be filtered for the clause." },
        { letter: "B", text: "Grep \u2014 it searches file contents for patterns, making it the correct tool to find all documents containing \"indemnification\"." },
        { letter: "C", text: "Read \u2014 read each document in the repository and search for the clause." },
        { letter: "D", text: "Bash \u2014 run `find . -name \"*.pdf\"` to locate PDF files containing the clause." },
      ],
      correct: "B",
      explanation: "Grep searches file contents for patterns. Glob searches file names/paths. The question asks to find documents containing a clause \u2014 that's content search = Grep.",
    },
    {
      text: "The agent needs to redact sensitive client names in a contract template. It tries using the Edit tool with anchor text: `Client Name:` but fails because this appears 20+ times in the document. What is the correct fallback?",
      domain: "D2",
      scenario: scenario1Exam4,
      options: [
        { letter: "A", text: "Use Bash to run a `sed` command that replaces all instances at once." },
        { letter: "B", text: "Use Read to load the full document, then use Write to write the modified version back with all redactions applied." },
        { letter: "C", text: "Use Edit with a longer anchor text that includes surrounding unique context for each instance." },
        { letter: "D", text: "Both B and C are valid approaches; try C first for precision, fall back to B if uniqueness can't be achieved." },
      ],
      correct: "D",
      explanation: "When Edit fails due to non-unique anchor text, try a longer unique anchor first (C). If uniqueness can't be achieved, fall back to Read + Write (B). Both are valid approaches.",
    },
    {
      text: "A paralegal asks the agent to understand a complex merger agreement. The agent reads all 85 pages upfront, consuming most of the context window. Subsequent questions about specific clauses get vague, generic answers. What's the better approach?",
      domain: "D2",
      scenario: scenario1Exam4,
      options: [
        { letter: "A", text: "Start by reading all pages but use `/compact` after each question to free up context." },
        { letter: "B", text: "Build understanding incrementally: use Grep to find key sections (definitions, obligations, termination), then Read only those sections as needed." },
        { letter: "C", text: "Ask the paralegal to identify the specific pages that are relevant before analysis begins." },
        { letter: "D", text: "Split the agreement into smaller sections and analyze each in a separate session." },
      ],
      correct: "B",
      explanation: "Incremental investigation: Grep \u2192 find key sections \u2192 Read only those. Reading all 85 pages upfront floods the context. /compact (A) loses details.",
    },
    {
      text: "Your law firm has both a Westlaw MCP server and a custom internal precedent database MCP server. The Westlaw integration is standard; the precedent server is firm-specific. How should you configure them?",
      domain: "D2",
      scenario: scenario1Exam4,
      options: [
        { letter: "A", text: "Both in `.mcp.json` \u2014 project-scoped and version-controlled." },
        { letter: "B", text: "Westlaw in `~/.claude.json` (user-level), precedent database in `.mcp.json` (project-level)." },
        { letter: "C", text: "Use the community Westlaw MCP server configured in `.mcp.json`. Configure the custom precedent server in `.mcp.json` too, since both are firm tools." },
        { letter: "D", text: "Both in `~/.claude.json` to avoid polluting the project repository." },
      ],
      correct: "C",
      explanation: "Use community MCP server for standard integrations. Configure both in project-scoped .mcp.json since both are firm tools. User-level for firm tools prevents sharing.",
    },
    {
      text: "Your legal agent has an agentic loop that processes tool calls. Currently, the loop checks whether the response contains a `TextBlock` to determine if Claude is done. During complex document reviews with interleaved text and tool calls, the agent sometimes stops prematurely. Why?",
      domain: "D1",
      scenario: scenario1Exam4,
      options: [
        { letter: "A", text: "The temperature is too low, causing the model to generate text too early." },
        { letter: "B", text: "Checking for `TextBlock` is an anti-pattern. Claude responses can contain both text AND tool calls simultaneously. The correct signal is `stop_reason == \"end_turn\"`." },
        { letter: "C", text: "The model's `max_tokens` is too low, causing it to end the response before finishing its tool calls." },
        { letter: "D", text: "The system prompt needs to instruct the model to never produce text until all tool calls are complete." },
      ],
      correct: "B",
      explanation: "Checking for TextBlock is an anti-pattern \u2014 responses can contain both text and tool calls. The correct signal is stop_reason == \"end_turn\".",
    },
    {
      text: "Your document review agent has 16 tools: 6 built-in plus 10 MCP tools for case law search, precedent lookup, citation checking, clause libraries, and matter management. Tool selection reliability is poor. How should you restructure?",
      domain: "D1",
      scenario: scenario1Exam4,
      options: [
        { letter: "A", text: "Keep all 16 tools but add detailed descriptions and few-shot examples showing correct tool selection." },
        { letter: "B", text: "Create specialized subagents with scoped tool sets: a research agent (case law, citations), a drafting agent (clause libraries, templates), and a review agent (precedent comparison, risk flags). A coordinator routes tasks appropriately." },
        { letter: "C", text: "Prioritize MCP tools over built-in tools in the system prompt to reduce confusion." },
        { letter: "D", text: "Remove the least-used MCP tools until you have 10 or fewer total." },
      ],
      correct: "B",
      explanation: "16 tools degrades selection reliability. Create specialized subagents with scoped tool sets (4-5 per agent). Better descriptions (A) help but don't solve cognitive load.",
    },
    {
      text: "You want to expose your firm's standard contract clause library (200+ clauses organized by type) to the agent so it can reference standard language without making exploratory tool calls. What MCP concept should you use?",
      domain: "D2",
      scenario: scenario1Exam4,
      options: [
        { letter: "A", text: "Configure 200 individual MCP tools \u2014 one per clause." },
        { letter: "B", text: "Expose the clause library as an MCP resource \u2014 a read-only content catalog that gives the agent visibility into available clauses." },
        { letter: "C", text: "Include all clauses in the CLAUDE.md file." },
        { letter: "D", text: "Create a `list_clauses` MCP tool that the agent calls to discover available clauses." },
      ],
      correct: "B",
      explanation: "MCP resources expose read-only content catalogs (clause libraries) without requiring tool calls. 200 individual tools (A) is impractical.",
    },
    {
      text: "A partner created a personal `/precedent-search` command for finding precedents using their preferred search criteria. An associate wants different search criteria. How should this be managed?",
      domain: "D3",
      scenario: scenario1Exam4,
      options: [
        { letter: "A", text: "Both attorneys put their commands in `.claude/commands/` with different names." },
        { letter: "B", text: "Each attorney creates their personal command in `~/.claude/commands/` \u2014 user-scoped commands that don't affect colleagues." },
        { letter: "C", text: "Create a single configurable command in `.claude/commands/` that accepts parameters for search criteria." },
        { letter: "D", text: "The associate must request the partner to modify the existing command." },
      ],
      correct: "B",
      explanation: "Personal commands go in user-scoped ~/.claude/commands/. Project-scoped (A) would force one attorney's preference on all.",
    },
    {
      text: "Your agent's agentic loop has been running tool calls for a contract review task. The loop condition is:\n```python\nfor i in range(25):\n    response = client.messages.create(...)\n    if response.stop_reason == \"end_turn\":\n        break\n    # ... process tool calls\n```\nWhat's the concern with this implementation?",
      domain: "D1",
      scenario: scenario1Exam4,
      options: [
        { letter: "A", text: "Nothing \u2014 this is the correct pattern with a safety limit." },
        { letter: "B", text: "The iteration cap (`range(25)`) could prematurely terminate legitimate reviews needing 26+ iterations. Use `stop_reason` as primary; if a safety limit is needed, make it generous (50+) and log warnings when hit." },
        { letter: "C", text: "`\"end_turn\"` is the wrong signal. It should check for `\"complete\"`." },
        { letter: "D", text: "The loop should check for tool calls in the content blocks, not the `stop_reason`." },
      ],
      correct: "B",
      explanation: "The range(25) cap could prematurely terminate legitimate reviews needing 26+ iterations. Safety limits should be generous (50+) with warnings.",
    },
    {
      text: "You want to compare two contract negotiation strategies \u2014 one aggressive and one conservative \u2014 from the same document analysis baseline. What feature enables this?",
      domain: "D1",
      scenario: scenario1Exam4,
      options: [
        { letter: "A", text: "Run the agent twice with different system prompts." },
        { letter: "B", text: "Use `fork_session` to create independent branches from the shared analysis baseline, exploring each strategy in its own branch." },
        { letter: "C", text: "Create two separate agents with different `AgentDefinition` configurations." },
        { letter: "D", text: "Use `--resume` to return to the analysis point and try the second approach." },
      ],
      correct: "B",
      explanation: "fork_session creates independent branches from a shared baseline. Running twice (A) lacks shared context. --resume (D) continues linearly.",
    },
    {
      text: "Your coordinator agent spawns a subagent to investigate \"Find all force majeure clauses in the vendor contracts.\" The subagent returns: \"Based on typical contract structures, force majeure clauses are usually in Section 12.\" The subagent didn't actually search. Why?",
      domain: "D1",
      scenario: scenario1Exam4,
      options: [
        { letter: "A", text: "The subagent doesn't have access to the Grep and Read tools needed to search documents." },
        { letter: "B", text: "The subagent inherited the coordinator's context, which doesn't include the contract files." },
        { letter: "C", text: "The subagent's system prompt doesn't instruct it to use tools for investigation." },
        { letter: "D", text: "Both A and C are likely contributing factors. Ensure `allowedTools` includes search tools AND the prompt instructs investigation rather than guessing." },
      ],
      correct: "D",
      explanation: "Two issues: the subagent needs the right tools AND proper instructions. Without search tools in allowedTools, it can't search. Without investigation instructions, it defaults to guessing.",
    },
    {
      text: "An attorney resumes a session from yesterday using `--resume contract-review`. Since yesterday, the counterparty has sent revised contract terms. The agent continues analyzing based on stale information. What's the solution?",
      domain: "D1",
      scenario: scenario1Exam4,
      options: [
        { letter: "A", text: "Always start a new session instead of resuming." },
        { letter: "B", text: "After resuming, inform the agent about the specific sections that changed so it can re-analyze those rather than re-reviewing the entire contract." },
        { letter: "C", text: "Run Bash to compare file versions and pipe the results into the agent context." },
        { letter: "D", text: "Use `/compact` after resuming to force the agent to re-read everything." },
      ],
      correct: "B",
      explanation: "After resuming, inform the agent about specific sections that changed for targeted re-analysis. Always starting fresh (A) wastes prior work.",
    },
    {
      text: "Your extraction schema marks `termination_date` as `required` with type `\"string\"`. For contracts without specified termination dates (evergreen agreements), Claude fabricates a plausible date. What schema design principle fixes this?",
      domain: "D4",
      scenario: scenario1Exam4,
      options: [
        { letter: "A", text: "Add validation rules that check extracted dates against a reasonable range." },
        { letter: "B", text: "Make fields that may be absent optional with nullable types (`[\"string\", \"null\"]`) and remove from `required`. This prevents fabrication to satisfy schema constraints." },
        { letter: "C", text: "Add \"Do not hallucinate dates\" to the extraction prompt." },
        { letter: "D", text: "Implement a post-extraction verification step that checks all dates against the document." },
      ],
      correct: "B",
      explanation: "Nullable optional fields prevent fabrication. When information is absent, Claude returns null. Validation (A) catches but doesn't prevent.",
    },
    {
      text: "Your contract review prompt says: \"Review this contract and flag any issues. Be thorough.\" The output varies wildly \u2014 sometimes 30 findings, sometimes 5. What's the root cause?",
      domain: "D4",
      scenario: scenario1Exam4,
      options: [
        { letter: "A", text: "The model needs a higher temperature for consistent creative output." },
        { letter: "B", text: "The instructions are too vague. Replace with explicit criteria specifying which issue types to report (liability caps, indemnity scope, termination rights) versus skip (minor formatting)." },
        { letter: "C", text: "The model's `max_tokens` varies between runs, limiting output length." },
        { letter: "D", text: "Add `--deterministic` flag to the Claude Code CLI for consistent output." },
      ],
      correct: "B",
      explanation: "Vague instructions produce inconsistent output. Explicit criteria defining what to report vs skip is the fix.",
    },
    {
      text: "After reviewing 40 contracts, context starts degrading \u2014 the agent references \"typical clauses\" instead of specific terms it discovered. What should you do?",
      domain: "D5",
      scenario: scenario1Exam4,
      options: [
        { letter: "A", text: "Start a new session and re-read the most important contracts." },
        { letter: "B", text: "Have the agent maintain a scratchpad file recording key findings (clause types, risk levels, party obligations). Re-read the scratchpad for subsequent reviews." },
        { letter: "C", text: "Use `/compact` to free up context space and continue review." },
        { letter: "D", text: "Increase the model's context window by using a higher-tier model." },
      ],
      correct: "B",
      explanation: "Scratchpad files persist findings across context boundaries. The agent writes key findings to a file and re-reads it.",
    },
    // Scenario 2: Supply Chain (Q16-Q30)
    {
      text: "Your agent needs to find all products with inventory below reorder point across 10,000+ SKUs. Which approach is correct?",
      domain: "D2",
      scenario: scenario2Exam4,
      options: [
        { letter: "A", text: "Use Grep to search local inventory files for low-stock items." },
        { letter: "B", text: "Use the `check_inventory` MCP tool with appropriate filter parameters \u2014 this queries the actual inventory management system." },
        { letter: "C", text: "Use Glob to find all inventory-related files and read them manually." },
        { letter: "D", text: "Ask warehouse staff to manually check stock levels and report to the agent." },
      ],
      correct: "B",
      explanation: "MCP server tools query the actual inventory management system. Grep (A) only searches local files.",
    },
    {
      text: "Your demand prediction prompt says: \"Predict which products will run out of stock. Be helpful.\" The output varies wildly between runs. What's the fix?",
      domain: "D4",
      scenario: scenario2Exam4,
      options: [
        { letter: "A", text: "The model needs a higher temperature for consistent creative output." },
        { letter: "B", text: "The instructions are too vague. Define explicit criteria: what data to consider (sales velocity, seasonality, lead times), what confidence threshold to use, what to report vs. skip." },
        { letter: "C", text: "The model's `max_tokens` varies between runs, limiting output length." },
        { letter: "D", text: "Add `--deterministic` flag to the Claude Code CLI for consistent output." },
      ],
      correct: "B",
      explanation: "Vague instructions produce inconsistent output. Explicit criteria defining what data to consider is the fix.",
    },
    {
      text: "Your agent frequently recommends reordering items that are already on order because it checks inventory before checking pending purchase orders. What's the fix?",
      domain: "D4",
      scenario: scenario2Exam4,
      options: [
        { letter: "A", text: "Add \"Check pending orders before recommending\" to the prompt." },
        { letter: "B", text: "Restructure the tool flow: use a combined `check_inventory_and_pending` tool, or enforce pending order checks via `tool_choice` sequencing before any reorder recommendations." },
        { letter: "C", text: "Display pending orders prominently in the UI so operators can see them." },
        { letter: "D", text: "Only recommend reorders for items that have been out of stock for 7+ days." },
      ],
      correct: "B",
      explanation: "Restructure tool flow to enforce pending order checks before recommendations. Prompt instructions (A) are probabilistic.",
    },
    {
      text: "You need your agent to output inventory alerts as structured JSON that can be programmatically sent to the warehouse management system. What's the correct CLI invocation?",
      domain: "D3",
      scenario: scenario2Exam4,
      options: [
        { letter: "A", text: "`claude -p \"Check inventory\" --json`" },
        { letter: "B", text: "`claude -p \"Check inventory\" --output-format json --json-schema '{\"type\":\"object\",\"properties\":{\"alerts\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"sku\":{\"type\":\"string\"},\"current_level\":{\"type\":\"number\"},\"reorder_point\":{\"type\":\"number\"}}}}}}'`" },
        { letter: "C", text: "`claude \"Check inventory\" --output-format json`" },
        { letter: "D", text: "`claude -p \"Check inventory\" | jq '.alerts'`" },
      ],
      correct: "B",
      explanation: "claude -p \"...\" --output-format json --json-schema '{...}' is the correct CLI invocation.",
    },
    {
      text: "Your team has both a standard SAP MCP server and a custom internal logistics MCP server. The SAP integration is standard; the logistics server is company-specific. How should you configure them?",
      domain: "D2",
      scenario: scenario2Exam4,
      options: [
        { letter: "A", text: "Both in `.mcp.json` \u2014 project-scoped and version-controlled, since both are company tools." },
        { letter: "B", text: "SAP in `~/.claude.json` (user-level), logistics in `.mcp.json` (project-level)." },
        { letter: "C", text: "Both in `~/.claude.json` to avoid polluting the project repository." },
        { letter: "D", text: "SAP in `.mcp.json`, logistics hardcoded in the agent definition." },
      ],
      correct: "A",
      explanation: "Both are company tools \u2014 configure both in project-scoped .mcp.json for team sharing.",
    },
    {
      text: "Your agent generates purchase orders. After an operator approves and modifies a PO, the re-generation posts the same items alongside the modifications. Operators complain about duplicate entries. What's the fix?",
      domain: "D3",
      scenario: scenario2Exam4,
      options: [
        { letter: "A", text: "Delete all previous PO drafts before each new generation run." },
        { letter: "B", text: "Include the prior PO state in context when re-running, and instruct the agent to report only changes or new items." },
        { letter: "C", text: "Only regenerate POs for items that have changed since the last version." },
        { letter: "D", text: "Use PO labels to track which items have been approved." },
      ],
      correct: "B",
      explanation: "Include prior PO state in context, ask for only changes or new items. Deleting comments (A) loses history.",
    },
    {
      text: "Your supply chain agent uses a `CLAUDE.md` with general inventory guidelines. But a specific warehouse `warehouses/cold-storage/` has different rules (temperature-sensitive items, shorter shelf lives). How should you configure this?",
      domain: "D3",
      scenario: scenario2Exam4,
      options: [
        { letter: "A", text: "Add an exception note to the root CLAUDE.md: \"In cold-storage/, shelf life rules differ.\"" },
        { letter: "B", text: "Create `.claude/rules/cold-storage.md` with `paths: [\"warehouses/cold-storage/**/*\"]` containing warehouse-specific rules, or create `warehouses/cold-storage/CLAUDE.md` with local standards." },
        { letter: "C", text: "Instruct the agent to always ask about temperature requirements for cold storage items." },
        { letter: "D", text: "Exclude the `warehouses/cold-storage/` warehouse from AI-assisted management entirely." },
      ],
      correct: "B",
      explanation: "Path-specific rules in .claude/rules/ or directory-level CLAUDE.md for warehouse-specific requirements.",
    },
    {
      text: "Your agent recommends suppliers and then reviews its own recommendations for quality. It marks all recommendations as appropriate. An independent review reveals 4 of 15 recommendations use suppliers with poor delivery records. Why?",
      domain: "D3",
      scenario: scenario2Exam4,
      options: [
        { letter: "A", text: "The model needs explicit instructions to be self-critical." },
        { letter: "B", text: "The model retains reasoning context from the initial recommendation, biasing it toward confirming its own decisions. Use an independent Claude instance (separate session) for recommendation validation." },
        { letter: "C", text: "The model's temperature should be higher for the self-review pass." },
        { letter: "D", text: "The original recommendation prompt is too lenient, so the self-review inherits the same leniency." },
      ],
      correct: "B",
      explanation: "Self-review bias \u2014 the model retains reasoning context. Use an independent instance.",
    },
    {
      text: "Your supply chain pipeline needs to run the agent non-interactively for batch inventory updates. Which statement about `-p` is correct?",
      domain: "D3",
      scenario: scenario2Exam4,
      options: [
        { letter: "A", text: "`-p` reads input from a file instead of stdin." },
        { letter: "B", text: "`-p` (or `--print`) runs Claude Code in non-interactive mode: it processes the prompt, outputs the result to stdout, and exits without waiting for user input." },
        { letter: "C", text: "`-p` enables parallel processing of multiple inventory updates." },
        { letter: "D", text: "`-p` formats the output for printing to physical labels." },
      ],
      correct: "B",
      explanation: "-p / --print = non-interactive mode. Processes prompt, outputs to stdout, exits.",
    },
    {
      text: "You need the agent to both generate demand forecasts AND validate that forecasts align with historical patterns. A colleague suggests using a single session for both to \"share context.\" What's the issue?",
      domain: "D3",
      scenario: scenario2Exam4,
      options: [
        { letter: "A", text: "A single session can't run two different prompts." },
        { letter: "B", text: "There's no issue \u2014 shared context improves both tasks." },
        { letter: "C", text: "Using the same session for generation and validation introduces self-review bias. Use separate, independent sessions for generation and validation." },
        { letter: "D", text: "The combined context might exceed the model's token limit." },
      ],
      correct: "C",
      explanation: "Self-review bias affects both generation and review in the same session. Use separate, independent sessions.",
    },
    {
      text: "Your agent analyzes a large inventory file (5,000 SKUs) and flags items from the first 1,000 and last 1,000, but rarely from the middle section. What explains this pattern?",
      domain: "D5",
      scenario: scenario2Exam4,
      options: [
        { letter: "A", text: "The model's random seed varies between inference calls." },
        { letter: "B", text: "The model's attention is non-uniform across long inputs \u2014 the \"lost-in-the-middle\" effect. Content near the middle gets less attention. Structure analyses to ensure coverage across all sections." },
        { letter: "C", text: "The model's `max_tokens` ended before it could analyze the middle section." },
        { letter: "D", text: "The model only processes the first and last portions of files exceeding a certain length." },
      ],
      correct: "B",
      explanation: "Lost-in-the-middle effect: content near the middle of long inputs gets less attention.",
    },
    {
      text: "Your agent loop appends each tool result to conversation messages and sends them back to Claude for the next iteration. A colleague suggests optimizing by only sending the latest tool result. What's wrong with this?",
      domain: "D1",
      scenario: scenario2Exam4,
      options: [
        { letter: "A", text: "Nothing \u2014 sending only the latest result reduces token costs." },
        { letter: "B", text: "The full conversation history must be sent in subsequent API requests so Claude can reason about accumulated context. Without prior results, the model loses track of what's been investigated." },
        { letter: "C", text: "Only the system prompt and latest result are needed \u2014 the model's internal memory handles the rest." },
        { letter: "D", text: "You can omit tool results but must keep assistant messages." },
      ],
      correct: "B",
      explanation: "Full conversation history must be sent so Claude reasons about accumulated context. This is how the Messages API works \u2014 it's stateless.",
    },
    {
      text: "Your `contact_supplier` tool returns different errors for different failure modes, but all use: `{\"success\": false, \"error\": \"Contact failed\"}`. This prevents distinguishing between supplier unavailable (needs retry), invalid contact info (needs correction), and system timeout (needs escalation). How should the tool be improved?",
      domain: "D2",
      scenario: scenario2Exam4,
      options: [
        { letter: "A", text: "Add error codes (500, 400, 403) matching HTTP conventions." },
        { letter: "B", text: "Return structured error metadata: `{\"isError\": true, \"errorCategory\": \"availability|validation|transient\", \"isRetryable\": true|false, \"message\": \"...\", \"operator_explanation\": \"...\"}`." },
        { letter: "C", text: "Return different error messages for each failure type (but keep the same `success: false` format)." },
        { letter: "D", text: "Log errors server-side and have the agent check an error log endpoint." },
      ],
      correct: "B",
      explanation: "Structured error metadata with errorCategory, isRetryable, and operator_explanation enables appropriate agent responses.",
    },
    {
      text: "After deploying the agent, metrics show it creates unnecessary purchase orders for 35% of recommendations \u2014 far above the 10% target. Analysis reveals it creates POs for all low-stock items regardless of pending orders or upcoming deliveries. What's the most effective fix?",
      domain: "D5",
      scenario: scenario2Exam4,
      options: [
        { letter: "A", text: "Remove the `create_purchase_order` tool to force manual review." },
        { letter: "B", text: "Add explicit PO creation criteria with few-shot examples: when to create (no pending orders, lead time exceeded) vs. wait (pending orders exist, delivery scheduled)." },
        { letter: "C", text: "Implement a separate approval model that pre-classifies POs as \"necessary\" or \"unnecessary.\"" },
        { letter: "D", text: "Have the agent self-report confidence scores and only create POs above a threshold." },
      ],
      correct: "B",
      explanation: "Explicit PO creation criteria with few-shot examples fix over-creation. Removing the tool (A) removes capability.",
    },
    {
      text: "Your coordinator agent needs to pass verified inventory data to a procurement subagent. Which approach correctly preserves the information?",
      domain: "D1",
      scenario: scenario2Exam4,
      options: [
        { letter: "A", text: "Tell the procurement subagent: \"Inventory is low. Create purchase orders.\"" },
        { letter: "B", text: "Include the complete verified inventory data in the procurement subagent's Task prompt: `\"Verified low-stock: SKU-1234 (current: 50, reorder: 200), SKU-5678 (current: 30, reorder: 150). Preferred suppliers: Vendor A, Vendor B.\"`" },
        { letter: "C", text: "Store the inventory data in a shared memory object that both agents can access." },
        { letter: "D", text: "Have the procurement subagent re-call `check_inventory` to verify independently." },
      ],
      correct: "B",
      explanation: "Subagents have isolated context. Pass complete verified data in the Task prompt.",
    },
    // Scenario 3: Educational Content (Q31-Q45)
    {
      text: "Your agent loop appends each tool result to conversation messages and sends them back to Claude for the next iteration. A colleague suggests optimizing by only sending the latest tool result instead of the full conversation history. What's wrong with this optimization?",
      domain: "D1",
      scenario: scenario3Exam4,
      options: [
        { letter: "A", text: "Nothing \u2014 sending only the latest result reduces token costs." },
        { letter: "B", text: "The full conversation history must be sent in subsequent API requests so Claude can reason about accumulated context. Without prior results, the model loses track of what's already been generated." },
        { letter: "C", text: "Only the system prompt and latest result are needed \u2014 the model's internal memory handles the rest." },
        { letter: "D", text: "You can omit tool results but must keep assistant messages." },
      ],
      correct: "B",
      explanation: "Full conversation history must be sent so Claude reasons about accumulated context. Without prior results, the model repeats work.",
    },
    {
      text: "Your agent generates a lesson plan correctly: aligns standards, creates activities, designs assessments. But when the educator adds \"also, can you create a simplified version for ESL students?\" as a follow-up, the agent starts from scratch instead of adapting the existing lesson. What's the issue?",
      domain: "D1",
      scenario: scenario3Exam4,
      options: [
        { letter: "A", text: "The agent's system prompt doesn't instruct it to maintain session state across follow-up requests." },
        { letter: "B", text: "The conversation history includes the generated lesson, but the prompt doesn't guide the agent to recognize that prior content should be adapted rather than regenerated. Add instructions for maintaining generated content within a session." },
        { letter: "C", text: "Each new request should trigger fresh generation for quality purposes." },
        { letter: "D", text: "The lesson plan cache has expired between the two requests." },
      ],
      correct: "B",
      explanation: "The conversation history contains the generated lesson, but the agent needs guidance to recognize that prior content should be adapted. Add session state management instructions.",
    },
    {
      text: "Your coordinator agent handles complex requests by delegating standards alignment to an alignment subagent and content generation to a content subagent. The alignment subagent encounters a transient standards database error. It retries 3 times, then returns: `{\"status\": \"error\", \"message\": \"Service unavailable\"}`. The coordinator tells the educator: \"I can't align to standards right now.\" What should the subagent return instead?",
      domain: "D2",
      scenario: scenario3Exam4,
      options: [
        { letter: "A", text: "The raw error log with stack trace for debugging." },
        { letter: "B", text: "Structured error context: `{\"status\": \"partial_failure\", \"errorCategory\": \"transient\", \"attempted\": \"align lesson to standards for Grade 5 Math\", \"retries\": 3, \"partial_results\": [\"standards domain identified: Number Operations\"], \"alternatives\": [\"retry in 10 minutes\", \"use cached standards mapping\"]}`." },
        { letter: "C", text: "A generic message: `{\"status\": \"error\", \"isRetryable\": true}`." },
        { letter: "D", text: "The subagent should keep retrying indefinitely until the standards database becomes available." },
      ],
      correct: "B",
      explanation: "Structured error context with category, partial results, retries attempted, and alternatives. Generic errors (C) prevent intelligent recovery.",
    },
    {
      text: "A teacher requests: \"Create a unit on photosynthesis for 7th grade, and I also need a quiz on cellular respiration from last week's unit.\" The system prompt says: \"Handle one request at a time.\" But the educator clearly has two distinct needs. What's the right behavior?",
      domain: "D1",
      scenario: scenario3Exam4,
      options: [
        { letter: "A", text: "Follow the system prompt exactly \u2014 address only the photosynthesis unit and ask the educator to submit the quiz request separately." },
        { letter: "B", text: "Decompose the request into two distinct items. Address them sequentially (new unit first, then quiz) and synthesize a unified response confirming both are being handled." },
        { letter: "C", text: "Decompose into two items and investigate both in parallel since they're independent." },
        { letter: "D", text: "Escalate because multi-request submissions exceed the agent's scope." },
      ],
      correct: "B",
      explanation: "Decompose multi-request submissions into distinct items. Address sequentially and synthesize a unified response.",
    },
    {
      text: "Your agent uses hooks to enforce that only certified educators can access certain advanced content templates. An uncertified user attempts to access an \"AP Biology Lab\" template three times \u2014 each attempt is blocked by the hook. Is this a problem?",
      domain: "D1",
      scenario: scenario3Exam4,
      options: [
        { letter: "A", text: "No \u2014 the agent is correctly attempting to fulfill the user's request." },
        { letter: "B", text: "Yes \u2014 after the first hook rejection, the agent should recognize the restriction and either explain the certification requirement or suggest alternative accessible templates. Repeated failed attempts waste resources and frustrate users." },
        { letter: "C", text: "No \u2014 the hook should allow access after 3 attempts as a fallback." },
        { letter: "D", text: "Yes \u2014 the agent should bypass the hook for educator-requested content." },
      ],
      correct: "B",
      explanation: "After the first hook rejection, the agent should recognize the restriction and either explain or suggest alternatives. Repeated failed attempts waste resources.",
    },
    {
      text: "A teacher says: \"I'm worried this content might be too advanced for my students, but I trust you can help me adjust it.\" The agent should:",
      domain: "D5",
      scenario: scenario3Exam4,
      options: [
        { letter: "A", text: "Escalate immediately because the teacher expressed worry about difficulty level." },
        { letter: "B", text: "Acknowledge the concern, collect appropriate information about student levels, and adapt content per differentiation protocol \u2014 the teacher indicated they want the AI to help with adjustment." },
        { letter: "C", text: "Use sentiment analysis to determine whether the worry level warrants immediate escalation." },
        { letter: "D", text: "Transfer to a human curriculum specialist because any expression of worry suggests the AI can't handle the situation." },
      ],
      correct: "B",
      explanation: "The teacher expressed worry BUT indicated willingness to let the agent help. Acknowledge concern, collect information, adapt content.",
    },
    {
      text: "Which `tool_choice` configuration should you use when the agent's first action in every content creation session MUST be to call `search_standards` for curriculum alignment?",
      domain: "D2",
      scenario: scenario3Exam4,
      options: [
        { letter: "A", text: "`tool_choice: \"auto\"` \u2014 let the model decide based on the educator's message." },
        { letter: "B", text: "`tool_choice: \"any\"` \u2014 force the model to call a tool, but let it choose which one." },
        { letter: "C", text: "`tool_choice: {\"type\": \"tool\", \"name\": \"search_standards\"}` \u2014 force the model to call the specific standards tool." },
        { letter: "D", text: "`tool_choice: \"required\"` \u2014 a special mode that requires a specific tool sequence." },
      ],
      correct: "C",
      explanation: "Forced tool selection guarantees a specific tool is called. \"auto\" (A) lets the model skip it. \"any\" (B) lets the model choose any tool.",
    },
    {
      text: "Your `validate_alignment` tool returns different errors for different failure modes, but all use: `{\"success\": false, \"error\": \"Validation failed\"}`. This prevents distinguishing between misaligned standards (needs revision), missing standards (needs research), and system timeout (needs retry). How should the tool be improved?",
      domain: "D2",
      scenario: scenario3Exam4,
      options: [
        { letter: "A", text: "Add error codes (500, 400, 403) matching HTTP conventions." },
        { letter: "B", text: "Return structured error metadata: `{\"isError\": true, \"errorCategory\": \"alignment|coverage|transient\", \"isRetryable\": true|false, \"message\": \"...\", \"educator_explanation\": \"...\"}`." },
        { letter: "C", text: "Return different error messages for each failure type (but keep the same `success: false` format)." },
        { letter: "D", text: "Log errors server-side and have the agent check an error log endpoint." },
      ],
      correct: "B",
      explanation: "Structured error metadata enables appropriate agent responses. HTTP codes (A) lack context.",
    },
    {
      text: "After deploying the agent, metrics show it escalates 50% of content requests \u2014 far above the 20% target. Analysis reveals it escalates all adaptation requests regardless of complexity, even straightforward simplifications. What's the most effective fix?",
      domain: "D5",
      scenario: scenario3Exam4,
      options: [
        { letter: "A", text: "Remove the escalation tool to force the agent to handle everything." },
        { letter: "B", text: "Add explicit escalation criteria with few-shot examples to the system prompt: when to escalate (novel subject matter, conflicting standards) vs. handle autonomously (reading level adjustment, format conversion)." },
        { letter: "C", text: "Implement a separate routing model that pre-classifies requests as \"agent-handleable\" or \"needs specialist.\"" },
        { letter: "D", text: "Have the agent self-report a confidence score and only escalate below a threshold." },
      ],
      correct: "B",
      explanation: "Explicit escalation criteria with few-shot examples fix over-escalation. Removing the tool (A) removes a safety valve.",
    },
    {
      text: "Your agent receives tool results accumulating across a 20-turn content creation session. By turn 15, the context window is 85% full with verbose standards data and lesson content. The agent's responses become unreliable. What's the best mitigation?",
      domain: "D5",
      scenario: scenario3Exam4,
      options: [
        { letter: "A", text: "Set a hard limit of 10 turns per session." },
        { letter: "B", text: "Use `/compact` at turn 10, but first extract critical lesson facts (grade level, standards IDs, key concepts) into a persistent block that survives compression." },
        { letter: "C", text: "Discard tool results older than 5 turns." },
        { letter: "D", text: "Route long sessions to human curriculum specialists after 12 turns." },
      ],
      correct: "B",
      explanation: "Extract critical facts before /compact so they survive compression. Hard turn limits (A) are too aggressive.",
    },
    {
      text: "A teacher provides their school ID as \"SCH-4421\" and grade level as \"7th Grade Math.\" The `search_standards` tool returns two matching standard sets with identical IDs. How should the agent proceed?",
      domain: "D5",
      scenario: scenario3Exam4,
      options: [
        { letter: "A", text: "Select the first set because it appears first in the results." },
        { letter: "B", text: "Select the one with the most recent update date." },
        { letter: "C", text: "Ask the teacher for an additional identifier \u2014 in this case, their state or district \u2014 to disambiguate between the two standard sets." },
        { letter: "D", text: "Merge the two standard sets and proceed with the combined information." },
      ],
      correct: "C",
      explanation: "Both ID and grade match two standard sets \u2014 need additional identifiers (state/district). First-result (A) is a heuristic that may be wrong.",
    },
    {
      text: "A teacher asks: \"Can you certify that this lesson meets state requirements for graduation?\" Your policy states: \"AI-generated content must be reviewed by certified educators before official use. The agent can suggest alignment but cannot provide official certification.\" What should the agent do?",
      domain: "D5",
      scenario: scenario3Exam4,
      options: [
        { letter: "A", text: "Deny the certification request, citing the policy: \"Official certification requires educator review. I can suggest alignment for your review.\"" },
        { letter: "B", text: "Attempt to provide certification since the teacher's request seems reasonable." },
        { letter: "C", text: "Escalate to a curriculum specialist because the policy is ambiguous about certification authority." },
        { letter: "D", text: "Ask the teacher for their state's graduation requirements to evaluate whether certification is appropriate." },
      ],
      correct: "A",
      explanation: "The policy explicitly states AI cannot provide official certification. Denial with offer to suggest alignment is correct.",
    },
    {
      text: "Your coordinator agent needs to pass verified standards alignment to a content generation subagent. Which approach correctly preserves the information?",
      domain: "D1",
      scenario: scenario3Exam4,
      options: [
        { letter: "A", text: "Tell the content subagent: \"Standards are verified. Generate the lesson.\"" },
        { letter: "B", text: "Include the complete verified standards data in the content subagent's Task prompt: `\"Verified standards: CCSS.MATH.7.NS.A.1-3, Grade 7 Number Systems. Generate 5-day unit with assessments.\"`" },
        { letter: "C", text: "Store the standards data in a shared memory object that both agents can access." },
        { letter: "D", text: "Have the content subagent re-call `search_standards` to verify independently." },
      ],
      correct: "B",
      explanation: "Subagents have isolated context. Pass complete verified data in the Task prompt.",
    },
    {
      text: "Your content generation prompt produces clean output for standard lessons but struggles with interdisciplinary units that reference standards from multiple subjects. For example, a STEM unit references both science and math standards, but the extraction only captures math. What prompting technique fixes this?",
      domain: "D4",
      scenario: scenario3Exam4,
      options: [
        { letter: "A", text: "Add \"Check all subjects\" to the system prompt." },
        { letter: "B", text: "Add 2-3 few-shot examples showing correct generation from interdisciplinary units, demonstrating that the agent should search for and incorporate standards from all referenced subjects." },
        { letter: "C", text: "Pre-process the request to separate into single-subject units." },
        { letter: "D", text: "Create a separate \"science standards\" pass." },
      ],
      correct: "B",
      explanation: "Few-shot examples showing extraction from interdisciplinary units. Demonstrates that critical data can come from multiple subjects.",
    },
    {
      text: "Your synthesis report combines data from 20 generated lessons into a curriculum portfolio summary. Sources are compressed into a paragraph summary during aggregation. A district administrator asks \"Which lessons cover standard CCSS.MATH.7.EE.B.4?\" and no one can trace it. What architectural change prevents this?",
      domain: "D5",
      scenario: scenario3Exam4,
      options: [
        { letter: "A", text: "Include all raw lesson data in the final report." },
        { letter: "B", text: "Require the aggregation step to maintain claim-source mappings: each standard in the summary must be traceable to specific lessons with lesson IDs, creation dates, and alignment confidence." },
        { letter: "C", text: "Add a disclaimer that mappings are approximations." },
        { letter: "D", text: "Store raw lessons in a separate database for manual lookup." },
      ],
      correct: "B",
      explanation: "Claim-source mappings maintain provenance through aggregation. Every standard must be traceable to specific lessons.",
    },
    // Scenario 4: Real Estate (Q46-Q60)
    {
      text: "Your extraction schema marks `listing_date` as `required` with type `\"string\"`. For properties without listed dates (common in pre-market submissions), Claude fabricates a plausible date. You also notice Claude invents a `property_type` value when the listing is ambiguous. What single schema design principle fixes both issues?",
      domain: "D4",
      scenario: scenario4Exam4,
      options: [
        { letter: "A", text: "Add validation rules that check extracted dates against a reasonable range." },
        { letter: "B", text: "Make fields that may be absent from source documents optional with nullable types (`[\"string\", \"null\"]`) and remove them from `required`. This prevents the model from fabricating values to satisfy schema constraints." },
        { letter: "C", text: "Add \"Do not hallucinate\" to the extraction prompt." },
        { letter: "D", text: "Implement a post-extraction verification step that checks all dates against the document." },
      ],
      correct: "B",
      explanation: "Nullable optional fields prevent fabrication for both listing_date and property_type. When information is absent, Claude returns null.",
    },
    {
      text: "Your property extraction tool uses `tool_choice: \"auto\"`. The model processes 75% of listings correctly but returns conversational text for 25% without calling the extraction tool. Changing to `tool_choice: \"any\"` resolves this. However, you now have two extraction tools (`extract_residential` and `extract_commercial`) and the model sometimes picks the wrong one. What's the best overall configuration?",
      domain: "D4",
      scenario: scenario4Exam4,
      options: [
        { letter: "A", text: "Keep `tool_choice: \"any\"` and improve both tool descriptions to make them clearly distinguishable." },
        { letter: "B", text: "Use `tool_choice: \"auto\"` with stronger prompt instructions." },
        { letter: "C", text: "Create a single combined `extract_property_data` tool that handles both property types." },
        { letter: "D", text: "Use forced tool selection to always call `extract_residential` first." },
      ],
      correct: "A",
      explanation: "tool_choice: \"any\" guarantees a tool call. The wrong-tool problem is solved by improving descriptions.",
    },
    {
      text: "Your extraction pipeline processes property records. For the field `square_footage`, some documents contain \"2,500 sq ft,\" some contain \"2500SF,\" and some don't specify at all. How should you design the schema?",
      domain: "D4",
      scenario: scenario4Exam4,
      options: [
        { letter: "A", text: "`\"square_footage\": {\"type\": \"string\"}` \u2014 accept any text and normalize later." },
        { letter: "B", text: "`\"square_footage\": {\"type\": [\"number\", \"null\"]}` (nullable) with format normalization rules in the prompt: \"Convert to numeric. If not specified, return null.\"" },
        { letter: "C", text: "`\"square_footage_value\": {\"type\": \"number\"}, \"square_footage_unit\": {\"type\": \"string\"}` \u2014 separate fields for value and unit." },
        { letter: "D", text: "`\"square_footage_category\": {\"type\": \"string\", \"enum\": [\"small\", \"medium\", \"large\", \"estate\"]}` \u2014 categorize instead of extracting raw values." },
      ],
      correct: "B",
      explanation: "Nullable field + format normalization rules handles all three cases: structured values, abbreviated values, and absence (null).",
    },
    {
      text: "After extraction, Pydantic validation catches: `property_value` is `\"approximately $1.2M\"` but the schema expects a numeric field. You retry, providing the original listing, the failed extraction, and the specific error. Claude corrects to `1200000.00`. After adding format normalization rules to the prompt (\"Convert currency descriptions to numeric: '$1.2M' \u2192 1200000\"), the same error stops appearing. What does this demonstrate?",
      domain: "D4",
      scenario: scenario4Exam4,
      options: [
        { letter: "A", text: "Retries always fix format errors eventually." },
        { letter: "B", text: "The most effective approach combines validation-retry for immediate correction AND prompt refinement to prevent the error category from recurring, reducing iterative resubmission costs." },
        { letter: "C", text: "Format normalization rules alone are sufficient; retries are unnecessary." },
        { letter: "D", text: "Pydantic validation should be replaced with Claude-based validation." },
      ],
      correct: "B",
      explanation: "Validation-retry for immediate correction + prompt refinement to prevent the error category from recurring.",
    },
    {
      text: "Your extraction system processes both MLS listings (structured, consistent formatting) and private sale documents (emails, handwritten notes, varied layouts). Overall accuracy is 94%. Stakeholders are satisfied. However, your compliance team reports frequent errors in private sale documents causing valuation gaps. What happened?",
      domain: "D5",
      scenario: scenario4Exam4,
      options: [
        { letter: "A", text: "The model needs additional training on informal documents." },
        { letter: "B", text: "The 94% aggregate accuracy masks poor performance on private sale documents. You need stratified accuracy analysis by document type \u2014 MLS listings may be 98%+ while private sales may be 75%." },
        { letter: "C", text: "Private sale documents shouldn't be processed by the extraction system." },
        { letter: "D", text: "The downstream valuation system needs better error handling for malformed data." },
      ],
      correct: "B",
      explanation: "Aggregate accuracy masks per-type performance. 94% overall might be 98% MLS + 75% private sales. Stratified analysis reveals hidden failures.",
    },
    {
      text: "Your self-correction pipeline extracts data, validates it, and retries on failure. For a lease agreement, the extraction includes `monthly_rent: 3000` but the lease actually states \"three thousand for the first year, increasing to three thousand five hundred in year two.\" What additional schema field would capture this complexity?",
      domain: "D4",
      scenario: scenario4Exam4,
      options: [
        { letter: "A", text: "`\"rent_notes\": {\"type\": \"string\"}` for free-text context." },
        { letter: "B", text: "Design a structured rent schedule: `\"rent_schedule\": {\"type\": \"array\", \"items\": {\"type\": \"object\", \"properties\": {\"period\": {\"type\": \"string\"}, \"monthly_amount\": {\"type\": \"number\"}, \"start_date\": {\"type\": [\"string\", \"null\"]}, \"end_date\": {\"type\": [\"string\", \"null\"]}}}}`." },
        { letter: "C", text: "Add `\"rent_is_variable\": {\"type\": \"boolean\"}`." },
        { letter: "D", text: "Add `\"rent_range\": {\"type\": \"object\", \"properties\": {\"min\": {\"type\": \"number\"}, \"max\": {\"type\": \"number\"}}}`." },
      ],
      correct: "B",
      explanation: "A structured rent schedule array captures multi-period variable amounts. Single field loses the year-two increase.",
    },
    {
      text: "Your batch job processes 3,000 property listings overnight using the Batches API. 2,850 succeed. Of the 150 failures, 90 are `context_limit_exceeded` (very long listings with attachments), 45 are extraction validation failures, and 15 are transient API errors. What's the correct recovery strategy?",
      domain: "D4",
      scenario: scenario4Exam4,
      options: [
        { letter: "A", text: "Resubmit all 3,000 listings with a more concise prompt." },
        { letter: "B", text: "Handle each failure category separately: chunk the 90 oversized listings, refine the prompt for the 45 validation failures (test on a sample first), and simply resubmit the 15 transient errors. Identify all by `custom_id`." },
        { letter: "C", text: "Resubmit only the 150 failures with the same prompt and hope for different results." },
        { letter: "D", text: "Switch all 150 failures to synchronous processing." },
      ],
      correct: "B",
      explanation: "Handle each failure category differently: chunk oversized, refine prompt for validation errors, resubmit transient errors. Use custom_id to identify each.",
    },
    {
      text: "Your extraction system has been running for 5 months with 96% accuracy on high-confidence extractions routed to auto-approval. Your appraisal team suggests stopping human review of high-confidence extractions entirely. What should you do first?",
      domain: "D5",
      scenario: scenario4Exam4,
      options: [
        { letter: "A", text: "Agree \u2014 96% over 5 months proves the system is reliable." },
        { letter: "B", text: "Implement stratified random sampling of high-confidence extractions to continuously measure error rates and detect novel error patterns. Don't eliminate human review; reduce it while maintaining ongoing validation." },
        { letter: "C", text: "Add a second Claude instance to review high-confidence extractions instead of humans." },
        { letter: "D", text: "Increase the confidence threshold to 99.5% before auto-approving." },
      ],
      correct: "B",
      explanation: "Stratified random sampling for ongoing validation. Never eliminate human review entirely \u2014 reduce it while maintaining ongoing measurement.",
    },
    {
      text: "A property extraction produces: `zoning: \"R-1 Residential\"` but a parallel extraction from a zoning amendment to the same property says: `zoning: \"C-2 Commercial\"`. The amendment supersedes the original zoning. How should your system handle this?",
      domain: "D5",
      scenario: scenario4Exam4,
      options: [
        { letter: "A", text: "Use the original property's value since it's the primary document." },
        { letter: "B", text: "Use the amendment's value since it was processed more recently." },
        { letter: "C", text: "Preserve both values with source attribution, annotate the conflict, and include document dates so a reviewer can determine which takes precedence. Flag the extraction as needing human verification." },
        { letter: "D", text: "Concatenate: `\"zoning\": \"R-1 Residential; C-2 Commercial\"`." },
      ],
      correct: "C",
      explanation: "Preserve both values with source attribution and dates. The amendment may supersede, but that's a determination for human review.",
    },
    {
      text: "Your extraction prompt produces clean output for standard listings but struggles with properties that have addendums referencing key terms. For example, a listing says \"per attached disclosure\" but the disclosure defines specific property conditions. The extraction misses the addendum data. What prompting technique fixes this?",
      domain: "D4",
      scenario: scenario4Exam4,
      options: [
        { letter: "A", text: "Add \"Check addendums\" to the system prompt." },
        { letter: "B", text: "Add 2-3 few-shot examples showing correct extraction from documents where critical data appears in addendums, disclosures, and exhibits \u2014 demonstrating that the model should search the entire document structure." },
        { letter: "C", text: "Pre-process the document to inline all addendums into the main listing." },
        { letter: "D", text: "Create a separate \"addendum extraction\" pass." },
      ],
      correct: "B",
      explanation: "Few-shot examples showing extraction from addendums, disclosures, and exhibits. Demonstrates that critical data can appear anywhere.",
    },
    {
      text: "You process both residential and commercial properties. Your single extraction prompt handles both, but frequently places commercial data into residential fields and vice versa. Claude generates valid JSON that passes schema validation but with incorrect field mappings. What type of error is this?",
      domain: "D4",
      scenario: scenario4Exam4,
      options: [
        { letter: "A", text: "Schema syntax error \u2014 fixable by making the schema more strict." },
        { letter: "B", text: "Semantic validation error \u2014 `tool_use` with schemas eliminates syntax errors but NOT semantic errors like values in wrong fields. Implement a separate validation step for cross-field consistency." },
        { letter: "C", text: "Prompt engineering error \u2014 the prompt needs more explicit field definitions." },
        { letter: "D", text: "Both B and C \u2014 fix the semantic validation AND improve the prompt." },
      ],
      correct: "D",
      explanation: "Both semantic validation (cross-field consistency checks) AND better prompting address this. Schema syntax is correct \u2014 the error is semantic.",
    },
    {
      text: "Your team processes 6,000 listings weekly. A pre-listing compliance check blocks agents until property documents are extracted and validated. A monthly market audit extracts data from historical listings for regulatory review. Your manager proposes using the Batch API for both workflows. What's correct?",
      domain: "D4",
      scenario: scenario4Exam4,
      options: [
        { letter: "A", text: "Use Batch API for both \u2014 the 50% savings applies to both workflows." },
        { letter: "B", text: "Use synchronous API for the pre-listing check (blocking listings) and Batch API for the monthly audit (latency-tolerant, cost-sensitive)." },
        { letter: "C", text: "Use Batch API for the pre-listing check with aggressive polling for fast results." },
        { letter: "D", text: "Use synchronous API for both to guarantee consistent processing." },
      ],
      correct: "B",
      explanation: "Blocking pre-listing = synchronous (agents wait). Monthly audit = batch (latency-tolerant, cost-sensitive).",
    },
    {
      text: "Your extraction of `total_property_value` works by extracting both the stated value and independently calculating from comparable sales. In 8% of properties, the stated value and calculated value differ. Your system currently discards these properties. What's a better approach?",
      domain: "D4",
      scenario: scenario4Exam4,
      options: [
        { letter: "A", text: "Always use the stated value \u2014 it's what the original listing says." },
        { letter: "B", text: "Always use the calculated value \u2014 it's mathematically derived." },
        { letter: "C", text: "Design the schema to extract both `stated_value` and `calculated_value`, add `conflict_detected: boolean`, and route conflicts to human review with both values and the discrepancy amount." },
        { letter: "D", text: "Average the two values." },
      ],
      correct: "C",
      explanation: "Extract both values, flag conflict, route to human review. Always using one value risks errors.",
    },
    {
      text: "Your extraction system needs to output field-level confidence scores for routing to human review. After deployment, you find that extractions marked \"0.95 confidence\" are wrong 28% of the time. What's needed?",
      domain: "D5",
      scenario: scenario4Exam4,
      options: [
        { letter: "A", text: "Lower the auto-approval threshold to 0.99." },
        { letter: "B", text: "Calibrate confidence thresholds using a labeled validation set. Out-of-the-box model confidence is not well-calibrated; you need to measure actual accuracy at each confidence level and set thresholds based on empirical data." },
        { letter: "C", text: "Replace model confidence with a rule-based confidence system." },
        { letter: "D", text: "Remove confidence scoring and send all extractions to human review." },
      ],
      correct: "B",
      explanation: "Model confidence is not well-calibrated out of the box. Calibrate using labeled validation sets.",
    },
    {
      text: "Your synthesis report combines data from 25 extracted properties into a market analysis summary. Sources are compressed into a paragraph summary during aggregation. A regulator asks \"Where did the $4.5M average come from?\" and no one can trace it to specific properties. What architectural change prevents this?",
      domain: "D5",
      scenario: scenario4Exam4,
      options: [
        { letter: "A", text: "Include all raw extraction data in the final report." },
        { letter: "B", text: "Require the aggregation step to maintain claim-source mappings: each figure in the summary must be traceable to specific properties with property IDs, listing references, and extraction dates." },
        { letter: "C", text: "Add a disclaimer that figures are approximations." },
        { letter: "D", text: "Store raw extractions in a separate database for manual lookup." },
      ],
      correct: "B",
      explanation: "Claim-source mappings maintain provenance through aggregation. Every figure must be traceable to specific properties.",
    },
  ],
}
