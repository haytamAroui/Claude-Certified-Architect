<p align="center">
  <img src="https://img.shields.io/badge/Anthropic-Claude_Certified_Architect-6B4FBB?style=for-the-badge&logo=anthropic&logoColor=white" alt="Claude Certified Architect"/>
</p>

<h1 align="center">Claude Certified Architect — Foundations</h1>

<p align="center">
  <strong>Complete Study Guide & Exam Preparation Kit</strong><br/>
  <em>6 Courses | 27 Task Statements | 120 Practice Questions | 5 Domains</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Questions-120-blue?style=flat-square" alt="120 Questions"/>
  <img src="https://img.shields.io/badge/Courses-6-green?style=flat-square" alt="6 Courses"/>
  <img src="https://img.shields.io/badge/Passing_Score-720%2F1000-orange?style=flat-square" alt="Passing Score 720"/>
  <img src="https://img.shields.io/badge/Exam_Time-120_min-red?style=flat-square" alt="120 Minutes"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="MIT License"/>
</p>

---

## About This Repository

This is a **comprehensive, self-contained study guide** for the [Claude Certified Architect — Foundations](https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request) certification exam by Anthropic. It covers all 5 exam domains, all 27 task statements, and includes 120 scenario-based practice questions across 2 full mock exams.

> **Register for the exam:** [anthropic.skilljar.com/claude-certified-architect-foundations-access-request](https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request)

**Who is this for?**
- Solution architects building production applications with Claude
- Developers with 6+ months of experience with Claude API, Agent SDK, Claude Code, and MCP
- Anyone preparing to take the Claude Certified Architect — Foundations exam

---

## Table of Contents

| # | Section | Description |
|---|---|---|
| 0 | [Study Roadmap](docs/guides/roadmap.md) | 2-3 week study plan with daily schedule |
| 1 | [Agentic Architecture & Orchestration](docs/courses/course-1-agentic-architecture.md) | Agent loops, multi-agent systems, hooks, decomposition (27%) |
| 2 | [Tool Design & MCP Integration](docs/courses/course-2-tool-design-mcp.md) | Tool descriptions, error handling, MCP servers (18%) |
| 3 | [Claude Code Configuration & Workflows](docs/courses/course-3-claude-code-config.md) | CLAUDE.md, slash commands, permissions, CI/CD (20%) |
| 4 | [Prompt Engineering & Structured Output](docs/courses/course-4-prompt-engineering.md) | System prompts, JSON schemas, few-shot, extraction (20%) |
| 5 | [Context Management & Reliability](docs/courses/course-5-context-reliability.md) | Context windows, escalation, caching, error recovery (15%) |
| 6 | [Exam Edge Cases & Traps](docs/courses/course-6-exam-edge-cases.md) | Subtle distinctions and common pitfalls |
| E1 | [Mock Exam 1](docs/exams/mock-exam.md) | 60 questions — all 6 scenarios |
| E2 | [Mock Exam 2](docs/exams/mock-exam-2.md) | 60 questions — different scenario mix |

---

## Exam Overview

```
Format:        Multiple choice (1 correct, 3 distractors)
Questions:     60
Time Limit:    120 minutes
Passing Score: 720 / 1000 (scaled)
Penalty:       None — answer every question
Scenarios:     4 out of 6 selected randomly per exam
```

### Domain Breakdown

```
Domain 1: Agentic Architecture & Orchestration ████████████████████████████ 27%
Domain 3: Claude Code Configuration & Workflows ████████████████████       20%
Domain 4: Prompt Engineering & Structured Output ████████████████████       20%
Domain 2: Tool Design & MCP Integration          ██████████████████         18%
Domain 5: Context Management & Reliability       ███████████████            15%
```

### Exam Scenarios

| # | Scenario | Primary Domains |
|---|---|---|
| 1 | Customer Support Resolution Agent | D1, D2, D5 |
| 2 | Code Generation with Claude Code | D3, D5 |
| 3 | Multi-Agent Research System | D1, D2, D5 |
| 4 | Developer Productivity with Claude | D2, D3, D1 |
| 5 | Claude Code for Continuous Integration | D3, D4 |
| 6 | Structured Data Extraction | D4, D5 |

---

## Getting Started

### Recommended Study Path

```
Week 1                          Week 2                          Week 3
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│  Phase 1: Foundation│  │Phase 2: Practical   │  │Phase 4: Practice    │
│                     │  │                     │  │                     │
│  Day 1-2: Course 1  │  │  Day 6-7: Course 3  │  │  Day 12-13: Mock 1  │
│  (Architecture 27%) │  │  (Claude Code 20%)  │  │  (60 questions)     │
│                     │  │                     │  │                     │
│  Day 3-5: Course 2  │  │  Day 8-9: Course 4  │  │  Day 14-15: Mock 2  │
│  (Tool Design 18%)  │  │  (Prompts 20%)      │  │  (60 questions)     │
│                     │  │                     │  │                     │
└─────────────────────┘  │Phase 3: Consolidate │  │Phase 5: Review      │
                         │                     │  │                     │
                         │  Day 10: Course 5   │  │  Day 16-17: Targeted│
                         │  (Context 15%)      │  │  domain review      │
                         │                     │  │                     │
                         │  Day 11: Course 6   │  │  Day 18: Final prep │
                         │  (Edge Cases)       │  │                     │
                         └─────────────────────┘  └─────────────────────┘
```

> **Full roadmap with daily instructions:** [docs/guides/roadmap.md](docs/guides/roadmap.md)

---

## What Each Course Contains

Each course includes:

- **Detailed Lessons** — One module per official task statement, covering both "Knowledge of" and "Skills in" from the exam guide
- **Code Examples** — Python snippets, JSON schemas, config files, and CLI commands
- **Visual Diagrams** — Architecture diagrams, decision trees, and comparison tables
- **Practice Questions** — 4 exam-style questions per course (20 total across Courses 1-5) with answers and explanations

---

## Key Concepts Quick Reference

<details>
<summary><strong>Agentic Loop Pattern (Domain 1)</strong></summary>

```python
while True:
    response = client.messages.create(...)

    if response.stop_reason == "end_turn":
        break  # Agent is done

    # Append assistant message ONCE
    messages.append({"role": "assistant", "content": response.content})

    # Batch ALL tool results into one user message
    tool_results = []
    for block in response.content:
        if block.type == "tool_use":
            result = execute_tool(block.name, block.input)
            tool_results.append({"type": "tool_result", "tool_use_id": block.id, "content": result})
    messages.append({"role": "user", "content": tool_results})
```

**Anti-patterns to avoid:**
- Parsing text content like `"I've completed"` for termination
- Using `max_iterations` as the **primary** stopping mechanism (fine as secondary safety net)
- Checking for `TextBlock` content as completion indicator
- Appending assistant message inside the tool-call loop (causes duplicates)
</details>

<details>
<summary><strong>MCP Structured Errors (Domain 2)</strong></summary>

```json
{
  "isError": true,
  "content": [
    {
      "type": "text",
      "text": "{\"errorCategory\": \"validation\", \"isRetryable\": false, \"message\": \"Order not found for ID 12345\"}"
    }
  ]
}
```

> `isError` is MCP spec. `errorCategory`/`isRetryable` are recommended design patterns built on top of MCP.
```
</details>

<details>
<summary><strong>CLAUDE.md Hierarchy (Domain 3)</strong></summary>

```
~/.claude/CLAUDE.md              (user-level, personal)
    └── .claude/CLAUDE.md        (project-level, shared via repo)
        └── subdirectory/CLAUDE.md   (directory-level, most specific)
            └── Most specific WINS on conflict
```

All levels are merged (additive). On conflict, the most specific level takes precedence.
</details>

<details>
<summary><strong>Escalation Decision Rule (Domain 5)</strong></summary>

```
Customer request arrives
    │
    ├─ Policy EXPLICITLY covers it?
    │   ├─ YES, policy ALLOWS → ✅ Approve
    │   └─ YES, policy DENIES  → ❌ Deny
    │
    └─ Policy is SILENT?
        └─ → 🔄 ESCALATE to human
```
</details>

---

## Repository Structure

```
claude-certified-architect/
│
├── README.md                          # You are here
├── LICENSE                            # MIT License
│
├── docs/
│   ├── courses/
│   │   ├── course-1-agentic-architecture.md
│   │   ├── course-2-tool-design-mcp.md
│   │   ├── course-3-claude-code-config.md
│   │   ├── course-4-prompt-engineering.md
│   │   ├── course-5-context-reliability.md
│   │   └── course-6-exam-edge-cases.md
│   │
│   ├── exams/
│   │   ├── mock-exam.md               # Mock Exam 1 — 60 questions
│   │   └── mock-exam-2.md             # Mock Exam 2 — 60 questions
│   │
│   └── guides/
│       └── roadmap.md                 # Complete 18-day study plan
│
└── assets/
    └── exam-guide.pdf                 # Official Anthropic Exam Guide
```

---

## How to Use This Repository

### 1. Clone & Study Locally

```bash
git clone https://github.com/<your-username>/claude-certified-architect.git
cd claude-certified-architect
```

### 2. Follow the Roadmap

Open [docs/guides/roadmap.md](docs/guides/roadmap.md) and follow the day-by-day plan.

### 3. Take Mock Exams

- Open the mock exam file
- Set a 120-minute timer
- Answer all 60 questions before checking answers
- Score yourself and review explanations for wrong answers

### 4. Track Your Progress

Use this checklist to track your progress:

- [ ] Course 1: Agentic Architecture & Orchestration
- [ ] Course 2: Tool Design & MCP Integration
- [ ] Course 3: Claude Code Configuration & Workflows
- [ ] Course 4: Prompt Engineering & Structured Output
- [ ] Course 5: Context Management & Reliability
- [ ] Course 6: Exam Edge Cases & Traps
- [ ] Mock Exam 1 completed
- [ ] Mock Exam 1 review completed
- [ ] Mock Exam 2 completed
- [ ] Mock Exam 2 review completed
- [ ] Final domain review completed

---

## Contributing

Found an error or want to improve a question? Contributions are welcome!

1. Fork this repository
2. Create a branch: `git checkout -b fix/question-description`
3. Commit your changes: `git commit -m "Fix: correct answer explanation for Q15"`
4. Push: `git push origin fix/question-description`
5. Open a Pull Request

---

## Disclaimer

This is an **unofficial** study guide created to help candidates prepare for the Claude Certified Architect — Foundations exam. It is based on publicly available information from Anthropic's exam guide and documentation. This repository is not affiliated with, endorsed by, or officially connected to Anthropic.

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>Good luck on your exam! </strong><br/>
  <em>If this guide helped you, consider giving it a star ⭐ or buying me tokens.</em>
</p>

<p align="center">
  <a href="https://buymeacoffee.com/haytamaroui" target="_blank">
    <img src="https://img.shields.io/badge/Buy%20me%20tokens-🪙-yellow?style=for-the-badge" alt="Buy me tokens"/>
  </a>
</p>
