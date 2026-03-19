import { Link, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, Map } from 'lucide-react'
import { courseContents } from '../data/courseContents'
import type { ComponentPropsWithoutRef } from 'react'

export default function Roadmap() {
  const content = courseContents['roadmap'] || '# Roadmap coming soon...'
  const navigate = useNavigate()

  const InternalLink = ({ href, children, ...props }: ComponentPropsWithoutRef<'a'>) => {
    if (href && href.startsWith('/')) {
      return (
        <a
          {...props}
          href={href}
          onClick={(e) => { e.preventDefault(); navigate(href) }}
        >
          {children}
        </a>
      )
    }
    return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
  }

  return (
    <div>
      <Link to="/" className="text-slate-400 hover:text-slate-200 text-sm flex items-center gap-1 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>
      <div className="flex items-center gap-3 mb-8">
        <Map className="w-6 h-6 text-success" />
        <h1 className="text-2xl font-bold text-white">18-Day Study Roadmap</h1>
      </div>
      <div className="prose max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: InternalLink }}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
