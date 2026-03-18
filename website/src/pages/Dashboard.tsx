import { Link } from 'react-router-dom'
import { BookOpen, FileQuestion, CheckCircle, Circle, Trophy, ArrowRight, Map, Flame, BarChart3 } from 'lucide-react'
import { courses } from '../data/courses'
import { useProgress } from '../data/useProgress'

const domainNames: Record<string, string> = {
  'Domain 1': 'Agentic Architecture',
  'Domain 2': 'Tool Design & MCP',
  'Domain 3': 'Claude Code Config',
  'Domain 4': 'Prompt Engineering',
  'Domain 5': 'Context & Reliability',
}

export default function Dashboard() {
  const { progress, toggleCourse, getDomainStats } = useProgress()
  const completedCount = progress.completedCourses.length
  const totalCourses = 6
  const progressPct = Math.round((completedCount / totalCourses) * 100)
  const domainStats = getDomainStats()

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/20 via-surface-light to-accent/10 rounded-2xl p-8 border border-surface-lighter">
        <h1 className="text-3xl font-bold text-white mb-2">
          Claude Certified Architect
        </h1>
        <p className="text-slate-300 text-lg mb-6">
          Foundations Exam — Study Guide & Practice
        </p>

        {/* Progress bar */}
        <div className="bg-surface/50 rounded-full h-3 mb-2">
          <div
            className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">{completedCount}/{totalCourses} courses completed</span>
          <span className="text-primary-light font-medium">{progressPct}%</span>
        </div>
      </div>

      {/* Courses Grid */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Courses
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {courses.map((course) => {
            const isCompleted = progress.completedCourses.includes(course.id)
            return (
              <div
                key={course.id}
                className="bg-surface-light border border-surface-lighter rounded-xl p-5 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500 bg-surface-lighter px-2 py-0.5 rounded">
                      {course.domain}
                    </span>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {course.weight}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleCourse(course.id)}
                    className="text-slate-500 hover:text-success transition-colors"
                    title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <h3 className="text-white font-semibold mb-1">
                  Course {course.id}: {course.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                <Link
                  to={`/course/${course.id}`}
                  className="inline-flex items-center gap-1.5 text-sm text-primary-light hover:text-primary font-medium transition-colors"
                >
                  Start studying <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* Exams + Resources */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Mock Exams */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-accent" />
            Mock Exams
          </h2>
          {[1, 2].map((id) => {
            const score = progress.examScores[id.toString()]
            return (
              <Link
                key={id}
                to={`/exam/${id}`}
                className="block bg-surface-light border border-surface-lighter rounded-xl p-5 mb-3 hover:border-accent/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">Mock Exam {id}</h3>
                    <p className="text-slate-400 text-sm">60 questions — 120 minutes</p>
                  </div>
                  {score ? (
                    <div className="text-right">
                      <div className="flex items-center gap-1.5">
                        <Trophy className={`w-4 h-4 ${score.score >= 43 ? 'text-success' : 'text-warning'}`} />
                        <span className={`font-bold ${score.score >= 43 ? 'text-success' : 'text-warning'}`}>
                          {score.score}/{score.total}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {new Date(score.date).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-500">Not attempted</span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Map className="w-5 h-5 text-success" />
            Resources
          </h2>
          <Link
            to="/roadmap"
            className="block bg-surface-light border border-surface-lighter rounded-xl p-5 mb-3 hover:border-success/30 transition-all"
          >
            <h3 className="text-white font-semibold">18-Day Study Roadmap</h3>
            <p className="text-slate-400 text-sm">Day-by-day plan from zero to exam-ready</p>
          </Link>
          <a
            href="https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-5 hover:border-primary/40 transition-all"
          >
            <h3 className="text-white font-semibold">Register for the Exam</h3>
            <p className="text-slate-400 text-sm">Official Anthropic certification portal</p>
          </a>
        </div>
      </div>

      {/* Domain Performance */}
      {Object.keys(domainStats).length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
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
                    <span className="text-sm text-slate-300">
                      {domain}: {domainNames[domain] || domain}
                    </span>
                    <span className={`text-sm font-medium ${isStrong ? 'text-success' : isWeak ? 'text-danger' : 'text-warning'}`}>
                      {stats.correct}/{stats.total} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-surface rounded-full overflow-hidden">
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
            <p className="text-xs text-slate-500 pt-2 border-t border-surface-lighter">
              Based on all completed mock exams. Green = 72%+ (strong), Yellow = 50-71% (review), Red = &lt;50% (focus area)
            </p>
          </div>
        </div>
      )}

      {/* Study Streak */}
      {progress.studyStreak > 0 && (
        <div className="bg-gradient-to-r from-primary/10 to-warning/10 border border-primary/20 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-warning/15 flex items-center justify-center">
            <Flame className="w-6 h-6 text-warning" />
          </div>
          <div>
            <p className="text-white font-semibold text-lg">{progress.studyStreak} day streak!</p>
            <p className="text-slate-400 text-sm">Keep studying daily to maintain your streak</p>
          </div>
        </div>
      )}

      {/* Passing criteria */}
      <div className="bg-surface-light border border-surface-lighter rounded-xl p-6">
        <h3 className="text-white font-semibold mb-3">Exam Quick Facts</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">60</p>
            <p className="text-sm text-slate-400">Questions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">120</p>
            <p className="text-sm text-slate-400">Minutes</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">720</p>
            <p className="text-sm text-slate-400">Passing Score</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">43/60</p>
            <p className="text-sm text-slate-400">Min. Correct</p>
          </div>
        </div>
      </div>
    </div>
  )
}
