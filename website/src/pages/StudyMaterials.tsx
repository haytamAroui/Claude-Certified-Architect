import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, BookOpen, Filter, ArrowRight, Tag } from 'lucide-react'
import { courses } from '../data/courses'

const allTopics = courses.flatMap((course) =>
  course.modules.map((module) => ({
    courseId: course.id,
    courseTitle: course.title,
    domain: course.domain,
    weight: course.weight,
    topic: module,
  }))
)

const domains = ['All', 'Domain 1', 'Domain 2', 'Domain 3', 'Domain 4', 'Domain 5', 'Bonus']

export default function StudyMaterials() {
  const [search, setSearch] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('All')

  const filtered = useMemo(() => {
    return allTopics.filter((t) => {
      const matchSearch =
        search === '' ||
        t.topic.toLowerCase().includes(search.toLowerCase()) ||
        t.courseTitle.toLowerCase().includes(search.toLowerCase())
      const matchDomain = selectedDomain === 'All' || t.domain === selectedDomain
      return matchSearch && matchDomain
    })
  }, [search, selectedDomain])

  // Group by course
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>()
    for (const item of filtered) {
      const key = item.courseId
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(item)
    }
    return map
  }, [filtered])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-primary" />
          Study Materials
        </h1>
        <p className="text-slate-400">
          Browse all topics across {courses.length} courses and {allTopics.length} modules
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search topics, courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-light border border-surface-lighter rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <div className="flex gap-1.5">
            {domains.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDomain(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedDomain === d
                    ? 'bg-primary/20 text-primary-light border border-primary/30'
                    : 'bg-surface-light text-slate-400 border border-surface-lighter hover:border-slate-500'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500">
        {filtered.length} topic{filtered.length !== 1 ? 's' : ''} found
        {search && ` for "${search}"`}
        {selectedDomain !== 'All' && ` in ${selectedDomain}`}
      </p>

      {/* Grouped Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-surface-light border border-surface-lighter rounded-xl">
          <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No topics match your search</p>
          <button
            onClick={() => { setSearch(''); setSelectedDomain('All') }}
            className="mt-3 text-sm text-primary-light hover:text-primary transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {Array.from(grouped.entries()).map(([courseId, topics]) => {
            const course = courses.find((c) => c.id === courseId)!
            return (
              <div
                key={courseId}
                className="bg-surface-light border border-surface-lighter rounded-xl overflow-hidden"
              >
                <div className="px-4 sm:px-5 py-3 bg-surface-lighter/50 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0 flex-wrap">
                    <span className="text-xs font-medium text-slate-500 bg-surface px-2 py-0.5 rounded">
                      {course.domain}
                    </span>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {course.weight}
                    </span>
                    <h3 className="text-white font-semibold text-sm ml-1 truncate">
                      Course {course.id}: {course.title}
                    </h3>
                  </div>
                  <Link
                    to={`/course/${courseId}`}
                    className="text-xs text-primary-light hover:text-primary flex items-center gap-1 transition-colors shrink-0"
                  >
                    Open <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="divide-y divide-surface-lighter">
                  {topics.map((topic, i) => (
                    <Link
                      key={i}
                      to={`/course/${courseId}`}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-surface-lighter/30 transition-colors group"
                    >
                      <Tag className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                        {topic.topic}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
