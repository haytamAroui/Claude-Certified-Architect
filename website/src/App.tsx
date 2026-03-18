import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const CourseViewer = lazy(() => import('./pages/CourseViewer'))
const ExamPage = lazy(() => import('./pages/ExamPage'))
const Roadmap = lazy(() => import('./pages/Roadmap'))
const StudyMaterials = lazy(() => import('./pages/StudyMaterials'))
const Certificate = lazy(() => import('./pages/Certificate'))
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
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/course/:courseId" element={<CourseViewer />} />
          <Route path="/exam/:examId" element={<ExamPage />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/materials" element={<StudyMaterials />} />
          <Route path="/certificate" element={<Certificate />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
