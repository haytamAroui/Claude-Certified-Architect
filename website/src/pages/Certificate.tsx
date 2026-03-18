import { Link } from 'react-router-dom'
import { ArrowLeft, Award, Download, Trophy, CheckCircle, Lock } from 'lucide-react'
import { useProgress } from '../data/useProgress'
import { courses } from '../data/courses'

export default function Certificate() {
  const { progress } = useProgress()
  const totalCourses = courses.length

  // Check if user has passed at least one exam
  const bestScore = Object.values(progress.examScores).reduce(
    (best, exam) => (exam.score > best.score ? exam : best),
    { score: 0, total: 60, date: '' }
  )
  const hasPassed = bestScore.score >= Math.ceil(bestScore.total * 0.72)
  const completedCourses = progress.completedCourses.length
  const allCoursesComplete = completedCourses >= totalCourses

  const userName = 'Study Candidate' // Could be made editable
  const dateStr = bestScore.date
    ? new Date(bestScore.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  if (!hasPassed) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <Link to="/" className="text-slate-400 hover:text-slate-200 text-sm flex items-center gap-1 mb-8 justify-center">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
        <div className="bg-surface-light border border-surface-lighter rounded-2xl p-10">
          <div className="w-16 h-16 bg-surface-lighter rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-slate-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Certificate Locked</h1>
          <p className="text-slate-400 mb-6">
            Complete all {totalCourses} courses and pass a mock exam (43/60+) to unlock your certificate of completion.
          </p>
          <div className="space-y-3 text-left bg-surface/50 rounded-lg p-5 max-w-sm mx-auto">
            <div className="flex items-center gap-2">
              {allCoursesComplete ? (
                <CheckCircle className="w-4 h-4 text-success" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-600" />
              )}
              <span className={`text-sm ${allCoursesComplete ? 'text-success' : 'text-slate-400'}`}>
                Complete all {totalCourses} courses ({completedCourses}/{totalCourses})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border border-slate-600" />
              <span className="text-sm text-slate-400">
                Pass a mock exam (best: {bestScore.score}/60)
              </span>
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-6 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            Continue Studying
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Link to="/" className="text-slate-400 hover:text-slate-200 text-sm flex items-center gap-1 mb-8">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </Link>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3 justify-center">
          <Award className="w-7 h-7 text-warning" />
          Certificate of Completion
        </h1>
        <p className="text-slate-400 mt-2">Congratulations on completing the study guide!</p>
      </div>

      {/* Certificate */}
      <div
        id="certificate"
        className="bg-gradient-to-br from-surface-light via-surface-light to-accent/5 border-2 border-primary/30 rounded-2xl p-6 sm:p-10 relative overflow-hidden"
      >
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-primary/40 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-primary/40 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-primary/40 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-primary/40 rounded-br-2xl" />

        <div className="text-center relative z-10">
          {/* Logo */}
          <div className="w-16 h-16 bg-primary/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-primary" />
          </div>

          <p className="text-sm text-slate-500 uppercase tracking-widest mb-2">Certificate of Completion</p>
          <h2 className="text-3xl font-bold text-white mb-1">Claude Certified Architect</h2>
          <p className="text-primary-light text-lg mb-8">Foundations Study Guide</p>

          <p className="text-slate-400 text-sm mb-1">Awarded to</p>
          <p className="text-2xl font-semibold text-white mb-8">{userName}</p>

          <div className="flex justify-center gap-4 sm:gap-8 mb-8 flex-wrap">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-primary">{bestScore.score}/{bestScore.total}</p>
              <p className="text-xs text-slate-500">Exam Score</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-success">{completedCourses}/{totalCourses}</p>
              <p className="text-xs text-slate-500">Courses</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-accent">
                {Math.round((bestScore.score / bestScore.total) * 1000)}
              </p>
              <p className="text-xs text-slate-500">Score (out of 1000)</p>
            </div>
          </div>

          <div className="border-t border-surface-lighter pt-6">
            <p className="text-sm text-slate-500">{dateStr}</p>
            <p className="text-xs text-slate-600 mt-1">
              This certificate acknowledges completion of the Claude Certified Architect study materials and mock exam.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 flex-wrap">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Print / Save as PDF
        </button>
        <Link
          to="/"
          className="flex items-center gap-2 bg-surface-lighter hover:bg-surface-lighter/80 text-slate-300 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
