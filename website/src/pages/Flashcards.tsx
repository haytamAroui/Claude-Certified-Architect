import { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Layers, RotateCcw, ChevronRight, Check, RefreshCw } from 'lucide-react'
import { flashcards, type Flashcard } from '../data/flashcardData'
import { useProgress } from '../data/useProgress'

const domains = ['All', 'D1', 'D2', 'D3', 'D4', 'D5'] as const
const domainLabels: Record<string, string> = {
  All: 'All Domains',
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

export default function Flashcards() {
  const { progress, saveFlashcardResult } = useProgress()
  const [selectedDomain, setSelectedDomain] = useState<string>('All')
  const [deck, setDeck] = useState<Flashcard[]>(() =>
    shuffle(flashcards)
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [answered, setAnswered] = useState(false)

  const filteredDeck = useMemo(() => {
    if (selectedDomain === 'All') return deck
    return deck.filter((c) => c.domain === selectedDomain)
  }, [deck, selectedDomain])

  const current = filteredDeck[currentIndex]
  const total = filteredDeck.length

  const masteredInDomain = useMemo(() => {
    if (selectedDomain === 'All') {
      return Object.values(progress.flashcardStats).reduce((s, d) => s + d.mastered, 0)
    }
    return progress.flashcardStats[selectedDomain]?.mastered || 0
  }, [progress.flashcardStats, selectedDomain])

  const reviewedInDomain = useMemo(() => {
    if (selectedDomain === 'All') {
      return Object.values(progress.flashcardStats).reduce((s, d) => s + d.reviewed, 0)
    }
    return progress.flashcardStats[selectedDomain]?.reviewed || 0
  }, [progress.flashcardStats, selectedDomain])

  const handleAnswer = useCallback((mastered: boolean) => {
    if (!current) return
    saveFlashcardResult(current.domain, mastered)
    setAnswered(true)

    // Simple spaced repetition: if "review again", re-insert card a few positions ahead
    if (!mastered) {
      setDeck((prev) => {
        const idx = prev.findIndex((c) => c.id === current.id)
        if (idx === -1) return prev
        const copy = [...prev]
        const [card] = copy.splice(idx, 1)
        const insertAt = Math.min(idx + 3 + Math.floor(Math.random() * 3), copy.length)
        copy.splice(insertAt, 0, card)
        return copy
      })
    }
  }, [current, saveFlashcardResult])

  const handleNext = useCallback(() => {
    setIsFlipped(false)
    setAnswered(false)
    setCurrentIndex((i) => (i + 1 >= total ? 0 : i + 1))
  }, [total])

  const handleReset = useCallback(() => {
    setDeck(shuffle(flashcards))
    setCurrentIndex(0)
    setIsFlipped(false)
    setAnswered(false)
  }, [])

  const handleDomainChange = useCallback((domain: string) => {
    setSelectedDomain(domain)
    setCurrentIndex(0)
    setIsFlipped(false)
    setAnswered(false)
  }, [])

  const progressPct = total > 0 ? Math.round((masteredInDomain / total) * 100) : 0

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <Link to="/learn" className="text-muted hover:text-heading text-sm flex items-center gap-1.5 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Learn
        </Link>
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-faint" />
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-medium text-heading">Flashcards</h1>
            <p className="text-muted text-sm">{reviewedInDomain} reviewed — {masteredInDomain} mastered</p>
          </div>
        </div>
      </div>

      {/* Domain Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {domains.map((d) => (
          <button
            key={d}
            onClick={() => handleDomainChange(d)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedDomain === d
                ? 'bg-primary/15 text-primary border border-primary/30'
                : 'bg-surface-lighter text-muted hover:text-heading border border-transparent'
            }`}
          >
            {d === 'All' ? 'All' : d} <span className="hidden sm:inline">— {domainLabels[d]}</span>
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-xs text-faint mb-1">
          <span>Mastery: {masteredInDomain}/{total}</span>
          <span>{progressPct}%</span>
        </div>
        <div className="h-1.5 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Card */}
      {current ? (
        <div className="flex flex-col items-center gap-6">
          {/* Card counter */}
          <p className="text-sm text-faint">
            Card {currentIndex + 1} of {total}
            <span className="mx-2">·</span>
            <span className="text-primary">{current.domain}</span>
            <span className="mx-2">·</span>
            <span className="text-muted">{current.category}</span>
          </p>

          {/* Flip Card */}
          <div
            className="perspective w-full max-w-lg cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label={isFlipped ? 'Flashcard answer side — click or press Enter to flip back' : 'Flashcard question — click or press Enter to reveal answer'}
            onClick={() => !answered && setIsFlipped(!isFlipped)}
            onKeyDown={(e) => { if (!answered && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setIsFlipped(!isFlipped) } }}
          >
            <div className={`card-flip relative w-full min-h-[280px] sm:min-h-[300px] ${isFlipped ? 'flipped' : ''}`}>
              {/* Front */}
              <div className="card-face absolute inset-0 bg-surface-light border border-surface-lighter rounded-2xl p-8 flex flex-col justify-center">
                <p className="text-xs text-faint uppercase tracking-wider mb-4">Question</p>
                <p className="text-heading font-display text-lg font-medium leading-relaxed">{current.front}</p>
                <p className="text-faint text-xs mt-6">Click to reveal answer</p>
              </div>

              {/* Back */}
              <div className="card-face card-face-back absolute inset-0 bg-surface-light border border-surface-lighter rounded-2xl p-8 flex flex-col justify-center">
                <p className="text-xs text-heading uppercase tracking-wider mb-4">Answer</p>
                <p className="text-body leading-relaxed">{current.back}</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          {isFlipped && !answered ? (
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleAnswer(false)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-warning/10 text-warning border border-warning/20 hover:bg-warning/20 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Review Again
              </button>
              <button
                onClick={() => handleAnswer(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-success/10 text-success border border-success/20 hover:bg-success/20 transition-all"
              >
                <Check className="w-4 h-4" />
                Got It
              </button>
            </div>
          ) : answered ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all"
            >
              Next Card
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <p className="text-xs text-faint">Tap the card to flip it</p>
          )}

          {/* Shuffle / Reset */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-xs text-faint hover:text-muted transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Shuffle & Reset
          </button>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted mb-4">No flashcards found for this filter.</p>
          <button
            onClick={() => handleDomainChange('All')}
            className="text-primary text-sm hover:text-primary-dark transition-colors"
          >
            Show all cards
          </button>
        </div>
      )}
    </div>
  )
}
