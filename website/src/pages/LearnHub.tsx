import { Link } from 'react-router-dom'
import { Brain, Layers, Zap, BookMarked, ChevronRight, AlertTriangle } from 'lucide-react'
import { useProgress } from '../data/useProgress'
import { flashcards } from '../data/flashcardData'
import { concepts } from '../data/conceptData'

const domainNames: Record<string, string> = {
  D1: 'Agentic Architecture',
  D2: 'Tool Design & MCP',
  D3: 'Claude Code Config',
  D4: 'Prompt Engineering',
  D5: 'Context & Reliability',
}

export default function LearnHub() {
  const { progress, getDomainStats, getWeakDomains } = useProgress()
  const domainStats = getDomainStats()
  const weakDomains = getWeakDomains()
  const hasExamData = Object.keys(domainStats).length > 0

  const totalFlashcards = flashcards.length
  const masteredCount = Object.values(progress.flashcardStats).reduce((sum, s) => sum + s.mastered, 0)

  const totalQuizzes = progress.quizScores.length
  const avgQuizScore = totalQuizzes > 0
    ? Math.round(progress.quizScores.reduce((sum, q) => sum + (q.score / q.total) * 100, 0) / totalQuizzes)
    : 0

  const viewedConcepts = progress.conceptsViewed.length
  const totalConcepts = concepts.length

  const modes = [
    {
      title: 'Flashcards',
      description: 'Review key concepts with flip cards. Track mastery across all 5 domains with spaced repetition.',
      icon: Layers,
      color: 'primary',
      to: '/learn/flashcards',
      stat: `${masteredCount}/${totalFlashcards} mastered`,
    },
    {
      title: 'Quick Quiz',
      description: 'Take 5 or 10 question mini-quizzes with instant feedback. Focus on weak domains.',
      icon: Zap,
      color: 'accent',
      to: '/learn/quiz',
      stat: totalQuizzes > 0 ? `${totalQuizzes} quizzes — ${avgQuizScore}% avg` : 'Not started',
    },
    {
      title: 'Key Concepts',
      description: 'Browse the most important terms and definitions. Each concept includes an exam tip.',
      icon: BookMarked,
      color: 'success',
      to: '/learn/concepts',
      stat: `${viewedConcepts}/${totalConcepts} explored`,
    },
  ]

  const colorMap: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
    primary: { bg: 'bg-primary/8', text: 'text-primary', border: 'border-primary/20', iconBg: 'bg-primary/15' },
    accent: { bg: 'bg-accent/8', text: 'text-accent-light', border: 'border-accent/20', iconBg: 'bg-accent/15' },
    success: { bg: 'bg-success/8', text: 'text-success', border: 'border-success/20', iconBg: 'bg-success/15' },
  }

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-5 h-5 text-faint" />
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-medium text-heading">Learn</h1>
            <p className="text-muted text-sm">Interactive study tools to reinforce your knowledge</p>
          </div>
        </div>
      </div>

      {/* Mode Cards */}
      <div className="grid md:grid-cols-3 gap-5">
        {modes.map((mode) => (
          <Link
            key={mode.title}
            to={mode.to}
            className="bg-surface-light border border-surface-lighter rounded-2xl p-6 hover:border-heading/10 transition-all group"
          >
            <mode.icon className="w-5 h-5 text-faint mb-4" />
            <h2 className="text-heading font-display font-medium text-lg mb-1.5">{mode.title}</h2>
            <p className="text-muted text-sm mb-4 line-clamp-2">{mode.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-faint">{mode.stat}</span>
              <span className="text-sm text-heading font-medium flex items-center gap-1">
                Start <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Weak Areas Callout — only show domains below passing threshold */}
      {hasExamData && weakDomains.filter((d) => {
        const s = domainStats[d]
        return s && s.total > 0 && (s.correct / s.total) < 0.72
      }).length > 0 && (
        <div className="bg-surface-light border border-surface-lighter rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-heading font-display font-medium mb-1">Focus Areas</h3>
              <p className="text-muted text-sm mb-4">
                Based on your mock exam performance, these domains need the most attention:
              </p>
              <div className="flex flex-wrap gap-2">
                {weakDomains.filter((d) => {
                  const s = domainStats[d]
                  return s && s.total > 0 && (s.correct / s.total) < 0.72
                }).slice(0, 3).map((domain) => {
                  const stats = domainStats[domain]
                  const pct = stats && stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
                  return (
                    <Link
                      key={domain}
                      to={`/learn/quiz?domain=${domain}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-warning/8 border border-warning/20 hover:bg-warning/15 transition-colors text-sm"
                    >
                      <span className="text-warning font-medium">{domain}</span>
                      <span className="text-faint">{domainNames[domain]}</span>
                      <span className={`font-medium ${pct < 50 ? 'text-danger' : 'text-warning'}`}>{pct}%</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="bg-surface-light border border-surface-lighter rounded-2xl p-8">
        <h3 className="font-display text-heading font-medium mb-5">Learning Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-display font-medium text-heading tabular-nums">{masteredCount}</p>
            <p className="text-sm text-muted">Cards Mastered</p>
          </div>
          <div>
            <p className="text-2xl font-display font-medium text-heading tabular-nums">{totalQuizzes}</p>
            <p className="text-sm text-muted">Quizzes Taken</p>
          </div>
          <div>
            <p className="text-2xl font-display font-medium text-heading tabular-nums">{viewedConcepts}</p>
            <p className="text-sm text-muted">Concepts Explored</p>
          </div>
          <div>
            <p className="text-2xl font-display font-medium text-heading tabular-nums">{totalQuizzes > 0 ? `${avgQuizScore}%` : '—'}</p>
            <p className="text-sm text-muted">Avg Quiz Score</p>
          </div>
        </div>
      </div>
    </div>
  )
}
