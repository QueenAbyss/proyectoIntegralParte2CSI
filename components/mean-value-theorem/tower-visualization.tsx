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

  // Función matemática - escalada correctamente para el rango -4 a 4
  const f = useCallback((x: number): number => {
    try {
      switch (functionType) {
        case "quadratic":
          return (x * x) / 4  // x² escalada: f(4) = 4, f(-4) = 4
        case "cubic":
          return (x * x * x) / 16  // x³ escalada: f(4) = 4, f(-4) = -4
        case "sin":
          return 4 * Math.sin(x)  // sin(x) escalada: rango [-4, 4]
        case "custom":
          if (customFunction) {
            const func = new Function("x", `return ${customFunction}`)
            const result = func(x)
            return isFinite(result) ? result : 0
          }
          return 0
        default:
          return (x * x) / 4  // Por defecto x² escalada
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

    // Fondo degradado púrpura-rosa
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "#D1C4E9") // Púrpura claro
    gradient.addColorStop(1, "#F8BBD0") // Rosa claro
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Base de la torre (césped verde)
    const baseY = height - 50
    
    // Dibujar césped con textura
    ctx.fillStyle = "#4CAF50"
    ctx.fillRect(0, baseY, width, 50)
    
    // Textura del césped (líneas diagonales)
    ctx.strokeStyle = "#2E7D32"
    ctx.lineWidth = 1
    for (let i = 0; i < width; i += 8) {
      ctx.beginPath()
      ctx.moveTo(i, baseY)
      ctx.lineTo(i + 4, baseY - 2)
      ctx.stroke()
    }

    // Calcular parámetros de la torre
    const towerWidth = width - 100
    const towerStartX = 50
    const meanHeight = calculateMeanHeight()
    const meanHeightScreen = baseY - (meanHeight + 1) * 30

    // Dibujar la torre como barras verticales (histograma)
    const numBars = 50
    const barWidth = towerWidth / numBars
    
    // Calcular el rango de valores de f(x) en el intervalo [a, b]
    let minY = Infinity, maxY = -Infinity
    for (let i = 0; i < numBars; i++) {
      const x = a + (i / numBars) * (b - a)
      const y = f(x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)
    }
    
    // Escalar las alturas para que se vean bien
    const yRange = maxY - minY
    const scaleFactor = yRange > 0 ? 100 / yRange : 1
    
    for (let i = 0; i < numBars; i++) {
      const x = a + (i / numBars) * (b - a)
      const y = f(x)
      const barHeight = Math.max(5, (y - minY) * scaleFactor)  // Altura mínima de 5px
      const barX = towerStartX + i * barWidth
      const barY = baseY - barHeight

      // Color del segmento basado en la altura - colores más vibrantes
      const intensity = Math.min(1, (y + 2) / 4)
      const r = Math.floor(100 + intensity * 155) // 100-255
      const g = Math.floor(50 + intensity * 205) // 50-255
      const blue = Math.floor(150 + intensity * 105) // 150-255
      
      ctx.fillStyle = `rgb(${r}, ${g}, ${blue})`
      ctx.fillRect(barX, barY, barWidth, barHeight)

      // Borde del segmento más oscuro
      ctx.strokeStyle = `rgba(${Math.floor(r * 0.7)}, ${Math.floor(g * 0.7)}, ${Math.floor(blue * 0.7)}, 0.9)`
      ctx.lineWidth = 1
      ctx.strokeRect(barX, barY, barWidth, barHeight)
    }

    // Línea de altura promedio (naranja)
    const meanHeightScaled = (meanHeight - minY) * scaleFactor
    const meanHeightScreenScaled = baseY - meanHeightScaled
    
    ctx.strokeStyle = "#FF9800"
    ctx.lineWidth = 3
    ctx.setLineDash([8, 4])
    ctx.beginPath()
    ctx.moveTo(towerStartX, meanHeightScreenScaled)
    ctx.lineTo(towerStartX + towerWidth, meanHeightScreenScaled)
    ctx.stroke()
    ctx.setLineDash([])

    // Etiqueta de altura promedio
    ctx.fillStyle = "#FF9800"
    ctx.font = "bold 12px Arial"
    ctx.textAlign = "left"
    ctx.fillText("Altura promedio", towerStartX + towerWidth + 10, meanHeightScreen + 5)

    // Marcadores especiales
    if (userEstimateC !== null) {
      const userX = towerStartX + ((userEstimateC - a) / (b - a)) * towerWidth
      const userYValue = f(userEstimateC)
      const userY = baseY - (userYValue - minY) * scaleFactor
      
      // Marcador del usuario
      ctx.fillStyle = "#EC4899"
      ctx.beginPath()
      ctx.arc(userX, userY, 8, 0, 2 * Math.PI)
      ctx.fill()
      
      ctx.strokeStyle = "#FFFFFF"
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Línea tangente del usuario (línea horizontal que representa la pendiente)
      ctx.strokeStyle = "#EC4899"
      ctx.lineWidth = 2
      ctx.setLineDash([4, 2])
      const tangentLength = 40
      ctx.beginPath()
      ctx.moveTo(userX - tangentLength/2, userY)
      ctx.lineTo(userX + tangentLength/2, userY)
      ctx.stroke()
      ctx.setLineDash([])

      // Etiqueta del usuario
      ctx.fillStyle = "#EC4899"
      ctx.font = "bold 10px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Tu c", userX, userY - 20)
    }

    if (actualC !== undefined) {
      const actualX = towerStartX + ((actualC - a) / (b - a)) * towerWidth
      const actualYValue = f(actualC)
      const actualY = baseY - (actualYValue - minY) * scaleFactor
      
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

    // Título de la torre con iconos de castillo
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
    
    // Verificar que el clic esté dentro del área de la torre
    if (x >= towerStartX && x <= towerStartX + towerWidth) {
      const mathX = a + ((x - towerStartX) / towerWidth) * (b - a)
      
      // Verificar que esté dentro del rango válido
      if (mathX >= a && mathX <= b) {
        onEstimateC(mathX)
      }
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
