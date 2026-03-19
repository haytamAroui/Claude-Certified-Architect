import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { Clock, CheckCircle } from 'lucide-react'

interface Props {
  moduleNumber: string
  title: string
  content: string
  isDone: boolean
  onToggleDone: () => void
}

export default function ModuleCard({ moduleNumber, title, content, isDone, onToggleDone }: Props) {
  const wordCount = content.split(/\s+/).length
  const readMinutes = Math.max(1, Math.round(wordCount / 200))

  return (
    <article className="bg-surface-light border border-surface-lighter rounded-2xl overflow-hidden">
      <div className="px-5 sm:px-6 py-4 border-b border-surface-lighter flex items-center justify-between gap-4 bg-gradient-to-r from-primary/10 to-transparent">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-primary-light tracking-wider uppercase mb-0.5">
            Module {moduleNumber}
          </p>
          <h2 className="text-lg font-bold text-white truncate">{title}</h2>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:flex items-center gap-1.5 text-slate-500 text-xs">
            <Clock className="w-3.5 h-3.5" />
            {readMinutes} min
          </span>
          <button
            onClick={onToggleDone}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
              isDone
                ? 'bg-green-500/10 text-green-400 border-green-500/30'
                : 'text-slate-500 border-surface-lighter hover:border-green-500/20 hover:text-slate-300'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            {isDone ? 'Done' : 'Mark done'}
          </button>
        </div>
      </div>

      <div className="px-5 sm:px-6 py-6 prose prose-invert prose-sm max-w-none
                      prose-headings:text-slate-100
                      prose-p:text-slate-300 prose-p:leading-relaxed
                      prose-code:text-purple-300 prose-code:bg-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
                      prose-pre:bg-surface prose-pre:border prose-pre:border-surface-lighter prose-pre:rounded-xl
                      prose-blockquote:border-primary/40 prose-blockquote:text-slate-400
                      prose-table:text-sm
                      prose-th:text-slate-200 prose-th:bg-surface/50 prose-th:px-3 prose-th:py-2
                      prose-td:text-slate-300 prose-td:border-surface-lighter prose-td:px-3 prose-td:py-2
                      prose-strong:text-slate-100
                      prose-a:text-primary-light prose-a:no-underline hover:prose-a:underline
                      prose-li:text-slate-300
                      prose-hr:border-surface-lighter">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
        >
          {content}
        </ReactMarkdown>
      </div>
    </article>
  )
}
