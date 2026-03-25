import { useState, useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { BookOpen, FileQuestion, Map, Home, Menu, X, ExternalLink, Search, Award, Github, Sun, Moon, Star } from 'lucide-react'
import { courses } from '../data/courses'

function useTheme() {
  const [light, setLight] = useState(() => localStorage.getItem('theme') === 'light')
  useEffect(() => {
    document.documentElement.classList.toggle('light', light)
    localStorage.setItem('theme', light ? 'light' : 'dark')
  }, [light])
  return { light, toggle: () => setLight(p => !p) }
}

const exams = [
  { id: '1', title: 'Mock Exam 1' },
  { id: '2', title: 'Mock Exam 2' },
  { id: '3', title: 'Mock Exam 3' },
  { id: '4', title: 'Mock Exam 4' },
]

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
    isActive
      ? 'bg-primary/8 text-primary font-medium'
      : 'text-muted hover:text-heading hover:bg-surface-lighter'
  }`

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

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { light, toggle: toggleTheme } = useTheme()
  const { visible: starVisible, dismiss: dismissStar } = useStarPopup()

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-overlay/50 z-40 lg:hidden"
          role="dialog"
          aria-label="Navigation menu"
          aria-modal="true"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => { if (e.key === 'Escape') setSidebarOpen(false) }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-surface-light border-r border-surface-lighter flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-surface-lighter">
          <NavLink to="/" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-[18px] h-[18px] text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-heading leading-tight">Claude Certified</h1>
              <p className="text-xs text-faint">Architect Study Guide</p>
            </div>
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-8">
          <div>
            <NavLink to="/" className={linkClass} onClick={() => setSidebarOpen(false)}>
              <Home className="w-4 h-4" />
              Dashboard
            </NavLink>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-faint uppercase tracking-wider mb-2 px-3">
              Courses
            </p>
            <div className="space-y-1">
              {courses.map((c) => (
                <NavLink
                  key={c.id}
                  to={`/course/${c.id}`}
                  className={linkClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span className="flex-1 truncate">{c.title}</span>
                  <span className="text-xs text-faint">{c.weight}</span>
                </NavLink>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-faint uppercase tracking-wider mb-2 px-3">
              Mock Exams
            </p>
            <div className="space-y-1">
              {exams.map((e) => (
                <NavLink
                  key={e.id}
                  to={`/exam/${e.id}`}
                  className={linkClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  <FileQuestion className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{e.title}</span>
                  <span className="text-xs text-faint">60 Q</span>
                </NavLink>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-faint uppercase tracking-wider mb-2 px-3">
              Resources
            </p>
            <div className="space-y-1">
              <NavLink to="/materials" className={linkClass} onClick={() => setSidebarOpen(false)}>
                <Search className="w-4 h-4" />
                Study Materials
              </NavLink>
              <NavLink to="/roadmap" className={linkClass} onClick={() => setSidebarOpen(false)}>
                <Map className="w-4 h-4" />
                Study Roadmap
              </NavLink>
              <NavLink to="/certificate" className={linkClass} onClick={() => setSidebarOpen(false)}>
                <Award className="w-4 h-4" />
                Certificate
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-surface-lighter space-y-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-faint hover:text-heading hover:bg-surface-lighter transition-colors w-full"
            aria-label={light ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {light ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span className="text-xs">{light ? 'Dark mode' : 'Light mode'}</span>
          </button>

          {/* Register link */}
          <a
            href="https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2.5 bg-primary/8 hover:bg-primary/15 rounded-lg text-primary text-sm font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Register for Exam
          </a>

          {/* Buy me tokens */}
          <a
            href="https://buymeacoffee.com/haytamaroui"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-muted hover:text-heading rounded-lg hover:bg-surface-lighter text-sm transition-colors"
          >
            <span className="text-base leading-none">🪙</span>
            Buy me tokens
          </a>

          {/* Creator credit */}
          <div className="flex items-center justify-between px-3 pt-2">
            <span className="text-xs text-faint">Created by <span className="text-muted">Haytam Aroui</span></span>
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
      </aside>

      {/* Star popup */}
      {starVisible && (
        <div className="fixed bottom-5 right-5 z-50 flex items-start gap-3 bg-surface-light border border-surface-lighter rounded-xl shadow-2xl p-4 max-w-xs animate-in slide-in-from-bottom-4 fade-in duration-300">
          <Star className="w-5 h-5 text-warning shrink-0 mt-0.5" fill="currentColor" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-heading leading-snug">Found this useful?</p>
            <p className="text-xs text-muted mt-0.5">Give the repo a star on GitHub — it helps others find it!</p>
            <a
              href="https://github.com/haytamAroui/Claude-Certified-Architect"
              target="_blank"
              rel="noopener noreferrer"
              onClick={dismissStar}
              className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-warning hover:text-warning transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              Star on GitHub
            </a>
          </div>
          <button
            onClick={dismissStar}
            className="text-faint hover:text-muted transition-colors shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 bg-surface-light/90 backdrop-blur-md border-b border-surface-lighter px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-surface-lighter text-muted"
            aria-label="Open navigation menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="text-sm font-medium text-heading">Claude Certified Architect</span>
        </div>

        <div className="p-6 sm:p-8 lg:p-12 max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
