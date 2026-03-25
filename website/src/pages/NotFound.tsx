import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="text-center py-24">
      <p className="text-7xl font-display font-semibold text-surface-lighter mb-6">404</p>
      <h1 className="text-xl font-semibold text-heading mb-3">Page Not Found</h1>
      <p className="text-muted mb-8">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-ivory px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>
    </div>
  )
}
