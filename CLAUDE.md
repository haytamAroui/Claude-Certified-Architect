
# Claude Certified Architect — Study Guide Website

## Quick Start
1. Run `/setup` — scans this project, fills in the sections below, creates `goals.md`
2. Run `/pulse` — shows current state of the project
3. Run `/add [what to build]` to add features, `/fix [what's broken]` to fix bugs
4. Run `/persist` before closing — saves session state so next session picks up where you left off

---

## Identity
Interactive certification prep website for Anthropic's Claude Certified Architect exam. Features course catalog with structured learning paths, mock exams with timed questions and scoring, progress tracking dashboard, study materials browser, exam simulation mode, and certificate of completion.
Domain: developer | Stack: React 19 + TypeScript + Vite 8 + Tailwind CSS 4 + React Router 7 | Scale: small (single SPA)

## Rules
1. **Completion** — Never say "should work" or "probably passes." Show the output or stay in progress.
2. **Precision** — Reference code as `file:line`. Never describe in prose.
3. **TDD** — No test framework is configured yet. Skip test-first workflow until Vitest is added.
4. **Working directory** — All npm/tsc/vite commands must run from `website/`. Always `cd /c/Users/hayta_o4yzgf5/Downloads/certification/website` before running dev commands. Never run `npx tsc` from the repo root.
5. **Content accuracy** — Exam content changes must be verified against `exam-guide.pdf` (in Downloads). Domain weights: D1 23%, D2 18%, D3 22%, D4 20%, D5 17%.
6. **courseContents.ts triple-check** — After any edit: (1) verify courses.ts module list matches headings, (2) verify CourseViewer splitModules regex handles new ## headings, (3) run `npx tsc --noEmit` from website/.

## Project Structure
- `website/` — Vite React SPA (main application)
  - `src/components/` — Layout (sidebar nav), ErrorBoundary, ExamTimer
  - `src/pages/` — Dashboard, CourseViewer, ExamPage, Roadmap, StudyMaterials, Certificate, NotFound
  - `src/data/` — courses.ts, courseContents.ts, examData.ts, useProgress.ts
  - `src/assets/` — Static assets
  - `src/index.css` — Theme tokens: dark (default) + `html.light` overrides (cream palette #faf9f5). Always check index.css when editing Layout.tsx for visual changes.
- All dev commands run from `website/` directory
- Dev server: `npm run dev` (port 5173)

## Deployment
- Live URL: https://www.claudecertif.online
- Config: `vercel.json` at repo root (installCommand, buildCommand, outputDirectory, SPA rewrites)
- Deploy: push to `main` → Vercel auto-deploys. No `framework` field in vercel.json (causes conflict).

## Session State
Read `.claude/memory/goals.md` at the start of every session.
If it does not exist, create it with empty sections.
Update it at the end of every session.

## Task Routing
Read `.claude/capabilities/manifest.md` to find what to load.
Load ONLY the files relevant to the current task — nothing else.

Quick dispatch (core — used most sessions):
- /add → commands/add.md · /fix → commands/fix.md · /test → commands/test.md
- /audit → commands/audit.md · /blueprint → commands/blueprint.md · /ship → commands/ship.md
- /pulse → commands/pulse.md · /explain → commands/explain.md
- Any code task → shared/tdd.md + shared/completion-rule.md

Extended (load command file on use):
- /setup · /dream · /snapshot · /persist · /refactor · /doc · /loop
- /migrate · /deps · /find · /create · /reflect · /hookify · /reflexes

Advanced (Level 5+):
- /evolve · /debate · /level-up

Unknown capability → grep manifest.md by description, load match

## Trade-Off Hierarchies
When priorities conflict:
1. User experience and visual polish (this is a study tool — it must feel professional)
2. Content accuracy (exam prep must be correct)
3. Code simplicity (small project, keep it lean)

## Available Commands
/dream · /setup · /fix · /add · /audit · /test · /blueprint · /evolve · /debate · /snapshot · /persist · /level-up · /ship · /pulse · /explain · /loop · /refactor · /doc · /migrate · /deps · /find · /create · /reflect · /hookify
