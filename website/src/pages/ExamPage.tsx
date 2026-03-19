import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Clock, CheckCircle, XCircle, Trophy, RotateCcw, Flag, Shield } from 'lucide-react'
import { useProgress } from '../data/useProgress'
import { examData } from '../data/examData'
import ExamTimer from '../components/ExamTimer'

type ExamPhase = 'intro' | 'active' | 'review'
type ExamMode = 'practice' | 'simulation'

export default function ExamPage() {
  const { examId } = useParams<{ examId: string }>()
  const { saveExamScore, progress } = useProgress()

  const questions = useMemo(() => examData[examId || '1'] || [], [examId])

  const [phase, setPhase] = useState<ExamPhase>('intro')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [flagged, setFlagged] = useState<Set<number>>(new Set())
  const [showExplanation, setShowExplanation] = useState(false)
  const [timerEnabled, setTimerEnabled] = useState(true)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [mode, setMode] = useState<ExamMode>('practice')
  const [highestReached, setHighestReached] = useState(0)

  const isSimulation = mode === 'simulation'

  const totalAnswered = Object.keys(answers).length
  const score = useMemo(() => {
    if (phase !== 'review') return 0
    return questions.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0)
  }, [phase, answers, questions])

  const passThreshold = Math.ceil(questions.length * 0.72)
  const passed = score >= passThreshold
  const lastScore = progress.examScores[examId || '1']

  const handleAnswer = (letter: string) => {
    if (phase === 'review') return
    // In simulation mode, can't change answer once set
    if (isSimulation && answers[current] !== undefined) return
    setAnswers((prev) => ({ ...prev, [current]: letter }))
  }

  const handleSubmit = () => {
    const s = questions.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0)
    // Compute per-domain breakdown
    const domainBreakdown: Record<string, { correct: number; total: number }> = {}
    questions.forEach((q, i) => {
      const d = q.domain || 'General'
      if (!domainBreakdown[d]) domainBreakdown[d] = { correct: 0, total: 0 }
      domainBreakdown[d].total++
      if (answers[i] === q.correct) domainBreakdown[d].correct++
    })
    saveExamScore(examId || '1', s, questions.length, domainBreakdown)
    setPhase('review')
    setCurrent(0)
  }

  const toggleFlag = () => {
    setFlagged((prev) => {
      const next = new Set(prev)
      if (next.has(current)) next.delete(current)
      else next.add(current)
      return next
    })
  }

  // Use a ref to avoid stale closure in timer callback
  const handleSubmitRef = useRef(handleSubmit)
  useEffect(() => {
    handleSubmitRef.current = handleSubmit
  })

  const handleTimeUp = useCallback(() => {
    handleSubmitRef.current()
  }, [])

  // Guard: invalid exam ID — after all hooks
  if (questions.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Exam not found</p>
        <Link to="/" className="text-primary-light mt-2 inline-block">Back to Dashboard</Link>
      </div>
    )
  }

  const question = questions[current]

  const restart = () => {
    setPhase('intro')
    setCurrent(0)
    setAnswers({})
    setFlagged(new Set())
    setShowExplanation(false)
    setHighestReached(0)
  }

  const goToNext = () => {
    if (current < questions.length - 1) {
      const next = current + 1
      setCurrent(next)
      setShowExplanation(false)
      if (next > highestReached) setHighestReached(next)
    }
  }

  const goToPrev = () => {
    if (current > 0 && !isSimulation) {
      setCurrent((c) => c - 1)
      setShowExplanation(false)
    }
  }

  // INTRO SCREEN
  if (phase === 'intro') {
    return (
      <div className="max-w-2xl mx-auto text-center py-6 sm:py-12">
        <Link to="/" className="text-slate-400 hover:text-slate-200 text-sm flex items-center gap-1 mb-6 sm:mb-8 justify-center">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
        <div className="bg-surface-light border border-surface-lighter rounded-2xl p-5 sm:p-10">
          <div className="w-16 h-16 bg-accent/15 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Mock Exam {examId}</h1>
          <p className="text-slate-400 mb-6">
            {questions.length} questions — Passing: {passThreshold}/{questions.length} (720 points)
          </p>

          {lastScore && (
            <div className={`mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
              lastScore.score >= 43 ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
            }`}>
              <Trophy className="w-4 h-4" />
              Last attempt: {lastScore.score}/{lastScore.total} ({new Date(lastScore.date).toLocaleDateString()})
            </div>
          )}

          {/* Mode selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-left">
            <button
              onClick={() => { setMode('practice'); setTimerEnabled(true) }}
              className={`p-4 rounded-xl border-2 transition-all ${
                mode === 'practice'
                  ? 'border-primary bg-primary/10'
                  : 'border-surface-lighter hover:border-slate-500'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Trophy className={`w-4 h-4 ${mode === 'practice' ? 'text-primary' : 'text-slate-500'}`} />
                <span className={`text-sm font-semibold ${mode === 'practice' ? 'text-white' : 'text-slate-300'}`}>
                  Practice Mode
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Navigate freely, flag questions, optional timer. Review and change answers anytime.
              </p>
            </button>
            <button
              onClick={() => { setMode('simulation'); setTimerEnabled(true) }}
              className={`p-4 rounded-xl border-2 transition-all ${
                mode === 'simulation'
                  ? 'border-accent bg-accent/10'
                  : 'border-surface-lighter hover:border-slate-500'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Shield className={`w-4 h-4 ${mode === 'simulation' ? 'text-accent' : 'text-slate-500'}`} />
                <span className={`text-sm font-semibold ${mode === 'simulation' ? 'text-white' : 'text-slate-300'}`}>
                  Simulation Mode
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Real exam conditions. 120-min timer, forward-only, answers lock on selection.
              </p>
            </button>
          </div>

          {/* Timer toggle — practice mode only */}
          {mode === 'practice' && (
            <div className="flex items-center justify-center gap-3 mb-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    timerEnabled ? 'bg-primary' : 'bg-surface-lighter'
                  }`}
                  role="switch"
                  aria-checked={timerEnabled}
                  aria-label="Toggle exam timer"
                  tabIndex={0}
                  onClick={() => setTimerEnabled(!timerEnabled)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTimerEnabled(!timerEnabled) } }}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      timerEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
                <span className="text-sm text-slate-300">
                  {timerEnabled ? '120-minute timer enabled' : 'Timer disabled'}
                </span>
              </label>
            </div>
          )}

          {isSimulation && (
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-6 text-left">
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-accent-light">Simulation rules:</strong> 120-minute countdown, forward-only navigation (no going back), answers lock immediately after selection. Auto-submits when time expires.
              </p>
            </div>
          )}

          <button
            onClick={() => { setPhase('active'); setHighestReached(0) }}
            className={`px-8 py-3 rounded-xl font-medium transition-colors text-lg ${
              isSimulation
                ? 'bg-accent hover:bg-accent/80 text-white'
                : 'bg-primary hover:bg-primary-dark text-white'
            }`}
          >
            {isSimulation ? 'Start Simulation' : 'Start Exam'}
          </button>
        </div>
      </div>
    )
  }

  // ACTIVE / REVIEW
  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button onClick={() => phase === 'active' && !isSimulation ? setPhase('intro') : phase === 'review' ? restart() : undefined} className="text-slate-400 hover:text-slate-200 shrink-0" disabled={phase === 'active' && isSimulation}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base sm:text-lg font-semibold text-white truncate">
            Mock Exam {examId}
            {isSimulation && phase === 'active' && (
              <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-lg bg-accent/15 text-accent-light">SIM</span>
            )}
            {phase === 'review' && (
              <span className={`ml-2 sm:ml-3 text-xs sm:text-sm font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg ${
                passed ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
              }`}>
                {passed ? 'PASSED' : 'FAILED'} — {score}/{questions.length}
              </span>
            )}
          </h2>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {(timerEnabled || isSimulation) && phase === 'active' && (
            <ExamTimer
              durationMinutes={120}
              isRunning={phase === 'active'}
              onTimeUp={handleTimeUp}
            />
          )}
          <span className="text-xs sm:text-sm text-slate-400">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1" />
            {totalAnswered}/{questions.length}
          </span>
          {phase === 'active' && (
            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="bg-primary hover:bg-primary-dark text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
            >
              Submit
            </button>
          )}
          {phase === 'review' && (
            <button
              onClick={restart}
              className="flex items-center gap-1.5 bg-surface-lighter hover:bg-accent/20 text-slate-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Retake
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Question panel */}
        <div className="flex-1">
          <div className="bg-surface-light border border-surface-lighter rounded-xl p-4 sm:p-6">
            {/* Question header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-500">
                Question {current + 1} of {questions.length}
                {question.domain && <span className="ml-2 text-xs bg-surface-lighter px-2 py-0.5 rounded">{question.domain}</span>}
              </span>
              {phase === 'active' && !isSimulation && (
                <button
                  onClick={toggleFlag}
                  className={`p-1.5 rounded transition-colors ${
                    flagged.has(current) ? 'text-warning bg-warning/10' : 'text-slate-500 hover:text-warning'
                  }`}
                  title="Flag for review"
                >
                  <Flag className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Scenario */}
            {question.scenario && (
              <div className="bg-surface/60 border border-surface-lighter rounded-lg p-4 mb-4 text-sm text-slate-300">
                {question.scenario}
              </div>
            )}

            {/* Question text */}
            <p className="text-white font-medium mb-6 leading-relaxed">{question.text}</p>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((opt) => {
                const isSelected = answers[current] === opt.letter
                const isCorrect = opt.letter === question.correct
                const showResult = phase === 'review'

                let borderColor = 'border-surface-lighter hover:border-slate-500'
                let bg = 'bg-surface'
                if (showResult && isCorrect) {
                  borderColor = 'border-success/50'
                  bg = 'bg-success/10'
                } else if (showResult && isSelected && !isCorrect) {
                  borderColor = 'border-danger/50'
                  bg = 'bg-danger/10'
                } else if (isSelected) {
                  borderColor = 'border-primary/50'
                  bg = 'bg-primary/10'
                }

                return (
                  <button
                    key={opt.letter}
                    onClick={() => handleAnswer(opt.letter)}
                    className={`w-full text-left p-4 rounded-lg border ${borderColor} ${bg} transition-all flex items-start gap-3`}
                    disabled={phase === 'review' || (isSimulation && answers[current] !== undefined)}
                  >
                    <span className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-sm font-medium border ${
                      isSelected
                        ? 'bg-primary/20 border-primary text-primary-light'
                        : 'border-surface-lighter text-slate-500'
                    }`}>
                      {showResult && isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : showResult && isSelected && !isCorrect ? (
                        <XCircle className="w-5 h-5 text-danger" />
                      ) : (
                        opt.letter
                      )}
                    </span>
                    <span className={`text-sm leading-relaxed ${
                      showResult && isCorrect ? 'text-success' : showResult && isSelected && !isCorrect ? 'text-danger/80' : 'text-slate-300'
                    }`}>
                      {opt.text}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            {phase === 'review' && (
              <div className="mt-5">
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="text-sm text-accent-light hover:text-accent transition-colors"
                >
                  {showExplanation ? 'Hide' : 'Show'} Explanation
                </button>
                {showExplanation && (
                  <div className="mt-3 bg-accent/5 border border-accent/20 rounded-lg p-4 text-sm text-slate-300 leading-relaxed">
                    {question.explanation}
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6 pt-4 border-t border-surface-lighter">
              {!isSimulation || phase === 'review' ? (
                <button
                  onClick={goToPrev}
                  disabled={current === 0}
                  className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Previous
                </button>
              ) : (
                <div />
              )}
              {current === questions.length - 1 && phase === 'active' ? (
                <button
                  onClick={() => setShowSubmitConfirm(true)}
                  className="flex items-center gap-1.5 text-sm text-primary-light hover:text-primary font-medium transition-colors"
                >
                  Finish & Submit <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={goToNext}
                  disabled={current === questions.length - 1}
                  className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Simulation lock indicator */}
            {isSimulation && phase === 'active' && answers[current] !== undefined && (
              <p className="text-xs text-slate-500 mt-2 text-center">Answer locked — click Next to continue</p>
            )}
          </div>
        </div>

        {/* Question grid sidebar */}
        <div className="lg:w-56 shrink-0 order-first lg:order-last">
          <div className="bg-surface-light border border-surface-lighter rounded-xl p-3 sm:p-4 sticky top-6">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Questions</h3>
            <div className="grid grid-cols-10 sm:grid-cols-6 gap-1 sm:gap-1.5">
              {questions.map((q, i) => {
                const isAnswered = answers[i] !== undefined
                const isCurrent = i === current
                const isFlagged = flagged.has(i)
                const isCorrectInReview = phase === 'review' && answers[i] === q.correct
                const isWrongInReview = phase === 'review' && answers[i] !== undefined && answers[i] !== q.correct
                // In simulation: can only navigate forward to already-visited questions
                const isLocked = isSimulation && phase === 'active' && i > highestReached

                let bg = 'bg-surface'
                if (isCurrent) bg = 'bg-primary/30 ring-1 ring-primary'
                else if (isCorrectInReview) bg = 'bg-success/20'
                else if (isWrongInReview) bg = 'bg-danger/20'
                else if (isLocked) bg = 'bg-surface/50'
                else if (isAnswered) bg = 'bg-surface-lighter'

                return (
                  <button
                    key={i}
                    onClick={() => {
                      if (isLocked) return
                      if (isSimulation && phase === 'active' && i < current) return
                      setCurrent(i)
                      setShowExplanation(false)
                    }}
                    disabled={isLocked || (isSimulation && phase === 'active' && i < current)}
                    className={`w-full aspect-square rounded text-xs font-medium transition-all ${bg} ${
                      isFlagged ? 'ring-1 ring-warning' : ''
                    } ${isLocked ? 'opacity-30 cursor-not-allowed' : 'hover:ring-1 hover:ring-slate-500'} text-slate-400`}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>

            {phase === 'review' && (
              <div className="mt-4 pt-4 border-t border-surface-lighter space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-success/20" />
                  <span className="text-slate-400">Correct: {score}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-danger/20" />
                  <span className="text-slate-400">Wrong: {totalAnswered - score}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-surface" />
                  <span className="text-slate-400">Unanswered: {questions.length - totalAnswered}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit confirmation modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" role="dialog" aria-modal="true" aria-label="Submit exam confirmation" onKeyDown={(e) => { if (e.key === 'Escape') setShowSubmitConfirm(false) }}>
          <div className="bg-surface-light border border-surface-lighter rounded-2xl p-8 max-w-sm w-full mx-4 animate-scale-in">
            <h3 className="text-lg font-semibold text-white mb-2">Submit Exam?</h3>
            <p className="text-sm text-slate-400 mb-1">
              You have answered {totalAnswered} of {questions.length} questions.
            </p>
            {questions.length - totalAnswered > 0 && (
              <p className="text-sm text-warning mb-4">
                {questions.length - totalAnswered} question{questions.length - totalAnswered !== 1 ? 's' : ''} unanswered.
              </p>
            )}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-surface-lighter text-slate-300 text-sm font-medium hover:bg-surface-lighter/80 transition-colors"
              >
                Keep Working
              </button>
              <button
                onClick={() => { setShowSubmitConfirm(false); handleSubmit() }}
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
