import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Zap, CheckCircle, XCircle, Trophy, RotateCcw, ChevronRight, Target } from 'lucide-react'
import { quizQuestions } from '../data/quizData'
import { useProgress } from '../data/useProgress'
import type { ExamQuestion } from '../data/examData'

type Phase = 'setup' | 'active' | 'results'

const allDomains = ['D1', 'D2', 'D3', 'D4', 'D5'] as const
const domainLabels: Record<string, string> = {
  D1: 'Agentic Architecture',
  D2: 'Tool Design & MCP',
  D3: 'Claude Code Config',
  D4: 'Prompt Engineering',
  D5: 'Context & Reliability',
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function QuickQuiz() {
  const [searchParams] = useSearchParams()
  const { progress, saveQuizScore, getWeakDomains } = useProgress()

  const [phase, setPhase] = useState<Phase>('setup')
  const [selectedDomain, setSelectedDomain] = useState<string>(searchParams.get('domain') || 'All')
  const [questionCount, setQuestionCount] = useState<5 | 10>(5)
  const [questions, setQuestions] = useState<ExamQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [results, setResults] = useState<{ correct: boolean; domain: string }[]>([])

  // Auto-select domain from URL params
  useEffect(() => {
    const d = searchParams.get('domain')
    if (d && allDomains.includes(d as typeof allDomains[number])) {
      setSelectedDomain(d)
    }
  }, [searchParams])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const weakDomains = useMemo(() => getWeakDomains(), [progress.examScores])

  const startQuiz = () => {
    let pool: ExamQuestion[] = []

    if (selectedDomain === 'Weak') {
      // Pick from weakest domains
      const targets = weakDomains.slice(0, 3)
      for (const d of targets) {
        pool.push(...(quizQuestions[d] || []))
      }
      if (pool.length === 0) {
        // No exam data yet — fall back to all
        pool = Object.values(quizQuestions).flat()
      }
    } else if (selectedDomain === 'All') {
      pool = Object.values(quizQuestions).flat()
    } else {
      pool = quizQuestions[selectedDomain] || []
    }

    const selected = shuffle(pool).slice(0, questionCount)
    setQuestions(selected)
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setResults([])
    setPhase('active')
  }

  const handleSelectAnswer = (letter: string) => {
    if (showFeedback) return
    setSelectedAnswer(letter)
    setShowFeedback(true)

    const q = questions[currentIndex]
    const isCorrect = letter === q.correct
    setResults((prev) => [...prev, { correct: isCorrect, domain: q.domain || 'General' }])
  }

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      // Quiz complete — score is saved in useEffect below when phase changes
      setPhase('results')
    } else {
      setCurrentIndex((i) => i + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    }
  }

  const resetQuiz = () => {
    setPhase('setup')
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setResults([])
  }

  // Save quiz score after results state has settled (avoids off-by-one from batched setState)
  useEffect(() => {
    if (phase === 'results' && results.length > 0) {
      const finalScore = results.filter((r) => r.correct).length
      saveQuizScore(finalScore, questions.length, selectedDomain)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const currentQuestion = questions[currentIndex]
  const totalCorrect = results.filter((r) => r.correct).length
  const score = questions.length > 0 ? Math.round((totalCorrect / questions.length) * 100) : 0
  const passed = score >= 72

  // Domain breakdown for results
  const domainBreakdown = useMemo(() => {
    const map: Record<string, { correct: number; total: number }> = {}
    for (const r of results) {
      if (!map[r.domain]) map[r.domain] = { correct: 0, total: 0 }
      map[r.domain].total++
      if (r.correct) map[r.domain].correct++
    }
    return map
  }, [results])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <Link to="/learn" className="text-muted hover:text-heading text-sm flex items-center gap-1.5 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Learn
        </Link>
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-faint" />
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-medium text-heading">Quick Quiz</h1>
            <p className="text-muted text-sm">Test your knowledge with instant feedback</p>
          </div>
        </div>
      </div>

      {/* ── SETUP PHASE ── */}
      {phase === 'setup' && (
        <div className="max-w-lg mx-auto space-y-6">
          <div className="bg-surface-light border border-surface-lighter rounded-2xl p-6 space-y-5">
            {/* Domain Selector */}
            <div>
              <p className="text-sm font-medium text-heading mb-3">Select Domain</p>
              <div className="flex flex-wrap gap-2">
                {['All', ...allDomains].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDomain(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedDomain === d
                        ? 'bg-accent/15 text-accent-light border border-accent/30'
                        : 'bg-surface-lighter text-muted hover:text-heading border border-transparent'
                    }`}
                  >
                    {d === 'All' ? 'All Domains' : `${d} — ${domainLabels[d]}`}
                  </button>
                ))}
                {weakDomains.length > 0 && (
                  <button
                    onClick={() => setSelectedDomain('Weak')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      selectedDomain === 'Weak'
                        ? 'bg-warning/15 text-warning border border-warning/30'
                        : 'bg-surface-lighter text-muted hover:text-heading border border-transparent'
                    }`}
                  >
                    <Target className="w-3 h-3" />
                    Weak Areas
                  </button>
                )}
              </div>
            </div>

            {/* Question Count */}
            <div>
              <p className="text-sm font-medium text-heading mb-3">Number of Questions</p>
              <div className="flex gap-3">
                {([5, 10] as const).map((n) => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      questionCount === n
                        ? 'bg-accent/15 text-accent-light border border-accent/30'
                        : 'bg-surface-lighter text-muted hover:text-heading border border-transparent'
                    }`}
                  >
                    {n} questions
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="w-full py-3 rounded-xl text-sm font-medium bg-heading text-surface hover:opacity-90 transition-all"
            >
              Start Quiz
            </button>
          </div>
        </div>
      )}

      {/* ── ACTIVE PHASE ── */}
      {phase === 'active' && currentQuestion && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Progress */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Question {currentIndex + 1} of {questions.length}</span>
            <span className="text-faint">
              {totalCorrect}/{currentIndex + (showFeedback ? 1 : 0)} correct
            </span>
          </div>
          <div className="h-1 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + (showFeedback ? 1 : 0)) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question */}
          <div className="bg-surface-light border border-surface-lighter rounded-2xl p-6">
            {currentQuestion.scenario && (
              <div className="bg-surface/50 border border-surface-lighter rounded-lg p-4 mb-4">
                <p className="text-sm text-muted leading-relaxed">{currentQuestion.scenario}</p>
              </div>
            )}
            <div className="flex items-start gap-2 mb-1">
              <span className="text-xs text-faint bg-surface-lighter px-2 py-0.5 rounded shrink-0">{currentQuestion.domain}</span>
            </div>
            <p className="text-heading font-medium mt-2 mb-6 leading-relaxed">{currentQuestion.text}</p>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedAnswer === opt.letter
                const isCorrect = opt.letter === currentQuestion.correct
                let style = 'bg-surface-lighter/50 border-surface-lighter text-body hover:border-accent/30 hover:bg-surface-lighter cursor-pointer'

                if (showFeedback) {
                  if (isCorrect) {
                    style = 'bg-success/10 border-success/40 text-heading'
                  } else if (isSelected && !isCorrect) {
                    style = 'bg-danger/10 border-danger/40 text-heading'
                  } else {
                    style = 'bg-surface-lighter/30 border-surface-lighter text-muted cursor-default'
                  }
                }

                return (
                  <button
                    key={opt.letter}
                    onClick={() => handleSelectAnswer(opt.letter)}
                    disabled={showFeedback}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-lg border text-sm transition-all ${style}`}
                  >
                    <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold border ${
                      showFeedback && isCorrect
                        ? 'bg-success/20 border-success/40 text-success'
                        : showFeedback && isSelected
                        ? 'bg-danger/20 border-danger/40 text-danger'
                        : isSelected
                        ? 'bg-accent/20 border-accent/40 text-accent-light'
                        : 'border-surface-lighter text-faint'
                    }`}>
                      {showFeedback && isCorrect ? <CheckCircle className="w-3.5 h-3.5" /> :
                       showFeedback && isSelected ? <XCircle className="w-3.5 h-3.5" /> :
                       opt.letter}
                    </span>
                    <span className="leading-relaxed">{opt.text}</span>
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            {showFeedback && (
              <div className={`mt-4 p-4 rounded-lg border text-sm leading-relaxed ${
                selectedAnswer === currentQuestion.correct
                  ? 'bg-success/5 border-success/20 text-body'
                  : 'bg-danger/5 border-danger/20 text-body'
              }`}>
                <p className={`font-medium mb-1 ${selectedAnswer === currentQuestion.correct ? 'text-success' : 'text-danger'}`}>
                  {selectedAnswer === currentQuestion.correct ? 'Correct!' : `Incorrect — the answer is ${currentQuestion.correct}`}
                </p>
                <p>{currentQuestion.explanation}</p>
              </div>
            )}
          </div>

          {/* Next Button */}
          {showFeedback && (
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-accent/10 text-accent-light border border-accent/20 hover:bg-accent/20 transition-all"
              >
                {currentIndex + 1 >= questions.length ? 'See Results' : 'Next Question'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── RESULTS PHASE ── */}
      {phase === 'results' && (
        <div className="max-w-lg mx-auto space-y-6">
          <div className="bg-surface-light border border-surface-lighter rounded-2xl p-8 text-center">
            <Trophy className={`w-8 h-8 mx-auto mb-4 ${passed ? 'text-success' : 'text-warning'}`} />
            <h2 className="font-display text-2xl font-medium text-heading mb-1">
              {totalCorrect}/{questions.length}
            </h2>
            <p className={`text-lg font-medium mb-1 ${passed ? 'text-success' : 'text-warning'}`}>
              {score}%
            </p>
            <p className="text-muted text-sm">
              {passed ? 'Great job! You\'re above the 72% passing threshold.' : 'Keep practicing — aim for 72% or higher.'}
            </p>
          </div>

          {/* Domain Breakdown */}
          {Object.keys(domainBreakdown).length > 1 && (
            <div className="bg-surface-light border border-surface-lighter rounded-2xl p-6 space-y-3">
              <h3 className="text-heading font-display font-medium text-sm">Domain Breakdown</h3>
              {Object.entries(domainBreakdown).sort(([a], [b]) => a.localeCompare(b)).map(([domain, stats]) => {
                const pct = Math.round((stats.correct / stats.total) * 100)
                return (
                  <div key={domain} className="flex items-center justify-between text-sm">
                    <span className="text-muted">{domain}: {domainLabels[domain] || domain}</span>
                    <span className={`font-medium ${pct >= 72 ? 'text-success' : pct >= 50 ? 'text-warning' : 'text-danger'}`}>
                      {stats.correct}/{stats.total} ({pct}%)
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={resetQuiz}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-surface-lighter text-muted hover:text-heading transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
            <Link
              to="/learn"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-accent/10 text-accent-light border border-accent/20 hover:bg-accent/20 transition-all"
            >
              Back to Learn
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
