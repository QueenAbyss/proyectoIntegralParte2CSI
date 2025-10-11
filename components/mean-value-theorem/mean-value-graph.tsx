"use client"

import React, { useRef, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"

interface MeanValueGraphProps {
  functionType: "quadratic" | "cubic" | "sin" | "custom"
  customFunction: string
  a: number
  b: number
  userEstimateC: number | null
  actualC?: number
  onEstimateC: (c: number) => void
  isLocked?: boolean
}

export function MeanValueGraph({
  functionType,
  customFunction,
  a,
  b,
  userEstimateC,
  actualC,
  onEstimateC,
  isLocked = false
}: MeanValueGraphProps) {
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

  // Calcular pendiente de la secante
  const calculateSecantSlope = useCallback(() => {
    const fa = f(a)
    const fb = f(b)
    return (fb - fa) / (b - a)
  }, [f, a, b])

  // Dibujar la gráfica
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 60

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height)

    // Fondo
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, width, height)

    // Convertir coordenadas matemáticas a coordenadas de pantalla
    const mathToScreen = (mathX: number, mathY: number) => {
      const screenX = padding + ((mathX - a) / (b - a)) * (width - 2 * padding)
      const screenY = height - padding - ((mathY - (-4)) / (4 - (-4))) * (height - 2 * padding)
      return { x: screenX, y: screenY }
    }

    // Dibujar ejes
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 2
    
    // Eje X
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()
    
    // Eje Y
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()

    // Etiquetas de ejes
    ctx.fillStyle = "#000000"
    ctx.font = "14px Arial"
    ctx.textAlign = "center"
    ctx.fillText("x", width - padding + 20, height - padding + 20)
    ctx.textAlign = "center"
    ctx.fillText("y", padding - 20, padding + 5)

    // Dibujar cuadrícula
    ctx.strokeStyle = "#E5E7EB"
    ctx.lineWidth = 1
    
    // Líneas verticales
    for (let i = Math.ceil(a); i <= Math.floor(b); i++) {
      const screenCoords = mathToScreen(i, 0)
      ctx.beginPath()
      ctx.moveTo(screenCoords.x, padding)
      ctx.lineTo(screenCoords.x, height - padding)
      ctx.stroke()
    }
    
    // Líneas horizontales
    for (let i = -4; i <= 4; i++) {
      const screenCoords = mathToScreen(0, i)
      ctx.beginPath()
      ctx.moveTo(padding, screenCoords.y)
      ctx.lineTo(width - padding, screenCoords.y)
      ctx.stroke()
    }

    // Etiquetas de la cuadrícula
    ctx.fillStyle = "#6B7280"
    ctx.font = "10px Arial"
    ctx.textAlign = "center"
    
    // Etiquetas del eje X
    for (let i = Math.ceil(a); i <= Math.floor(b); i++) {
      const screenCoords = mathToScreen(i, 0)
      ctx.fillText(i.toString(), screenCoords.x, height - padding + 15)
    }
    
    // Etiquetas del eje Y
    ctx.textAlign = "right"
    for (let i = -4; i <= 4; i++) {
      const screenCoords = mathToScreen(0, i)
      ctx.fillText(i.toString(), padding - 10, screenCoords.y + 3)
    }

    // Dibujar función
    ctx.strokeStyle = "#8B5CF6"
    ctx.lineWidth = 3
    ctx.beginPath()
    
    const step = (b - a) / 200
    for (let x = a; x <= b; x += step) {
      const y = f(x)
      const screenCoords = mathToScreen(x, y)
      
      if (x === a) {
        ctx.moveTo(screenCoords.x, screenCoords.y)
      } else {
        ctx.lineTo(screenCoords.x, screenCoords.y)
      }
    }
    ctx.stroke()

    // Dibujar recta secante
    const slope = calculateSecantSlope()
    const fa = f(a)
    const fb = f(b)
    
    ctx.strokeStyle = "#10B981"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(mathToScreen(a, fa).x, mathToScreen(a, fa).y)
    ctx.lineTo(mathToScreen(b, fb).x, mathToScreen(b, fb).y)
    ctx.stroke()
    ctx.setLineDash([])

    // Dibujar puntos a y b
    const pointA = mathToScreen(a, fa)
    const pointB = mathToScreen(b, fb)
    
    // Punto a
    ctx.fillStyle = "#10B981"
    ctx.beginPath()
    ctx.arc(pointA.x, pointA.y, 6, 0, 2 * Math.PI)
    ctx.fill()
    ctx.strokeStyle = "#FFFFFF"
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Etiqueta a
    ctx.fillStyle = "#059669"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.fillText("a", pointA.x, pointA.y - 15)
    
    // Punto b
    ctx.fillStyle = "#10B981"
    ctx.beginPath()
    ctx.arc(pointB.x, pointB.y, 6, 0, 2 * Math.PI)
    ctx.fill()
    ctx.strokeStyle = "#FFFFFF"
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Etiqueta b
    ctx.fillText("b", pointB.x, pointB.y - 15)

    // Dibujar tangente del usuario
    if (userEstimateC !== null) {
      const userY = f(userEstimateC)
      const userPoint = mathToScreen(userEstimateC, userY)
      
      // Punto del usuario
      ctx.fillStyle = "#EC4899"
      ctx.beginPath()
      ctx.arc(userPoint.x, userPoint.y, 6, 0, 2 * Math.PI)
      ctx.fill()
      ctx.strokeStyle = "#FFFFFF"
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Tangente del usuario
      const userSlope = slope // Pendiente de la secante
      const tangentLength = 1
      const tangentStartX = userEstimateC - tangentLength
      const tangentEndX = userEstimateC + tangentLength
      const tangentStartY = userY - userSlope * tangentLength
      const tangentEndY = userY + userSlope * tangentLength
      
      ctx.strokeStyle = "#EC4899"
      ctx.lineWidth = 2
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(mathToScreen(tangentStartX, tangentStartY).x, mathToScreen(tangentStartX, tangentStartY).y)
      ctx.lineTo(mathToScreen(tangentEndX, tangentEndY).x, mathToScreen(tangentEndX, tangentEndY).y)
      ctx.stroke()
      ctx.setLineDash([])
      
      // Etiqueta del usuario
      ctx.fillStyle = "#BE185D"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Tu c", userPoint.x, userPoint.y - 15)
    }

    // Dibujar tangente real
    if (actualC !== undefined) {
      const actualY = f(actualC)
      const actualPoint = mathToScreen(actualC, actualY)
      
      // Punto real
      ctx.fillStyle = "#F59E0B"
      ctx.beginPath()
      ctx.arc(actualPoint.x, actualPoint.y, 6, 0, 2 * Math.PI)
      ctx.fill()
      ctx.strokeStyle = "#FFFFFF"
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Tangente real
      const actualSlope = slope
      const tangentLength = 1
      const tangentStartX = actualC - tangentLength
      const tangentEndX = actualC + tangentLength
      const tangentStartY = actualY - actualSlope * tangentLength
      const tangentEndY = actualY + actualSlope * tangentLength
      
      ctx.strokeStyle = "#F59E0B"
      ctx.lineWidth = 2
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(mathToScreen(tangentStartX, tangentStartY).x, mathToScreen(tangentStartX, tangentStartY).y)
      ctx.lineTo(mathToScreen(tangentEndX, tangentEndY).x, mathToScreen(tangentEndX, tangentEndY).y)
      ctx.stroke()
      ctx.setLineDash([])
      
      // Etiqueta real
      ctx.fillStyle = "#92400E"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText("c real", actualPoint.x, actualPoint.y - 15)
    }

    // Leyenda
    const legendY = padding + 20
    const legendX = width - padding - 150
    
    // Función
    ctx.strokeStyle = "#8B5CF6"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(legendX, legendY)
    ctx.lineTo(legendX + 30, legendY)
    ctx.stroke()
    
    ctx.fillStyle = "#374151"
    ctx.font = "12px Arial"
    ctx.textAlign = "left"
    ctx.fillText("-f(x)", legendX + 35, legendY + 5)
    
    // Secante
    ctx.strokeStyle = "#10B981"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(legendX, legendY + 20)
    ctx.lineTo(legendX + 30, legendY + 20)
    ctx.stroke()
    ctx.setLineDash([])
    
    ctx.fillText("--Recta secante", legendX + 35, legendY + 25)

    // Mostrar pendiente
    ctx.fillStyle = "#6B7280"
    ctx.font = "12px Arial"
    ctx.textAlign = "right"
    ctx.fillText(`Pendiente = ${slope.toFixed(3)}`, width - padding, height - padding + 20)
  }, [f, a, b, userEstimateC, actualC, calculateSecantSlope])

  // Manejar clic en el canvas
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isLocked) return // No permitir clics cuando está bloqueado
    
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Convertir coordenadas de pantalla a coordenadas matemáticas
    const padding = 60
    const mathX = a + ((x - padding) / (canvas.width - 2 * padding)) * (b - a)

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
      canvas.height = 400
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  // Dibujar cuando cambien las dependencias
  useEffect(() => {
    drawGraph()
  }, [drawGraph])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className={`w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg ${
          isLocked ? 'cursor-not-allowed opacity-75' : 'cursor-crosshair'
        }`}
        style={{ minHeight: '400px' }}
      />
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
