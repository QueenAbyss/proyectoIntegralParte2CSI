"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface TimerDisplayProps {
  isRunning: boolean
  externalTime: number
  onTimeUpdate?: (time: number) => void
}

export function TimerDisplay({ isRunning, externalTime, onTimeUpdate }: TimerDisplayProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-blue-700 dark:text-blue-400">Cronómetro</h3>
        </div>
        <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">
          {isRunning ? "Tiempo transcurrido" : "Tiempo total"}
        </p>
        <div className="text-center">
          <div className={`text-3xl font-bold ${
            isRunning ? 'text-blue-600 animate-pulse' : 'text-gray-600 dark:text-gray-400'
          }`}>
            {formatTime(externalTime || 0)}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {isRunning ? "⏱️ Cronometrando..." : "⏹️ Detenido"}
          </div>
        </div>
      </div>
    </Card>
  )
}
