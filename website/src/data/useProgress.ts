import { useState, useEffect } from 'react'

export interface DomainScore {
  correct: number
  total: number
}

interface Progress {
  completedCourses: string[]
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
        examScores: parsed.examScores || {},
        studyStreak: parsed.studyStreak || 0,
        lastStudyDate: parsed.lastStudyDate || null,
      }
    }
  } catch {}
  return { completedCourses: [], examScores: {}, studyStreak: 0, lastStudyDate: null }
}

function saveProgress(progress: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  // Update streak on mount
  useEffect(() => {
    const today = getToday()
    if (progress.lastStudyDate === today) return

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    setProgress((p) => ({
      ...p,
      studyStreak: p.lastStudyDate === yesterdayStr ? p.studyStreak + 1 : 1,
      lastStudyDate: today,
    }))
  }, [])

  const toggleCourse = (courseId: string) => {
    setProgress((p) => ({
      ...p,
      completedCourses: p.completedCourses.includes(courseId)
        ? p.completedCourses.filter((id) => id !== courseId)
        : [...p.completedCourses, courseId],
    }))
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

  return { progress, toggleCourse, saveExamScore, getDomainStats }
}
