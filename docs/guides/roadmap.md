# Claude Certified Architect — Foundations: Study Roadmap

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

**File:** [Course 1](../courses/course-1-agentic-architecture.md)

This is the **highest-weighted domain**. Start here, no exceptions.

| Priority | Task Statement | Key Concept |
|---|---|---|
| Critical | 1.1 — Agentic loops | `stop_reason == "tool_use"` vs `"end_turn"` |
| Critical | 1.2 — Multi-agent coordination | Hub-and-spoke, coordinator-subagent pattern |
| Critical | 1.3 — Subagent invocation & context passing | `Task` tool, `allowedTools`, isolated context |
| High | 1.4 — Multi-step workflows & handoffs | Hooks vs prompt-based enforcement |
| High | 1.5 — Agent SDK hooks | `PostToolUse` for interception & normalization |
| Medium | 1.6 — Task decomposition strategies | Prompt chaining vs dynamic decomposition |
| Medium | 1.7 — Session state & forking | `--resume`, `fork_session` |

**Study actions:**
1. Read the full course end-to-end
2. Memorize the `stop_reason` loop pattern — it appears in many questions
3. Understand why parsing text content for termination is an anti-pattern
4. Know the difference between hooks (deterministic) vs prompts (probabilistic)
5. Answer the 4 practice questions at the end, review wrong answers

---

### Day 3: Course 2 — Tool Design & MCP Integration (18%)

**File:** [Course 2](../courses/course-2-tool-design-mcp.md)

Builds directly on Course 1. Tool design is tightly coupled with agent architecture.

| Priority | Task Statement | Key Concept |
|---|---|---|
| Critical | 2.1 — Tool descriptions & boundaries | Descriptions drive tool selection, not names |
| Critical | 2.2 — Structured error responses | `isError` flag, `errorCategory`, `isRetryable` |
| High | 2.3 — Tool distribution & tool choice | 4-5 tools per agent, scoped access |
| High | 2.4 — MCP server configuration | Transport types, `allowedTools` filtering |
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

**File:** [Course 3](../courses/course-3-claude-code-config.md)

Very practical and testable. Many questions are about config file specifics.

| Priority | Task Statement | Key Concept |
|---|---|---|
| Critical | 3.1 — CLAUDE.md hierarchy | Project vs user vs enterprise scope |
| Critical | 3.2 — Custom slash commands | `.claude/commands/` directory structure |
| High | 3.3 — Permission modes | Allowlists, `--allowedTools`, plan mode |
| High | 3.4 — MCP server configuration in Claude Code | `claude_desktop_config.json`, transport types |
| Medium | 3.5 — CI/CD integration | `--print`, `-p` flag, non-interactive mode |
| Medium | 3.6 — Plan mode | When to plan vs when to execute directly |

**Study actions:**
1. Read the full course
2. Know the CLAUDE.md file hierarchy and override behavior
3. Understand slash command file naming conventions
4. Know CI/CD flags and patterns
5. Answer practice questions

---

### Day 6-7: Course 4 — Prompt Engineering & Structured Output (20%)

**File:** [Course 4](../courses/course-4-prompt-engineering.md)

Overlaps with Course 2 (tool descriptions) and Course 3 (CI prompts).

| Priority | Task Statement | Key Concept |
|---|---|---|
| Critical | 4.1 — System prompts for agents | Role, constraints, output format |
| Critical | 4.2 — Structured output with JSON schemas | `response_format`, schema enforcement |
| High | 4.3 — Few-shot examples | When to use, formatting patterns |
| High | 4.4 — Extraction prompts | Field-by-field instructions, edge cases |
| Medium | 4.5 — Prompt chaining for quality | Verification passes, self-evaluation |
| Medium | 4.6 — CI/CD prompt design | Actionable feedback, minimizing false positives |

**Study actions:**
1. Read the full course
2. Understand `response_format` vs prompt-only JSON enforcement
3. Know when few-shot helps vs when it wastes context
4. Know the extraction pattern: instructions > examples > edge case handling
5. Answer practice questions

---

## Phase 3: Tie It Together (Days 10-11)

> Goal: Master the final domain that connects everything

### Day 8: Course 5 — Context Management & Reliability (15%)

**File:** [Course 5](../courses/course-5-context-reliability.md)

Lowest weight but ties all other domains together. Don't skip it.

| Priority | Task Statement | Key Concept |
|---|---|---|
| Critical | 5.1 — Context window management | Token limits, summarization strategies |
| Critical | 5.2 — Multi-turn conversation design | Message history, context injection |
| High | 5.3 — Escalation & human-in-the-loop | When to escalate vs when to deny |
| High | 5.4 — Self-evaluation & reliability | Confidence thresholds, verification loops |
| Medium | 5.5 — Caching & cost optimization | `cache_control`, prompt caching patterns |
| Medium | 5.6 — Error recovery & graceful degradation | Partial results, fallback strategies |

**Study actions:**
1. Read the full course
2. Understand context window tradeoffs deeply
3. Know the escalation decision framework
4. Know caching patterns (exam tests specific API details)
5. Answer practice questions

---

### Day 9: Course 6 — Exam Edge Cases & Traps (Supplementary)

**File:** [Course 6](../courses/course-6-exam-edge-cases.md)

Read this **after** Courses 1-5. It covers the 6 most common exam traps.

**Key traps to master:**
1. **"Policy Silent" vs "Policy Denies"** — opposite actions for similar-looking scenarios
2. **Hooks vs prompts** — when deterministic enforcement is required
3. **`stop_reason` anti-patterns** — text parsing, iteration caps as primary mechanism
4. **Tool count tradeoffs** — why fewer tools per agent is better
5. **Context passing between agents** — subagents don't inherit parent context
6. **Structured errors vs generic errors** — `isRetryable` and `errorCategory` specifics

---

## Phase 4: Practice Exams (Days 12-16)

> Goal: Test knowledge under exam conditions, identify weak areas, and close gaps

### Day 10-11: Mock Exam 1

**File:** [Mock Exam 1](../exams/mock-exam.md) — 60 questions, all 6 scenarios

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

**File:** [Mock Exam 2](../exams/mock-exam-2.md) — 60 new questions, different scenario mix

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

- [ ] `stop_reason == "tool_use"` → continue loop; `"end_turn"` → exit loop; `"max_tokens"` → continue conversation
- [ ] Append assistant message ONCE before processing tool calls; batch tool results into ONE user message
- [ ] Iteration caps are fine as a SECONDARY safety net, not the primary mechanism
- [ ] Subagents do NOT inherit parent context — pass data explicitly in the prompt
- [ ] Hooks = deterministic enforcement; Prompts = probabilistic guidance
- [ ] 4-5 tools per agent is optimal; 18+ tools degrades selection reliability
- [ ] `isError: true` + `errorCategory` + `isRetryable` = recommended error design pattern (not MCP spec fields)
- [ ] CLAUDE.md hierarchy: all levels merged; most specific (directory-level) wins on conflict
- [ ] Custom slash commands live in `.claude/commands/`
- [ ] `--print` and `-p` flags for CI/CD non-interactive mode
- [ ] Policy silent on a request → escalate; Policy explicitly denies → deny
- [ ] `fork_session` for parallel exploration from a shared baseline
- [ ] `cache_control: {"type": "ephemeral"}` for caching stable content (system prompts, docs) — 90% cost savings
- [ ] Few-shot examples: useful for ambiguous formats, wasteful for simple extractions
- [ ] `/memory` edits user-level CLAUDE.md — not just a diagnostic command

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
| Exam traps & edge cases | Course 6 | — |
