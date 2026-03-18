import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import CourseViewer from './pages/CourseViewer'
import ExamPage from './pages/ExamPage'
import Roadmap from './pages/Roadmap'
import StudyMaterials from './pages/StudyMaterials'
import Certificate from './pages/Certificate'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/course/:courseId" element={<CourseViewer />} />
        <Route path="/exam/:examId" element={<ExamPage />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/materials" element={<StudyMaterials />} />
        <Route path="/certificate" element={<Certificate />} />
      </Route>
    </Routes>
  )
}

export default App
