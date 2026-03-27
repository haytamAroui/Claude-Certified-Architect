import { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  BookOpen, FileQuestion, Home, Menu, X, ExternalLink, Search, Award,
  Map, Sun, Moon, Star, Github, Brain, Terminal,
} from 'lucide-react'

function useTheme() {
  const [light, setLight] = useState(() => localStorage.getItem('theme') === 'light')
  useEffect(() => {
    document.documentElement.classList.toggle('light', light)
    localStorage.setItem('theme', light ? 'light' : 'dark')
  }, [light])
  return { light, toggle: () => setLight(p => !p) }
}

function useStarPopup() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (localStorage.getItem('star-dismissed')) return
    const t = setTimeout(() => setVisible(true), 4000)
    return () => clearTimeout(t)
  }, [])
  const dismiss = () => {
    setVisible(false)
    localStorage.setItem('star-dismissed', '1')
  }
  return { visible, dismiss }
}

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
    isActive
      ? 'bg-primary/8 text-primary font-medium'
      : 'text-muted hover:text-heading hover:bg-surface-lighter'
  }`

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { light, toggle: toggleTheme } = useTheme()
  const { visible: starVisible, dismiss: dismissStar } = useStarPopup()
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  function active(isActive: boolean) {
    return isActive ? 'text-heading font-medium' : 'text-muted hover:text-heading'
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* ── Top Navigation ── */}
      <header className="sticky top-0 z-50 bg-surface-light/95 backdrop-blur-md border-b border-surface-lighter">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 mr-10 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display text-[15px] font-medium text-heading tracking-tight hidden sm:block">
              Anthropic Academy
            </span>
          </NavLink>

          {/* Desktop Nav — flat links, no dropdowns */}
          <nav className="hidden md:flex items-center gap-7 flex-1">
            <NavLink to="/dashboard" end className={({ isActive }) => `text-sm transition-colors ${active(isActive)}`}>
              Dashboard
            </NavLink>
            <NavLink to="/course/1" className={() => {
              const isCourse = location.pathname.startsWith('/course/') && location.pathname !== '/course/7'
              return `text-sm transition-colors ${isCourse ? 'text-heading font-medium' : 'text-muted hover:text-heading'}`
            }}>
              Courses
            </NavLink>
            <NavLink to="/course/7" className={({ isActive }) => `text-sm transition-colors ${active(isActive)}`}>
              Claude Code
            </NavLink>
            <NavLink to="/learn" className={({ isActive }) => {
              const isLearn = location.pathname.startsWith('/learn')
              return `text-sm transition-colors ${isActive || isLearn ? 'text-heading font-medium' : 'text-muted hover:text-heading'}`
            }}>
              Fun
            </NavLink>
            <NavLink to="/exam/1" className={({ isActive }) => {
              const isExam = location.pathname.startsWith('/exam/')
              return `text-sm transition-colors ${isActive || isExam ? 'text-heading font-medium' : 'text-muted hover:text-heading'}`
            }}>
              Exams
            </NavLink>
            <NavLink to="/materials" className={({ isActive }) => {
              const isRes = ['/materials', '/roadmap', '/certificate'].includes(location.pathname)
              return `text-sm transition-colors ${isActive || isRes ? 'text-heading font-medium' : 'text-muted hover:text-heading'}`
            }}>
              Resources
            </NavLink>
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2 ml-auto md:ml-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-faint hover:text-heading hover:bg-surface-lighter transition-colors"
              aria-label={light ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {light ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <a
              href="https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-heading text-surface rounded-xl text-xs font-medium hover:opacity-90 transition-opacity"
            >
              Register
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-muted hover:text-heading hover:bg-surface-lighter transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="absolute inset-0 bg-overlay/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 right-0 w-80 max-w-[85vw] bg-surface-light border-l border-surface-lighter flex flex-col mobile-drawer">
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-lighter">
              <span className="text-sm font-medium text-heading">Navigation</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg hover:bg-surface-lighter text-muted transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              <NavLink to="/dashboard" end className={mobileLinkClass}>
                <Home className="w-4 h-4" /> Dashboard
              </NavLink>
              <NavLink to="/course/7" className={mobileLinkClass}>
                <Terminal className="w-4 h-4" /> Claude Code
              </NavLink>

              <p className="text-[10px] font-medium text-faint uppercase tracking-wider mt-5 mb-2 px-3">Exam Prep</p>
              <NavLink to="/course/1" className={mobileLinkClass}>
                <BookOpen className="w-4 h-4" /> Course 1 — Architecture
              </NavLink>
              <NavLink to="/course/2" className={mobileLinkClass}>
                <BookOpen className="w-4 h-4" /> Course 2 — Tools & MCP
              </NavLink>
              <NavLink to="/course/3" className={mobileLinkClass}>
                <BookOpen className="w-4 h-4" /> Course 3 — Config
              </NavLink>
              <NavLink to="/course/4" className={mobileLinkClass}>
                <BookOpen className="w-4 h-4" /> Course 4 — Prompts
              </NavLink>
              <NavLink to="/course/5" className={mobileLinkClass}>
                <BookOpen className="w-4 h-4" /> Course 5 — Reliability
              </NavLink>
              <NavLink to="/course/6" className={mobileLinkClass}>
                <BookOpen className="w-4 h-4" /> Course 6 — Exam Traps
              </NavLink>

              <p className="text-[10px] font-medium text-faint uppercase tracking-wider mt-5 mb-2 px-3">Fun</p>
              <NavLink to="/learn" end className={mobileLinkClass}>
                <Brain className="w-4 h-4" /> Learn Hub
              </NavLink>
              <NavLink to="/learn/flashcards" className={mobileLinkClass}>
                <Star className="w-4 h-4" /> Flashcards
              </NavLink>
              <NavLink to="/learn/quiz" className={mobileLinkClass}>
                <Star className="w-4 h-4" /> Quick Quiz
              </NavLink>
              <NavLink to="/learn/concepts" className={mobileLinkClass}>
                <Star className="w-4 h-4" /> Key Concepts
              </NavLink>

              <p className="text-[10px] font-medium text-faint uppercase tracking-wider mt-5 mb-2 px-3">Exams</p>
              <NavLink to="/exam/1" className={mobileLinkClass}>
                <FileQuestion className="w-4 h-4" /> Mock Exam 1
              </NavLink>
              <NavLink to="/exam/2" className={mobileLinkClass}>
                <FileQuestion className="w-4 h-4" /> Mock Exam 2
              </NavLink>
              <NavLink to="/exam/3" className={mobileLinkClass}>
                <FileQuestion className="w-4 h-4" /> Mock Exam 3
              </NavLink>
              <NavLink to="/exam/4" className={mobileLinkClass}>
                <FileQuestion className="w-4 h-4" /> Mock Exam 4
              </NavLink>

              <p className="text-[10px] font-medium text-faint uppercase tracking-wider mt-5 mb-2 px-3">Resources</p>
              <NavLink to="/materials" className={mobileLinkClass}>
                <Search className="w-4 h-4" /> Study Materials
              </NavLink>
              <NavLink to="/roadmap" className={mobileLinkClass}>
                <Map className="w-4 h-4" /> Study Roadmap
              </NavLink>
              <NavLink to="/certificate" className={mobileLinkClass}>
                <Award className="w-4 h-4" /> Certificate
              </NavLink>
            </nav>

            <div className="p-4 border-t border-surface-lighter">
              <a
                href="https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-heading text-surface rounded-xl text-sm font-medium hover:opacity-90 transition-opacity w-full"
              >
                Register for Exam
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </aside>
        </div>
      )}

      {/* ── Star Popup ── */}
      {starVisible && (
        <div className="fixed bottom-5 right-5 z-50 flex items-start gap-3 bg-surface-light border border-surface-lighter rounded-xl shadow-lg p-4 max-w-xs animate-fade-in">
          <Star className="w-5 h-5 text-warning shrink-0 mt-0.5" fill="currentColor" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-heading leading-snug">Found this useful?</p>
            <p className="text-xs text-muted mt-0.5">Star the repo on GitHub — it helps others find it!</p>
            <a
              href="https://github.com/haytamAroui/Claude-Certified-Architect"
              target="_blank"
              rel="noopener noreferrer"
              onClick={dismissStar}
              className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              Star on GitHub
            </a>
          </div>
          <button onClick={dismissStar} className="text-faint hover:text-muted transition-colors shrink-0" aria-label="Dismiss">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Main ── */}
      <main className="flex-1">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <Outlet />
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-surface-lighter mt-auto no-print">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-faint">
            Created by <span className="text-muted">Haytam Aroui</span>
          </span>
          <div className="flex items-center gap-4">
            <a
              href="https://buymeacoffee.com/haytamaroui"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-faint hover:text-muted transition-colors"
            >
              Buy me tokens
            </a>
            <a
              href="https://github.com/haytamAroui/Claude-Certified-Architect"
              target="_blank"
              rel="noopener noreferrer"
              className="text-faint hover:text-muted transition-colors"
              aria-label="GitHub repository"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
