import { useState, useEffect, useCallback } from 'react'
import { Clock, AlertTriangle } from 'lucide-react'

interface ExamTimerProps {
  durationMinutes: number
  isRunning: boolean
  onTimeUp: () => void
}

export default function ExamTimer({ durationMinutes, isRunning, onTimeUp }: ExamTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60)

  const handleTimeUp = useCallback(onTimeUp, [onTimeUp])

  useEffect(() => {
    setSecondsLeft(durationMinutes * 60)
  }, [durationMinutes])

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, secondsLeft, handleTimeUp])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const totalSeconds = durationMinutes * 60
  const pct = (secondsLeft / totalSeconds) * 100
  const isLow = secondsLeft < 300 // under 5 minutes
  const isCritical = secondsLeft < 60 // under 1 minute

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-mono transition-colors ${
      isCritical
        ? 'bg-danger/15 text-danger animate-pulse'
        : isLow
          ? 'bg-warning/15 text-warning'
          : 'bg-surface-lighter text-slate-300'
    }`}>
      {isLow ? (
        <AlertTriangle className="w-4 h-4" />
      ) : (
        <Clock className="w-4 h-4" />
      )}
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
      <div className="w-16 h-1.5 bg-surface rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            isCritical ? 'bg-danger' : isLow ? 'bg-warning' : 'bg-primary'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
