import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookMarked, Search, ChevronDown, ChevronUp, CheckCircle, Lightbulb, ExternalLink } from 'lucide-react'
import { concepts } from '../data/conceptData'
import { useProgress } from '../data/useProgress'

const domains = ['All', 'D1', 'D2', 'D3', 'D4', 'D5'] as const
const domainLabels: Record<string, string> = {
  D1: 'Agentic Architecture',
  D2: 'Tool Design & MCP',
  D3: 'Claude Code Config',
  D4: 'Prompt Engineering',
  D5: 'Context & Reliability',
}

export default function Concepts() {
  const { progress, markConceptViewed } = useProgress()
  const [search, setSearch] = useState('')
  const [selectedDomain, setSelectedDomain] = useState<string>('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = concepts
    if (selectedDomain !== 'All') {
      list = list.filter((c) => c.domain === selectedDomain)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (c) =>
          c.term.toLowerCase().includes(q) ||
          c.definition.toLowerCase().includes(q) ||
          c.examTip.toLowerCase().includes(q)
      )
    }
    return list
  }, [search, selectedDomain])

  const grouped = useMemo(() => {
    const map: Record<string, typeof concepts> = {}
    for (const c of filtered) {
      if (!map[c.domain]) map[c.domain] = []
      map[c.domain].push(c)
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  const viewedCount = progress.conceptsViewed.length
  const totalCount = concepts.length

  const handleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null)
    } else {
      setExpandedId(id)
      markConceptViewed(id)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <Link to="/learn" className="text-muted hover:text-heading text-sm flex items-center gap-1.5 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Learn
        </Link>
        <div className="flex items-center gap-3">
          <BookMarked className="w-5 h-5 text-faint" />
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-medium text-heading">Key Concepts</h1>
            <p className="text-muted text-sm">{viewedCount}/{totalCount} explored</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-faint" />
        <input
          type="text"
          placeholder="Search concepts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-light border border-surface-lighter text-body text-sm placeholder:text-faint focus:border-heading/20 focus:outline-none transition-colors"
        />
      </div>

      {/* Domain Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {domains.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDomain(d)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedDomain === d
                ? 'bg-heading/10 text-heading border border-heading/20'
                : 'bg-surface-lighter text-muted hover:text-heading border border-transparent'
            }`}
          >
            {d === 'All' ? 'All' : d}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-faint">
        {filtered.length} concept{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* Grouped concepts */}
      {grouped.length > 0 ? (
        <div className="space-y-8">
          {grouped.map(([domain, items]) => (
            <div key={domain}>
              <h2 className="text-sm font-medium text-faint uppercase tracking-wider mb-3">
                {domain}: {domainLabels[domain]}
              </h2>
              <div className="space-y-2">
                {items.map((concept) => {
                  const isExpanded = expandedId === concept.id
                  const isViewed = progress.conceptsViewed.includes(concept.id)

                  return (
                    <div
                      key={concept.id}
                      className={`bg-surface-light border rounded-2xl transition-all ${
                        isExpanded ? 'border-heading/15' : 'border-surface-lighter'
                      }`}
                    >
                      {/* Header — always visible */}
                      <button
                        onClick={() => handleExpand(concept.id)}
                        className="w-full flex items-center gap-3 px-5 py-3.5 text-left"
                      >
                        {isViewed ? (
                          <CheckCircle className="w-4 h-4 text-success shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-surface-lighter shrink-0" />
                        )}
                        <span className="flex-1 text-heading font-medium text-sm">{concept.term}</span>
                        <span className="text-xs text-faint bg-surface-lighter px-2 py-0.5 rounded shrink-0">{concept.domain}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-faint shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-faint shrink-0" />
                        )}
                      </button>

                      {/* Expanded content */}
                      {isExpanded && (
                        <div className="px-5 pb-5 space-y-4 border-t border-surface-lighter pt-4 ml-7">
                          {/* Definition */}
                          <div>
                            <p className="text-xs text-faint uppercase tracking-wider mb-1">Definition</p>
                            <p className="text-body text-sm leading-relaxed">{concept.definition}</p>
                          </div>

                          {/* Exam Tip */}
                          <div className="bg-primary/5 border-l-2 border-primary rounded-r-lg px-4 py-3">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Lightbulb className="w-3.5 h-3.5 text-primary" />
                              <p className="text-xs font-medium text-primary">Exam Tip</p>
                            </div>
                            <p className="text-sm text-body leading-relaxed">{concept.examTip}</p>
                          </div>

                          {/* Related Concepts */}
                          {concept.relatedConcepts.length > 0 && (
                            <div>
                              <p className="text-xs text-faint uppercase tracking-wider mb-2">Related</p>
                              <div className="flex flex-wrap gap-1.5">
                                {concept.relatedConcepts.map((relId) => {
                                  const related = concepts.find((c) => c.id === relId)
                                  if (!related) return null
                                  return (
                                    <button
                                      key={relId}
                                      onClick={() => handleExpand(relId)}
                                      className="px-2.5 py-1 rounded-md text-xs bg-surface-lighter text-muted hover:text-heading hover:bg-surface-lighter/80 transition-colors"
                                    >
                                      {related.term}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          {/* Course Link */}
                          {concept.courseModule && (
                            <Link
                              to={`/course/${concept.courseModule}`}
                              className="inline-flex items-center gap-1.5 text-xs text-accent-light hover:text-accent transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Study in Course {concept.courseModule}
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted mb-2">No concepts match your search.</p>
          <button
            onClick={() => { setSearch(''); setSelectedDomain('All') }}
            className="text-success text-sm hover:text-success/80 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
