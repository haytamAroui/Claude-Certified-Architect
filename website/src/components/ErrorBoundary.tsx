import { Component, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6">
          <div className="bg-surface-light border border-surface-lighter rounded-2xl p-10 max-w-md text-center">
            <div className="w-14 h-14 bg-danger/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <span className="text-2xl">!</span>
            </div>
            <h1 className="text-xl font-bold text-heading mb-2">Something went wrong</h1>
            <p className="text-muted text-sm mb-6">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-5 py-2.5 bg-surface-lighter hover:bg-surface-lighter/80 text-body rounded-xl text-sm font-medium transition-colors"
              >
                Try Again
              </button>
              <Link
                to="/"
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-ivory rounded-xl text-sm font-medium transition-colors"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
