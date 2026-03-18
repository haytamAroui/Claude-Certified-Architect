export interface ExamQuestion {
  text: string
  scenario?: string
  domain: string
  options: { letter: string; text: string }[]
  correct: string
  explanation: string
}

// Exam 1: 60 questions weighted by domain
const exam1: ExamQuestion[] = [
  // Domain 1: Agentic Architecture & Orchestration (16 questions — 27%)
  {
    text: 'What does a `stop_reason` of `"tool_use"` indicate in a Claude API response?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'Claude encountered an error and stopped' },
      { letter: 'B', text: 'Claude wants to call a tool and expects the result back' },
      { letter: 'C', text: 'Claude has finished its response' },
      { letter: 'D', text: 'The response was truncated due to token limits' },
    ],
    correct: 'B',
    explanation:
      'When stop_reason is "tool_use", Claude is requesting to execute a tool. The agentic loop should execute the tool and return the result so Claude can continue processing.',
  },
  {
    text: 'In a correct agentic loop implementation, what should happen when `stop_reason` is `"max_tokens"`?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'Exit the loop and return the partial response' },
      { letter: 'B', text: 'Retry the exact same request' },
      { letter: 'C', text: 'Continue the conversation so Claude can finish its response' },
      { letter: 'D', text: 'Increase the max_tokens parameter and retry' },
    ],
    correct: 'C',
    explanation:
      'When stop_reason is "max_tokens", the response was truncated. A production agentic loop should continue the conversation so Claude can complete its response, rather than silently returning incomplete output.',
  },
  {
    text: 'What is the primary benefit of the coordinator-subagent pattern in multi-agent systems?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'It reduces the total number of API calls' },
      { letter: 'B', text: 'It provides context isolation between parallel tasks' },
      { letter: 'C', text: 'It eliminates the need for tool definitions' },
      { letter: 'D', text: 'It automatically handles rate limiting' },
    ],
    correct: 'B',
    explanation:
      'The coordinator-subagent pattern provides context isolation — each subagent works in its own context window, preventing cross-contamination of information between parallel tasks while the coordinator manages the overall workflow.',
  },
  {
    text: 'When a subagent in the Agent SDK completes its work, what happens to its context?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'It is automatically merged into the coordinator\'s context' },
      { letter: 'B', text: 'It persists for the entire session' },
      { letter: 'C', text: 'It is discarded — only the return value is passed back' },
      { letter: 'D', text: 'It is saved to a shared memory store' },
    ],
    correct: 'C',
    explanation:
      'Subagent context isolation means the subagent\'s full conversation history is discarded when it completes. Only the final return value (the subagent\'s output) is passed back to the coordinator, keeping the coordinator\'s context clean.',
  },
  {
    text: 'Which hook type in the Agent SDK fires BEFORE a tool is executed?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'after_tool' },
      { letter: 'B', text: 'before_tool' },
      { letter: 'C', text: 'on_tool_start' },
      { letter: 'D', text: 'pre_execute' },
    ],
    correct: 'B',
    explanation:
      'The Agent SDK provides before_tool and after_tool hooks. The before_tool hook fires before tool execution, allowing you to validate inputs, log actions, or even block tool calls based on policy.',
  },
  {
    text: 'What is the correct way to handle a tool call that your application does not recognize?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'Silently ignore it and continue' },
      { letter: 'B', text: 'Throw an exception to stop the loop' },
      { letter: 'C', text: 'Return an error result with is_error: true' },
      { letter: 'D', text: 'Restart the entire conversation' },
    ],
    correct: 'C',
    explanation:
      'Unknown tool calls should return a tool result with is_error: true and a descriptive message. This lets Claude understand the tool failed and adapt its approach, rather than crashing the loop or silently dropping information.',
  },
  {
    text: 'In task decomposition, what determines the optimal granularity of subtasks for subagents?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'Each subtask should use exactly one tool call' },
      { letter: 'B', text: 'Subtasks should be independently verifiable units of work' },
      { letter: 'C', text: 'All subtasks must be the same size' },
      { letter: 'D', text: 'Subtasks should never share any context' },
    ],
    correct: 'B',
    explanation:
      'The optimal granularity for subtasks is "independently verifiable units of work" — each subtask should be small enough to validate but large enough to be meaningful. This allows the coordinator to verify completion and handle failures at the right level.',
  },
  {
    text: 'Which `stop_reason` value should terminate the agentic loop in a standard implementation?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: '"tool_use"' },
      { letter: 'B', text: '"max_tokens"' },
      { letter: 'C', text: '"end_turn"' },
      { letter: 'D', text: '"stop_sequence"' },
    ],
    correct: 'C',
    explanation:
      'The "end_turn" stop_reason indicates Claude has finished processing and is ready to present its final response. This is the normal exit condition for an agentic loop.',
  },
  {
    scenario: 'You are building an agent that needs to search a codebase and then make edits based on what it finds.',
    text: 'What is the most important consideration for the agent\'s tool ordering?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'Always search before editing — Claude should gather information before acting' },
      { letter: 'B', text: 'Edit first, then search to verify the changes' },
      { letter: 'C', text: 'Tool ordering doesn\'t matter — Claude decides the order' },
      { letter: 'D', text: 'Combine search and edit into a single tool for efficiency' },
    ],
    correct: 'C',
    explanation:
      'Claude autonomously decides tool ordering within the agentic loop. While search-then-edit is a common pattern, Claude should be given all tools and trusted to determine the right sequence. Forcing tool order removes the agent\'s ability to adapt.',
  },
  {
    text: 'What is the key difference between "handoff" and "coordinator-subagent" multi-agent patterns?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'Handoff passes control permanently; coordinator maintains oversight' },
      { letter: 'B', text: 'They are the same pattern with different names' },
      { letter: 'C', text: 'Handoff is faster; coordinator is more accurate' },
      { letter: 'D', text: 'Handoff uses tools; coordinator uses prompts' },
    ],
    correct: 'A',
    explanation:
      'In a handoff pattern, the current agent transfers control to another agent and does not get it back — the new agent becomes the active one. In coordinator-subagent, the coordinator spawns subagents but retains control, receiving their results back.',
  },
  {
    text: 'How should an agentic loop handle a response that contains BOTH text content and tool_use blocks?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'Ignore the text and only process tool calls' },
      { letter: 'B', text: 'Process the text first, then the tool calls' },
      { letter: 'C', text: 'Execute all tool calls and include their results in the next message' },
      { letter: 'D', text: 'Return an error — mixed content is invalid' },
    ],
    correct: 'C',
    explanation:
      'A Claude response can contain both text and tool_use blocks. The correct behavior is to execute all requested tool calls and return their results. The text content is typically Claude\'s reasoning or status update to the user.',
  },
  {
    scenario: 'Your multi-agent system has a coordinator that spawns 3 subagents in parallel. Subagent 2 fails with an error.',
    text: 'What is the best practice for handling this failure?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'Cancel all subagents and restart the entire task' },
      { letter: 'B', text: 'Let the coordinator decide — return the error as a subagent result' },
      { letter: 'C', text: 'Automatically retry subagent 2 three times' },
      { letter: 'D', text: 'Ignore the failed subagent and proceed with results from 1 and 3' },
    ],
    correct: 'B',
    explanation:
      'The coordinator should receive the error as a result from the failed subagent and decide what to do — retry, use partial results, or take an alternative approach. This keeps decision-making at the coordinator level where full context exists.',
  },
  {
    text: 'What is the purpose of the `system` parameter in the Claude Messages API?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'To define the tools available to the agent' },
      { letter: 'B', text: 'To set persistent instructions that guide the agent\'s behavior throughout the conversation' },
      { letter: 'C', text: 'To specify the model version to use' },
      { letter: 'D', text: 'To configure rate limiting for the API' },
    ],
    correct: 'B',
    explanation:
      'The system parameter provides persistent instructions that guide Claude\'s behavior throughout the entire conversation. It\'s the primary mechanism for setting agent identity, constraints, and behavioral guidelines.',
  },
  {
    text: 'In the Agent SDK, what is the role of a "guardrail"?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'It limits the number of tokens in a response' },
      { letter: 'B', text: 'It runs validation checks on agent inputs/outputs to enforce safety policies' },
      { letter: 'C', text: 'It manages API rate limiting' },
      { letter: 'D', text: 'It provides caching for tool results' },
    ],
    correct: 'B',
    explanation:
      'Guardrails in the Agent SDK run validation checks on agent inputs and outputs. They can run in parallel with agent execution and trip to stop the agent if policy violations are detected, providing a safety layer.',
  },
  {
    text: 'When should you use multiple agents vs. a single agent with multiple tools?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'Always use multiple agents for any complex task' },
      { letter: 'B', text: 'Use multiple agents when tasks need different system prompts or context isolation' },
      { letter: 'C', text: 'Always use a single agent — multiple agents add unnecessary complexity' },
      { letter: 'D', text: 'Use multiple agents only when you have more than 10 tools' },
    ],
    correct: 'B',
    explanation:
      'Multiple agents are warranted when tasks need different system prompts (different personas/instructions), context isolation (preventing cross-contamination), or when a task naturally decomposes into independent specialist roles. A single agent with multiple tools is simpler and preferred when context sharing is needed.',
  },
  {
    scenario: 'You are implementing session management for a long-running agent.',
    text: 'What is the most reliable way to preserve critical context across session boundaries?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'Include all previous messages in every new session' },
      { letter: 'B', text: 'Summarize key decisions and state in the system prompt or a context document' },
      { letter: 'C', text: 'Store the full conversation in a database and retrieve on demand' },
      { letter: 'D', text: 'Rely on Claude\'s built-in memory across sessions' },
    ],
    correct: 'B',
    explanation:
      'The most reliable approach is to summarize key decisions, state, and context into the system prompt or a structured context document. Including all messages is expensive and may hit context limits. Claude does not have built-in cross-session memory in the API.',
  },

  // Domain 2: Tool Design & MCP Integration (12 questions — 20%)
  {
    text: 'What is the most important element of a tool description for Claude\'s tool selection?',
    domain: 'Domain 2',
    options: [
      { letter: 'A', text: 'The tool name' },
      { letter: 'B', text: 'A clear description of WHEN to use the tool and what it does' },
      { letter: 'C', text: 'The JSON schema for parameters' },
      { letter: 'D', text: 'The return type specification' },
    ],
    correct: 'B',
    explanation:
      'The description field is the most critical element for tool selection. Claude uses the description to decide WHEN to use a tool. A clear description of when to use the tool (and when NOT to) dramatically improves tool selection accuracy.',
  },
  {
    text: 'How should a tool communicate a recoverable error back to Claude?',
    domain: 'Domain 2',
    options: [
      { letter: 'A', text: 'Throw an exception in the tool handler' },
      { letter: 'B', text: 'Return a tool_result with is_error: true and a descriptive message' },
      { letter: 'C', text: 'Return an empty result' },
      { letter: 'D', text: 'Return a special error code in the content field' },
    ],
    correct: 'B',
    explanation:
      'Setting is_error: true in the tool_result tells Claude the tool failed in a recoverable way. Claude can then decide to retry with different parameters, use a different tool, or inform the user. This is the structured way to communicate tool errors.',
  },
  {
    text: 'What does MCP (Model Context Protocol) standardize?',
    domain: 'Domain 2',
    options: [
      { letter: 'A', text: 'The format of Claude\'s responses' },
      { letter: 'B', text: 'How AI applications connect to external data sources and tools' },
      { letter: 'C', text: 'The training process for language models' },
      { letter: 'D', text: 'The pricing structure for API calls' },
    ],
    correct: 'B',
    explanation:
      'MCP (Model Context Protocol) is an open standard that standardizes how AI applications connect to external data sources and tools. It provides a universal protocol replacing fragmented, custom integrations with a single standard.',
  },
  {
    text: 'What is the difference between `tool_result` with empty content vs. `is_error: true`?',
    domain: 'Domain 2',
    options: [
      { letter: 'A', text: 'They are functionally identical' },
      { letter: 'B', text: 'Empty content means "no results found" (success); is_error means the tool itself failed' },
      { letter: 'C', text: 'Empty content crashes the loop; is_error is handled gracefully' },
      { letter: 'D', text: 'Empty content is for search tools; is_error is for write tools' },
    ],
    correct: 'B',
    explanation:
      'Empty tool results mean the tool executed successfully but found nothing (e.g., search returned 0 results). is_error: true means the tool itself encountered a problem (e.g., connection failed, invalid parameters). Claude handles these differently — empty results are informational, errors may trigger retries.',
  },
  {
    scenario: 'You have 15 tools defined for your agent but Claude keeps selecting the wrong tool for file operations.',
    text: 'What is the most effective fix?',
    domain: 'Domain 2',
    options: [
      { letter: 'A', text: 'Reduce the total number of tools to under 10' },
      { letter: 'B', text: 'Improve tool descriptions with clear "use when" and "do not use when" guidance' },
      { letter: 'C', text: 'Add tool_choice: "required" to force tool selection' },
      { letter: 'D', text: 'Move file tools to a separate agent' },
    ],
    correct: 'B',
    explanation:
      'The most effective fix is improving tool descriptions. Adding explicit "use when" and "do not use when" clauses helps Claude distinguish between similar tools. This is more targeted than reducing tools or splitting agents, which may be unnecessary.',
  },
  {
    text: 'In MCP server configuration for Claude Code, where are server definitions specified?',
    domain: 'Domain 2',
    options: [
      { letter: 'A', text: 'In the system prompt' },
      { letter: 'B', text: 'In .claude/settings.json or project-level settings' },
      { letter: 'C', text: 'In the tool definitions array' },
      { letter: 'D', text: 'In a separate mcp.config.js file' },
    ],
    correct: 'B',
    explanation:
      'MCP servers for Claude Code are configured in settings files — either .claude/settings.json for user-level or project-level settings. This defines which MCP servers are available, how to start them, and what tools they provide.',
  },
  {
    text: 'What is "tool distribution" in a multi-agent system?',
    domain: 'Domain 2',
    options: [
      { letter: 'A', text: 'Giving every agent access to every tool' },
      { letter: 'B', text: 'Strategically assigning specific tools to specific agents based on their role' },
      { letter: 'C', text: 'Randomly distributing tools across agents for load balancing' },
      { letter: 'D', text: 'Duplicating tool definitions across multiple servers' },
    ],
    correct: 'B',
    explanation:
      'Tool distribution means strategically assigning specific tools to specific agents based on their role. A code-editing agent gets file tools, a search agent gets search tools. This reduces confusion and improves tool selection accuracy by limiting each agent\'s scope.',
  },
  {
    text: 'Which tool_choice value lets Claude decide whether to use a tool or respond with text?',
    domain: 'Domain 2',
    options: [
      { letter: 'A', text: '{ "type": "auto" }' },
      { letter: 'B', text: '{ "type": "any" }' },
      { letter: 'C', text: '{ "type": "required" }' },
      { letter: 'D', text: '{ "type": "none" }' },
    ],
    correct: 'A',
    explanation:
      'tool_choice: { "type": "auto" } (the default) lets Claude freely decide whether to use a tool or respond with text. "any" forces Claude to use some tool. "tool" forces a specific named tool. There is no "required" or "none" type.',
  },
  {
    text: 'What happens when you set `tool_choice` to `{ "type": "any" }`?',
    domain: 'Domain 2',
    options: [
      { letter: 'A', text: 'Claude can use any combination of tools and text' },
      { letter: 'B', text: 'Claude must use at least one tool — it cannot respond with only text' },
      { letter: 'C', text: 'Claude will use all available tools' },
      { letter: 'D', text: 'The tools are made optional for the response' },
    ],
    correct: 'B',
    explanation:
      'tool_choice: { "type": "any" } forces Claude to call at least one tool — it cannot respond with only text. This is useful when you always want structured output via tool calls rather than free-form text.',
  },
  {
    scenario: 'Your tool returns a large JSON payload (50KB) as a result.',
    text: 'What is the best practice for handling this?',
    domain: 'Domain 2',
    options: [
      { letter: 'A', text: 'Return the full payload — Claude can handle large inputs' },
      { letter: 'B', text: 'Truncate or summarize the result before returning it as a tool_result' },
      { letter: 'C', text: 'Split it across multiple tool_result messages' },
      { letter: 'D', text: 'Compress the JSON before sending' },
    ],
    correct: 'B',
    explanation:
      'Large tool results consume context window space and can degrade performance. Best practice is to truncate or summarize results before returning them — extract only the relevant fields. This keeps the context window efficient and improves response quality.',
  },
  {
    text: 'Which built-in tool in Claude Code is used for making targeted changes to existing files?',
    domain: 'Domain 2',
    options: [
      { letter: 'A', text: 'Write' },
      { letter: 'B', text: 'Edit (str_replace_editor)' },
      { letter: 'C', text: 'Bash with sed command' },
      { letter: 'D', text: 'Patch' },
    ],
    correct: 'B',
    explanation:
      'The Edit tool (str_replace_editor) makes targeted, surgical changes to existing files by replacing specific strings. Write overwrites entire files. Using Bash/sed is discouraged in favor of the dedicated Edit tool.',
  },
  {
    text: 'In MCP, what is a "resource" as distinct from a "tool"?',
    domain: 'Domain 2',
    options: [
      { letter: 'A', text: 'Resources are read-only data sources; tools perform actions' },
      { letter: 'B', text: 'Resources are faster than tools' },
      { letter: 'C', text: 'Resources require authentication; tools do not' },
      { letter: 'D', text: 'There is no difference — they are interchangeable terms' },
    ],
    correct: 'A',
    explanation:
      'In MCP, resources are read-only data sources that provide context (like files, database records, API responses). Tools perform actions that may have side effects (like writing files, sending messages). Resources inform; tools act.',
  },

  // Domain 3: Claude Code Configuration & Workflows (12 questions — 20%)
  {
    text: 'In the CLAUDE.md configuration hierarchy, which file takes the highest precedence?',
    domain: 'Domain 3',
    options: [
      { letter: 'A', text: 'Repository root CLAUDE.md' },
      { letter: 'B', text: '~/.claude/CLAUDE.md (user-level)' },
      { letter: 'C', text: 'CLAUDE.md in the current working directory (deepest path)' },
      { letter: 'D', text: '.claude/settings.json' },
    ],
    correct: 'C',
    explanation:
      'CLAUDE.md files follow a hierarchy where deeper paths take precedence. The file closest to the current working directory wins. This allows subdirectories to override repository-level instructions for specific parts of the codebase.',
  },
  {
    text: 'What is the purpose of a custom slash command in Claude Code?',
    domain: 'Domain 3',
    options: [
      { letter: 'A', text: 'To define new API endpoints' },
      { letter: 'B', text: 'To create reusable prompt templates that can be invoked with /<name>' },
      { letter: 'C', text: 'To configure environment variables' },
      { letter: 'D', text: 'To manage Git operations' },
    ],
    correct: 'B',
    explanation:
      'Custom slash commands in Claude Code are reusable prompt templates stored in .claude/commands/. Users invoke them with /<name> and they expand to full prompts with instructions, providing consistent workflows for common tasks.',
  },
  {
    text: 'Where should custom commands be stored in a Claude Code project?',
    domain: 'Domain 3',
    options: [
      { letter: 'A', text: 'In the project root directory' },
      { letter: 'B', text: 'In .claude/commands/ directory' },
      { letter: 'C', text: 'In a commands.json configuration file' },
      { letter: 'D', text: 'In the system prompt' },
    ],
    correct: 'B',
    explanation:
      'Custom commands live in the .claude/commands/ directory as markdown files. Each .md file in this directory becomes a slash command with the filename as the command name (e.g., .claude/commands/fix.md → /fix).',
  },
  {
    text: 'What is Plan Mode in Claude Code?',
    domain: 'Domain 3',
    options: [
      { letter: 'A', text: 'A billing plan for the API' },
      { letter: 'B', text: 'A read-only mode where Claude analyzes and plans without making changes' },
      { letter: 'C', text: 'A mode for creating project timelines' },
      { letter: 'D', text: 'A mode that only allows git operations' },
    ],
    correct: 'B',
    explanation:
      'Plan Mode puts Claude Code into a read-only analysis mode. Claude can read files, search, and think, but cannot modify files or execute commands. This is used for designing approaches before implementation, reducing the risk of premature changes.',
  },
  {
    scenario: 'Your team wants Claude Code to always run linting before committing code.',
    text: 'What is the correct way to enforce this?',
    domain: 'Domain 3',
    options: [
      { letter: 'A', text: 'Add a reminder in CLAUDE.md' },
      { letter: 'B', text: 'Configure a pre-commit hook in settings.json' },
      { letter: 'C', text: 'Use a custom command that includes linting' },
      { letter: 'D', text: 'Add it to the system prompt' },
    ],
    correct: 'B',
    explanation:
      'Hooks in settings.json provide automated enforcement. A pre-commit hook will always run linting before commits, regardless of what instructions say. CLAUDE.md reminders are advisory — hooks are enforced by the system.',
  },
  {
    text: 'How does Claude Code handle path-scoped rules in CLAUDE.md?',
    domain: 'Domain 3',
    options: [
      { letter: 'A', text: 'Rules apply globally regardless of path' },
      { letter: 'B', text: 'CLAUDE.md in subdirectories provides path-scoped overrides for files in that directory' },
      { letter: 'C', text: 'Path scoping requires a separate configuration file' },
      { letter: 'D', text: 'Rules are scoped by file extension, not path' },
    ],
    correct: 'B',
    explanation:
      'Placing a CLAUDE.md file in a subdirectory provides path-scoped instructions that apply specifically to files in that directory. This allows different rules for different parts of the codebase (e.g., stricter rules for src/security/).',
  },
  {
    text: 'What is the difference between a Claude Code "command" and a "skill"?',
    domain: 'Domain 3',
    options: [
      { letter: 'A', text: 'They are identical concepts' },
      { letter: 'B', text: 'Commands are simple prompt templates; skills are commands with additional metadata, allowed tools, and can disable model invocation' },
      { letter: 'C', text: 'Commands are built-in; skills are user-created' },
      { letter: 'D', text: 'Skills can call APIs; commands cannot' },
    ],
    correct: 'B',
    explanation:
      'Skills extend commands with frontmatter metadata including: allowed-tools (restricting which tools the skill can use), disable-model-invocation (preventing arbitrary code execution), description, and argument hints. They provide more structured, controlled automation.',
  },
  {
    text: 'When running Claude Code in CI/CD with the `-p` flag, what behavior changes?',
    domain: 'Domain 3',
    options: [
      { letter: 'A', text: 'Nothing changes — it runs identically to interactive mode' },
      { letter: 'B', text: 'Claude runs non-interactively: no user prompts, slash commands don\'t work, must use --allowedTools' },
      { letter: 'C', text: 'It only allows read operations' },
      { letter: 'D', text: 'It automatically commits and pushes all changes' },
    ],
    correct: 'B',
    explanation:
      'The -p flag runs Claude Code non-interactively. There\'s no user to prompt for permission, slash commands can\'t be used (they expand in interactive mode), and you must explicitly configure allowed tools via --allowedTools flag for security.',
  },
  {
    text: 'What is the `$ARGUMENTS` placeholder in a custom command file?',
    domain: 'Domain 3',
    options: [
      { letter: 'A', text: 'A reference to environment variables' },
      { letter: 'B', text: 'The text the user typed after the slash command name' },
      { letter: 'C', text: 'A list of command-line flags' },
      { letter: 'D', text: 'The previous command\'s output' },
    ],
    correct: 'B',
    explanation:
      '$ARGUMENTS in a command file is replaced with whatever the user typed after the command name. For example, "/fix the login button" would replace $ARGUMENTS with "the login button" in the fix.md template.',
  },
  {
    text: 'How should CLAUDE.md instructions be structured for maximum effectiveness?',
    domain: 'Domain 3',
    options: [
      { letter: 'A', text: 'As a single long paragraph' },
      { letter: 'B', text: 'As clear, numbered rules with specific file references and concrete examples' },
      { letter: 'C', text: 'As a JSON configuration file' },
      { letter: 'D', text: 'As a list of prohibited actions only' },
    ],
    correct: 'B',
    explanation:
      'CLAUDE.md is most effective with clear, numbered rules, specific file:line references, and concrete examples. Vague prose is less effective than specific, actionable instructions. Including both "do this" and "don\'t do this" with examples maximizes adherence.',
  },
  {
    text: 'What happens when CLAUDE.md at the repo root and a subdirectory CLAUDE.md conflict?',
    domain: 'Domain 3',
    options: [
      { letter: 'A', text: 'The repo root always wins' },
      { letter: 'B', text: 'An error is thrown' },
      { letter: 'C', text: 'The subdirectory CLAUDE.md takes precedence for files in its scope' },
      { letter: 'D', text: 'Both are ignored and default settings are used' },
    ],
    correct: 'C',
    explanation:
      'The subdirectory CLAUDE.md takes precedence for files within its scope. This follows a "most specific wins" principle — deeper paths override shallower ones, allowing teams to customize rules for specific directories while maintaining global defaults.',
  },
  {
    scenario: 'You want Claude Code to automatically review PRs when they\'re opened.',
    text: 'Which approach best achieves this?',
    domain: 'Domain 3',
    options: [
      { letter: 'A', text: 'Add "review all PRs" to CLAUDE.md' },
      { letter: 'B', text: 'Set up a CI/CD workflow that invokes Claude Code with -p and a review prompt' },
      { letter: 'C', text: 'Create a /review custom command' },
      { letter: 'D', text: 'Configure a GitHub webhook directly to the Anthropic API' },
    ],
    correct: 'B',
    explanation:
      'For automated PR review, set up a CI/CD workflow (e.g., GitHub Action) that invokes Claude Code with the -p flag and a review prompt. This runs non-interactively on each PR, using the project\'s CLAUDE.md for context. Custom commands require interactive invocation.',
  },

  // Domain 4: Prompt Engineering & Structured Output (11 questions — 18%)
  {
    text: 'What is the recommended way to get structured JSON output from Claude?',
    domain: 'Domain 4',
    options: [
      { letter: 'A', text: 'Ask Claude to "respond in JSON format" in the prompt' },
      { letter: 'B', text: 'Use tool_use with a tool whose input_schema defines the desired structure' },
      { letter: 'C', text: 'Set a response_format parameter to "json"' },
      { letter: 'D', text: 'Use regex to parse JSON from Claude\'s text response' },
    ],
    correct: 'B',
    explanation:
      'The most reliable way to get structured output from Claude is using tool_use with a tool whose input_schema defines the exact JSON structure you want. Claude will "call" this tool with validated structured data. This guarantees schema compliance unlike free-form text responses.',
  },
  {
    text: 'What is the purpose of the system prompt in the Messages API?',
    domain: 'Domain 4',
    options: [
      { letter: 'A', text: 'To provide the user\'s first message' },
      { letter: 'B', text: 'To set persistent behavioral instructions separate from conversation messages' },
      { letter: 'C', text: 'To define the tool schemas' },
      { letter: 'D', text: 'To configure the model parameters' },
    ],
    correct: 'B',
    explanation:
      'The system prompt provides persistent behavioral instructions that guide Claude throughout the entire conversation. It\'s separate from user/assistant messages and is the primary way to set tone, rules, persona, and constraints.',
  },
  {
    text: 'When using few-shot prompting, where should examples be placed for best results?',
    domain: 'Domain 4',
    options: [
      { letter: 'A', text: 'In the system prompt only' },
      { letter: 'B', text: 'In user/assistant message pairs within the messages array' },
      { letter: 'C', text: 'In the tool descriptions' },
      { letter: 'D', text: 'In a separate examples parameter' },
    ],
    correct: 'B',
    explanation:
      'Few-shot examples are most effective as user/assistant message pairs in the messages array. This mimics real conversation flow and gives Claude the clearest signal of the expected input→output pattern. The system prompt can reference them, but the examples themselves work best as messages.',
  },
  {
    text: 'What is the primary advantage of using tool_use for extraction tasks over free-form text?',
    domain: 'Domain 4',
    options: [
      { letter: 'A', text: 'It\'s faster' },
      { letter: 'B', text: 'It guarantees output matches the defined JSON schema' },
      { letter: 'C', text: 'It costs fewer tokens' },
      { letter: 'D', text: 'It allows longer responses' },
    ],
    correct: 'B',
    explanation:
      'tool_use guarantees the output matches the defined JSON schema. When Claude "calls" a tool, its arguments must conform to the input_schema. This eliminates parsing errors and ensures consistent structure — critical for extraction pipelines that feed into downstream systems.',
  },
  {
    text: 'What is the Batch API used for?',
    domain: 'Domain 4',
    options: [
      { letter: 'A', text: 'Processing a single very long document' },
      { letter: 'B', text: 'Sending multiple independent requests that are processed asynchronously at lower cost' },
      { letter: 'C', text: 'Batch-training a custom Claude model' },
      { letter: 'D', text: 'Sending requests to multiple models simultaneously' },
    ],
    correct: 'B',
    explanation:
      'The Batch API allows you to send multiple independent requests that are processed asynchronously. It offers a 50% cost reduction compared to real-time API calls. Results are available within 24 hours, making it ideal for bulk processing tasks like data extraction or content classification.',
  },
  {
    scenario: 'You need Claude to extract invoice data with fields: vendor, amount, date, and line items.',
    text: 'What is the most reliable approach?',
    domain: 'Domain 4',
    options: [
      { letter: 'A', text: 'Prompt: "Extract the vendor, amount, date, and line items as JSON"' },
      { letter: 'B', text: 'Define a tool called "record_invoice" with an input_schema specifying all required fields and their types' },
      { letter: 'C', text: 'Use a regex to extract each field from Claude\'s text response' },
      { letter: 'D', text: 'Ask Claude to fill a markdown table template' },
    ],
    correct: 'B',
    explanation:
      'Defining a tool with a precise input_schema is the most reliable approach. Claude will "call" the tool with structured data matching the schema, including proper types, required fields, and nested arrays for line items. No parsing needed.',
  },
  {
    text: 'How should you structure a system prompt for a task-specific agent?',
    domain: 'Domain 4',
    options: [
      { letter: 'A', text: 'Keep it as short as possible — one sentence' },
      { letter: 'B', text: 'Identity/role → Rules/constraints → Context → Output format' },
      { letter: 'C', text: 'List every possible edge case' },
      { letter: 'D', text: 'Copy the full API documentation' },
    ],
    correct: 'B',
    explanation:
      'Effective system prompts follow a structure: Identity/role (who Claude is), Rules/constraints (what to do and not do), Context (relevant background), Output format (how to respond). This layered structure gives Claude clear guidance at each level.',
  },
  {
    text: 'What is "prompt caching" with cache_control in the Claude API?',
    domain: 'Domain 4',
    options: [
      { letter: 'A', text: 'Storing Claude\'s responses for reuse' },
      { letter: 'B', text: 'Marking parts of the prompt as cacheable so they don\'t need to be re-processed on subsequent calls' },
      { letter: 'C', text: 'Caching tool results between calls' },
      { letter: 'D', text: 'Pre-loading the model with common prompts' },
    ],
    correct: 'B',
    explanation:
      'Prompt caching with cache_control marks parts of the prompt (system prompt, tools, messages) as cacheable. On subsequent calls with the same cached content, those tokens are read from cache instead of re-processed, reducing cost by up to 90% and latency significantly.',
  },
  {
    text: 'When is it appropriate to use `tool_choice: { "type": "tool", "name": "specific_tool" }`?',
    domain: 'Domain 4',
    options: [
      { letter: 'A', text: 'Always — it ensures consistent behavior' },
      { letter: 'B', text: 'When you need to force Claude to use a specific tool for structured output in a single-turn flow' },
      { letter: 'C', text: 'Never — Claude should always choose freely' },
      { letter: 'D', text: 'Only in multi-agent systems' },
    ],
    correct: 'B',
    explanation:
      'Forcing a specific tool is useful in single-turn flows where you always want structured output in a specific format — e.g., always extracting data via a "record_data" tool. In multi-turn agentic loops, auto is usually better since Claude needs freedom to choose the right action.',
  },
  {
    text: 'What is the key difference between "prefilling" and few-shot prompting?',
    domain: 'Domain 4',
    options: [
      { letter: 'A', text: 'They are the same technique' },
      { letter: 'B', text: 'Prefilling starts Claude\'s response with specific text; few-shot provides example input/output pairs' },
      { letter: 'C', text: 'Prefilling is cheaper; few-shot is more accurate' },
      { letter: 'D', text: 'Prefilling works with tools; few-shot works with text' },
    ],
    correct: 'B',
    explanation:
      'Prefilling adds the start of Claude\'s response (as an assistant message) to steer the output format — e.g., starting with "{" to ensure JSON. Few-shot prompting provides complete input→output examples as user/assistant message pairs to demonstrate the desired pattern.',
  },
  {
    scenario: 'You need to classify customer support tickets into 5 categories with confidence scores.',
    text: 'Which approach produces the most reliable structured output?',
    domain: 'Domain 4',
    options: [
      { letter: 'A', text: 'Prompt: "Classify this ticket and give a confidence score"' },
      { letter: 'B', text: 'Define a classify_ticket tool with input_schema: { category: enum[...], confidence: number }' },
      { letter: 'C', text: 'Use XML tags: <category>...</category><confidence>...</confidence>' },
      { letter: 'D', text: 'Ask Claude to rate 1-5 for each category' },
    ],
    correct: 'B',
    explanation:
      'A tool with an enum for categories and a number for confidence score guarantees valid, parseable output. The enum restricts categories to exactly your 5 options, and the number type ensures confidence is numeric. No parsing or validation code needed.',
  },

  // Domain 5: Context Management & Reliability (9 questions — 15%)
  {
    text: 'What is the biggest risk of not managing context window size in a long-running agent?',
    domain: 'Domain 5',
    options: [
      { letter: 'A', text: 'Higher API costs' },
      { letter: 'B', text: 'Critical information gets pushed out of the context window, leading to loss of important context' },
      { letter: 'C', text: 'Slower response times' },
      { letter: 'D', text: 'More API errors' },
    ],
    correct: 'B',
    explanation:
      'The biggest risk is context loss. As conversation grows, older messages may be truncated or summarized. If critical information (like user requirements or constraints) is pushed out, the agent may make incorrect decisions based on incomplete context.',
  },
  {
    text: 'When should an agent escalate to a human rather than continuing autonomously?',
    domain: 'Domain 5',
    options: [
      { letter: 'A', text: 'Never — agents should always complete tasks autonomously' },
      { letter: 'B', text: 'When ambiguity, low confidence, or high-risk decisions exceed the agent\'s defined autonomy boundary' },
      { letter: 'C', text: 'Only when an API error occurs' },
      { letter: 'D', text: 'After every 5 tool calls' },
    ],
    correct: 'B',
    explanation:
      'Agents should escalate when they encounter ambiguity they can\'t resolve, their confidence is below a threshold, or the action exceeds their defined autonomy level (e.g., deleting data, spending money). Well-designed agents know their boundaries and escalate appropriately.',
  },
  {
    text: 'How does error propagation work in a multi-agent system?',
    domain: 'Domain 5',
    options: [
      { letter: 'A', text: 'Errors in subagents are always hidden from the coordinator' },
      { letter: 'B', text: 'Subagent errors should be returned as structured results to the coordinator for decision-making' },
      { letter: 'C', text: 'All errors cause the entire system to halt' },
      { letter: 'D', text: 'Errors are logged but never affect other agents' },
    ],
    correct: 'B',
    explanation:
      'Subagent errors should be returned as structured results to the coordinator. The coordinator has the full context to decide the best recovery strategy — retry, use alternative approach, or escalate. Hiding errors prevents proper error handling; halting everything is too aggressive.',
  },
  {
    text: 'What is the purpose of "information provenance" in an agent system?',
    domain: 'Domain 5',
    options: [
      { letter: 'A', text: 'Tracking API usage and billing' },
      { letter: 'B', text: 'Tracking where information came from so decisions can be traced back to their sources' },
      { letter: 'C', text: 'Encrypting sensitive data' },
      { letter: 'D', text: 'Measuring response latency' },
    ],
    correct: 'B',
    explanation:
      'Information provenance tracks where each piece of information came from — which tool call, which document, which user message. This allows auditing agent decisions, debugging incorrect outputs, and building trust by showing the evidence chain behind each action.',
  },
  {
    scenario: 'Your agent is exploring a large codebase with 10,000+ files.',
    text: 'What is the recommended strategy for efficient exploration?',
    domain: 'Domain 5',
    options: [
      { letter: 'A', text: 'Read every file sequentially' },
      { letter: 'B', text: 'Use targeted search (grep/glob) first, then read only relevant files' },
      { letter: 'C', text: 'Load the entire codebase into the context window' },
      { letter: 'D', text: 'Ask the user which files to read' },
    ],
    correct: 'B',
    explanation:
      'For large codebases, start with targeted search tools (grep for content, glob for file patterns) to narrow down relevant files, then read only those. This is efficient and stays within context limits. Reading everything is impractical; asking the user defeats the purpose of an agent.',
  },
  {
    text: 'How does prompt caching with `cache_control` reduce costs?',
    domain: 'Domain 5',
    options: [
      { letter: 'A', text: 'It compresses the prompt before sending' },
      { letter: 'B', text: 'Cached tokens are charged at a reduced rate (up to 90% savings) on subsequent calls' },
      { letter: 'C', text: 'It eliminates the need for a system prompt' },
      { letter: 'D', text: 'It reduces the model\'s response length' },
    ],
    correct: 'B',
    explanation:
      'When you mark content with cache_control: { "type": "ephemeral" }, the first call processes normally. Subsequent calls with the same cached prefix read those tokens from cache at a 90% discount, significantly reducing costs for repetitive prompts like system instructions and tool definitions.',
  },
  {
    text: 'What is "confidence calibration" in the context of agent reliability?',
    domain: 'Domain 5',
    options: [
      { letter: 'A', text: 'Setting a fixed confidence threshold for all tasks' },
      { letter: 'B', text: 'Teaching the agent to accurately assess and communicate its uncertainty so actions match confidence levels' },
      { letter: 'C', text: 'Running the same query multiple times to get consistent results' },
      { letter: 'D', text: 'Using a separate model to verify outputs' },
    ],
    correct: 'B',
    explanation:
      'Confidence calibration means the agent accurately assesses its own uncertainty and communicates it. A well-calibrated agent takes autonomous action when confident, seeks clarification when uncertain, and escalates when unsure. This directly maps to when to act vs. when to ask.',
  },
  {
    text: 'What should happen when a critical piece of information is identified in a long conversation?',
    domain: 'Domain 5',
    options: [
      { letter: 'A', text: 'Hope it stays in the context window' },
      { letter: 'B', text: 'Write it to a persistent store (file, variable) and reference it in the system prompt' },
      { letter: 'C', text: 'Repeat it in every message' },
      { letter: 'D', text: 'Create a new conversation with just that information' },
    ],
    correct: 'B',
    explanation:
      'Critical information in long conversations should be persisted outside the conversation context — written to a file, stored in a variable, or referenced in the system prompt. This ensures it survives context window truncation and is always accessible.',
  },
  {
    text: 'Which approach best handles ambiguity in a user\'s request to an agent?',
    domain: 'Domain 5',
    options: [
      { letter: 'A', text: 'Make the best guess and proceed' },
      { letter: 'B', text: 'Ask a clarifying question with specific options before proceeding' },
      { letter: 'C', text: 'Refuse to act until the user provides a perfectly clear request' },
      { letter: 'D', text: 'Execute all possible interpretations simultaneously' },
    ],
    correct: 'B',
    explanation:
      'When facing ambiguity, the best approach is to ask a targeted clarifying question with specific options. This is more efficient than guessing (which may be wrong) or refusing (which blocks progress). Offering options helps the user provide clear direction quickly.',
  },
]

// Exam 2: 60 different questions, same domain weights
const exam2: ExamQuestion[] = [
  // Domain 1: Agentic Architecture & Orchestration (16 questions)
  {
    text: 'What is the fundamental pattern that makes an agent "agentic" rather than a simple chatbot?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'Using a large language model' },
      { letter: 'B', text: 'A loop that takes actions (tool calls) based on observations, continuing until a goal is met' },
      { letter: 'C', text: 'Having access to the internet' },
      { letter: 'D', text: 'Using the latest model version' },
    ],
    correct: 'B',
    explanation:
      'An agent is defined by its agentic loop — the ability to take actions (via tool calls), observe results, reason about them, and continue iterating until a goal is achieved. A simple chatbot does request→response without this iterative action-observation cycle.',
  },
  {
    text: 'In the Agent SDK, what does the `handoff()` function do?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'It pauses the current agent' },
      { letter: 'B', text: 'It transfers conversation control from the current agent to a different agent' },
      { letter: 'C', text: 'It creates a backup of the agent state' },
      { letter: 'D', text: 'It starts a parallel agent process' },
    ],
    correct: 'B',
    explanation:
      'handoff() transfers control from the current agent to another agent. The new agent takes over the conversation with its own system prompt and tools. This is a permanent transfer — the original agent does not get control back (unlike coordinator-subagent).',
  },
  {
    text: 'Why is context isolation important for subagents?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'It makes them run faster' },
      { letter: 'B', text: 'It prevents one subagent\'s task-specific information from contaminating another\'s context' },
      { letter: 'C', text: 'It reduces API costs' },
      { letter: 'D', text: 'It allows them to use different models' },
    ],
    correct: 'B',
    explanation:
      'Context isolation prevents cross-contamination between subagents. If a code-analysis subagent shares context with a documentation subagent, irrelevant information could confuse each agent\'s task. Isolation ensures each agent operates with clean, task-relevant context.',
  },
  {
    scenario: 'You have an agent with 3 sequential tool calls. The second tool call fails with a network error.',
    text: 'What should the agentic loop do?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'Restart from tool call 1' },
      { letter: 'B', text: 'Skip to tool call 3' },
      { letter: 'C', text: 'Return the error as a tool_result and let Claude decide the next step' },
      { letter: 'D', text: 'Exit the loop with an error' },
    ],
    correct: 'C',
    explanation:
      'Return the error as a tool_result with is_error: true. Claude can then decide the best recovery strategy — retry, use an alternative approach, or inform the user. The agentic loop should not make recovery decisions that Claude should make.',
  },
  {
    text: 'What is the correct order of content blocks in a Claude API response that includes both thinking and tool use?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'tool_use → thinking → text' },
      { letter: 'B', text: 'thinking → text → tool_use' },
      { letter: 'C', text: 'text → tool_use → thinking' },
      { letter: 'D', text: 'The order varies and all blocks should be processed' },
    ],
    correct: 'D',
    explanation:
      'The response may contain multiple content blocks in varying order. A robust agentic loop should process all blocks regardless of order — extracting tool_use blocks for execution, text blocks for display, and thinking blocks for logging/debugging.',
  },
  {
    text: 'What is the maximum number of tool calls Claude can request in a single response?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'Exactly 1' },
      { letter: 'B', text: 'Up to 5' },
      { letter: 'C', text: 'Multiple — Claude can request several tool calls in one response' },
      { letter: 'D', text: 'It depends on the model version' },
    ],
    correct: 'C',
    explanation:
      'Claude can request multiple tool calls in a single response. The agentic loop should execute all of them and return all results in the next message. Processing only the first tool call would lose the other requests.',
  },
  {
    text: 'When should you use the `after_tool` hook in the Agent SDK?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'To modify the tool\'s input parameters' },
      { letter: 'B', text: 'To inspect, log, or modify tool results before they\'re sent back to Claude' },
      { letter: 'C', text: 'To choose which tool to call' },
      { letter: 'D', text: 'To cancel the tool call before execution' },
    ],
    correct: 'B',
    explanation:
      'The after_tool hook fires after tool execution, before the result is sent to Claude. Use it to inspect results, log them for monitoring, redact sensitive data, or transform the output. To modify inputs or cancel, use before_tool instead.',
  },
  {
    scenario: 'Your coordinator agent receives results from 3 subagents. Subagent 1 says the file has 100 lines, subagent 2 says 150 lines.',
    text: 'How should the coordinator handle this conflict?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'Always trust the first subagent' },
      { letter: 'B', text: 'Average the results' },
      { letter: 'C', text: 'Use the coordinator\'s reasoning to evaluate the conflict and potentially verify independently' },
      { letter: 'D', text: 'Report both results to the user without analysis' },
    ],
    correct: 'C',
    explanation:
      'The coordinator should use its reasoning capability to evaluate conflicting results — consider which subagent\'s approach was more reliable, potentially run a verification step, and synthesize a correct answer. Simply averaging or blindly trusting one agent defeats the purpose of multi-agent oversight.',
  },
  {
    text: 'What is the primary risk of an unbounded agentic loop?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'It will produce better results but take longer' },
      { letter: 'B', text: 'Runaway cost, infinite loops, or the agent taking increasingly erratic actions' },
      { letter: 'C', text: 'It will crash the API server' },
      { letter: 'D', text: 'There is no risk — Claude always knows when to stop' },
    ],
    correct: 'B',
    explanation:
      'Unbounded loops risk runaway costs (each iteration is an API call), infinite loops (Claude may cycle between actions without progress), and erratic behavior as context fills. Production loops should have iteration limits, cost budgets, and progress-checking mechanisms.',
  },
  {
    text: 'How do you pass information from a coordinator to a subagent?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'Through shared global variables' },
      { letter: 'B', text: 'Through the subagent\'s initial prompt or handoff context' },
      { letter: 'C', text: 'Through a database' },
      { letter: 'D', text: 'Information flows automatically between agents' },
    ],
    correct: 'B',
    explanation:
      'Information passes to subagents through their initial prompt — the task description the coordinator provides when spawning the subagent. This is the subagent\'s "briefing" and should contain all context needed for the task. There are no shared globals between agents.',
  },
  {
    text: 'What is the "enforcement" pattern in multi-agent systems?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'Using rate limits to control agents' },
      { letter: 'B', text: 'Running a separate agent that validates or constrains the primary agent\'s outputs' },
      { letter: 'C', text: 'Forcing agents to use specific tools' },
      { letter: 'D', text: 'Limiting the number of agents in the system' },
    ],
    correct: 'B',
    explanation:
      'The enforcement pattern uses a secondary agent (or guardrail) to validate the primary agent\'s outputs against policies or constraints. For example, a content-moderation agent reviewing a writing agent\'s output before it reaches the user.',
  },
  {
    text: 'Which pattern is best for a customer service agent that needs to handle billing, technical support, and account management?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'Single agent with all tools' },
      { letter: 'B', text: 'Handoff pattern — route to specialized agent based on intent' },
      { letter: 'C', text: 'Run all three agents simultaneously on every request' },
      { letter: 'D', text: 'Coordinator-subagent with parallel execution' },
    ],
    correct: 'B',
    explanation:
      'A handoff pattern is ideal here — a triage agent classifies the customer\'s intent and hands off to the appropriate specialist (billing, tech support, or account). Each specialist has its own tools and system prompt. Only one specialist handles each conversation.',
  },
  {
    scenario: 'Your agent has been running for 50 iterations and its responses are becoming less coherent.',
    text: 'What is the most likely cause?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'The model is getting tired' },
      { letter: 'B', text: 'The context window is filling up, causing important early context to be lost or compressed' },
      { letter: 'C', text: 'A bug in the tool implementations' },
      { letter: 'D', text: 'The API key is expiring' },
    ],
    correct: 'B',
    explanation:
      'After many iterations, the conversation history fills the context window. Early messages (including system prompt context, original requirements) may be truncated or compressed, causing the agent to lose track of its goals and produce less coherent responses.',
  },
  {
    text: 'What is the Agent SDK\'s `Runner` class responsible for?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'Managing API authentication' },
      { letter: 'B', text: 'Orchestrating the agentic loop — calling Claude, executing tools, managing turns' },
      { letter: 'C', text: 'Loading and parsing tool definitions' },
      { letter: 'D', text: 'Handling network retries' },
    ],
    correct: 'B',
    explanation:
      'The Runner class orchestrates the entire agentic loop — it calls the Claude API, processes responses, executes tool calls, manages turn-by-turn conversation flow, handles handoffs, and continues until the agent signals completion.',
  },
  {
    text: 'What is the correct way to return multiple tool results when Claude requested multiple tools in one response?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'Send separate messages for each tool result' },
      { letter: 'B', text: 'Include all tool_result blocks in a single user message, each matching its tool_use_id' },
      { letter: 'C', text: 'Only return the result of the first tool call' },
      { letter: 'D', text: 'Concatenate all results into one tool_result block' },
    ],
    correct: 'B',
    explanation:
      'All tool results should be in a single user message with separate tool_result content blocks, each matching its corresponding tool_use_id. This maintains the 1:1 mapping between tool calls and results that the API requires.',
  },
  {
    text: 'What does "graceful degradation" mean in the context of an agentic system?',
    domain: 'Domain 1',
    options: [
      { letter: 'A', text: 'Shutting down cleanly when an error occurs' },
      { letter: 'B', text: 'Continuing to provide value even when some capabilities are unavailable or failing' },
      { letter: 'C', text: 'Gradually reducing response quality over time' },
      { letter: 'D', text: 'Lowering the model temperature when errors increase' },
    ],
    correct: 'B',
    explanation:
      'Graceful degradation means the system continues to provide value even when some components fail. If a search tool is down, the agent can still reason from cached context. If a subagent fails, the coordinator can proceed with partial results rather than failing entirely.',
  },

  // Domain 2: Tool Design & MCP (12 questions)
  {
    text: 'Why should tool descriptions include "do NOT use when" guidance?',
    domain: 'Domain 2',
    options: [
      { letter: 'A', text: 'To increase the description length for better caching' },
      { letter: 'B', text: 'To prevent Claude from selecting the tool in inappropriate situations' },
      { letter: 'C', text: 'To satisfy API schema requirements' },
      { letter: 'D', text: 'To document the tool for developers' },
    ],
    correct: 'B',
    explanation:
      'Negative guidance ("do NOT use when") prevents Claude from selecting a tool in inappropriate situations. Without it, Claude may use a search tool when it should use a direct file read, or a write tool when it should use an edit tool. Explicit negative examples significantly improve tool selection.',
  },
  {
    text: 'What should a well-designed tool return when it finds no results?',
    domain: 'Domain 2',
    options: [
      { letter: 'A', text: 'An error with is_error: true' },
      { letter: 'B', text: 'A successful result with a message like "No results found for query X"' },
      { letter: 'C', text: 'An empty string' },
      { letter: 'D', text: 'null' },
    ],
    correct: 'B',
    explanation:
      'No results is a successful outcome — the tool worked correctly, it just found nothing. Return a clear message like "No results found for query X". Using is_error: true would incorrectly signal the tool malfunctioned. An empty string gives Claude no context about what happened.',
  },
  {
    text: 'What is the role of `input_schema` in a tool definition?',
    domain: 'Domain 2',
    options: [
      { letter: 'A', text: 'It defines the format of the tool\'s return value' },
      { letter: 'B', text: 'It defines the JSON Schema for the tool\'s input parameters that Claude must follow' },
      { letter: 'C', text: 'It configures the tool\'s authentication' },
      { letter: 'D', text: 'It sets rate limits for the tool' },
    ],
    correct: 'B',
    explanation:
      'input_schema is a JSON Schema that defines the expected parameters for the tool. Claude\'s tool calls must conform to this schema. It includes parameter names, types, required fields, descriptions, and constraints. This is how you ensure structured, valid tool inputs.',
  },
  {
    text: 'In MCP, what is the relationship between "servers" and "tools"?',
    domain: 'Domain 2',
    options: [
      { letter: 'A', text: 'They are the same thing' },
      { letter: 'B', text: 'An MCP server exposes one or more tools (and optionally resources and prompts)' },
      { letter: 'C', text: 'Tools contain servers' },
      { letter: 'D', text: 'Servers are for data; tools are for computation' },
    ],
    correct: 'B',
    explanation:
      'An MCP server is a process that exposes capabilities to the AI — primarily tools (actions), resources (data), and prompts (templates). One MCP server can expose multiple tools. The client connects to the server and makes its tools available to Claude.',
  },
  {
    scenario: 'You have a tool that deletes files. Claude is about to use it on an important file.',
    text: 'What is the best safety mechanism?',
    domain: 'Domain 2',
    options: [
      { letter: 'A', text: 'Remove the tool entirely' },
      { letter: 'B', text: 'Use a before_tool hook to check with the user before executing destructive operations' },
      { letter: 'C', text: 'Add "be careful" to the tool description' },
      { letter: 'D', text: 'Make the tool always fail' },
    ],
    correct: 'B',
    explanation:
      'A before_tool hook can intercept destructive tool calls and prompt the user for confirmation before execution. This provides a human-in-the-loop safety layer for high-risk operations without removing the capability entirely.',
  },
  {
    text: 'How should tool parameter descriptions be written for best results?',
    domain: 'Domain 2',
    options: [
      { letter: 'A', text: 'As brief as possible — one word per parameter' },
      { letter: 'B', text: 'With clear descriptions including valid values, formats, and examples' },
      { letter: 'C', text: 'Using technical jargon for precision' },
      { letter: 'D', text: 'Identical to the parameter name' },
    ],
    correct: 'B',
    explanation:
      'Tool parameter descriptions should be clear and include valid values, expected formats, and examples. For instance: "The file path relative to the project root, e.g., \'src/index.ts\'" is much better than just "path". Claude uses these descriptions to construct correct tool call arguments.',
  },
  {
    text: 'What transport protocol does MCP use for local servers?',
    domain: 'Domain 2',
    options: [
      { letter: 'A', text: 'HTTP REST' },
      { letter: 'B', text: 'stdio (standard input/output)' },
      { letter: 'C', text: 'WebSocket only' },
      { letter: 'D', text: 'gRPC' },
    ],
    correct: 'B',
    explanation:
      'Local MCP servers use stdio (standard input/output) for communication. The client starts the server process and communicates over stdin/stdout using JSON-RPC messages. Remote servers can use SSE (Server-Sent Events) over HTTP.',
  },
  {
    text: 'What is the maximum recommended number of tools for a single agent?',
    domain: 'Domain 2',
    options: [
      { letter: 'A', text: 'Exactly 5' },
      { letter: 'B', text: 'There is no hard limit, but quality of tool descriptions matters more than quantity' },
      { letter: 'C', text: '10 is the absolute maximum' },
      { letter: 'D', text: 'Unlimited — more tools are always better' },
    ],
    correct: 'B',
    explanation:
      'There\'s no hard maximum, but more tools means more competition for selection. The quality of tool descriptions (when to use, when not to use) matters more than reducing count. If tool selection degrades, improve descriptions before cutting tools. That said, scoping tools to relevant agents is good practice.',
  },
  {
    text: 'What happens when a tool_result has both `content` and `is_error: true`?',
    domain: 'Domain 2',
    options: [
      { letter: 'A', text: 'The content is ignored' },
      { letter: 'B', text: 'Claude sees the content as an error description and can adapt its approach' },
      { letter: 'C', text: 'The API returns a validation error' },
      { letter: 'D', text: 'The is_error flag is ignored' },
    ],
    correct: 'B',
    explanation:
      'When is_error is true, the content serves as the error description. Claude reads it to understand what went wrong and can adapt — retry with different parameters, try an alternative tool, or inform the user about the issue. Always provide descriptive error content.',
  },
  {
    text: 'Why should you avoid tools with overlapping functionality?',
    domain: 'Domain 2',
    options: [
      { letter: 'A', text: 'It increases API costs' },
      { letter: 'B', text: 'Claude may select the wrong one, leading to inconsistent behavior' },
      { letter: 'C', text: 'It causes API errors' },
      { letter: 'D', text: 'MCP doesn\'t support it' },
    ],
    correct: 'B',
    explanation:
      'Overlapping tools create ambiguity in tool selection. If "search_files" and "find_in_codebase" do similar things, Claude may inconsistently pick one or the other. Either consolidate them or add very clear descriptions explaining when each should be used.',
  },
  {
    text: 'What is the purpose of tool "scoping" in a multi-agent system?',
    domain: 'Domain 2',
    options: [
      { letter: 'A', text: 'Limiting API call rates per tool' },
      { letter: 'B', text: 'Giving each agent only the tools relevant to its role, reducing noise and improving selection' },
      { letter: 'C', text: 'Setting file system permissions for tools' },
      { letter: 'D', text: 'Grouping tools by programming language' },
    ],
    correct: 'B',
    explanation:
      'Tool scoping gives each agent only the tools relevant to its specific role. A search agent only gets search tools; a code editor only gets file manipulation tools. This reduces the "tool menu" each agent sees, dramatically improving tool selection accuracy.',
  },
  {
    scenario: 'An MCP server intermittently fails with connection timeouts.',
    text: 'What is the best resilience pattern?',
    domain: 'Domain 2',
    options: [
      { letter: 'A', text: 'Increase the timeout to 5 minutes' },
      { letter: 'B', text: 'Implement retry logic with exponential backoff and return is_error with context on final failure' },
      { letter: 'C', text: 'Remove the MCP server and use direct API calls' },
      { letter: 'D', text: 'Switch to a different MCP server implementation' },
    ],
    correct: 'B',
    explanation:
      'Retry with exponential backoff handles transient failures gracefully. After exhausting retries, return is_error: true with a descriptive message so Claude can adapt. This provides resilience without hiding failures from the agent.',
  },

  // Domain 3: Claude Code Configuration (12 questions)
  {
    text: 'What is the CLAUDE.md file used for?',
    domain: 'Domain 3',
    options: [
      { letter: 'A', text: 'Storing API keys' },
      { letter: 'B', text: 'Providing project-specific instructions and context to Claude Code' },
      { letter: 'C', text: 'Configuring the build system' },
      { letter: 'D', text: 'Defining database schemas' },
    ],
    correct: 'B',
    explanation:
      'CLAUDE.md provides project-specific instructions and context to Claude Code. It contains coding standards, project conventions, architectural decisions, and behavioral rules that guide how Claude works within the specific project.',
  },
  {
    text: 'Where should user-level (not project-level) Claude Code settings be stored?',
    domain: 'Domain 3',
    options: [
      { letter: 'A', text: 'In the project\'s .claude/ directory' },
      { letter: 'B', text: 'In ~/.claude/ (user home directory)' },
      { letter: 'C', text: 'In /etc/claude/' },
      { letter: 'D', text: 'In environment variables only' },
    ],
    correct: 'B',
    explanation:
      'User-level settings go in ~/.claude/ (the user\'s home directory). This includes user CLAUDE.md, settings.json, and other personal configuration. Project-level settings go in the project\'s .claude/ directory.',
  },
  {
    text: 'What file format are Claude Code custom commands written in?',
    domain: 'Domain 3',
    options: [
      { letter: 'A', text: 'JSON' },
      { letter: 'B', text: 'Markdown (.md) with optional YAML frontmatter' },
      { letter: 'C', text: 'YAML' },
      { letter: 'D', text: 'TypeScript' },
    ],
    correct: 'B',
    explanation:
      'Custom commands are markdown files (.md) with optional YAML frontmatter for metadata. The frontmatter can specify name, description, allowed-tools, argument hints, and other configuration. The markdown body contains the prompt template.',
  },
  {
    text: 'What does the `allowed-tools` frontmatter field in a command file do?',
    domain: 'Domain 3',
    options: [
      { letter: 'A', text: 'Lists tools that must be called during the command' },
      { letter: 'B', text: 'Restricts which tools Claude can use while executing this command' },
      { letter: 'C', text: 'Defines new tools for the command' },
      { letter: 'D', text: 'Specifies which MCP servers to connect to' },
    ],
    correct: 'B',
    explanation:
      'allowed-tools restricts which tools Claude can use while executing the command. This provides a security boundary — for example, a "plan" command might only allow Read, Grep, Glob (no Edit, Write, Bash) to prevent accidental changes during planning.',
  },
  {
    scenario: 'You want to prevent Claude Code from modifying files in the `config/production/` directory.',
    text: 'What is the most reliable approach?',
    domain: 'Domain 3',
    options: [
      { letter: 'A', text: 'Add "do not edit config/production/" to CLAUDE.md' },
      { letter: 'B', text: 'Create a CLAUDE.md in config/production/ with strict read-only rules' },
      { letter: 'C', text: 'Use permission settings in settings.json to deny write access to that path' },
      { letter: 'D', text: 'Remove the directory from the project' },
    ],
    correct: 'C',
    explanation:
      'Permission settings in settings.json provide system-level enforcement. CLAUDE.md instructions are advisory — Claude tries to follow them but they can be overridden. Settings.json permissions are enforced by the tool execution layer, making them the most reliable protection.',
  },
  {
    text: 'How do hooks differ from CLAUDE.md instructions?',
    domain: 'Domain 3',
    options: [
      { letter: 'A', text: 'They are the same thing' },
      { letter: 'B', text: 'Hooks are shell commands that execute automatically; CLAUDE.md instructions are advisory guidance for Claude' },
      { letter: 'C', text: 'Hooks are faster; CLAUDE.md is more accurate' },
      { letter: 'D', text: 'CLAUDE.md is enforced; hooks are optional' },
    ],
    correct: 'B',
    explanation:
      'Hooks are shell commands executed by the system automatically on events (before/after tool calls, commits, etc.). They are enforced — the system runs them regardless of what Claude does. CLAUDE.md provides guidance that Claude tries to follow but isn\'t mechanically enforced.',
  },
  {
    text: 'What does the `disable-model-invocation` frontmatter option do in a command file?',
    domain: 'Domain 3',
    options: [
      { letter: 'A', text: 'Disables the language model entirely' },
      { letter: 'B', text: 'Prevents the command from triggering additional Claude API calls beyond the initial one' },
      { letter: 'C', text: 'Reduces the model\'s token limit' },
      { letter: 'D', text: 'Switches to a cheaper model' },
    ],
    correct: 'B',
    explanation:
      'disable-model-invocation prevents the command from making additional Claude API calls. This is useful for commands that should only expand a template without iterative reasoning — keeping costs predictable and behavior deterministic.',
  },
  {
    text: 'What is the purpose of `settings.local.json` vs `settings.json`?',
    domain: 'Domain 3',
    options: [
      { letter: 'A', text: 'They serve the same purpose' },
      { letter: 'B', text: 'settings.local.json is for personal overrides not committed to git; settings.json is for shared team config' },
      { letter: 'C', text: 'settings.local.json is for production; settings.json is for development' },
      { letter: 'D', text: 'settings.local.json overrides are weaker than settings.json' },
    ],
    correct: 'B',
    explanation:
      'settings.json contains shared team configuration committed to the repo. settings.local.json is for personal overrides (e.g., different MCP servers, personal permissions) that should NOT be committed. Local settings override shared settings.',
  },
  {
    text: 'How can Claude Code be integrated into a GitHub Actions CI/CD pipeline?',
    domain: 'Domain 3',
    options: [
      { letter: 'A', text: 'Add Claude Code as a Git hook' },
      { letter: 'B', text: 'Use the `claude -p` command with a prompt in a workflow step, configured with API key and allowed tools' },
      { letter: 'C', text: 'Install Claude Code as a GitHub App' },
      { letter: 'D', text: 'Use webhook callbacks' },
    ],
    correct: 'B',
    explanation:
      'In CI/CD, use `claude -p "your prompt"` in a GitHub Actions workflow step. Set the ANTHROPIC_API_KEY as a secret and configure --allowedTools for the specific tools needed. The -p flag enables non-interactive execution suitable for automation.',
  },
  {
    text: 'What does the `--allowedTools` flag do when running Claude Code with `-p`?',
    domain: 'Domain 3',
    options: [
      { letter: 'A', text: 'It lists tools for debugging purposes' },
      { letter: 'B', text: 'It explicitly permits specific tools, since -p mode has no interactive approval' },
      { letter: 'C', text: 'It disables all tools not in the list' },
      { letter: 'D', text: 'Both B and C' },
    ],
    correct: 'D',
    explanation:
      'In -p mode, there\'s no user to approve tool usage. --allowedTools both permits the listed tools AND prevents use of any tools not listed. This provides explicit security control for automated/CI environments.',
  },
  {
    text: 'What is the benefit of using skills over simple custom commands?',
    domain: 'Domain 3',
    options: [
      { letter: 'A', text: 'Skills are faster to execute' },
      { letter: 'B', text: 'Skills provide tool restrictions, metadata, argument hints, and can be shared as reusable packages' },
      { letter: 'C', text: 'Skills can access the internet; commands cannot' },
      { letter: 'D', text: 'Skills use less memory' },
    ],
    correct: 'B',
    explanation:
      'Skills extend commands with: allowed-tools (security boundary), metadata (description, triggers), argument-hint (usage guidance), disable-model-invocation, and are structured for sharing as reusable packages. They provide more control and discoverability than basic commands.',
  },
  {
    text: 'What is the recommended approach for iterative refinement in Claude Code?',
    domain: 'Domain 3',
    options: [
      { letter: 'A', text: 'Write everything in one prompt' },
      { letter: 'B', text: 'Use Plan Mode to design, then exit and implement, then review and iterate' },
      { letter: 'C', text: 'Always start over from scratch if the first attempt isn\'t perfect' },
      { letter: 'D', text: 'Let Claude decide the entire approach without guidance' },
    ],
    correct: 'B',
    explanation:
      'Plan Mode → implement → review → iterate is the recommended workflow. Plan Mode (read-only) lets you design safely. Then exit Plan Mode to implement. Review the results and iterate. This prevents premature changes while keeping progress moving forward.',
  },

  // Domain 4: Prompt Engineering (11 questions)
  {
    text: 'What is the key advantage of using the `system` parameter instead of putting instructions in the first user message?',
    domain: 'Domain 4',
    options: [
      { letter: 'A', text: 'It\'s cheaper in terms of tokens' },
      { letter: 'B', text: 'System instructions persist across all turns and are treated as higher-priority context' },
      { letter: 'C', text: 'It allows longer text' },
      { letter: 'D', text: 'It supports images' },
    ],
    correct: 'B',
    explanation:
      'The system parameter provides instructions that persist across all turns and receive special treatment — they\'re always present and treated as foundational context. User messages may be summarized or truncated in long conversations, but system instructions maintain their position and weight.',
  },
  {
    text: 'When creating a tool specifically for structured output (not actual execution), what should `tool_choice` be set to?',
    domain: 'Domain 4',
    options: [
      { letter: 'A', text: '{ "type": "auto" }' },
      { letter: 'B', text: '{ "type": "tool", "name": "your_output_tool" }' },
      { letter: 'C', text: '{ "type": "any" }' },
      { letter: 'D', text: 'Don\'t set tool_choice' },
    ],
    correct: 'B',
    explanation:
      'When using a tool purely for structured output, force it with { "type": "tool", "name": "your_tool" }. This ensures Claude always provides output through the tool (guaranteeing schema compliance) rather than sometimes responding with free-form text.',
  },
  {
    text: 'What is "prefilling" in the Claude API?',
    domain: 'Domain 4',
    options: [
      { letter: 'A', text: 'Pre-loading the model with training data' },
      { letter: 'B', text: 'Including an assistant message with partial content to steer Claude\'s response format' },
      { letter: 'C', text: 'Caching the system prompt' },
      { letter: 'D', text: 'Sending the prompt before the conversation starts' },
    ],
    correct: 'B',
    explanation:
      'Prefilling means including an assistant message with partial content in the messages array. For example, adding { "role": "assistant", "content": "{" } steers Claude to continue with JSON. It\'s a powerful technique for controlling output format without extra instructions.',
  },
  {
    text: 'How many messages should a few-shot example typically include?',
    domain: 'Domain 4',
    options: [
      { letter: 'A', text: 'Always exactly 3' },
      { letter: 'B', text: '2-4 diverse examples covering the main patterns and edge cases' },
      { letter: 'C', text: 'As many as possible for the best results' },
      { letter: 'D', text: 'Exactly 1 — more examples confuse the model' },
    ],
    correct: 'B',
    explanation:
      '2-4 diverse examples typically provides the best balance. They should cover the main patterns and at least one edge case. More examples consume context without proportional benefit; fewer may not demonstrate the pattern clearly enough. Focus on diversity over quantity.',
  },
  {
    text: 'What is the difference between `max_tokens` and the model\'s context window limit?',
    domain: 'Domain 4',
    options: [
      { letter: 'A', text: 'They are the same thing' },
      { letter: 'B', text: 'max_tokens limits the response length; context window limits the total input + output tokens' },
      { letter: 'C', text: 'max_tokens is for the prompt; context window is for the response' },
      { letter: 'D', text: 'max_tokens is deprecated' },
    ],
    correct: 'B',
    explanation:
      'max_tokens limits how long Claude\'s response can be. The context window is the total capacity for input (prompt + history) plus output. You must ensure input tokens + max_tokens doesn\'t exceed the context window. Setting max_tokens too low causes truncation (stop_reason: "max_tokens").',
  },
  {
    text: 'When should you use XML tags like <instructions> in prompts?',
    domain: 'Domain 4',
    options: [
      { letter: 'A', text: 'Never — they confuse Claude' },
      { letter: 'B', text: 'When you need to clearly delineate different sections of a complex prompt' },
      { letter: 'C', text: 'Only in system prompts' },
      { letter: 'D', text: 'Only when Claude requests them' },
    ],
    correct: 'B',
    explanation:
      'XML tags help Claude distinguish between different parts of a complex prompt — instructions vs. context vs. examples vs. user input. They act as clear section boundaries, reducing confusion about where instructions end and content begins. Claude is trained to understand XML structure well.',
  },
  {
    text: 'What is the "chain of thought" technique and when is it most useful?',
    domain: 'Domain 4',
    options: [
      { letter: 'A', text: 'Asking Claude to explain its answer — useful for all queries' },
      { letter: 'B', text: 'Prompting Claude to reason step-by-step before answering — most useful for complex reasoning tasks' },
      { letter: 'C', text: 'Chaining multiple API calls together' },
      { letter: 'D', text: 'Using Claude\'s thinking blocks in Extended Thinking mode' },
    ],
    correct: 'B',
    explanation:
      'Chain of thought prompts Claude to reason step-by-step before giving a final answer. It\'s most useful for complex reasoning, math, logic, and multi-step analysis where the intermediate steps improve accuracy. For simple factual queries, it adds unnecessary verbosity.',
  },
  {
    text: 'What cache_control type is used for prompt caching?',
    domain: 'Domain 4',
    options: [
      { letter: 'A', text: '{ "type": "permanent" }' },
      { letter: 'B', text: '{ "type": "ephemeral" }' },
      { letter: 'C', text: '{ "type": "session" }' },
      { letter: 'D', text: '{ "type": "ttl", "seconds": 300 }' },
    ],
    correct: 'B',
    explanation:
      'cache_control: { "type": "ephemeral" } is used for prompt caching. "Ephemeral" means the cache has a limited lifetime (typically 5 minutes) and is automatically refreshed when reused. There is no "permanent" or "session" type in the current API.',
  },
  {
    text: 'What is the risk of putting mutable data in the system prompt?',
    domain: 'Domain 4',
    options: [
      { letter: 'A', text: 'It costs more tokens' },
      { letter: 'B', text: 'The system prompt is cached — changes won\'t take effect until the cache expires' },
      { letter: 'C', text: 'Mutable data in the system prompt can become stale, leading to incorrect behavior' },
      { letter: 'D', text: 'There is no risk' },
    ],
    correct: 'C',
    explanation:
      'If you put frequently changing data (like "current inventory: 5 items") in the system prompt, it may become stale within the conversation. Better to put static instructions in the system prompt and provide mutable data through tool calls or user messages where it stays current.',
  },
  {
    scenario: 'You want Claude to always respond with a specific JSON format: { "answer": string, "confidence": number }.',
    text: 'What is the most robust approach?',
    domain: 'Domain 4',
    options: [
      { letter: 'A', text: 'Add "Always respond in this JSON format" to the system prompt' },
      { letter: 'B', text: 'Create a tool with input_schema matching the format and force it with tool_choice' },
      { letter: 'C', text: 'Use prefilling with \'{ "answer":\'' },
      { letter: 'D', text: 'Use few-shot examples showing the format' },
    ],
    correct: 'B',
    explanation:
      'A tool with the exact input_schema + tool_choice forcing that tool is the most robust approach. It guarantees schema compliance every time. Other approaches (prompt instructions, prefilling, few-shot) are helpful but can still produce non-conforming output occasionally.',
  },
  {
    text: 'How does the Batch API differ from the standard Messages API?',
    domain: 'Domain 4',
    options: [
      { letter: 'A', text: 'It uses a different model' },
      { letter: 'B', text: 'Requests are processed asynchronously with 24h SLA, at 50% lower cost, but no streaming' },
      { letter: 'C', text: 'It supports more tokens' },
      { letter: 'D', text: 'It requires a different API key' },
    ],
    correct: 'B',
    explanation:
      'The Batch API processes requests asynchronously with a 24-hour service level agreement at 50% lower cost. Requests don\'t stream — you submit a batch and poll or wait for results. Ideal for bulk processing where real-time responses aren\'t needed.',
  },

  // Domain 5: Context Management & Reliability (9 questions)
  {
    text: 'What is "context window management" and why does it matter?',
    domain: 'Domain 5',
    options: [
      { letter: 'A', text: 'Managing browser windows — it doesn\'t matter for APIs' },
      { letter: 'B', text: 'Strategically managing what information occupies the limited context window to maximize agent effectiveness' },
      { letter: 'C', text: 'Opening multiple conversations in parallel' },
      { letter: 'D', text: 'Setting the max_tokens parameter' },
    ],
    correct: 'B',
    explanation:
      'Context window management means strategically controlling what information occupies the finite context space. This includes summarizing old messages, extracting key information to persistent storage, managing tool result sizes, and ensuring critical instructions stay in context.',
  },
  {
    text: 'What is the "summarize and persist" pattern for long conversations?',
    domain: 'Domain 5',
    options: [
      { letter: 'A', text: 'Summarizing the conversation for the user' },
      { letter: 'B', text: 'Periodically summarizing key decisions/state to a file and referencing it, freeing context window space' },
      { letter: 'C', text: 'Asking Claude to write shorter responses' },
      { letter: 'D', text: 'Compressing messages with gzip' },
    ],
    correct: 'B',
    explanation:
      'The "summarize and persist" pattern involves periodically extracting key decisions, state, and context into a persistent file (or system prompt), then referencing it. This frees context window space while preserving critical information, enabling longer effective conversations.',
  },
  {
    text: 'When should an agent request human review?',
    domain: 'Domain 5',
    options: [
      { letter: 'A', text: 'Only when it encounters an API error' },
      { letter: 'B', text: 'When actions are irreversible, high-stakes, or the agent\'s confidence is below a defined threshold' },
      { letter: 'C', text: 'Before every single action' },
      { letter: 'D', text: 'Never — fully autonomous agents should handle everything' },
    ],
    correct: 'B',
    explanation:
      'Human review is warranted for irreversible actions (deleting data), high-stakes decisions (financial transactions), and low-confidence situations. The agent should be calibrated to know its own uncertainty and have defined thresholds for when to proceed vs. when to pause for human input.',
  },
  {
    text: 'What is the "breadcrumb" technique for context preservation?',
    domain: 'Domain 5',
    options: [
      { letter: 'A', text: 'Leaving comments in code' },
      { letter: 'B', text: 'Recording key file paths, decisions, and state markers that help resume context after compaction' },
      { letter: 'C', text: 'Creating a trail of log files' },
      { letter: 'D', text: 'Using git blame to track changes' },
    ],
    correct: 'B',
    explanation:
      'Breadcrumbs are concise records of key file paths, decisions, and state markers that help an agent (or the next session) quickly reconstruct context. After context compaction or session boundary, reading breadcrumbs is faster than re-discovering everything.',
  },
  {
    scenario: 'Your agent is processing a 200-page document and needs to answer questions about it.',
    text: 'What is the most effective approach?',
    domain: 'Domain 5',
    options: [
      { letter: 'A', text: 'Load the entire document into the context window' },
      { letter: 'B', text: 'Extract relevant sections using search/chunking, then include only those in the prompt' },
      { letter: 'C', text: 'Summarize the document to 1 page and use that' },
      { letter: 'D', text: 'Create a separate conversation for each page' },
    ],
    correct: 'B',
    explanation:
      'For large documents, extract relevant sections using search or chunking strategies, then include only those in the prompt. This keeps the context focused and efficient. Full document loading wastes context space on irrelevant content; over-summarizing loses detail.',
  },
  {
    text: 'What is the difference between "transient" and "persistent" context in an agent?',
    domain: 'Domain 5',
    options: [
      { letter: 'A', text: 'Transient context exists only in the current conversation; persistent context survives across sessions' },
      { letter: 'B', text: 'They are the same thing' },
      { letter: 'C', text: 'Transient is cheaper; persistent costs more' },
      { letter: 'D', text: 'Transient is for text; persistent is for files' },
    ],
    correct: 'A',
    explanation:
      'Transient context (conversation messages, tool results) exists only in the current session and is lost when it ends. Persistent context (files, databases, CLAUDE.md) survives across sessions. Agents should persist critical information that must survive session boundaries.',
  },
  {
    text: 'How should an agent handle a situation where it\'s unsure about the user\'s intent?',
    domain: 'Domain 5',
    options: [
      { letter: 'A', text: 'Proceed with the most common interpretation' },
      { letter: 'B', text: 'Refuse to act' },
      { letter: 'C', text: 'State what it understands and ask a clarifying question with specific options' },
      { letter: 'D', text: 'Try all possible interpretations' },
    ],
    correct: 'C',
    explanation:
      'Best practice: state what you understand ("I think you want X"), and ask a clarifying question with specific options ("Did you mean A, B, or C?"). This shows the user your interpretation (which may be correct), while offering alternatives if it\'s wrong.',
  },
  {
    text: 'What is the purpose of a "checkpoint" in long-running agent tasks?',
    domain: 'Domain 5',
    options: [
      { letter: 'A', text: 'Saving the model weights' },
      { letter: 'B', text: 'Recording the current state so the agent can resume from that point if interrupted' },
      { letter: 'C', text: 'Creating a git commit' },
      { letter: 'D', text: 'Measuring performance' },
    ],
    correct: 'B',
    explanation:
      'Checkpoints record the agent\'s current state — what\'s been done, what\'s pending, key decisions, and relevant context — so the agent (or a new session) can resume from that point if interrupted. This is critical for tasks that span long periods or multiple sessions.',
  },
  {
    text: 'What is the recommended approach when an agent encounters conflicting information from two different tools?',
    domain: 'Domain 5',
    options: [
      { letter: 'A', text: 'Always trust the most recent result' },
      { letter: 'B', text: 'Always trust the first result' },
      { letter: 'C', text: 'Evaluate the reliability of each source, attempt verification, and communicate the conflict transparently' },
      { letter: 'D', text: 'Average the results' },
    ],
    correct: 'C',
    explanation:
      'When tools give conflicting information, the agent should: evaluate which source is more authoritative, attempt to verify independently if possible, and communicate the conflict to the user transparently. Blind trust in recency or order can propagate errors.',
  },
]

export const examData: Record<string, ExamQuestion[]> = {
  '1': exam1,
  '2': exam2,
}
