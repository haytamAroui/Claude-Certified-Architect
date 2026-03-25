import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, List, ChevronUp, X } from 'lucide-react'
import { courses } from '../data/courses'
import { useProgress } from '../data/useProgress'
import { courseContents } from '../data/courseContents'
import ModuleTOC from '../components/ModuleTOC'
import ModuleCard from '../components/ModuleCard'

/** Split course markdown into individual module chunks */
function splitModules(courseId: string, content: string): { title: string; content: string }[] {
  // Course 6 uses "## Trap N —" plus bonus sections
  if (courseId === '6') {
    const pattern = /(?=^## (?:Trap \d+|Bonus:|Quick Self-Test:|Scenario Practice:))/m
    return content.split(pattern).filter(Boolean).map((chunk) => {
      const firstLine = chunk.split('\n')[0]
      const title = firstLine.replace(/^## /, '').replace(/ —.*/, '').trim()
      return { title, content: chunk.trim() }
    })
  }

  // Courses 1-5: split on "## Module N.N —" and "## Practice Questions"
  const pattern = /(?=^## (?:Module \d+\.\d+[a-b]? —|Practice Questions —))/m
  const chunks = content.split(pattern).filter(Boolean)

  return chunks.map((chunk) => {
    const firstLine = chunk.split('\n')[0]
    // Extract title: "## Module 1.1 — The Agentic Loop" → "The Agentic Loop"
    const titleMatch = firstLine.match(/— (.+)$/)
    const title = titleMatch ? titleMatch[1].trim() : firstLine.replace(/^## /, '').trim()
    return { title, content: chunk.trim() }
  })
}

/** Get module number label from course/module index */
function getModuleNumber(courseId: string, index: number, title: string): string {
  if (courseId === '6') return String(index + 1)
  if (title.startsWith('Practice Questions')) return 'P'
  return `${courseId}.${index + 1}`
}

export default function CourseViewer() {
  const { courseId } = useParams<{ courseId: string }>()
  const course = courses.find((c) => c.id === courseId)
  const { progress, toggleModule } = useProgress()
  const [activeModule, setActiveModule] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)

  if (!course) {
    return (
      <div className="text-center py-20">
        <p className="text-muted">Course not found</p>
        <Link to="/" className="text-primary mt-2 inline-block">Back to Dashboard</Link>
      </div>
    )
  }

  const content = courseContents[course.id] || '# Coming soon...'
  // Strip the course title line (# Course N: ...) before splitting
  const bodyContent = content.replace(/^# .+\n+(?:>.*\n+)?(?:---\n+)?/, '')

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const modules = useMemo(() => splitModules(course.id, bodyContent), [course.id, bodyContent])
  const completedModules = progress.completedModules[course.id] || []
  const progressPct = modules.length > 0 ? Math.round((completedModules.length / modules.length) * 100) : 0
  const currentModule = modules[activeModule] || modules[0]

  const prevCourse = courses.find((c) => c.id === String(Number(course.id) - 1))
  const nextCourse = courses.find((c) => c.id === String(Number(course.id) + 1))

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <Link to="/" className="text-muted hover:text-heading text-sm flex items-center gap-1.5 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-faint bg-surface-lighter px-2.5 py-1 rounded-md">
                {course.domain}
              </span>
              <span className="text-xs font-medium text-primary bg-primary/8 px-2.5 py-1 rounded-md">
                Exam Weight: {course.weight}
              </span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-semibold text-heading flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-primary shrink-0" />
              Course {course.id}: {course.title}
            </h1>
          </div>
        </div>

        {/* Module progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-faint mb-1">
            <span>{completedModules.length}/{modules.length} modules</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-1.5 bg-surface rounded-full overflow-hidden" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6 items-start">
        {/* Desktop TOC */}
        <ModuleTOC
          modules={modules.map((m) => m.title)}
          activeIndex={activeModule}
          completedIndices={completedModules}
          onSelect={setActiveModule}
        />

        {/* Content area */}
        <div className="flex-1 min-w-0 space-y-6">
          {currentModule && (
            <ModuleCard
              moduleNumber={getModuleNumber(course.id, activeModule, currentModule.title)}
              title={currentModule.title}
              content={currentModule.content}
              isDone={completedModules.includes(activeModule)}
              onToggleDone={() => toggleModule(course.id, activeModule, modules.length)}
            />
          )}

          {/* Module navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveModule((i) => Math.max(0, i - 1))}
              disabled={activeModule === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted hover:text-heading hover:bg-surface-lighter transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Dot indicators */}
            <div className="flex items-center gap-1.5">
              {modules.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveModule(i)}
                  className={`rounded-full transition-all ${
                    i === activeModule
                      ? 'bg-primary w-4 h-2'
                      : completedModules.includes(i)
                      ? 'bg-success/50 w-2 h-2 hover:bg-success'
                      : 'bg-surface-lighter w-2 h-2 hover:bg-surface-lighter'
                  }`}
                  aria-label={`Module ${i + 1}`}
                />
              ))}
            </div>

            {activeModule < modules.length - 1 ? (
              <button
                onClick={() => setActiveModule((i) => i + 1)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-primary/8 text-primary hover:bg-primary/15 border border-primary/20 transition-all"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <Link
                to={nextCourse ? `/course/${nextCourse.id}` : '/exam/1'}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-accent/10 text-accent-light hover:bg-accent/20 border border-accent/20 transition-all"
              >
                <span className="hidden sm:inline">{nextCourse ? `Course ${nextCourse.id}` : 'Mock Exam'}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Course navigation */}
          <div className="flex justify-between items-center pt-4 border-t border-surface-lighter">
            {prevCourse ? (
              <Link to={`/course/${prevCourse.id}`} className="flex items-center gap-2 text-muted hover:text-body text-xs transition-colors">
                <ArrowLeft className="w-3 h-3" />
                Course {prevCourse.id}
              </Link>
            ) : <div />}
            {nextCourse ? (
              <Link to={`/course/${nextCourse.id}`} className="flex items-center gap-2 text-muted hover:text-body text-xs transition-colors">
                Course {nextCourse.id}
                <ChevronRight className="w-3 h-3" />
              </Link>
            ) : (
              <Link to="/exam/1" className="flex items-center gap-2 text-muted hover:text-body text-xs transition-colors">
                Take Mock Exam
                <ChevronRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile module drawer trigger */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-surface-light border border-surface-lighter rounded-full text-sm font-medium text-heading shadow-xl"
        >
          <List className="w-4 h-4 text-primary" />
          Module {activeModule + 1} of {modules.length}
          <ChevronUp className="w-3.5 h-3.5 text-muted" />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50" onClick={() => setDrawerOpen(false)}>
          <div className="absolute inset-0 bg-overlay/60" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-surface-light border-t border-surface-lighter rounded-t-2xl max-h-[70vh] overflow-y-auto animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-surface-lighter sticky top-0 bg-surface-light">
              <p className="text-sm font-semibold text-heading">Modules</p>
              <button onClick={() => setDrawerOpen(false)} className="text-muted hover:text-heading">
                <X className="w-5 h-5" />
              </button>
            </div>
            <ol className="p-3 space-y-1">
              {modules.map((m, i) => (
                <li key={i}>
                  <button
                    onClick={() => { setActiveModule(i); setDrawerOpen(false) }}
                    className={`w-full text-left flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all ${
                      i === activeModule
                        ? 'bg-primary/8 text-primary font-medium'
                        : 'text-muted hover:text-heading hover:bg-surface-lighter'
                    }`}
                  >
                    <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                      completedModules.includes(i)
                        ? 'bg-success/15 border-success/40 text-success'
                        : i === activeModule
                        ? 'bg-primary/20 border-primary/40 text-primary'
                        : 'border-surface-lighter text-subtle'
                    }`}>
                      {completedModules.includes(i) ? '✓' : i + 1}
                    </span>
                    <span className="leading-tight">{m.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
