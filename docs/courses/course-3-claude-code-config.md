# Course 3: Claude Code Configuration & Workflows

> **Exam Weight: 20%** — Third-largest domain. Highly practical and testable.

---

## Module 3.1 — CLAUDE.md Configuration Hierarchy

### The Three Levels

```
                                      Specificity / Priority on Conflict
                                              ▲
  subdirectory/CLAUDE.md              ← Most specific (WINS on conflict)  │
                                                                          │
  .claude/CLAUDE.md or root CLAUDE.md ← Project-level (shared via repo)   │
                                                                          │
  ~/.claude/CLAUDE.md                 ← User-level (personal, NOT shared) │
                                              ▼
```

All levels are **loaded and merged** — they are additive, not replacements. When instructions conflict, the **most specific level wins** (directory-level overrides project-level, which overrides user-level).

### The Most Common Exam Trap

> **Scenario:** A new team member joins and doesn't get the team's coding conventions.
> **Root cause:** The instructions are in `~/.claude/CLAUDE.md` (user-level), not project-level.
> **Fix:** Move to `.claude/CLAUDE.md` (version controlled, shared via repo).

### The `@import` Syntax

Keep CLAUDE.md modular by importing external files:

```markdown
# CLAUDE.md
Follow our coding standards defined in:
@./standards/coding-style.md
@./standards/testing-rules.md
@./standards/api-conventions.md
```

- Maximum **5 nesting levels** for imports
- Paths are relative to the CLAUDE.md file location
- Keeps each file focused and maintainable

### `.claude/rules/` Directory

An alternative to one big CLAUDE.md — organize rules by topic:

```
.claude/
  rules/
    testing.md           ← Testing conventions
    api-conventions.md   ← API design rules
    deployment.md        ← Deployment procedures
    security.md          ← Security requirements
```

Each file can have **YAML frontmatter** for path-scoping (covered in Module 3.3).

### The `/memory` Command

Use `/memory` to **edit your user-level CLAUDE.md** — add or modify persistent memory entries that Claude remembers across sessions:

- **Add** new preferences, conventions, or project context
- **Modify** existing memory entries
- **Debug** why behavior differs between team members (different user-level memories)

---

## Module 3.2 — Custom Commands and Skills

### Commands vs Skills

| Feature | Commands | Skills |
|---|---|---|
| Location | `.claude/commands/` | `.claude/skills/` |
| Invocation | Slash command (`/review`) | On-demand or referenced |
| Configuration | Just a markdown file | SKILL.md with **frontmatter** |
| Isolation | Runs in main context | Can run in **forked context** |
| Tool restrictions | No | Yes (`allowed-tools`) |

### Project vs User Scope

| Scope | Commands | Skills |
|---|---|---|
| **Project** (shared) | `.claude/commands/` | `.claude/skills/` |
| **Personal** | `~/.claude/commands/` | `~/.claude/skills/` |

Project scope = version controlled = shared with team.
User scope = personal only = not shared.

### SKILL.md Frontmatter Options

```yaml
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
```

### `context: fork` — The Key Feature

When a skill produces **verbose output** (e.g., codebase analysis, brainstorming), it can pollute the main conversation context with discovery data.

**Without fork:** Skill output stays in main context → eats token budget → degrades later responses.

**With `context: fork`:** Skill runs in an **isolated sub-agent context**. Only the skill's final summary returns to the main conversation.

### `allowed-tools` — Restricting Tool Access

```yaml
allowed-tools:
  - Read
  - Grep
  - Glob
```

This prevents a skill from using destructive tools (Write, Bash, Edit) when it only needs to read/analyze.

### `argument-hint` — Prompting for Parameters

When a developer invokes a skill without arguments:

```yaml
argument-hint: "Provide the module name to analyze"
```

Claude will prompt: "Which module would you like me to analyze?"

### Skills vs CLAUDE.md: When to Use Which

| Use Case | Mechanism |
|---|---|
| **Always loaded**, universal standards | CLAUDE.md |
| **On-demand**, task-specific workflow | Skill |
| Verbose output that shouldn't pollute context | Skill with `context: fork` |
| Restricted tool access needed | Skill with `allowed-tools` |

---

## Module 3.3 — Path-Specific Rules

### YAML Frontmatter with Glob Patterns

```yaml
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
```

This file only loads when Claude is editing files matching those glob patterns.

### Rules vs Directory CLAUDE.md

| Scenario | Best Choice |
|---|---|
| Conventions for **scattered files** (tests everywhere) | `.claude/rules/` with globs |
| Conventions for a **specific directory** (`src/api/`) | Directory-level `CLAUDE.md` |

**Why?** Test files live alongside source code (`Button.test.tsx` next to `Button.tsx`). A directory-level CLAUDE.md can't cover test files spread across 50 directories. Glob patterns can.

### Examples

```yaml
# .claude/rules/terraform.md
---
paths:
  - "terraform/**/*"
---
# Terraform rules...
```

```yaml
# .claude/rules/api.md
---
paths:
  - "src/api/**/*"
  - "src/routes/**/*"
---
# API conventions...
```

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

```
1. Plan mode → Explore + design (context-efficient)
2. Direct execution → Implement the planned approach (focused)
```

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

```markdown
Transform dates to ISO format:

Input: "March 5th, 2025"
Output: "2025-03-05"

Input: "5/3/25"
Output: "2025-03-05"

Input: "last Tuesday"
Output: null (cannot determine absolute date)
```

2–3 examples are usually enough to resolve ambiguity.

### Test-Driven Iteration

```
1. Write test suite (expected behavior, edge cases, performance)
2. Ask Claude to implement
3. Run tests → share failures with Claude
4. Claude fixes → re-test
5. Repeat until all tests pass
```

### Interview Pattern

Instead of diving into implementation, have Claude **ask questions first**:

```
"Before I implement the caching layer, I have some questions:
1. What's the expected cache invalidation strategy?
2. Should cache misses fall through to the database synchronously?
3. Are there any consistency requirements between cache and DB?
4. What's the expected cache hit ratio?"
```

This surfaces considerations you might not have anticipated.

### Sequential vs Parallel Issue Resolution

- **Independent problems** → Fix one at a time (sequential messages)
- **Interacting problems** → Describe all in one message (fixes may conflict)

---

## Module 3.6 — CI/CD Integration

### The `-p` Flag

> **This is the single most tested CI/CD fact:** Use `-p` (or `--print`) for non-interactive mode.

```bash
# ✅ Correct — non-interactive, prints to stdout, exits
claude -p "Analyze this PR for security issues"

# ❌ Wrong — hangs waiting for interactive input
claude "Analyze this PR for security issues"
```

### Structured CI Output

```bash
# JSON output with schema validation
claude -p "Review this PR" \
  --output-format json \
  --json-schema '{"type":"object","properties":{"findings":[...]}}'
```

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

A) `.claude/CLAUDE.md` in the project
B) `~/.claude/CLAUDE.md` in the original developer's home directory
C) `.claude/rules/conventions.md` with path scoping
D) `.claude/skills/SKILL.md` with the conventions

**Answer: B** — User-level config isn't shared. Move to project-level `.claude/CLAUDE.md`.

---

**Q2:** Your CI pipeline runs `claude "Review this PR"` but the job hangs indefinitely. What's wrong?

A) Missing `CLAUDE_HEADLESS=true` environment variable
B) Need to add the `-p` flag for non-interactive mode
C) Need to redirect stdin from `/dev/null`
D) Need to add the `--batch` flag

**Answer: B** — `-p` is the documented way to run Claude Code in CI. The other options don't exist.

---

**Q3:** Test files are spread across the codebase (`Button.test.tsx` alongside `Button.tsx`). You want consistent test conventions everywhere. What's the best approach?

A) `.claude/rules/testing.md` with `paths: ["**/*.test.tsx", "**/*.test.ts"]`
B) Root CLAUDE.md with test conventions under a "Testing" header
C) `.claude/skills/testing-skill/SKILL.md` with test conventions
D) CLAUDE.md in each subdirectory containing test files

**Answer: A** — Glob patterns match scattered files regardless of directory. B relies on inference. C requires manual invocation. D is impractical for 50+ directories.

---

**Q4:** A skill produces verbose codebase analysis output that fills the context window. How do you prevent this from degrading later responses?

A) Add `allowed-tools: [Read, Grep]` to the SKILL.md frontmatter
B) Add `context: fork` to the SKILL.md frontmatter
C) Move the skill instructions to CLAUDE.md
D) Split the skill into multiple smaller skills

**Answer: B** — `context: fork` runs the skill in an isolated sub-agent context. Only the summary returns to the main conversation.
