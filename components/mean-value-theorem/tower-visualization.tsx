"use client"

import React, { useRef, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"

interface TowerVisualizationProps {
  functionType: "quadratic" | "cubic" | "sin" | "custom"
  customFunction: string
  a: number
  b: number
  userEstimateC: number | null
  actualC?: number
  onEstimateC: (c: number) => void
  isLocked?: boolean
}

export function TowerVisualization({
  functionType,
  customFunction,
  a,
  b,
  userEstimateC,
  actualC,
  onEstimateC,
  isLocked = false
}: TowerVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Función matemática
  const f = useCallback((x: number): number => {
    try {
      switch (functionType) {
        case "quadratic":
          return 0.3 * x * x - 1
        case "cubic":
          return 0.1 * x * x * x - 0.5 * x
        case "sin":
          return 2 * Math.sin(x)
        case "custom":
          if (customFunction) {
            const func = new Function("x", `return ${customFunction}`)
            const result = func(x)
            return isFinite(result) ? result : 0
          }
          return 0
        default:
          return 0
      }
    } catch {
      return 0
    }
  }, [functionType, customFunction])

  // Calcular altura promedio
  const calculateMeanHeight = useCallback(() => {
    let sum = 0
    const n = 1000
    const dx = (b - a) / n
    
    for (let i = 0; i < n; i++) {
      const x = a + i * dx
      sum += f(x)
    }
    
    return sum / n
  }, [f, a, b])

  // Dibujar la torre
  const drawTower = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height)

    // Fondo mágico
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "#E0E7FF") // Azul claro
    gradient.addColorStop(0.7, "#F0FDF4") // Verde claro
    gradient.addColorStop(1, "#FEF3C7") // Amarillo claro
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Base de la torre (césped)
    const baseY = height - 80
    const baseHeight = 20
    
    // Dibujar césped con textura
    ctx.fillStyle = "#22C55E"
    ctx.fillRect(0, baseY, width, baseHeight)
    
    // Textura del césped
    ctx.strokeStyle = "#16A34A"
    ctx.lineWidth = 1
    for (let i = 0; i < width; i += 10) {
      ctx.beginPath()
      ctx.moveTo(i, baseY)
      ctx.lineTo(i + 5, baseY - 3)
      ctx.stroke()
    }

    // Calcular parámetros de la torre
    const towerWidth = width - 100
    const towerStartX = 50
    const maxHeight = height - 120
    const meanHeight = calculateMeanHeight()
    const meanHeightScreen = baseY - (meanHeight + 2) * 20

    // Dibujar segmentos de la torre
    const numSegments = 100
    const segmentWidth = towerWidth / numSegments
    
    for (let i = 0; i < numSegments; i++) {
      const x = a + (i / numSegments) * (b - a)
      const y = f(x)
      const segmentHeight = (y + 2) * 20
      const segmentX = towerStartX + i * segmentWidth
      const segmentY = baseY - segmentHeight

      // Color del segmento basado en la altura
      const intensity = Math.min(1, (y + 2) / 4)
      const r = Math.floor(138 + intensity * 117) // 138-255
      const g = Math.floor(43 + intensity * 212) // 43-255
      const blue = Math.floor(226 + intensity * 29) // 226-255
      
      ctx.fillStyle = `rgb(${r}, ${g}, ${blue})`
      ctx.fillRect(segmentX, segmentY, segmentWidth, segmentHeight)

      // Borde del segmento
      ctx.strokeStyle = `rgba(${r}, ${g}, ${blue}, 0.8)`
      ctx.lineWidth = 1
      ctx.strokeRect(segmentX, segmentY, segmentWidth, segmentHeight)
    }

    // Línea de altura promedio
    ctx.strokeStyle = "#F59E0B"
    ctx.lineWidth = 3
    ctx.setLineDash([10, 5])
    ctx.beginPath()
    ctx.moveTo(towerStartX, meanHeightScreen)
    ctx.lineTo(towerStartX + towerWidth, meanHeightScreen)
    ctx.stroke()
    ctx.setLineDash([])

    // Etiqueta de altura promedio
    ctx.fillStyle = "#92400E"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Altura promedio", towerStartX + towerWidth / 2, meanHeightScreen - 10)

    // Marcadores especiales
    if (userEstimateC !== null) {
      const userX = towerStartX + ((userEstimateC - a) / (b - a)) * towerWidth
      const userY = baseY - (f(userEstimateC) + 2) * 20
      
      // Marcador del usuario
      ctx.fillStyle = "#EC4899"
      ctx.beginPath()
      ctx.arc(userX, userY, 8, 0, 2 * Math.PI)
      ctx.fill()
      
      ctx.strokeStyle = "#FFFFFF"
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Etiqueta del usuario
      ctx.fillStyle = "#BE185D"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Tu c", userX, userY - 15)
    }

    if (actualC !== undefined) {
      const actualX = towerStartX + ((actualC - a) / (b - a)) * towerWidth
      const actualY = baseY - (f(actualC) + 2) * 20
      
      // Marcador real
      ctx.fillStyle = "#F59E0B"
      ctx.beginPath()
      ctx.arc(actualX, actualY, 8, 0, 2 * Math.PI)
      ctx.fill()
      
      ctx.strokeStyle = "#FFFFFF"
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Etiqueta real
      ctx.fillStyle = "#92400E"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText("c real", actualX, actualY - 15)
    }

    // Título de la torre
    ctx.fillStyle = "#1F2937"
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "center"
    ctx.fillText("🏰 Torre del Valor Medio 🏰", width / 2, 30)

    // Descripción
    ctx.fillStyle = "#6B7280"
    ctx.font = "12px Arial"
    ctx.fillText("La altura de la torre representa f(x)", width / 2, baseY + 40)

    // Etiquetas de intervalo
    ctx.fillStyle = "#374151"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.fillText(`a = ${a.toFixed(1)}`, towerStartX, baseY + 35)
    ctx.fillText(`b = ${b.toFixed(1)}`, towerStartX + towerWidth, baseY + 35)
  }, [f, a, b, userEstimateC, actualC, calculateMeanHeight])

  // Manejar clic en el canvas
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isLocked) return // No permitir clics cuando está bloqueado
    
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Convertir coordenadas de pantalla a coordenadas matemáticas
    const towerStartX = 50
    const towerWidth = canvas.width - 100
    const mathX = a + ((x - towerStartX) / towerWidth) * (b - a)

    // Verificar que el clic esté dentro del rango válido
    if (mathX >= a && mathX <= b) {
      onEstimateC(mathX)
    }
  }, [a, b, onEstimateC, isLocked])

  // Redimensionar canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (!container) return

      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = 300
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  // Dibujar cuando cambien las dependencias
  useEffect(() => {
    drawTower()
  }, [drawTower])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className={`w-full border-2 border-purple-200 dark:border-purple-800 rounded-lg ${
          isLocked ? 'cursor-not-allowed opacity-75' : 'cursor-crosshair'
        }`}
        style={{ minHeight: '300px' }}
      />
      
      {/* Hada decorativa */}
      {!isLocked && (
        <div className="absolute top-4 right-4 text-2xl animate-bounce">
          ✨
        </div>
      )}
      
      {isLocked && (
        <div className="absolute inset-0 flex items-start justify-center pt-8 bg-black/20 rounded-lg">
          <div className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 shadow-lg">
            🔒 Haz clic en "Intentar de nuevo" para continuar
          </div>
        </div>
      )}
    </div>
  )
}
