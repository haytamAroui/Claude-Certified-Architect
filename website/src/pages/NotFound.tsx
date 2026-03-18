import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <p className="text-6xl font-bold text-surface-lighter mb-4">404</p>
      <h1 className="text-xl font-semibold text-white mb-2">Page Not Found</h1>
      <p className="text-slate-400 mb-6">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>
    </div>
  )
}
