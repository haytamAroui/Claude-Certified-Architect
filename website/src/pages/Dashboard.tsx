import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen, FileQuestion, CheckCircle, Circle, Trophy, Map,
  Flame, BarChart3, Brain, Award, Zap, Terminal, Play, ChevronRight,
} from 'lucide-react'
import { courses } from '../data/courses'
import { useProgress } from '../data/useProgress'
import { badges as badgeCatalog } from '../data/badgeData'

const domainNames: Record<string, string> = {
  D1: 'Agentic Architecture',
  D2: 'Tool Design & MCP',
  D3: 'Claude Code Config',
  D4: 'Prompt Engineering',
  D5: 'Context & Reliability',
}

const courseColors: Record<string, string> = {
  '1': 'dash-card-sage',
  '2': 'dash-card-sky',
  '3': 'dash-card-heather',
  '4': 'dash-card-oat',
  '5': 'dash-card-sky',
  '6': 'dash-card-heather',
  '7': 'dash-card-warm',
}

function checkBadges(progress: ReturnType<typeof useProgress>['progress']): string[] {
  const earned: string[] = []
  if (progress.completedCourses.length >= 1) earned.push('first-course')
  if (progress.completedCourses.length >= 7) earned.push('all-courses')
  const examIds = Object.keys(progress.examScores)
  if (examIds.length >= 1) earned.push('first-exam')
  if (examIds.length >= 4) earned.push('all-exams')
  for (const e of Object.values(progress.examScores)) {
    if (e.score / e.total >= 0.72) earned.push('exam-pass')
    if (e.score / e.total >= 0.90) earned.push('exam-ace')
  }
  if (progress.studyStreak >= 7) earned.push('streak-7')
  const totalMastered = Object.values(progress.flashcardStats).reduce((s, d) => s + d.mastered, 0)
  if (totalMastered >= 50) earned.push('flashcard-master')
  if (progress.quizScores.length >= 10) earned.push('quiz-streak')
  if (progress.conceptsViewed.length >= 40) earned.push('concept-explorer')
  return [...new Set(earned)]
}

export default function Dashboard() {
  const { progress, toggleCourse, getDomainStats, awardBadge, addXP } = useProgress()
  const completedCount = progress.completedCourses.length
  const totalCourses = courses.length
  const progressPct = Math.round((completedCount / totalCourses) * 100)
  const domainStats = getDomainStats()

  const featuredCourse = courses.find(c => c.id === '7')!
  const examCourses = courses.filter(c => c.id !== '7')
  const featuredModules = progress.completedModules['7'] || []
  const featuredDone = featuredModules.length
  const featuredTotal = featuredCourse.modules.length
  const featuredPct = Math.round((featuredDone / featuredTotal) * 100)
  const isFeaturedCompleted = progress.completedCourses.includes('7')

  useEffect(() => {
    const earned = checkBadges(progress)
    for (const b of earned) {
      if (!progress.badges.includes(b)) {
        awardBadge(b)
        addXP(25)
      }
    }
  }, [progress.completedCourses, progress.examScores, progress.studyStreak, progress.flashcardStats, progress.quizScores, progress.conceptsViewed])

  return (
    <div className="space-y-10 animate-fade-in">

      {/* ── Overview bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-medium text-heading tracking-tight">
            Your dashboard
          </h1>
          <p className="text-muted text-sm mt-1">Claude Certified Architect — Foundations</p>
        </div>
        <div className="flex items-center gap-3">
          {progress.studyStreak > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-warning/8 border border-warning/15 rounded-lg">
              <Flame className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium text-warning">{progress.studyStreak} day streak</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/8 border border-accent/15 rounded-lg">
            <Zap className="w-3.5 h-3.5 text-accent" />
            <span className="text-sm font-medium text-accent">{progress.xpPoints} XP</span>
          </div>
        </div>
      </div>

      {/* ── Study Roadmap Banner ── */}
      <Link
        to="/roadmap"
        className="group flex items-center gap-4 rounded-2xl border border-primary/15 bg-primary/4 p-4 sm:p-5 hover:border-primary/25 hover:bg-primary/6 transition-all"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Map className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-medium text-heading">18-Day Study Roadmap</h2>
          <p className="text-xs text-muted mt-0.5">
            Follow the day-by-day plan — from foundations to exam day. Track your progress through 5 phases.
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-primary shrink-0 group-hover:translate-x-0.5 transition-transform" />
      </Link>

      {/* ── Progress ── */}
      <div className="rounded-xl border border-surface-lighter p-5 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-body">{completedCount} of {totalCourses} courses completed</span>
          <span className="text-sm font-medium text-heading tabular-nums">{progressPct}%</span>
        </div>
        <div className="h-2 bg-surface-lighter rounded-full overflow-hidden" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100} aria-label={`Course progress: ${progressPct}%`}>
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Quick facts */}
        <div className="grid grid-cols-4 gap-4 mt-5 pt-5 border-t border-surface-lighter">
          {[
            { label: 'Questions', value: '60' },
            { label: 'Minutes', value: '120' },
            { label: 'Pass score', value: '720' },
            { label: 'Min. correct', value: '43/60' },
          ].map(f => (
            <div key={f.label} className="text-center">
              <p className="font-display text-lg font-medium text-heading">{f.value}</p>
              <p className="text-[10px] text-faint uppercase tracking-wider mt-0.5">{f.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Featured: Claude Code ── */}
      <Link
        to="/course/7"
        className="block rounded-2xl overflow-hidden group dash-card-warm border border-surface-lighter hover:shadow-md transition-all"
      >
        <div className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                  Featured
                </span>
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent">
                  Hands-On
                </span>
                {isFeaturedCompleted && (
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-success/10 text-success flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Complete
                  </span>
                )}
              </div>

              <div className="flex items-start gap-3 mb-3">
                <Terminal className="w-6 h-6 text-primary mt-0.5 shrink-0" />
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-medium text-heading tracking-tight">
                    {featuredCourse.title}
                  </h2>
                  <p className="text-muted text-sm mt-1">{featuredCourse.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {featuredCourse.modules.map((mod, i) => {
                  const done = featuredModules.includes(i)
                  return (
                    <span
                      key={i}
                      className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors ${
                        done
                          ? 'bg-success/10 text-success'
                          : 'bg-surface/30 text-faint'
                      }`}
                    >
                      {mod}
                    </span>
                  )
                })}
              </div>
            </div>

            <div className="lg:w-48 shrink-0 flex flex-col items-start lg:items-center gap-3">
              <div className="w-full">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted">{featuredDone}/{featuredTotal} modules</span>
                  <span className="text-heading font-medium">{featuredPct}%</span>
                </div>
                <div className="bg-surface/30 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${featuredPct}%` }}
                  />
                </div>
              </div>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-heading text-surface text-sm font-medium group-hover:opacity-90 transition-opacity">
                <Play className="w-4 h-4" />
                {featuredDone > 0 ? 'Continue' : 'Start learning'}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* ── Badges ── */}
      {progress.badges.length > 0 && (
        <div>
          <h2 className="font-display text-lg font-medium text-heading mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-faint" />
            Badges
          </h2>
          <div className="flex flex-wrap gap-2">
            {badgeCatalog.map(b => {
              const earned = progress.badges.includes(b.id)
              return (
                <div
                  key={b.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${
                    earned
                      ? 'border-warning/20 text-heading'
                      : 'border-surface-lighter text-subtle'
                  }`}
                  title={earned ? b.description : `${b.condition} to unlock`}
                >
                  <span className={`text-base ${earned ? '' : 'grayscale opacity-40'}`}>{b.icon}</span>
                  <span className={earned ? 'font-medium' : ''}>{b.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Exam Prep Courses ── */}
      <div>
        <h2 className="font-display text-lg font-medium text-heading mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-faint" />
          Exam prep courses
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {examCourses.map((course) => {
            const isCompleted = progress.completedCourses.includes(course.id)
            const mods = progress.completedModules[course.id] || []
            const modPct = course.modules.length > 0 ? Math.round((mods.length / course.modules.length) * 100) : 0
            return (
              <div
                key={course.id}
                className={`rounded-xl border border-surface-lighter p-5 group hover:shadow-sm transition-all ${courseColors[course.id] || ''}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-medium text-faint px-2 py-0.5 rounded-full border border-surface-lighter">
                    {course.domain}
                  </span>
                  <span className="text-[11px] font-medium text-primary px-2 py-0.5 rounded-full bg-primary/8">
                    {course.weight}
                  </span>
                </div>

                <div className="flex items-start justify-between mb-1.5">
                  <h3 className="font-display text-[15px] font-medium text-heading leading-snug">
                    {course.title}
                  </h3>
                  <button
                    onClick={() => toggleCourse(course.id)}
                    className="text-faint hover:text-success transition-colors ml-2 shrink-0"
                    title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <p className="text-muted text-xs mb-4 line-clamp-2">{course.description}</p>

                <div className="mb-4">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-faint">{mods.length}/{course.modules.length} modules</span>
                    <span className="text-heading font-medium">{modPct}%</span>
                  </div>
                  <div className="bg-surface/30 rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${modPct}%` }}
                    />
                  </div>
                </div>

                <Link
                  to={`/course/${course.id}`}
                  className="inline-flex items-center gap-1.5 text-sm text-primary font-medium group-hover:gap-2 transition-all"
                >
                  {mods.length > 0 ? 'Continue' : 'Explore'}
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Interactive Learning ── */}
      <Link
        to="/learn"
        className="group flex items-center gap-3 rounded-xl border border-surface-lighter p-5 hover:shadow-sm transition-all"
      >
        <Brain className="w-5 h-5 text-faint group-hover:text-primary transition-colors" />
        <div className="flex-1 min-w-0">
          <h3 className="text-heading font-medium text-sm">Interactive Learning</h3>
          <p className="text-muted text-xs">Flashcards, quizzes & key concepts</p>
        </div>
        <ChevronRight className="w-4 h-4 text-faint group-hover:text-primary transition-colors" />
      </Link>

      {/* ── Mock Exams ── */}
      <div>
        <h2 className="font-display text-lg font-medium text-heading mb-4 flex items-center gap-2">
          <FileQuestion className="w-5 h-5 text-faint" />
          Mock exams
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((id) => {
            const score = progress.examScores[id.toString()]
            return (
              <Link
                key={id}
                to={`/exam/${id}`}
                className="group rounded-xl border border-surface-lighter p-5 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-heading font-medium text-sm">Mock Exam {id}</h3>
                    <p className="text-muted text-xs mt-0.5">60 questions — 120 min</p>
                  </div>
                  {score ? (
                    <div className="text-right">
                      <div className="flex items-center gap-1.5">
                        <Trophy className={`w-4 h-4 ${score.score >= 43 ? 'text-success' : 'text-warning'}`} />
                        <span className={`font-medium text-sm tabular-nums ${score.score >= 43 ? 'text-success' : 'text-warning'}`}>
                          {score.score}/{score.total}
                        </span>
                      </div>
                      <p className="text-[10px] text-faint mt-0.5">
                        {new Date(score.date).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-faint group-hover:text-primary transition-colors" />
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── Domain Performance ── */}
      {Object.keys(domainStats).length > 0 && (
        <div>
          <h2 className="font-display text-lg font-medium text-heading mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-faint" />
            Domain performance
          </h2>
          <div className="rounded-xl border border-surface-lighter p-5 sm:p-6 space-y-4">
            {Object.entries(domainStats).sort(([a], [b]) => a.localeCompare(b)).map(([domain, stats]) => {
              const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
              const isStrong = pct >= 72
              const isWeak = pct < 50
              return (
                <div key={domain}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-faint w-6">{domain}</span>
                      <span className="text-sm text-body">{domainNames[domain] || domain}</span>
                    </div>
                    <span className={`text-sm font-medium tabular-nums ${isStrong ? 'text-success' : isWeak ? 'text-danger' : 'text-warning'}`}>
                      {pct}%
                    </span>
                  </div>
                  <div className="h-2 bg-surface-lighter rounded-full overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${domainNames[domain] || domain}: ${pct}%`}>
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
            <p className="text-[11px] text-faint pt-3 border-t border-surface-lighter">
              Green = 72%+ (strong) · Yellow = 50-71% (review) · Red = &lt;50% (focus area)
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
