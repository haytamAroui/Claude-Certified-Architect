import { Link } from 'react-router-dom'
import { BookOpen, FileQuestion, CheckCircle, Circle, Trophy, ArrowRight, Map, Flame, BarChart3 } from 'lucide-react'
import { courses } from '../data/courses'
import { useProgress } from '../data/useProgress'

const domainNames: Record<string, string> = {
  D1: 'Agentic Architecture',
  D2: 'Tool Design & MCP',
  D3: 'Claude Code Config',
  D4: 'Prompt Engineering',
  D5: 'Context & Reliability',
}

export default function Dashboard() {
  const { progress, toggleCourse, getDomainStats } = useProgress()
  const completedCount = progress.completedCourses.length
  const totalCourses = courses.length
  const progressPct = Math.round((completedCount / totalCourses) * 100)
  const domainStats = getDomainStats()

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero */}
      <div className="rounded-2xl p-8 sm:p-10 border border-surface-lighter bg-surface-light">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-heading tracking-tight mb-2">
          Claude Certified Architect
        </h1>
        <p className="text-body text-lg mb-8">
          Foundations Exam — Study Guide &amp; Practice
        </p>

        {/* Progress bar */}
        <div className="bg-surface/50 rounded-full h-2 mb-3" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100} aria-label={`Course progress: ${progressPct}%`}>
          <div
            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">{completedCount}/{totalCourses} courses completed</span>
          <span className="text-primary font-medium">{progressPct}%</span>
        </div>
      </div>

      {/* Courses Grid */}
      <div>
        <h2 className="font-display text-xl font-semibold text-heading mb-5 flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-primary" />
          Courses
        </h2>
        <div className="grid md:grid-cols-2 gap-5 stagger-children">
          {courses.map((course) => {
            const isCompleted = progress.completedCourses.includes(course.id)
            return (
              <div
                key={course.id}
                className="bg-surface-light border border-surface-lighter rounded-xl p-6 hover:border-primary/20 transition-all group card-hover"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-medium text-faint bg-surface-lighter px-2.5 py-1 rounded-md">
                    {course.domain}
                  </span>
                  <span className="text-xs font-medium text-primary bg-primary/8 px-2.5 py-1 rounded-md">
                    {course.weight}
                  </span>
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-heading font-semibold text-base">
                    Course {course.id}: {course.title}
                  </h3>
                  <button
                    onClick={() => toggleCourse(course.id)}
                    className="text-faint hover:text-success transition-colors ml-3 shrink-0"
                    title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-muted text-sm mb-5 line-clamp-2">
                  {course.description}
                </p>
                <Link
                  to={`/course/${course.id}`}
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-dark font-medium transition-colors"
                >
                  Start studying <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* Exams + Resources */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Mock Exams */}
        <div>
          <h2 className="font-display text-xl font-semibold text-heading mb-5 flex items-center gap-2.5">
            <FileQuestion className="w-5 h-5 text-accent" />
            Mock Exams
          </h2>
          {[1, 2, 3, 4].map((id) => {
            const score = progress.examScores[id.toString()]
            return (
              <Link
                key={id}
                to={`/exam/${id}`}
                className="block bg-surface-light border border-surface-lighter rounded-xl p-6 mb-3 hover:border-accent/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-heading font-semibold">Mock Exam {id}</h3>
                    <p className="text-muted text-sm">60 questions — 120 minutes</p>
                  </div>
                  {score ? (
                    <div className="text-right">
                      <div className="flex items-center gap-1.5">
                        <Trophy className={`w-4 h-4 ${score.score >= 43 ? 'text-success' : 'text-warning'}`} />
                        <span className={`font-bold ${score.score >= 43 ? 'text-success' : 'text-warning'}`}>
                          {score.score}/{score.total}
                        </span>
                      </div>
                      <p className="text-xs text-faint">
                        {new Date(score.date).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <span className="text-sm text-faint">Not attempted</span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="font-display text-xl font-semibold text-heading mb-5 flex items-center gap-2.5">
            <Map className="w-5 h-5 text-success" />
            Resources
          </h2>
          <Link
            to="/roadmap"
            className="block bg-surface-light border border-surface-lighter rounded-xl p-6 mb-3 hover:border-success/30 transition-all"
          >
            <h3 className="text-heading font-semibold">18-Day Study Roadmap</h3>
            <p className="text-muted text-sm">Day-by-day plan from zero to exam-ready</p>
          </Link>
          <a
            href="https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-surface-light border border-surface-lighter rounded-xl p-6 hover:border-primary/20 transition-all"
          >
            <h3 className="text-heading font-semibold">Register for the Exam</h3>
            <p className="text-muted text-sm">Official Anthropic certification portal</p>
          </a>
        </div>
      </div>

      {/* Domain Performance */}
      {Object.keys(domainStats).length > 0 && (
        <div>
          <h2 className="font-display text-xl font-semibold text-heading mb-5 flex items-center gap-2.5">
            <BarChart3 className="w-5 h-5 text-primary" />
            Domain Performance
          </h2>
          <div className="bg-surface-light border border-surface-lighter rounded-xl p-6 space-y-4">
            {Object.entries(domainStats).sort(([a], [b]) => a.localeCompare(b)).map(([domain, stats]) => {
              const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
              const isStrong = pct >= 72
              const isWeak = pct < 50
              return (
                <div key={domain}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-body">
                      {domain}: {domainNames[domain] || domain}
                    </span>
                    <span className={`text-sm font-medium ${isStrong ? 'text-success' : isWeak ? 'text-danger' : 'text-warning'}`}>
                      {stats.correct}/{stats.total} ({pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 bg-surface rounded-full overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${domainNames[domain] || domain}: ${pct}%`}>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isStrong ? 'bg-success' : isWeak ? 'bg-danger' : 'bg-warning'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
            <p className="text-xs text-faint pt-2 border-t border-surface-lighter">
              Based on all completed mock exams. Green = 72%+ (strong), Yellow = 50-71% (review), Red = &lt;50% (focus area)
            </p>
          </div>
        </div>
      )}

      {/* Study Streak */}
      {progress.studyStreak > 0 && (
        <div className="bg-surface-light border border-surface-lighter rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-warning/15 flex items-center justify-center">
            <Flame className="w-6 h-6 text-warning" />
          </div>
          <div>
            <p className="text-heading font-semibold text-lg">{progress.studyStreak} day streak!</p>
            <p className="text-muted text-sm">Keep studying daily to maintain your streak</p>
          </div>
        </div>
      )}

      {/* Passing criteria */}
      <div className="bg-surface-light border border-surface-lighter rounded-xl p-8">
        <h3 className="font-display text-heading font-semibold mb-5">Exam Quick Facts</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">60</p>
            <p className="text-sm text-muted">Questions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">120</p>
            <p className="text-sm text-muted">Minutes</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">720</p>
            <p className="text-sm text-muted">Passing Score</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">43/60</p>
            <p className="text-sm text-muted">Min. Correct</p>
          </div>
        </div>
      </div>
    </div>
  )
}
