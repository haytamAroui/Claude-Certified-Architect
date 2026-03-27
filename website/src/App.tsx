import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const CourseViewer = lazy(() => import('./pages/CourseViewer'))
const ExamPage = lazy(() => import('./pages/ExamPage'))
const Roadmap = lazy(() => import('./pages/Roadmap'))
const StudyMaterials = lazy(() => import('./pages/StudyMaterials'))
const Certificate = lazy(() => import('./pages/Certificate'))
const LearnHub = lazy(() => import('./pages/LearnHub'))
const Flashcards = lazy(() => import('./pages/Flashcards'))
const QuickQuiz = lazy(() => import('./pages/QuickQuiz'))
const Concepts = lazy(() => import('./pages/Concepts'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Landing page — full-bleed, outside Layout */}
        <Route path="/" element={<LandingPage />} />

        {/* App pages — inside Layout with top nav + footer */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/course/:courseId" element={<CourseViewer />} />
          <Route path="/exam/:examId" element={<ExamPage />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/materials" element={<StudyMaterials />} />
          <Route path="/certificate" element={<Certificate />} />
          <Route path="/learn" element={<LearnHub />} />
          <Route path="/learn/flashcards" element={<Flashcards />} />
          <Route path="/learn/quiz" element={<QuickQuiz />} />
          <Route path="/learn/concepts" element={<Concepts />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
