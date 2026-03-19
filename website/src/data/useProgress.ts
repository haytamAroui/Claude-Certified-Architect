import { useState, useEffect } from 'react'

export interface DomainScore {
  correct: number
  total: number
}

interface Progress {
  completedCourses: string[]
  completedModules: Record<string, number[]>
  examScores: Record<string, { score: number; total: number; date: string; domainBreakdown?: Record<string, DomainScore> }>
  studyStreak: number
  lastStudyDate: string | null
}

const STORAGE_KEY = 'claude-cert-progress'

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        completedCourses: parsed.completedCourses || [],
        completedModules: parsed.completedModules || {},
        examScores: parsed.examScores || {},
        studyStreak: parsed.studyStreak || 0,
        lastStudyDate: parsed.lastStudyDate || null,
      }
    }
  } catch { /* corrupt localStorage — reset to defaults */ }
  return { completedCourses: [], completedModules: {}, examScores: {}, studyStreak: 0, lastStudyDate: null }
}

function saveProgress(progress: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

function initProgress(): Progress {
  const base = loadProgress()
  const today = getToday()
  if (base.lastStudyDate === today) return base

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  return {
    ...base,
    studyStreak: base.lastStudyDate === yesterdayStr ? base.studyStreak + 1 : 1,
    lastStudyDate: today,
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(initProgress)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const toggleCourse = (courseId: string) => {
    setProgress((p) => ({
      ...p,
      completedCourses: p.completedCourses.includes(courseId)
        ? p.completedCourses.filter((id) => id !== courseId)
        : [...p.completedCourses, courseId],
    }))
  }

  const toggleModule = (courseId: string, moduleIndex: number, totalModules: number) => {
    setProgress((p) => {
      const current = p.completedModules[courseId] || []
      const isComplete = current.includes(moduleIndex)
      const updated = isComplete
        ? current.filter((i) => i !== moduleIndex)
        : [...current, moduleIndex]
      const allDone = updated.length >= totalModules
      const courseCompleted = p.completedCourses.includes(courseId)
      return {
        ...p,
        completedModules: { ...p.completedModules, [courseId]: updated },
        completedCourses: allDone && !courseCompleted
          ? [...p.completedCourses, courseId]
          : !allDone && courseCompleted
          ? p.completedCourses.filter((id) => id !== courseId)
          : p.completedCourses,
      }
    })
  }

  const saveExamScore = (examId: string, score: number, total: number, domainBreakdown?: Record<string, DomainScore>) => {
    setProgress((p) => ({
      ...p,
      examScores: {
        ...p.examScores,
        [examId]: { score, total, date: new Date().toISOString(), domainBreakdown },
      },
    }))
  }

  // Aggregate domain performance across all exams
  const getDomainStats = (): Record<string, DomainScore> => {
    const stats: Record<string, DomainScore> = {}
    for (const exam of Object.values(progress.examScores)) {
      if (!exam.domainBreakdown) continue
      for (const [domain, ds] of Object.entries(exam.domainBreakdown)) {
        if (!stats[domain]) stats[domain] = { correct: 0, total: 0 }
        stats[domain].correct += ds.correct
        stats[domain].total += ds.total
      }
    }
    return stats
  }

  return { progress, toggleCourse, toggleModule, saveExamScore, getDomainStats }
}
