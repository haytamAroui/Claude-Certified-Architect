import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, Map, ChevronDown, ChevronRight, BookOpen, FileQuestion,
  CheckCircle, Circle, Clock, Target, Zap, Trophy, Layers, Lightbulb,
} from 'lucide-react'
import { useProgress } from '../data/useProgress'

/* ── Structured roadmap data ── */

interface DayTask {
  priority: 'Critical' | 'High' | 'Medium'
  id: string
  topic: string
  concept: string
}

interface StudyDay {
  id: string
  title: string
  link: string
  weight?: string
  intro: string
  tasks: DayTask[]
  actions: string[]
}

interface Phase {
  id: string
  title: string
  subtitle: string
  days: string
  icon: typeof Map
  color: string
  items: StudyDay[]
}

const phases: Phase[] = [
  {
    id: 'phase-1',
    title: 'Foundation',
    subtitle: 'Build core understanding of the two heaviest domains (45% of exam)',
    days: 'Days 1–5',
    icon: Layers,
    color: 'primary',
    items: [
      {
        id: 'day-1-2',
        title: 'Course 1 — Agentic Architecture & Orchestration',
        link: '/course/1',
        weight: '23%',
        intro: 'The highest-weighted domain. Start here, no exceptions.',
        tasks: [
          { priority: 'Critical', id: '1.1', topic: 'Agentic loops', concept: 'stop_reason == "tool_use" vs "end_turn"' },
          { priority: 'Critical', id: '1.2', topic: 'Multi-agent coordination', concept: 'Hub-and-spoke, coordinator-subagent pattern' },
          { priority: 'Critical', id: '1.3', topic: 'Subagent invocation & context passing', concept: 'Task tool, allowedTools, isolated context' },
          { priority: 'High', id: '1.4', topic: 'Multi-step workflows & handoffs', concept: 'Hooks vs prompt-based enforcement' },
          { priority: 'High', id: '1.5', topic: 'Agent SDK hooks', concept: 'PostToolUse for interception & normalization' },
          { priority: 'Medium', id: '1.6', topic: 'Task decomposition strategies', concept: 'Prompt chaining vs dynamic decomposition' },
          { priority: 'Medium', id: '1.7', topic: 'Session state & forking', concept: '--resume, fork_session' },
        ],
        actions: [
          'Read the full course end-to-end',
          'Memorize the stop_reason loop pattern — it appears in many questions',
          'Understand why parsing text content for termination is an anti-pattern',
          'Know the difference between hooks (deterministic) vs prompts (probabilistic)',
          'Answer the 4 practice questions at the end, review wrong answers',
        ],
      },
      {
        id: 'day-3',
        title: 'Course 2 — Tool Design & MCP Integration',
        link: '/course/2',
        weight: '18%',
        intro: 'Builds directly on Course 1. Tool design is tightly coupled with agent architecture.',
        tasks: [
          { priority: 'Critical', id: '2.1', topic: 'Tool descriptions & boundaries', concept: 'Descriptions drive tool selection, not names' },
          { priority: 'Critical', id: '2.2', topic: 'Structured error responses', concept: 'isError flag, errorCategory, isRetryable' },
          { priority: 'High', id: '2.3', topic: 'Tool distribution & tool choice', concept: '4-5 tools per agent, scoped access' },
          { priority: 'High', id: '2.4', topic: 'MCP server configuration', concept: 'Transport types, allowedTools filtering' },
          { priority: 'Medium', id: '2.5', topic: 'Input validation & schema design', concept: 'Flat parameters, enums over free text' },
        ],
        actions: [
          'Read the full course',
          'Memorize: overlapping tool descriptions cause misrouting',
          'Know why too many tools (18+) degrade reliability',
          'Know structured error patterns cold — multiple exam questions test this',
          'Answer practice questions',
        ],
      },
    ],
  },
  {
    id: 'phase-2',
    title: 'Practical Skills',
    subtitle: 'Master the two "practical" domains (42% of exam)',
    days: 'Days 6–9',
    icon: Target,
    color: 'accent',
    items: [
      {
        id: 'day-4-5',
        title: 'Course 3 — Claude Code Configuration & Workflows',
        link: '/course/3',
        weight: '22%',
        intro: 'Very practical and testable. Many questions are about config file specifics.',
        tasks: [
          { priority: 'Critical', id: '3.1', topic: 'CLAUDE.md hierarchy', concept: 'Project vs user vs enterprise scope' },
          { priority: 'Critical', id: '3.2', topic: 'Custom slash commands', concept: '.claude/commands/ directory structure' },
          { priority: 'High', id: '3.3', topic: 'Permission modes', concept: 'Allowlists, --allowedTools, plan mode' },
          { priority: 'High', id: '3.4', topic: 'MCP server configuration in Claude Code', concept: 'claude_desktop_config.json, transport types' },
          { priority: 'Medium', id: '3.5', topic: 'CI/CD integration', concept: '--print, -p flag, non-interactive mode' },
          { priority: 'Medium', id: '3.6', topic: 'Plan mode', concept: 'When to plan vs when to execute directly' },
        ],
        actions: [
          'Read the full course',
          'Know the CLAUDE.md file hierarchy and override behavior',
          'Understand slash command file naming conventions',
          'Know CI/CD flags and patterns',
          'Answer practice questions',
        ],
      },
      {
        id: 'day-6-7',
        title: 'Course 4 — Prompt Engineering & Structured Output',
        link: '/course/4',
        weight: '20%',
        intro: 'Overlaps with Course 2 (tool descriptions) and Course 3 (CI prompts).',
        tasks: [
          { priority: 'Critical', id: '4.1', topic: 'System prompts for agents', concept: 'Role, constraints, output format' },
          { priority: 'Critical', id: '4.2', topic: 'Structured output with JSON schemas', concept: 'response_format, schema enforcement' },
          { priority: 'High', id: '4.3', topic: 'Few-shot examples', concept: 'When to use, formatting patterns' },
          { priority: 'High', id: '4.4', topic: 'Extraction prompts', concept: 'Field-by-field instructions, edge cases' },
          { priority: 'Medium', id: '4.5', topic: 'Prompt chaining for quality', concept: 'Verification passes, self-evaluation' },
          { priority: 'Medium', id: '4.6', topic: 'CI/CD prompt design', concept: 'Actionable feedback, minimizing false positives' },
        ],
        actions: [
          'Read the full course',
          'Understand response_format vs prompt-only JSON enforcement',
          'Know when few-shot helps vs when it wastes context',
          'Know the extraction pattern: instructions > examples > edge case handling',
          'Answer practice questions',
        ],
      },
    ],
  },
  {
    id: 'phase-3',
    title: 'Tie It Together',
    subtitle: 'Master the final domain that connects everything',
    days: 'Days 10–11',
    icon: Zap,
    color: 'warning',
    items: [
      {
        id: 'day-8',
        title: 'Course 5 — Context Management & Reliability',
        link: '/course/5',
        weight: '17%',
        intro: 'Lowest weight but ties all other domains together. Don\'t skip it.',
        tasks: [
          { priority: 'Critical', id: '5.1', topic: 'Context window management', concept: 'Token limits, summarization strategies' },
          { priority: 'Critical', id: '5.2', topic: 'Multi-turn conversation design', concept: 'Message history, context injection' },
          { priority: 'High', id: '5.3', topic: 'Escalation & human-in-the-loop', concept: 'When to escalate vs when to deny' },
          { priority: 'High', id: '5.4', topic: 'Self-evaluation & reliability', concept: 'Confidence thresholds, verification loops' },
          { priority: 'Medium', id: '5.5', topic: 'Caching & cost optimization', concept: 'cache_control, prompt caching patterns' },
          { priority: 'Medium', id: '5.6', topic: 'Error recovery & graceful degradation', concept: 'Partial results, fallback strategies' },
        ],
        actions: [
          'Read the full course',
          'Understand context window tradeoffs deeply',
          'Know the escalation decision framework',
          'Know caching patterns (exam tests specific API details)',
          'Answer practice questions',
        ],
      },
      {
        id: 'day-9',
        title: 'Course 6 — Exam Edge Cases & Traps',
        link: '/course/6',
        intro: 'Read this after Courses 1-5. Covers the 6 most common exam traps.',
        tasks: [],
        actions: [
          '"Policy Silent" vs "Policy Denies" — opposite actions for similar-looking scenarios',
          'Hooks vs prompts — when deterministic enforcement is required',
          'stop_reason anti-patterns — text parsing, iteration caps as primary mechanism',
          'Tool count tradeoffs — why fewer tools per agent is better',
          'Context passing between agents — subagents don\'t inherit parent context',
          'Structured errors vs generic errors — isRetryable and errorCategory specifics',
        ],
      },
    ],
  },
  {
    id: 'phase-4',
    title: 'Practice Exams',
    subtitle: 'Test knowledge under exam conditions, identify weak areas, close gaps',
    days: 'Days 12–16',
    icon: FileQuestion,
    color: 'success',
    items: [
      {
        id: 'day-10-11',
        title: 'Mock Exam 1',
        link: '/exam/1',
        intro: '60 questions, all 6 scenarios. Passing benchmark: 45+/60.',
        tasks: [],
        actions: [
          'Take the full exam under timed conditions (120 min)',
          'Score yourself — mark each answer correct/incorrect',
          'For every wrong answer, identify which Task Statement it tests',
          'Re-read the relevant course section for each missed topic',
          'Re-attempt wrong questions without looking at answers',
        ],
      },
      {
        id: 'day-12-13',
        title: 'Mock Exam 2',
        link: '/exam/2',
        intro: '60 new questions, different scenario mix. Emphasizes Developer Productivity and CI/CD.',
        tasks: [],
        actions: [
          'Take the full exam under timed conditions (120 min)',
          'Score and analyze wrong answers by domain',
          'Compare your domain scores between Mock 1 and Mock 2',
          'Target the domain with the lowest combined score',
        ],
      },
    ],
  },
  {
    id: 'phase-5',
    title: 'Final Review',
    subtitle: 'Consolidate knowledge and build exam-day confidence',
    days: 'Days 17–18',
    icon: Trophy,
    color: 'primary',
    items: [
      {
        id: 'day-14',
        title: 'Domain-Weighted Review',
        link: '/dashboard',
        intro: 'Allocate final review time proportionally to exam weight. Only re-read sections where you got mock exam questions wrong.',
        tasks: [],
        actions: [
          'D1: Agentic Architecture — 23% — 45 min',
          'D3: Claude Code Config — 22% — 40 min',
          'D4: Prompt Engineering — 20% — 35 min',
          'D2: Tool Design & MCP — 18% — 30 min',
          'D5: Context & Reliability — 17% — 30 min',
        ],
      },
      {
        id: 'day-15',
        title: 'Exam-Day Preparation',
        link: '/course/6',
        intro: 'Quick-fire checklist of must-know facts before the exam.',
        tasks: [],
        actions: [
          'stop_reason == "tool_use" → continue loop; "end_turn" → exit loop',
          'Subagents do NOT inherit parent context — pass data explicitly',
          'Hooks = deterministic enforcement; Prompts = probabilistic guidance',
          '4-5 tools per agent is optimal; 18+ tools degrades reliability',
          'isError: true + errorCategory + isRetryable = recommended error pattern',
          'CLAUDE.md hierarchy: all levels merged; most specific wins on conflict',
          'Policy silent → escalate; Policy explicitly denies → deny',
          'cache_control: {"type": "ephemeral"} for caching stable content — 90% cost savings',
        ],
      },
    ],
  },
]

const examDayTips = [
  'Read each scenario carefully — context determines the correct answer',
  'Eliminate obvious distractors first — usually 2 answers are clearly wrong',
  'Watch for "almost right" answers — the exam loves subtle distinctions',
  'Budget 2 minutes per question — flag hard ones and come back',
  'Never leave a question blank — no penalty for guessing',
  'Trust the framework, not intuition — the exam tests Anthropic\'s recommended patterns',
]

const priorityStyle: Record<string, string> = {
  Critical: 'bg-danger/15 text-danger',
  High: 'bg-warning/15 text-warning',
  Medium: 'bg-faint/15 text-faint',
}

/* ── Component ── */

export default function Roadmap() {
  const [openPhases, setOpenPhases] = useState<Record<string, boolean>>({ 'phase-1': true })
  const [openDays, setOpenDays] = useState<Record<string, boolean>>({})
  const [activePhase, setActivePhase] = useState('phase-1')
  const phaseRefs = useRef<Record<string, HTMLElement | null>>({})
  const { progress } = useProgress()

  // Track which phase is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActivePhase(entry.target.id)
          }
        }
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0 }
    )
    for (const el of Object.values(phaseRefs.current)) {
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  const togglePhase = (id: string) =>
    setOpenPhases((p) => ({ ...p, [id]: !p[id] }))

  const toggleDay = (id: string) =>
    setOpenDays((p) => ({ ...p, [id]: !p[id] }))

  const scrollToPhase = (id: string) => {
    phaseRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setOpenPhases((p) => ({ ...p, [id]: true }))
  }

  // Calculate completion per phase
  const getPhaseProgress = (phase: Phase) => {
    const courseIds = phase.items.map((item) => {
      const m = item.link.match(/\/course\/(\d+)/)
      return m ? m[1] : null
    }).filter(Boolean) as string[]
    const examIds = phase.items.map((item) => {
      const m = item.link.match(/\/exam\/(\d+)/)
      return m ? m[1] : null
    }).filter(Boolean) as string[]

    const totalItems = phase.items.length
    let completed = 0
    for (const cid of courseIds) {
      if (progress.completedCourses.includes(cid)) completed++
    }
    for (const eid of examIds) {
      if (progress.examScores[eid]) completed++
    }
    // For review days (no course/exam link), count as complete if all courses done
    const otherItems = totalItems - courseIds.length - examIds.length
    if (otherItems > 0 && progress.completedCourses.length >= 6) {
      completed += otherItems
    }
    return { completed, total: totalItems }
  }

  return (
    <div>
      <Link to="/dashboard" className="text-muted hover:text-heading text-sm flex items-center gap-1 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Map className="w-5 h-5 text-faint" />
          <h1 className="font-display text-2xl sm:text-3xl font-medium text-heading">18-Day Study Roadmap</h1>
        </div>
        <p className="text-muted text-sm">
          Pass the exam (720/1000) in 2-3 weeks of focused study — 6 courses + 4 mock exams + official exam guide
        </p>
      </div>

      {/* Exam info bar */}
      <div className="bg-surface-light border border-surface-lighter rounded-2xl p-4 sm:p-5 mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="font-display text-lg font-medium text-heading tabular-nums">60</p>
            <p className="text-xs text-faint">Questions</p>
          </div>
          <div>
            <p className="font-display text-lg font-medium text-heading tabular-nums">120 min</p>
            <p className="text-xs text-faint">Time Limit</p>
          </div>
          <div>
            <p className="font-display text-lg font-medium text-heading tabular-nums">720/1000</p>
            <p className="text-xs text-faint">Pass Score</p>
          </div>
          <div>
            <p className="font-display text-lg font-medium text-heading tabular-nums">4 of 6</p>
            <p className="text-xs text-faint">Random Scenarios</p>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sticky sidebar TOC — desktop only */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24">
            <p className="text-[10px] font-medium text-faint uppercase tracking-wider mb-3 px-1">Phases</p>
            <nav className="space-y-1">
              {phases.map((phase) => {
                const pg = getPhaseProgress(phase)
                const isActive = activePhase === phase.id
                return (
                  <button
                    key={phase.id}
                    onClick={() => scrollToPhase(phase.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 group ${
                      isActive
                        ? 'bg-surface-lighter text-heading font-medium'
                        : 'text-muted hover:text-heading hover:bg-surface-light'
                    }`}
                  >
                    <span className="flex-1 truncate">{phase.title}</span>
                    {pg.completed === pg.total && pg.total > 0 ? (
                      <CheckCircle className="w-3.5 h-3.5 text-success shrink-0" />
                    ) : (
                      <span className="text-[10px] text-faint tabular-nums">{pg.completed}/{pg.total}</span>
                    )}
                  </button>
                )
              })}
              <button
                onClick={() => document.getElementById('exam-day')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted hover:text-heading hover:bg-surface-light transition-all flex items-center gap-2"
              >
                <span className="flex-1">Exam Day Tips</span>
                <Lightbulb className="w-3.5 h-3.5 text-faint" />
              </button>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-6">
          {phases.map((phase) => {
            const Icon = phase.icon
            const isOpen = openPhases[phase.id] ?? false
            const pg = getPhaseProgress(phase)
            const pct = pg.total > 0 ? Math.round((pg.completed / pg.total) * 100) : 0

            return (
              <section
                key={phase.id}
                id={phase.id}
                ref={(el) => { phaseRefs.current[phase.id] = el }}
                className="scroll-mt-24"
              >
                {/* Phase header — always visible, clickable */}
                <button
                  onClick={() => togglePhase(phase.id)}
                  className="w-full bg-surface-light border border-surface-lighter rounded-2xl p-4 sm:p-5 text-left hover:border-subtle transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-faint shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-display text-lg font-medium text-heading">
                          {phase.title}
                        </h2>
                        <span className="text-xs text-faint bg-surface-lighter px-2 py-0.5 rounded">
                          {phase.days}
                        </span>
                        {pg.completed === pg.total && pg.total > 0 && (
                          <span className="text-xs text-success bg-success/10 px-2 py-0.5 rounded">
                            Complete
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted mt-1">{phase.subtitle}</p>

                      {/* Progress bar */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex-1 h-1 bg-surface-lighter rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-faint tabular-nums w-12 text-right">
                          {pg.completed}/{pg.total}
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-faint shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Phase content — collapsible */}
                {isOpen && (
                  <div className="mt-3 space-y-3 pl-0 sm:pl-2">
                    {phase.items.map((day) => {
                      const isDayOpen = openDays[day.id] ?? false
                      const courseMatch = day.link.match(/\/course\/(\d+)/)
                      const examMatch = day.link.match(/\/exam\/(\d+)/)
                      const isCompleted = courseMatch
                        ? progress.completedCourses.includes(courseMatch[1])
                        : examMatch
                        ? !!progress.examScores[examMatch[1]]
                        : false

                      return (
                        <div
                          key={day.id}
                          className="bg-surface-light/50 border border-surface-lighter rounded-xl overflow-hidden"
                        >
                          {/* Day header */}
                          <button
                            onClick={() => toggleDay(day.id)}
                            className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-surface-lighter/30 transition-colors"
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-success shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-subtle shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium text-heading truncate">
                                  {day.title}
                                </span>
                                {day.weight && (
                                  <span className="text-[10px] font-medium text-primary bg-primary/8 px-1.5 py-0.5 rounded shrink-0">
                                    {day.weight}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted mt-0.5 line-clamp-1">{day.intro}</p>
                            </div>
                            <ChevronDown
                              className={`w-3.5 h-3.5 text-faint shrink-0 transition-transform duration-200 ${
                                isDayOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {/* Day content — collapsible */}
                          {isDayOpen && (
                            <div className="px-4 pb-4 border-t border-surface-lighter">
                              {/* Task table */}
                              {day.tasks.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-[10px] font-medium text-faint uppercase tracking-wider mb-2">
                                    Task Statements
                                  </p>
                                  <div className="space-y-1.5">
                                    {day.tasks.map((task) => (
                                      <div
                                        key={task.id}
                                        className="flex items-start gap-2 text-sm"
                                      >
                                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${priorityStyle[task.priority]}`}>
                                          {task.priority}
                                        </span>
                                        <div className="min-w-0">
                                          <span className="text-body">
                                            {task.id} — {task.topic}
                                          </span>
                                          <span className="text-faint ml-1.5">
                                            · {task.concept}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Study actions */}
                              <div className="mt-4">
                                <p className="text-[10px] font-medium text-faint uppercase tracking-wider mb-2">
                                  {day.tasks.length > 0 ? 'Study Actions' : 'Key Focus Areas'}
                                </p>
                                <ol className="space-y-1.5">
                                  {day.actions.map((action, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-body">
                                      <span className="text-faint tabular-nums shrink-0 w-4 text-right">{i + 1}.</span>
                                      <span>{action}</span>
                                    </li>
                                  ))}
                                </ol>
                              </div>

                              {/* Open course/exam link */}
                              <Link
                                to={day.link}
                                className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-primary hover:text-primary-light transition-colors"
                              >
                                {examMatch ? (
                                  <><FileQuestion className="w-3.5 h-3.5" /> Start Exam</>
                                ) : (
                                  <><BookOpen className="w-3.5 h-3.5" /> Open Course</>
                                )}
                                <ChevronRight className="w-3 h-3" />
                              </Link>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>
            )
          })}

          {/* Exam Day Tips */}
          <section id="exam-day" className="scroll-mt-24">
            <div className="bg-surface-light border border-surface-lighter rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-5 h-5 text-faint" />
                <h2 className="font-display text-lg font-medium text-heading">Exam-Day Strategy</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {examDayTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="w-5 h-5 rounded-full bg-surface-lighter flex items-center justify-center text-[10px] font-medium text-faint shrink-0 mt-0.5 tabular-nums">
                      {i + 1}
                    </span>
                    <span className="text-body">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Quick reference */}
          <section className="bg-surface-light border border-surface-lighter rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-faint" />
              <h2 className="font-display text-lg font-medium text-heading">Quick Reference: Domain Weights</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {[
                { label: 'D1: Architecture', weight: '23%', course: '/course/1' },
                { label: 'D3: Config', weight: '22%', course: '/course/3' },
                { label: 'D4: Prompts', weight: '20%', course: '/course/4' },
                { label: 'D2: Tools & MCP', weight: '18%', course: '/course/2' },
                { label: 'D5: Reliability', weight: '17%', course: '/course/5' },
              ].map((d) => (
                <Link
                  key={d.label}
                  to={d.course}
                  className="bg-surface/50 border border-surface-lighter rounded-xl p-3 text-center hover:border-subtle transition-colors group"
                >
                  <p className="font-display text-lg font-medium text-heading tabular-nums group-hover:text-primary transition-colors">
                    {d.weight}
                  </p>
                  <p className="text-xs text-faint mt-0.5">{d.label}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
