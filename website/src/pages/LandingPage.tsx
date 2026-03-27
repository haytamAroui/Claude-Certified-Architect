import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen, Terminal, ArrowRight, FileQuestion, Brain, Map,
  CheckCircle, Sun, Moon, Github, ExternalLink, Shield, Layers,
  Award, Clock, ChevronRight, Play, Coffee,
} from 'lucide-react'

function useTheme() {
  const [light, setLight] = useState(() => localStorage.getItem('theme') === 'light')
  useEffect(() => {
    document.documentElement.classList.toggle('light', light)
    localStorage.setItem('theme', light ? 'light' : 'dark')
  }, [light])
  return { light, toggle: () => setLight(p => !p) }
}

const courses = [
  {
    title: 'Claude Code Hands-On',
    desc: 'Practical mastery of every Claude Code feature — slash commands, memory, skills, subagents, MCP, hooks.',
    badge: 'Featured',
    badgeColor: 'bg-primary/10 text-primary',
    cardBg: 'bg-[#f0e6df]',
    darkCardBg: 'dark-card-warm',
    link: '/course/7',
    modules: 10,
  },
  {
    title: 'Agentic Architecture',
    desc: 'The agentic loop, multi-agent orchestration, hooks, and session management.',
    badge: 'D1 · 23%',
    badgeColor: 'bg-[#d4e4d8]/60 text-success',
    cardBg: 'bg-[#e0ebe3]',
    darkCardBg: 'dark-card-sage',
    link: '/course/1',
    modules: 7,
  },
  {
    title: 'Tool Design & MCP',
    desc: 'Tool descriptions, MCP error patterns, built-in tools, and distribution scoping.',
    badge: 'D2 · 18%',
    badgeColor: 'bg-[#c5d4e4]/60 text-accent',
    cardBg: 'bg-[#dce6ef]',
    darkCardBg: 'dark-card-sky',
    link: '/course/2',
    modules: 5,
  },
  {
    title: 'Claude Code Config',
    desc: 'CLAUDE.md hierarchy, custom commands, plan mode, and CI/CD integration.',
    badge: 'D3 · 22%',
    badgeColor: 'bg-[#d9d0e4]/60 text-[#8b6baf]',
    cardBg: 'bg-[#e6dff0]',
    darkCardBg: 'dark-card-heather',
    link: '/course/3',
    modules: 6,
  },
  {
    title: 'Prompt Engineering',
    desc: 'System prompts, structured output, few-shot patterns, and batch processing.',
    badge: 'D4 · 20%',
    badgeColor: 'bg-[#e4d0c5]/60 text-warning',
    cardBg: 'bg-[#f0e6dc]',
    darkCardBg: 'dark-card-oat',
    link: '/course/4',
    modules: 6,
  },
  {
    title: 'Context & Reliability',
    desc: 'Context preservation, error propagation, caching, and human review patterns.',
    badge: 'D5 · 17%',
    badgeColor: 'bg-[#c5d4e4]/60 text-accent',
    cardBg: 'bg-[#dce6ef]',
    darkCardBg: 'dark-card-sky',
    link: '/course/5',
    modules: 7,
  },
]

export default function LandingPage() {
  const { light, toggle: toggleTheme } = useTheme()

  return (
    <div className="landing-page min-h-screen flex flex-col">
      {/* ── Navigation ── */}
      <header className="sticky top-0 z-50 landing-nav border-b border-surface-lighter">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display text-[15px] font-medium text-heading tracking-tight hidden sm:block">
              Anthropic Academy
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            <Link to="/dashboard" className="text-sm text-muted hover:text-heading transition-colors">
              Dashboard
            </Link>
            <Link to="/course/1" className="text-sm text-muted hover:text-heading transition-colors">
              Courses
            </Link>
            <Link to="/course/7" className="text-sm text-muted hover:text-heading transition-colors">
              Claude Code
            </Link>
            <Link to="/learn" className="text-sm text-muted hover:text-heading transition-colors">
              Fun
            </Link>
            <Link to="/exam/1" className="text-sm text-muted hover:text-heading transition-colors">
              Exams
            </Link>
            <Link to="/materials" className="text-sm text-muted hover:text-heading transition-colors">
              Resources
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-faint hover:text-heading hover:bg-surface-lighter transition-colors"
              aria-label={light ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {light ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <a
              href="https://buymeacoffee.com/haytamaroui"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white rounded-xl text-xs font-medium hover:bg-primary-dark transition-colors"
            >
              <Coffee className="w-3.5 h-3.5" />
              Buy me tokens
            </a>
            <a
              href="https://github.com/haytamAroui/Claude-Certified-Architect"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-faint hover:text-heading hover:bg-surface-lighter transition-colors hidden sm:flex"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 bg-heading text-surface rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Start Learning
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="pt-20 sm:pt-28 pb-16 sm:pb-24">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-primary font-medium tracking-wide mb-5 landing-fade-in">
              Claude Certified Architect — Foundations
            </p>

            <h1 className="font-display text-[2.75rem] sm:text-[3.5rem] lg:text-[4rem] font-medium text-heading leading-[1.08] tracking-[-0.03em] mb-6 landing-fade-in" style={{ animationDelay: '80ms' }}>
              Master Claude.{' '}
              <span className="text-primary">Get certified.</span>
            </h1>

            <p className="text-body text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10 landing-fade-in" style={{ animationDelay: '160ms' }}>
              The complete, free study guide for Anthropic's certification exam.
              Courses, practice exams, flashcards, and a hands-on Claude Code lab
              — everything you need in one place.
            </p>

            <div className="flex flex-wrap justify-center gap-4 landing-fade-in" style={{ animationDelay: '240ms' }}>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-heading text-surface rounded-xl text-[15px] font-medium hover:opacity-90 transition-opacity"
              >
                Start studying
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 border border-surface-lighter text-body rounded-xl text-[15px] font-medium hover:bg-surface-lighter hover:text-heading transition-all"
              >
                Register for exam
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Terminal Preview ── */}
      <section className="pb-20 sm:pb-28">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl overflow-hidden border border-surface-lighter shadow-sm">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-5 py-3.5 bg-surface-light border-b border-surface-lighter">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-danger/50" />
                  <div className="w-3 h-3 rounded-full bg-warning/50" />
                  <div className="w-3 h-3 rounded-full bg-success/50" />
                </div>
                <span className="text-xs text-faint font-mono ml-3">claude code</span>
              </div>

              {/* Content */}
              <div className="terminal-bg p-6 sm:p-8 font-mono text-[13px] leading-relaxed space-y-3">
                <div>
                  <span className="text-success">$</span>{' '}
                  <span className="text-accent-light">claude</span>
                </div>
                <div className="text-faint text-xs py-1">
                  <span className="text-primary font-semibold">Claude Code</span>
                  <span className="text-faint">{' '}v1.0.27</span>
                </div>
                <div className="pt-2">
                  <span className="text-success">claude&gt;</span>{' '}
                  <span className="text-body">/add authentication with OAuth2 flow</span>
                </div>
                <div className="pt-3 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-3.5 h-3.5 text-success shrink-0" />
                    <span className="text-body text-xs">Created <span className="text-accent-light">src/auth/oauth.ts</span></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-3.5 h-3.5 text-success shrink-0" />
                    <span className="text-body text-xs">Created <span className="text-accent-light">src/auth/middleware.ts</span></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-3.5 h-3.5 text-success shrink-0" />
                    <span className="text-body text-xs">Updated <span className="text-accent-light">src/routes/index.ts</span></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-3.5 h-3.5 text-success shrink-0" />
                    <span className="text-body text-xs">All 12 tests passing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Exam Facts ── */}
      <section className="py-12 sm:py-16 border-y border-surface-lighter">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            {[
              { value: '60', label: 'Questions', icon: FileQuestion },
              { value: '120', label: 'Minutes', icon: Clock },
              { value: '720', label: 'Pass score', icon: Shield },
              { value: '5', label: 'Domains', icon: Layers },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <s.icon className="w-5 h-5 text-faint mx-auto mb-3" />
                <p className="font-display text-3xl font-medium text-heading tracking-tight">{s.value}</p>
                <p className="text-xs text-muted mt-1 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Courses ── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="mb-12">
            <h2 className="font-display text-3xl sm:text-[2.5rem] font-medium text-heading tracking-tight leading-tight mb-3">
              Study courses
            </h2>
            <p className="text-body text-base sm:text-lg max-w-xl">
              Seven courses aligned with the official exam guide — from agentic architecture to hands-on Claude Code practice.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((c, i) => (
              <Link
                key={c.title}
                to={c.link}
                className={`group relative rounded-2xl p-6 sm:p-7 transition-all hover:shadow-md landing-fade-in course-card ${c.darkCardBg}`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${c.badgeColor}`}>
                    {c.badge}
                  </span>
                  <span className="text-[11px] text-faint">{c.modules} modules</span>
                </div>

                <h3 className="font-display text-lg font-medium text-heading mb-2 group-hover:text-primary transition-colors">
                  {c.title}
                </h3>

                <p className="text-muted text-sm leading-relaxed mb-5">
                  {c.desc}
                </p>

                <span className="inline-flex items-center gap-1.5 text-sm text-primary font-medium group-hover:gap-2.5 transition-all">
                  Explore
                  <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Practice Tools ── */}
      <section className="py-20 sm:py-28 border-t border-surface-lighter">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="mb-12">
            <h2 className="font-display text-3xl sm:text-[2.5rem] font-medium text-heading tracking-tight leading-tight mb-3">
              Practice & learn
            </h2>
            <p className="text-body text-base sm:text-lg max-w-xl">
              Go beyond reading. Test your knowledge with mock exams, flashcards, quizzes, and an 18-day study roadmap.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: FileQuestion,
                title: '4 Mock Exams',
                desc: '240 questions with timed simulation and domain scoring.',
                link: '/dashboard',
              },
              {
                icon: Brain,
                title: 'Flashcards',
                desc: 'Spaced repetition cards across all 5 exam domains.',
                link: '/learn/flashcards',
              },
              {
                icon: Play,
                title: 'Quick Quizzes',
                desc: 'Short, focused quizzes with instant feedback.',
                link: '/learn/quiz',
              },
              {
                icon: Map,
                title: '18-Day Roadmap',
                desc: 'Day-by-day plan from zero to exam-ready.',
                link: '/roadmap',
              },
            ].map((t, i) => (
              <Link
                key={t.title}
                to={t.link}
                className="group rounded-2xl border border-surface-lighter p-6 hover:border-primary/20 transition-all hover:shadow-sm landing-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <t.icon className="w-6 h-6 text-faint mb-4 group-hover:text-primary transition-colors" />
                <h3 className="text-heading font-medium text-[15px] mb-1.5">{t.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Domain Coverage ── */}
      <section className="py-20 sm:py-28 border-t border-surface-lighter">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="font-display text-3xl sm:text-[2.5rem] font-medium text-heading tracking-tight leading-tight mb-3">
                Full domain coverage
              </h2>
              <p className="text-body text-base sm:text-lg mb-6">
                Every course maps to the official exam blueprint. Focus where the weight is heaviest.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:gap-3 transition-all"
              >
                View all courses <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-5">
              {[
                { domain: 'D1', name: 'Agentic Architecture', weight: 23 },
                { domain: 'D2', name: 'Tool Design & MCP', weight: 18 },
                { domain: 'D3', name: 'Claude Code Config', weight: 22 },
                { domain: 'D4', name: 'Prompt Engineering', weight: 20 },
                { domain: 'D5', name: 'Context & Reliability', weight: 17 },
              ].map((d) => (
                <div key={d.domain}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-faint w-6">{d.domain}</span>
                      <span className="text-sm text-heading">{d.name}</span>
                    </div>
                    <span className="text-sm font-medium text-heading tabular-nums">{d.weight}%</span>
                  </div>
                  <div className="h-2 bg-surface-lighter rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${d.weight * 4}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 sm:py-28 border-t border-surface-lighter">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-[2.5rem] font-medium text-heading tracking-tight leading-tight mb-4">
            Ready to get certified?
          </h2>
          <p className="text-body text-base sm:text-lg max-w-lg mx-auto mb-10">
            Start with the hands-on Claude Code course or dive straight into exam prep.
            Your progress is saved locally — pick up where you left off.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-heading text-surface rounded-xl text-[15px] font-medium hover:opacity-90 transition-opacity"
            >
              Go to dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/course/7"
              className="inline-flex items-center gap-2.5 px-8 py-4 border border-surface-lighter text-body rounded-xl text-[15px] font-medium hover:bg-surface-lighter hover:text-heading transition-all"
            >
              <Terminal className="w-4 h-4" />
              Try Claude Code course
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer border-t border-surface-lighter mt-auto">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 py-10 sm:py-14">
          <div className="grid sm:grid-cols-3 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <span className="font-display text-sm font-semibold text-heading">Claude Certified</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Free, open-source study guide for Anthropic's Claude Certified Architect exam.
                Not affiliated with Anthropic.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-faint uppercase tracking-wider mb-3">Study</p>
              <div className="space-y-2">
                <Link to="/dashboard" className="block text-sm text-muted hover:text-heading transition-colors">Dashboard</Link>
                <Link to="/course/7" className="block text-sm text-muted hover:text-heading transition-colors">Claude Code Course</Link>
                <Link to="/learn" className="block text-sm text-muted hover:text-heading transition-colors">Learn Hub</Link>
                <Link to="/roadmap" className="block text-sm text-muted hover:text-heading transition-colors">Study Roadmap</Link>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-faint uppercase tracking-wider mb-3">Resources</p>
              <div className="space-y-2">
                <a href="https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted hover:text-heading transition-colors">Register for Exam</a>
                <a href="https://github.com/haytamAroui/Claude-Certified-Architect" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted hover:text-heading transition-colors">GitHub Repository</a>
                <a href="https://buymeacoffee.com/haytamaroui" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted hover:text-heading transition-colors">Buy me tokens</a>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-surface-lighter flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-faint">
              Created by Haytam Aroui
            </span>
            <div className="flex items-center gap-4">
              <a href="https://github.com/haytamAroui/Claude-Certified-Architect" target="_blank" rel="noopener noreferrer" className="text-faint hover:text-muted transition-colors" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
