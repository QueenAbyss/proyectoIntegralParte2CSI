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
    const padding = 20

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height)

    // Fondo blanco
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, width, height)

    // Configuración de coordenadas - rango fijo como pediste
    const xMin = -4, xMax = 4
    const yMin = -4, yMax = 4
    
    const graphWidth = width - 2 * padding
    const graphHeight = height - 2 * padding

    // Convertir coordenadas matemáticas a coordenadas de pantalla
    const toScreenX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * graphWidth
    const toScreenY = (y: number) => padding + ((yMax - y) / (yMax - yMin)) * graphHeight

    // Dibujar cuadrícula
    ctx.strokeStyle = "#E0E0E0"
    ctx.lineWidth = 0.5
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      ctx.beginPath()
      ctx.moveTo(toScreenX(x), toScreenY(yMin))
      ctx.lineTo(toScreenX(x), toScreenY(yMax))
      ctx.stroke()
    }
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
      ctx.beginPath()
      ctx.moveTo(toScreenX(xMin), toScreenY(y))
      ctx.lineTo(toScreenX(xMax), toScreenY(y))
      ctx.stroke()
    }

    // Dibujar ejes
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 2
    
    // Eje X
    ctx.beginPath()
    ctx.moveTo(toScreenX(xMin), toScreenY(0))
    ctx.lineTo(toScreenX(xMax), toScreenY(0))
    ctx.stroke()
    
    // Eje Y
    ctx.beginPath()
    ctx.moveTo(toScreenX(0), toScreenY(yMin))
    ctx.lineTo(toScreenX(0), toScreenY(yMax))
    ctx.stroke()

    // Etiquetas de ejes
    ctx.fillStyle = "#000000"
    ctx.font = "14px Arial"
    ctx.textAlign = "center"
    ctx.fillText("x", toScreenX(xMax) + 20, toScreenY(0) + 5)
    ctx.textAlign = "center"
    ctx.fillText("y", toScreenX(0) - 5, toScreenY(yMax) - 10)

    // Etiquetas de la cuadrícula
    ctx.fillStyle = "#6B7280"
    ctx.font = "10px Arial"
    ctx.textAlign = "center"
    
    // Etiquetas del eje X
    for (let i = Math.ceil(xMin); i <= Math.floor(xMax); i++) {
      if (i !== 0) {
        ctx.fillText(i.toString(), toScreenX(i), toScreenY(0) + 15)
      }
    }
    
    // Etiquetas del eje Y
    ctx.textAlign = "right"
    for (let i = Math.ceil(yMin); i <= Math.floor(yMax); i++) {
      if (i !== 0) {
        ctx.fillText(i.toString(), toScreenX(0) - 10, toScreenY(i) + 3)
      }
    }

    // Dibujar función usando la función escalada
    ctx.strokeStyle = "#8E24AA"
    ctx.lineWidth = 3
    ctx.beginPath()
    
    const step = (xMax - xMin) / 200
    let firstPoint = true
    for (let x = xMin; x <= xMax; x += step) {
      const y = f(x)  // Usar la función escalada
      
      if (y >= yMin && y <= yMax) {
        if (firstPoint) {
          ctx.moveTo(toScreenX(x), toScreenY(y))
          firstPoint = false
        } else {
          ctx.lineTo(toScreenX(x), toScreenY(y))
        }
      }
    }
    ctx.stroke()

    // Dibujar puntos a y b
    // Usar los valores de a y b de las props
    const fa = f(a)
    const fb = f(b)
    
    // Debug: verificar que los valores estén dentro del rango
    const aInRange = a >= xMin && a <= xMax && fa >= yMin && fa <= yMax
    const bInRange = b >= xMin && b <= xMax && fb >= yMin && fb <= yMax
    
    // Debug: log de valores para verificar
    console.log('Debug puntos a y b:', {
      a, fa, aInRange,
      b, fb, bInRange,
      xMin, xMax, yMin, yMax,
      aScreenX: toScreenX(a), aScreenY: toScreenY(fa),
      bScreenX: toScreenX(b), bScreenY: toScreenY(fb)
    })
    
    // Solo dibujar si están dentro del rango visible
    if (aInRange) {
      // Punto a - más visible
      ctx.fillStyle = "#4CAF50"
      ctx.beginPath()
      ctx.arc(toScreenX(a), toScreenY(fa), 10, 0, 2 * Math.PI)
      ctx.fill()
      ctx.strokeStyle = "#FFFFFF"
      ctx.lineWidth = 4
      ctx.stroke()
      
      // Etiqueta a - más visible
      ctx.fillStyle = "#4CAF50"
      ctx.font = "bold 16px Arial"
      ctx.textAlign = "center"
      ctx.fillText("a", toScreenX(a), toScreenY(fa) - 25)
    }
    
    if (bInRange) {
      // Punto b - más visible
      ctx.fillStyle = "#4CAF50"
      ctx.beginPath()
      ctx.arc(toScreenX(b), toScreenY(fb), 10, 0, 2 * Math.PI)
      ctx.fill()
      ctx.strokeStyle = "#FFFFFF"
      ctx.lineWidth = 4
      ctx.stroke()
      
      // Etiqueta b - más visible
      ctx.fillStyle = "#4CAF50"
      ctx.font = "bold 16px Arial"
      ctx.textAlign = "center"
      ctx.fillText("b", toScreenX(b), toScreenY(fb) - 25)
    }

    // Dibujar recta secante solo si ambos puntos están en el rango
    if (aInRange && bInRange) {
      ctx.strokeStyle = "#4CAF50"
      ctx.lineWidth = 3
      ctx.setLineDash([8, 4])
      ctx.beginPath()
      ctx.moveTo(toScreenX(a), toScreenY(fa))
      ctx.lineTo(toScreenX(b), toScreenY(fb))
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Dibujar marcador del usuario
    if (userEstimateC !== null) {
      const userY = f(userEstimateC)
      
      // Punto del usuario
      ctx.fillStyle = "#EC4899"
      ctx.beginPath()
      ctx.arc(toScreenX(userEstimateC), toScreenY(userY), 8, 0, 2 * Math.PI)
      ctx.fill()
      ctx.strokeStyle = "#FFFFFF"
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Etiqueta del usuario
      ctx.fillStyle = "#EC4899"
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "center"
      ctx.fillText(`Tu c ≈ ${userEstimateC.toFixed(2)}`, toScreenX(userEstimateC) + 10, toScreenY(userY) - 10)
    }

    // Dibujar tangente real
    if (actualC !== undefined) {
      const actualY = f(actualC)
      
      // Punto real
      ctx.fillStyle = "#F59E0B"
      ctx.beginPath()
      ctx.arc(toScreenX(actualC), toScreenY(actualY), 6, 0, 2 * Math.PI)
      ctx.fill()
      ctx.strokeStyle = "#FFFFFF"
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Tangente real
      const actualSlope = calculateSecantSlope()
      const tangentLength = 1
      const tangentStartX = actualC - tangentLength
      const tangentEndX = actualC + tangentLength
      const tangentStartY = actualY - actualSlope * tangentLength
      const tangentEndY = actualY + actualSlope * tangentLength
      
      ctx.strokeStyle = "#F59E0B"
      ctx.lineWidth = 2
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(toScreenX(tangentStartX), toScreenY(tangentStartY))
      ctx.lineTo(toScreenX(tangentEndX), toScreenY(tangentEndY))
      ctx.stroke()
      ctx.setLineDash([])
      
      // Etiqueta real
      ctx.fillStyle = "#92400E"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText("c real", toScreenX(actualC), toScreenY(actualY) - 15)
    }

    // Leyenda
    const legendY = padding + 20
    const legendX = width - padding - 150
    
    // Función
    ctx.strokeStyle = "#8E24AA"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(legendX, legendY)
    ctx.lineTo(legendX + 30, legendY)
    ctx.stroke()
    
    ctx.fillStyle = "#1F2937"
    ctx.font = "10px Arial"
    ctx.textAlign = "left"
    ctx.fillText("f(x)", legendX + 35, legendY + 5)
    
    // Secante
    ctx.strokeStyle = "#4CAF50"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 3])
    ctx.beginPath()
    ctx.moveTo(legendX, legendY + 20)
    ctx.lineTo(legendX + 30, legendY + 20)
    ctx.stroke()
    ctx.setLineDash([])
    
    ctx.fillText("Recta secante", legendX + 35, legendY + 25)

    // Calcular y mostrar pendiente
    const slope = (fb - fa) / (b - a)
    ctx.fillStyle = "#1F2937"
    ctx.font = "bold 12px Arial"
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
    const padding = 20
    const xMin = -4, xMax = 4
    const graphWidth = canvas.width - 2 * padding
    
    // Verificar que el clic esté dentro del área del gráfico
    if (x >= padding && x <= canvas.width - padding) {
      const mathX = xMin + ((x - padding) / graphWidth) * (xMax - xMin)
      
      // Verificar que esté dentro del rango válido y entre a y b
      if (mathX >= Math.min(a, b) && mathX <= Math.max(a, b)) {
        onEstimateC(mathX)
      }
    }
  }, [onEstimateC, isLocked])

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
