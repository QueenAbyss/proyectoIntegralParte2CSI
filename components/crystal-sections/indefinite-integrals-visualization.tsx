"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Play, Pause, RotateCcw, Eye, EyeOff, Sparkles, Star, Crown, Gem, Wand2, Lightbulb } from "lucide-react"
import { AchievementsSystem } from "../mean-value-theorem/achievements-system"
import { TimerDisplay } from "../mean-value-theorem/timer-display"

interface IndefiniteIntegralsVisualizationProps {
  width?: number
  height?: number
}

export function IndefiniteIntegralsVisualization({ 
  width = 800, 
  height = 500 
}: IndefiniteIntegralsVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedFunction, setSelectedFunction] = useState("quadratic")
  const [showFamily, setShowFamily] = useState(true)
  const [constantC, setConstantC] = useState(0)
  const [animationFrame, setAnimationFrame] = useState(0)
  const [customFunction, setCustomFunction] = useState("")
  const [showParticles, setShowParticles] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1)

  // Estados de logros y métricas
  const [achievements, setAchievements] = useState([
    { id: "first_exploration", title: "Primera Exploración", description: "Explora tu primera función", unlocked: false },
    { id: "family_master", title: "Maestro de Familias", description: "Visualiza 5 familias diferentes", unlocked: false },
    { id: "crystal_keeper", title: "Guardián del Cristal", description: "Domina todas las funciones básicas", unlocked: false },
    { id: "animation_master", title: "Maestro de Animación", description: "Activa la animación automática", unlocked: false },
    { id: "constant_explorer", title: "Explorador de Constantes", description: "Explora todos los valores de C", unlocked: false },
  ])
  const [exploredFunctions, setExploredFunctions] = useState(new Set())
  const [functionChanges, setFunctionChanges] = useState(0)
  const [showNotification, setShowNotification] = useState(false)
  const [currentNotification, setCurrentNotification] = useState<any>(null)
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now())
  const [currentTime, setCurrentTime] = useState<number>(0)

  // Funciones matemáticas con temática de hadas
  // f(x) es la función original, F(x) es su antiderivada
  const fairyFunctions = {
    quadratic: {
      f: (x: number) => x * x,  // f(x) = x²
      F: (x: number, C: number = 0) => (x * x * x) / 3 + C,  // F(x) = x³/3 + C
      name: "x²",
      antiderivative: "x³/3 + C",
      fairyName: "🌺 Hada Cuadrática",
      color: "#FF6B6B",
      description: "La hada que crea curvas suaves y elegantes"
    },
    sine: {
      f: (x: number) => Math.cos(x),  // f(x) = cos(x)
      F: (x: number, C: number = 0) => Math.sin(x) + C,  // F(x) = sin(x) + C
      name: "cos(x)",
      antiderivative: "sin(x) + C",
      fairyName: "🌊 Hada Ondulante",
      color: "#4ECDC4",
      description: "La hada que baila con las olas del mar"
    },
    exponential: {
      f: (x: number) => Math.exp(x),  // f(x) = eˣ
      F: (x: number, C: number = 0) => Math.exp(x) + C,  // F(x) = eˣ + C
      name: "eˣ",
      antiderivative: "eˣ + C",
      fairyName: "✨ Hada Exponencial",
      color: "#45B7D1",
      description: "La hada del crecimiento infinito"
    },
    linear: {
      f: (x: number) => 2 * x + 1,  // f(x) = 2x + 1
      F: (x: number, C: number = 0) => x * x + x + C,  // F(x) = x² + x + C
      name: "2x + 1",
      antiderivative: "x² + x + C",
      fairyName: "📏 Hada Lineal",
      color: "#96CEB4",
      description: "La hada que traza líneas rectas perfectas"
    }
  }

  const currentFunc = fairyFunctions[selectedFunction as keyof typeof fairyFunctions]

  // Sistema de logros
  const checkAchievement = (type: string, data?: any) => {
    if (type === "first_exploration" && !achievements.find(a => a.id === "first_exploration")?.unlocked) {
      unlockAchievement("first_exploration")
    }
    
    if (type === "family_master" && exploredFunctions.size >= 5 && !achievements.find(a => a.id === "family_master")?.unlocked) {
      unlockAchievement("family_master")
    }
    
    if (type === "crystal_keeper" && exploredFunctions.size >= 4 && !achievements.find(a => a.id === "crystal_keeper")?.unlocked) {
      unlockAchievement("crystal_keeper")
    }
    
    if (type === "animation_master" && isPlaying && !achievements.find(a => a.id === "animation_master")?.unlocked) {
      unlockAchievement("animation_master")
    }
    
    if (type === "constant_explorer" && functionChanges >= 9 && !achievements.find(a => a.id === "constant_explorer")?.unlocked) {
      unlockAchievement("constant_explorer")
    }
  }

  const unlockAchievement = (id: string) => {
    setAchievements(prev => prev.map(a => 
      a.id === id ? { ...a, unlocked: true } : a
    ))
    
    const achievement = achievements.find(a => a.id === id)
    if (achievement) {
      setCurrentNotification(achievement)
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 5000)
    }
  }

  // Manejar cambio de función
  const handleFunctionChange = (func: string) => {
    setSelectedFunction(func)
    setExploredFunctions(prev => new Set([...prev, func]))
    setFunctionChanges(prev => prev + 1)
    checkAchievement("first_exploration")
    checkAchievement("family_master")
    checkAchievement("crystal_keeper")
    checkAchievement("constant_explorer")
  }

  // Manejar cambio de constante C
  const handleConstantChange = (value: number) => {
    setConstantC(value)
    setFunctionChanges(prev => prev + 1)
    checkAchievement("constant_explorer")
  }

  // Manejar animación
  const handleAnimationToggle = () => {
    setIsPlaying(!isPlaying)
  }

  // Verificar logro de animación cuando isPlaying cambie
  useEffect(() => {
    if (isPlaying) {
      checkAchievement("animation_master")
    }
  }, [isPlaying])

  // Cronómetro - Actualización separada cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now() - sessionStartTime)
    }, 1000) // Actualizar cada segundo

    return () => clearInterval(timer)
  }, [sessionStartTime])

  // Animación del cristal
  useEffect(() => {
    let animationId: number
    let lastTime = 0
    const targetFPS = 30
    const frameDelay = 1000 / targetFPS

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameDelay) {
        drawCrystal()
        lastTime = currentTime
      }
      animationId = requestAnimationFrame(animate)
    }
    
    animationId = requestAnimationFrame(animate)
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [selectedFunction, showFamily, constantC, showParticles, width, height])

  // Animación de deslizamiento por las familias (separada)
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setAnimationFrame(prev => {
        const newFrame = (prev + 1) % 9 // 9 familias (0-8)
        const constants = [-4, -3, -2, -1, 0, 1, 2, 3, 4]
        setConstantC(constants[newFrame])
        return newFrame
      })
    }, 1000) // 1 segundo entre cada cambio

    return () => clearInterval(interval)
  }, [isPlaying])

  const drawCrystal = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Fondo blanco limpio
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, width, height)

    // Configuración del plano cartesiano
    const padding = 60
    const graphWidth = width - 2 * padding
    const graphHeight = height - 2 * padding
    const centerX = padding + graphWidth / 2
    const centerY = padding + graphHeight / 2

    // Dibujar cuadrícula
    ctx.strokeStyle = "#E5E7EB"
    ctx.lineWidth = 1

    // Líneas verticales
    for (let i = -4; i <= 4; i++) {
      const x = centerX + (i / 4) * (graphWidth / 2)
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, height - padding)
      ctx.stroke()
    }

    // Líneas horizontales
    for (let i = -4; i <= 4; i++) {
      const y = centerY - (i / 4) * (graphHeight / 2)
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Dibujar ejes principales
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 2

    // Eje X
    ctx.beginPath()
    ctx.moveTo(padding, centerY)
    ctx.lineTo(width - padding, centerY)
    ctx.stroke()

    // Eje Y
    ctx.beginPath()
    ctx.moveTo(centerX, padding)
    ctx.lineTo(centerX, height - padding)
    ctx.stroke()

    // Flechas de los ejes
    // Flecha eje X
    ctx.beginPath()
    ctx.moveTo(width - padding - 10, centerY - 5)
    ctx.lineTo(width - padding, centerY)
    ctx.lineTo(width - padding - 10, centerY + 5)
    ctx.stroke()

    // Flecha eje Y
    ctx.beginPath()
    ctx.moveTo(centerX - 5, padding + 10)
    ctx.lineTo(centerX, padding)
    ctx.lineTo(centerX + 5, padding + 10)
    ctx.stroke()

    // Etiquetas de los ejes
    ctx.fillStyle = "#374151"
    ctx.font = "14px Arial"
    ctx.textAlign = "center"
    ctx.fillText("x", width - padding + 20, centerY + 5)
    ctx.textAlign = "center"
    ctx.fillText("y", centerX - 5, padding - 10)

    // Etiquetas numéricas
    ctx.font = "12px Arial"
    ctx.fillStyle = "#6B7280"
    ctx.textAlign = "center"

    // Etiquetas del eje X
    for (let i = -4; i <= 4; i++) {
      if (i !== 0) {
        const x = centerX + (i / 4) * (graphWidth / 2)
        ctx.fillText(i.toString(), x, centerY + 20)
      }
    }

    // Etiquetas del eje Y
    ctx.textAlign = "right"
    for (let i = -4; i <= 4; i++) {
      if (i !== 0) {
        const y = centerY - (i / 4) * (graphHeight / 2)
        ctx.fillText(i.toString(), centerX - 10, y + 4)
      }
    }

    // Convertir coordenadas matemáticas a pantalla
    const mathToScreen = (mathX: number, mathY: number) => {
      const screenX = centerX + (mathX / 4) * (graphWidth / 2)
      const screenY = centerY - (mathY / 4) * (graphHeight / 2)
      return { x: screenX, y: screenY }
    }

    // No dibujar la función original, solo las antiderivadas

    // Dibujar familia de antiderivadas
    if (showFamily) {
      // Más familias, mejor distribuidas
      const constants = [-4, -3, -2, -1, 0, 1, 2, 3, 4]
      const colors = ["#FF6B6B", "#FF8C00", "#FFA500", "#32CD32", "#4169E1", "#9370DB", "#8A2BE2", "#FF1493", "#00CED1"]
      
      constants.forEach((C, index) => {
        ctx.strokeStyle = colors[index]
        ctx.lineWidth = 2
        ctx.setLineDash(C === constantC ? [] : [5, 5])
        ctx.beginPath()

        let firstPoint = true
        for (let x = -4; x <= 4; x += 0.05) {
          const y = currentFunc.F(x, C)
          // Escalar la función para que quepa en el rango visible
          const scaledY = Math.max(-4, Math.min(4, y / 4)) // Escalar por 4 para que x³/3(4) = 64/3 ≈ 21 se convierta en ≈ 5.25
          const screenCoords = mathToScreen(x, scaledY)
          if (firstPoint) {
            ctx.moveTo(screenCoords.x, screenCoords.y)
            firstPoint = false
          } else {
            ctx.lineTo(screenCoords.x, screenCoords.y)
          }
        }
        ctx.stroke()
        
        // Resaltar la constante seleccionada
        if (C === constantC) {
          ctx.strokeStyle = "#FFD700"
          ctx.lineWidth = 3
          ctx.beginPath()
          let firstPoint = true
          for (let x = -4; x <= 4; x += 0.05) {
            const y = currentFunc.F(x, C)
            // Escalar la función para que quepa en el rango visible
            const scaledY = Math.max(-4, Math.min(4, y / 4)) // Escalar por 4
            const screenCoords = mathToScreen(x, scaledY)
            if (firstPoint) {
              ctx.moveTo(screenCoords.x, screenCoords.y)
              firstPoint = false
            } else {
              ctx.lineTo(screenCoords.x, screenCoords.y)
            }
          }
          ctx.stroke()
        }
      })
      ctx.setLineDash([])
    }

    // Sin efectos de partículas, solo deslizamiento

    // Etiquetas fijas en la gráfica
    if (showFamily) {
      // Posición fija en la esquina superior izquierda
      const labelX = padding + 20  // Posición fija en la izquierda
      const labelY = padding + 30  // Posición fija arriba
      
      // Fondo para la etiqueta
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)"
      ctx.fillRect(labelX - 10, labelY - 15, 80, 25)
      ctx.strokeStyle = "#FFD700"
      ctx.lineWidth = 2
      ctx.strokeRect(labelX - 10, labelY - 15, 80, 25)
      
      // Texto de la etiqueta con valor dinámico
      ctx.fillStyle = "#FFD700"
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "left"
      ctx.fillText(`F(x) + ${constantC}`, labelX, labelY)
    }

    // Leyenda mejorada
    const legendX = width - 200
    const legendY = padding + 30
    
    // Fondo de la leyenda
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)"
    ctx.fillRect(legendX - 10, legendY - 10, 190, showFamily ? 80 : 40)
    ctx.strokeStyle = "#E5E7EB"
    ctx.lineWidth = 1
    ctx.strokeRect(legendX - 10, legendY - 10, 190, showFamily ? 80 : 40)
    
    // Función original
    ctx.strokeStyle = currentFunc.color
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(legendX, legendY)
    ctx.lineTo(legendX + 30, legendY)
    ctx.stroke()
    
    ctx.fillStyle = "#374151"
    ctx.font = "bold 12px Arial"
    ctx.textAlign = "left"
    ctx.fillText(`f(x) = ${currentFunc.name}`, legendX + 35, legendY + 5)
    
    // Familia de antiderivadas
    if (showFamily) {
      ctx.strokeStyle = "#FFD700"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(legendX, legendY + 25)
      ctx.lineTo(legendX + 30, legendY + 25)
      ctx.stroke()
      ctx.setLineDash([])
      
      ctx.fillText(`F(x) = ${currentFunc.antiderivative}`, legendX + 35, legendY + 30)
      
      // Mostrar la constante seleccionada
      ctx.fillStyle = "#6B7280"
      ctx.font = "10px Arial"
      ctx.fillText(`C = ${constantC}`, legendX + 35, legendY + 45)
    }
  }, [selectedFunction, showFamily, constantC, showParticles, isPlaying, currentFunc, width, height])

  return (
    <div className="space-y-4">
      {/* Notificación de logros */}
      {showNotification && currentNotification && (
        <div className="fixed top-4 right-4 z-50 bg-yellow-50 border border-yellow-300 rounded-lg p-4 shadow-lg animate-in slide-in-from-top">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-600" />
            <div>
              <div className="font-semibold text-yellow-800">¡Logro Desbloqueado!</div>
              <div className="text-sm text-yellow-700">{currentNotification.title}</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Canvas Principal */}
        <div className="lg:col-span-2">
          <Card className="p-3 bg-white/90 backdrop-blur">
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className="w-full border-2 border-purple-300 rounded-lg"
              />
            </div>

            {/* Información de la hada actual - Compacta */}
            <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Gem className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-800 text-sm">{currentFunc.fairyName}</h4>
                </div>
                {showFamily && (
                  <div className="px-2 py-1 bg-yellow-100 rounded text-xs font-mono text-yellow-800">
                    C = {constantC}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white/80 rounded border border-purple-300">
                  <div className="font-semibold text-purple-800">f(x)</div>
                  <div className="font-mono text-purple-700">{currentFunc.name}</div>
                </div>
                <div className="p-2 bg-white/80 rounded border border-purple-300">
                  <div className="font-semibold text-purple-800">F(x)</div>
                  <div className="font-mono text-purple-700">{currentFunc.antiderivative}</div>
                </div>
              </div>
            </div>

          </Card>
        </div>

        {/* Panel de Control - Compacto */}
        <div className="space-y-3">
          {/* Selección de Hadas - Compacta */}
          <Card className="p-3 bg-white/90 backdrop-blur">
            <h3 className="font-semibold mb-2 text-purple-800 flex items-center gap-2 text-sm">
              <Star className="w-4 h-4" />
              Elige tu Hada
            </h3>
            <div className="space-y-1">
              {Object.keys(fairyFunctions).map((func) => (
                <Button
                  key={func}
                  onClick={() => handleFunctionChange(func)}
                  variant={selectedFunction === func ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start text-xs"
                >
                  {fairyFunctions[func as keyof typeof fairyFunctions].fairyName}
                </Button>
              ))}
            </div>
          </Card>

          {/* Familia de Antiderivadas - Compacta */}
          <Card className="p-3 bg-white/90 backdrop-blur">
            <h3 className="font-semibold mb-2 text-purple-800 flex items-center gap-2 text-sm">
              <Crown className="w-4 h-4" />
              Familia Mágica
            </h3>
            <div className="space-y-2">
              <Button
                onClick={() => setShowFamily(!showFamily)}
                variant={showFamily ? "default" : "outline"}
                size="sm"
                className="w-full text-xs"
              >
                {showFamily ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                {showFamily ? "Ocultar" : "Mostrar"}
              </Button>
              
              {showFamily && (
                <div>
                  <label className="text-xs text-purple-600">Constante C</label>
                  <Slider
                    value={[constantC]}
                    onValueChange={(value) => handleConstantChange(value[0])}
                    min={-4}
                    max={4}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-center text-xs text-purple-500">C = {constantC}</div>
                </div>
              )}
            </div>
          </Card>

          {/* Animación - Compacta */}
          <Card className="p-3 bg-white/90 backdrop-blur">
            <h3 className="font-semibold mb-2 text-purple-800 flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4" />
              Animación
            </h3>
            <div className="space-y-2">
              <Button
                onClick={handleAnimationToggle}
                className="w-full text-xs"
                variant={isPlaying ? "destructive" : "default"}
                size="sm"
              >
                {isPlaying ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                {isPlaying ? "Detener" : "Deslizar"}
              </Button>
              
              <div className="text-xs text-purple-600 text-center">
                Desliza automáticamente por las familias
              </div>
            </div>
          </Card>

          {/* Sistema de Logros - Compacto */}
          <div className="max-h-48 overflow-y-auto">
            <AchievementsSystem achievements={achievements} />
          </div>

          {/* Cronómetro - Optimizado para no afectar renderización */}
          <div className="max-h-32">
            <Card className="p-3 bg-white/90 backdrop-blur">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <h4 className="font-semibold text-blue-800 text-sm">Cronómetro</h4>
              </div>
              <div className="text-center">
                <div className="text-lg font-mono text-blue-700">
                  {Math.floor(currentTime / 1000 / 60).toString().padStart(2, '0')}:
                  {Math.floor((currentTime / 1000) % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-blue-600">
                  Tiempo en visualización
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Consejo de las Hadas - Separado del contenido principal */}
      <div className="mt-4">
        <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <h4 className="font-semibold text-yellow-800">Consejo de las Hadas</h4>
          </div>
          <p className="text-sm text-yellow-700">
            💫 Recuerda que las integrales indefinidas siempre incluyen una constante de integración C, y que el cambio de variable es como una transformación mágica que simplifica las funciones más complejas.
          </p>
        </Card>
      </div>
    </div>
  )
}
