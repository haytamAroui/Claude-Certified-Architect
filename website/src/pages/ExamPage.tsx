import { useState, useMemo, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Clock, CheckCircle, XCircle, Trophy, RotateCcw, Flag } from 'lucide-react'
import { useProgress } from '../data/useProgress'
import { examData } from '../data/examData'
import ExamTimer from '../components/ExamTimer'

type ExamPhase = 'intro' | 'active' | 'review'

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

  const question = questions[current]
  const totalAnswered = Object.keys(answers).length
  const score = useMemo(() => {
    if (phase !== 'review') return 0
    return questions.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0)
  }, [phase, answers, questions])

  const passed = score >= 43
  const lastScore = progress.examScores[examId || '1']

  const handleAnswer = (letter: string) => {
    if (phase === 'review') return
    setAnswers((prev) => ({ ...prev, [current]: letter }))
  }

  const handleSubmit = () => {
    const s = questions.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0)
    // Compute per-domain breakdown
    const domainBreakdown: Record<string, { correct: number; total: number }> = {}
    questions.forEach((q, i) => {
      if (!domainBreakdown[q.domain]) domainBreakdown[q.domain] = { correct: 0, total: 0 }
      domainBreakdown[q.domain].total++
      if (answers[i] === q.correct) domainBreakdown[q.domain].correct++
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

  const handleTimeUp = useCallback(() => {
    handleSubmit()
  }, [])

  const restart = () => {
    setPhase('intro')
    setCurrent(0)
    setAnswers({})
    setFlagged(new Set())
    setShowExplanation(false)
  }

  // INTRO SCREEN
  if (phase === 'intro') {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Link to="/" className="text-slate-400 hover:text-slate-200 text-sm flex items-center gap-1 mb-8 justify-center">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
        <div className="bg-surface-light border border-surface-lighter rounded-2xl p-10">
          <div className="w-16 h-16 bg-accent/15 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Mock Exam {examId}</h1>
          <p className="text-slate-400 mb-6">
            {questions.length} questions — Passing: 43/60 (720 points)
          </p>

          {lastScore && (
            <div className={`mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
              lastScore.score >= 43 ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
            }`}>
              <Trophy className="w-4 h-4" />
              Last attempt: {lastScore.score}/{lastScore.total} ({new Date(lastScore.date).toLocaleDateString()})
            </div>
          )}

          <div className="space-y-3 text-sm text-slate-400 mb-6 text-left bg-surface/50 rounded-lg p-5">
            <p>- Select one answer per question</p>
            <p>- Use the flag button to mark questions for review</p>
            <p>- Navigate freely between questions</p>
            <p>- Submit when ready to see your score and explanations</p>
          </div>

          {/* Timer toggle */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  timerEnabled ? 'bg-primary' : 'bg-surface-lighter'
                }`}
                onClick={() => setTimerEnabled(!timerEnabled)}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    timerEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
              <span className="text-sm text-slate-300">
                {timerEnabled ? '120-minute timer enabled' : 'Timer disabled (practice mode)'}
              </span>
            </label>
          </div>

          <button
            onClick={() => setPhase('active')}
            className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-medium transition-colors text-lg"
          >
            Start Exam
          </button>
        </div>
      </div>
    )
  }

  // ACTIVE / REVIEW
  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => phase === 'active' ? setPhase('intro') : restart()} className="text-slate-400 hover:text-slate-200">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-white">
            Mock Exam {examId}
            {phase === 'review' && (
              <span className={`ml-3 text-sm font-medium px-3 py-1 rounded-lg ${
                passed ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
              }`}>
                {passed ? 'PASSED' : 'FAILED'} — {score}/{questions.length}
              </span>
            )}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {timerEnabled && phase === 'active' && (
            <ExamTimer
              durationMinutes={120}
              isRunning={phase === 'active'}
              onTimeUp={handleTimeUp}
            />
          )}
          <span className="text-sm text-slate-400">
            <Clock className="w-4 h-4 inline mr-1" />
            {totalAnswered}/{questions.length} answered
          </span>
          {phase === 'active' && (
            <button
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Submit Exam
            </button>
          )}
          {phase === 'review' && (
            <button
              onClick={restart}
              className="flex items-center gap-1.5 bg-surface-lighter hover:bg-accent/20 text-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Retake
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Question panel */}
        <div className="flex-1">
          <div className="bg-surface-light border border-surface-lighter rounded-xl p-6">
            {/* Question header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-500">
                Question {current + 1} of {questions.length}
                {question.domain && <span className="ml-2 text-xs bg-surface-lighter px-2 py-0.5 rounded">{question.domain}</span>}
              </span>
              {phase === 'active' && (
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
                    disabled={phase === 'review'}
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
              <button
                onClick={() => { setCurrent((c) => c - 1); setShowExplanation(false) }}
                disabled={current === 0}
                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
              <button
                onClick={() => { setCurrent((c) => c + 1); setShowExplanation(false) }}
                disabled={current === questions.length - 1}
                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Question grid sidebar */}
        <div className="lg:w-56 shrink-0">
          <div className="bg-surface-light border border-surface-lighter rounded-xl p-4 sticky top-6">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Questions</h3>
            <div className="grid grid-cols-6 gap-1.5">
              {questions.map((q, i) => {
                const isAnswered = answers[i] !== undefined
                const isCurrent = i === current
                const isFlagged = flagged.has(i)
                const isCorrectInReview = phase === 'review' && answers[i] === q.correct
                const isWrongInReview = phase === 'review' && answers[i] !== undefined && answers[i] !== q.correct

                let bg = 'bg-surface'
                if (isCurrent) bg = 'bg-primary/30 ring-1 ring-primary'
                else if (isCorrectInReview) bg = 'bg-success/20'
                else if (isWrongInReview) bg = 'bg-danger/20'
                else if (isAnswered) bg = 'bg-surface-lighter'

                return (
                  <button
                    key={i}
                    onClick={() => { setCurrent(i); setShowExplanation(false) }}
                    className={`w-full aspect-square rounded text-xs font-medium transition-all ${bg} ${
                      isFlagged ? 'ring-1 ring-warning' : ''
                    } hover:ring-1 hover:ring-slate-500 text-slate-400`}
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
    </div>
  )
}
