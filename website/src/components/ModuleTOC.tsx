import { CheckCircle, Circle } from 'lucide-react'

interface Props {
  modules: string[]
  activeIndex: number
  completedIndices: number[]
  onSelect: (i: number) => void
}

export default function ModuleTOC({ modules, activeIndex, completedIndices, onSelect }: Props) {
  return (
    <nav className="w-56 shrink-0 sticky top-6 self-start hidden lg:block">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
        Modules
      </p>
      <ol className="space-y-1">
        {modules.map((title, i) => {
          const isActive = i === activeIndex
          const isDone = completedIndices.includes(i)
          return (
            <li key={i}>
              <button
                onClick={() => onSelect(i)}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/15 text-primary-light font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-surface-lighter'
                }`}
              >
                {isDone ? (
                  <CheckCircle className="w-4 h-4 shrink-0 text-green-400" />
                ) : (
                  <Circle className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary-light' : 'text-slate-600'}`} />
                )}
                <span className="leading-tight line-clamp-2">{title}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
