import { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { Clock, CheckCircle, Copy, Check, Lightbulb } from 'lucide-react'

interface Props {
  moduleNumber: string
  title: string
  content: string
  isDone: boolean
  onToggleDone: () => void
}

/* ── Custom markdown components ── */

function CodeBlock({ node, children, ...props }: any) {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    const text = preRef.current?.textContent || ''
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      <pre ref={preRef} {...props}>{children}</pre>
      <button
        onClick={copyCode}
        className="absolute top-3 right-3 p-1.5 rounded-md bg-surface-lighter/80 hover:bg-surface-lighter text-faint hover:text-heading transition-all opacity-0 group-hover:opacity-100"
        aria-label={copied ? 'Copied' : 'Copy code'}
      >
        {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  )
}

function Callout({ children }: any) {
  return (
    <blockquote>
      <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </blockquote>
  )
}

function ResponsiveTable({ node, children, ...props }: any) {
  return (
    <div className="overflow-x-auto my-5 rounded-lg border border-surface-lighter">
      <table {...props}>{children}</table>
    </div>
  )
}

const mdComponents = {
  pre: CodeBlock,
  blockquote: Callout,
  table: ResponsiveTable,
}

export default function ModuleCard({ moduleNumber, title, content, isDone, onToggleDone }: Props) {
  const wordCount = content.split(/\s+/).length
  const readMinutes = Math.max(1, Math.round(wordCount / 200))

  return (
    <article className="bg-surface-light border border-surface-lighter rounded-2xl overflow-hidden">
      <div className="px-6 sm:px-8 py-5 border-b border-surface-lighter flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-faint tracking-wider uppercase mb-1">
            Module {moduleNumber}
          </p>
          <h2 className="text-lg font-display font-medium text-heading truncate">{title}</h2>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:flex items-center gap-1.5 text-faint text-xs">
            <Clock className="w-3.5 h-3.5" />
            {readMinutes} min
          </span>
          <button
            onClick={onToggleDone}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
              isDone
                ? 'bg-success/10 text-success border-success/30'
                : 'text-faint border-surface-lighter hover:border-success/20 hover:text-body'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            {isDone ? 'Done' : 'Mark done'}
          </button>
        </div>
      </div>

      <div className="px-6 sm:px-8 py-8 prose prose-invert prose-sm max-w-none
                      prose-headings:text-heading
                      prose-p:text-body prose-p:leading-relaxed
                      prose-code:text-accent-light prose-code:bg-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
                      prose-pre:bg-surface prose-pre:border prose-pre:border-surface-lighter prose-pre:rounded-xl
                      prose-table:text-sm
                      prose-th:text-body prose-th:bg-surface/50 prose-th:px-3 prose-th:py-2
                      prose-td:text-body prose-td:border-surface-lighter prose-td:px-3 prose-td:py-2
                      prose-strong:text-heading
                      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                      prose-li:text-body
                      prose-hr:border-surface-lighter">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
          components={mdComponents as any}
        >
          {content}
        </ReactMarkdown>
      </div>
    </article>
  )
}
