import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen } from 'lucide-react'
import { courses } from '../data/courses'
import { useProgress } from '../data/useProgress'
import { courseContents } from '../data/courseContents'

export default function CourseViewer() {
  const { courseId } = useParams<{ courseId: string }>()
  const course = courses.find((c) => c.id === courseId)
  const { progress, toggleCourse } = useProgress()

  if (!course) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Course not found</p>
        <Link to="/" className="text-primary-light mt-2 inline-block">Back to Dashboard</Link>
      </div>
    )
  }

  const content = courseContents[course.id] || '# Coming soon...'
  const isCompleted = progress.completedCourses.includes(course.id)
  const prevCourse = courses.find((c) => c.id === String(Number(course.id) - 1))
  const nextCourse = courses.find((c) => c.id === String(Number(course.id) + 1))

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link to="/" className="text-slate-400 hover:text-slate-200 text-sm flex items-center gap-1 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-slate-500 bg-surface-lighter px-2 py-0.5 rounded">
                {course.domain}
              </span>
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                Exam Weight: {course.weight}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              Course {course.id}: {course.title}
            </h1>
          </div>
          <button
            onClick={() => toggleCourse(course.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isCompleted
                ? 'bg-success/15 text-success border border-success/30'
                : 'bg-surface-lighter text-slate-400 border border-surface-lighter hover:border-success/30'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            {isCompleted ? 'Completed' : 'Mark Complete'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="prose max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-12 pt-6 border-t border-surface-lighter">
        {prevCourse ? (
          <Link
            to={`/course/${prevCourse.id}`}
            className="flex items-center gap-2 text-slate-400 hover:text-primary-light transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Course {prevCourse.id}: {prevCourse.title}</span>
          </Link>
        ) : <div />}
        {nextCourse ? (
          <Link
            to={`/course/${nextCourse.id}`}
            className="flex items-center gap-2 text-slate-400 hover:text-primary-light transition-colors"
          >
            <span className="text-sm">Course {nextCourse.id}: {nextCourse.title}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            to="/exam/1"
            className="flex items-center gap-2 text-accent-light hover:text-accent transition-colors"
          >
            <span className="text-sm">Take Mock Exam 1</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  )
}
