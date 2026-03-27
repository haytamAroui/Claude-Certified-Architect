export interface Badge {
  id: string
  label: string
  description: string
  icon: string
  condition: string
}

export const badges: Badge[] = [
  {
    id: 'first-course',
    label: 'First Steps',
    description: 'Completed your first course',
    icon: '📖',
    condition: 'Complete any 1 course',
  },
  {
    id: 'all-courses',
    label: 'Scholar',
    description: 'Completed all courses',
    icon: '🎓',
    condition: 'Complete all 7 courses',
  },
  {
    id: 'first-exam',
    label: 'Test Taker',
    description: 'Completed your first mock exam',
    icon: '📝',
    condition: 'Complete any mock exam',
  },
  {
    id: 'exam-pass',
    label: 'Passing Grade',
    description: 'Scored 72%+ on a mock exam',
    icon: '🏆',
    condition: 'Score 43/60 or higher',
  },
  {
    id: 'exam-ace',
    label: 'Ace',
    description: 'Scored 90%+ on a mock exam',
    icon: '⭐',
    condition: 'Score 54/60 or higher',
  },
  {
    id: 'streak-7',
    label: 'Week Warrior',
    description: '7-day study streak',
    icon: '🔥',
    condition: 'Study 7 days in a row',
  },
  {
    id: 'flashcard-master',
    label: 'Card Shark',
    description: 'Mastered 50+ flashcards',
    icon: '🃏',
    condition: 'Master 50 flashcards',
  },
  {
    id: 'quiz-streak',
    label: 'Quiz Whiz',
    description: 'Completed 10 quick quizzes',
    icon: '⚡',
    condition: 'Complete 10 quizzes',
  },
  {
    id: 'concept-explorer',
    label: 'Deep Diver',
    description: 'Viewed 40+ key concepts',
    icon: '🔬',
    condition: 'View 40 concepts',
  },
  {
    id: 'all-exams',
    label: 'Exam Master',
    description: 'Completed all 4 mock exams',
    icon: '👑',
    condition: 'Complete all mock exams',
  },
]
