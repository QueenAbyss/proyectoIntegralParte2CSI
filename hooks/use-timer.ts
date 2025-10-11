"use client"

import { useState, useEffect, useCallback } from "react"

interface TimerState {
  startTime: number | null
  elapsedTime: number
  isRunning: boolean
}

export function useTimer(initialState?: TimerState) {
  const [isRunning, setIsRunning] = useState(initialState?.isRunning || false)
  const [currentTime, setCurrentTime] = useState(initialState?.elapsedTime || 0)
  const [startTime, setStartTime] = useState<number | null>(initialState?.startTime || null)

  // Iniciar temporizador
  const startTimer = useCallback(() => {
    setIsRunning(true)
    setStartTime(Date.now())
  }, [])

  // Detener temporizador
  const stopTimer = useCallback(() => {
    setIsRunning(false)
    setStartTime(null)
  }, [])

  // Resetear temporizador
  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setCurrentTime(0)
    setStartTime(null)
  }, [])

  // Actualizar tiempo cada segundo
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isRunning && startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        setCurrentTime(elapsed)
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, startTime])

  return { 
    isRunning, 
    currentTime, 
    startTimer, 
    stopTimer, 
    resetTimer, 
    setCurrentTime 
  }
}
