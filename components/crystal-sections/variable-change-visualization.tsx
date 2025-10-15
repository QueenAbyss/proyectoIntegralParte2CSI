"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Play, Pause, RotateCcw, Eye, EyeOff, Sparkles, Star, Crown, Gem, Wand2 } from "lucide-react"
import { AchievementsSystem } from "../mean-value-theorem/achievements-system"
import { TimerDisplay } from "../mean-value-theorem/timer-display"

interface VariableChangeVisualizationProps {
  width?: number
  height?: number
}

export function VariableChangeVisualization({ 
  width = 800, 
  height = 500 
}: VariableChangeVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedTransformation, setSelectedTransformation] = useState("linear")
  const [showTransformation, setShowTransformation] = useState(true)
  const [transformationValue, setTransformationValue] = useState(1)
  const [customTransformation, setCustomTransformation] = useState("")
  const [showParticles, setShowParticles] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1)

  // Estados de logros y métricas
  const [achievements, setAchievements] = useState([
    { id: "first_transformation", title: "Primera Transformación", description: "Realiza tu primera transformación", unlocked: false },
    { id: "transformation_master", title: "Maestro de Transformaciones", description: "Domina 5 transformaciones diferentes", unlocked: false },
    { id: "crystal_transformer", title: "Transformador de Cristal", description: "Usa todas las transformaciones básicas", unlocked: false },
    { id: "particle_master", title: "Maestro de Partículas", description: "Activa las partículas mágicas", unlocked: false },
    { id: "speed_demon", title: "Demonio de Velocidad", description: "Cambia transformaciones rápidamente", unlocked: false },
  ])
  const [exploredTransformations, setExploredTransformations] = useState(new Set())
  const [transformationChanges, setTransformationChanges] = useState(0)
  const [showNotification, setShowNotification] = useState(false)
  const [currentNotification, setCurrentNotification] = useState<any>(null)

  // Transformaciones mágicas
  const magicTransformations = {
    linear: {
      name: "u = x + 1",
      description: "Transformación lineal simple",
      fairyName: "🌺 Hada Lineal",
      color: "#FF6B6B",
      transform: (x: number) => x + 1,
      inverse: (u: number) => u - 1
    },
    quadratic: {
      name: "u = x²",
      description: "Transformación cuadrática",
      fairyName: "🌟 Hada Cuadrática",
      color: "#4ECDC4",
      transform: (x: number) => x * x,
      inverse: (u: number) => Math.sqrt(Math.abs(u)) * Math.sign(u)
    },
    exponential: {
      name: "u = eˣ",
      description: "Transformación exponencial",
      fairyName: "✨ Hada Exponencial",
      color: "#45B7D1",
      transform: (x: number) => Math.exp(x),
      inverse: (u: number) => Math.log(Math.abs(u)) * Math.sign(u)
    },
    trigonometric: {
      name: "u = sin(x)",
      description: "Transformación trigonométrica",
      fairyName: "🌊 Hada Ondulante",
      color: "#96CEB4",
      transform: (x: number) => Math.sin(x),
      inverse: (u: number) => Math.asin(Math.max(-1, Math.min(1, u)))
    }
  }

  const currentTransform = magicTransformations[selectedTransformation as keyof typeof magicTransformations]

  // Sistema de logros
  const checkAchievement = (type: string, data?: any) => {
    if (type === "first_transformation" && !achievements.find(a => a.id === "first_transformation")?.unlocked) {
      unlockAchievement("first_transformation")
    }
    
    if (type === "transformation_master" && exploredTransformations.size >= 5 && !achievements.find(a => a.id === "transformation_master")?.unlocked) {
      unlockAchievement("transformation_master")
    }
    
    if (type === "crystal_transformer" && exploredTransformations.size >= 4 && !achievements.find(a => a.id === "crystal_transformer")?.unlocked) {
      unlockAchievement("crystal_transformer")
    }
    
    if (type === "particle_master" && showParticles && !achievements.find(a => a.id === "particle_master")?.unlocked) {
      unlockAchievement("particle_master")
    }
    
    if (type === "speed_demon" && transformationChanges >= 10 && !achievements.find(a => a.id === "speed_demon")?.unlocked) {
      unlockAchievement("speed_demon")
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

  // Manejar cambio de transformación
  const handleTransformationChange = (transform: string) => {
    setSelectedTransformation(transform)
    setExploredTransformations(prev => new Set([...prev, transform]))
    setTransformationChanges(prev => prev + 1)
    checkAchievement("first_transformation")
    checkAchievement("transformation_master")
    checkAchievement("crystal_transformer")
    checkAchievement("speed_demon")
  }

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
  }, [selectedTransformation, showTransformation, transformationValue, showParticles, animationSpeed, width, height])

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

    // Función original f(x) = x²
    const originalFunction = (x: number) => x * x

    // Dibujar función original
    ctx.strokeStyle = "#8A2BE2"
    ctx.lineWidth = 4
    ctx.beginPath()

    for (let x = -3; x <= 3; x += 0.1) {
      const screenCoords = mathToScreen(x, originalFunction(x))
      if (x === -3) {
        ctx.moveTo(screenCoords.x, screenCoords.y)
      } else {
        ctx.lineTo(screenCoords.x, screenCoords.y)
      }
    }
    ctx.stroke()

    // Dibujar transformación si está activa
    if (showTransformation) {
      ctx.strokeStyle = currentTransform.color
      ctx.lineWidth = 3
      ctx.setLineDash([10, 5])
      ctx.beginPath()

      for (let x = -3; x <= 3; x += 0.1) {
        const transformedX = currentTransform.transform(x)
        const screenCoords = mathToScreen(transformedX, originalFunction(x))
        if (x === -3) {
          ctx.moveTo(screenCoords.x, screenCoords.y)
        } else {
          ctx.lineTo(screenCoords.x, screenCoords.y)
        }
      }
      ctx.stroke()
      ctx.setLineDash([])

      // Dibujar flecha de transformación
      ctx.strokeStyle = "#FFD700"
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(width/2 - 50, height/2)
      ctx.lineTo(width/2 + 50, height/2)
      ctx.stroke()

      // Cabeza de flecha
      ctx.beginPath()
      ctx.moveTo(width/2 + 50, height/2)
      ctx.lineTo(width/2 + 30, height/2 - 10)
      ctx.moveTo(width/2 + 50, height/2)
      ctx.lineTo(width/2 + 30, height/2 + 10)
      ctx.stroke()

      // Etiquetas de transformación
      ctx.fillStyle = "#333333"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText("f(x)", width/2 - 100, height/2 - 10)
      ctx.fillText("f(u)", width/2 + 100, height/2 - 10)
    }

    // Partículas mágicas
    if (showParticles && isPlaying) {
      ctx.fillStyle = "rgba(255, 215, 0, 0.6)"
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const size = 2 + Math.random() * 3
        ctx.beginPath()
        ctx.arc(x, y, size, 0, 2 * Math.PI)
        ctx.fill()
      }
    }

    // Etiquetas
    ctx.fillStyle = "#333333"
    ctx.font = "12px Arial"
    ctx.textAlign = "left"
    ctx.fillText(`f(x) = x²`, 10, 20)
    ctx.fillText(`Transformación: ${currentTransform.name}`, 10, 35)
    ctx.fillText(`Valor: ${transformationValue}`, 10, 50)
  }, [selectedTransformation, showTransformation, transformationValue, showParticles, isPlaying, currentTransform, width, height])

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Canvas Principal */}
        <div className="lg:col-span-3">
          <Card className="p-4 bg-white/90 backdrop-blur">
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className="w-full border-2 border-pink-300 rounded-lg"
              />
            </div>

            {/* Información de la transformación actual */}
            <div className="mt-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
              <div className="flex items-center gap-3 mb-2">
                <Wand2 className="w-6 h-6 text-pink-600" />
                <h4 className="font-semibold text-pink-800">{currentTransform.fairyName}</h4>
              </div>
              <p className="text-sm text-pink-700">{currentTransform.description}</p>
              <div className="mt-2 text-xs text-pink-600">
                <strong>Transformación:</strong> {currentTransform.name}
              </div>
            </div>
          </Card>
        </div>

        {/* Panel de Control */}
        <div className="space-y-4">
          {/* Selección de Transformaciones */}
          <Card className="p-4 bg-white/90 backdrop-blur">
            <h3 className="font-semibold mb-3 text-pink-800 flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              Transformaciones Mágicas
            </h3>
            <div className="space-y-2">
              {Object.keys(magicTransformations).map((transform) => (
                <Button
                  key={transform}
                  onClick={() => handleTransformationChange(transform)}
                  variant={selectedTransformation === transform ? "default" : "outline"}
                  className="w-full justify-start"
                >
                  {magicTransformations[transform as keyof typeof magicTransformations].fairyName}
                </Button>
              ))}
            </div>
          </Card>

          {/* Controles de Transformación */}
          <Card className="p-4 bg-white/90 backdrop-blur">
            <h3 className="font-semibold mb-3 text-pink-800 flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Control Mágico
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowTransformation(!showTransformation)}
                  variant={showTransformation ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                >
                  {showTransformation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showTransformation ? "Ocultar" : "Mostrar"}
                </Button>
              </div>
              
              {showTransformation && (
                <div>
                  <label className="text-sm text-pink-600">Valor de Transformación</label>
                  <Slider
                    value={[transformationValue]}
                    onValueChange={(value) => setTransformationValue(value[0])}
                    min={-2}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="text-center text-xs text-pink-500">Valor = {transformationValue}</div>
                </div>
              )}
            </div>
          </Card>

          {/* Efectos Mágicos */}
          <Card className="p-4 bg-white/90 backdrop-blur">
            <h3 className="font-semibold mb-3 text-pink-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Efectos Mágicos
            </h3>
            <div className="space-y-2">
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-full"
                variant={isPlaying ? "destructive" : "default"}
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isPlaying ? "Detener" : "Partículas"}
              </Button>
              
              <Button
                onClick={() => setShowParticles(!showParticles)}
                variant={showParticles ? "default" : "outline"}
                className="w-full"
              >
                ✨ {showParticles ? "Ocultar" : "Mostrar"} Partículas
              </Button>
            </div>
          </Card>

          {/* Sistema de Logros */}
          <AchievementsSystem achievements={achievements} />

          {/* Cronómetro */}
          <TimerDisplay
            isRunning={isPlaying}
            externalTime={0}
            onTimeUpdate={() => {}}
          />
        </div>
      </div>
    </div>
  )
}
