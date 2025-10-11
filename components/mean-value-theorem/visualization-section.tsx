"use client"

import React, { useState, useCallback, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trophy, Clock, Target, Eye, MousePointer } from "lucide-react"
import { AchievementsSystem } from "./achievements-system"
import { TimerDisplay } from "./timer-display"
import { TowerVisualization } from "./tower-visualization"
import { MeanValueGraph } from "./mean-value-graph"
import { MathKeyboard } from "./math-keyboard"

interface TimerState {
  startTime: number | null
  elapsedTime: number
  isRunning: boolean
}

interface VisualizationSectionProps {
  timerState?: TimerState
  setTimerState?: (state: TimerState) => void
  exampleData?: {
    functionType: "quadratic" | "cubic" | "sin" | "custom"
    customFunction: string
    a: number
    b: number
  } | null
  onExampleLoaded?: (data: any) => void
}

export function VisualizationSection({ timerState, setTimerState, exampleData, onExampleLoaded }: VisualizationSectionProps) {
  // Estados principales
  const [a, setA] = useState(-2.0)
  const [b, setB] = useState(2.0)
  const [functionType, setFunctionType] = useState<"quadratic" | "cubic" | "sin" | "custom">("quadratic")
  const [customFunction, setCustomFunction] = useState("x**2")
  const [userEstimateC, setUserEstimateC] = useState<number | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isLocked, setIsLocked] = useState(false) // Nuevo estado para bloquear C después de buscar
  const [result, setResult] = useState<{
    found: boolean
    actualC: number
    userC: number
    error: number
  } | null>(null)
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [functionError, setFunctionError] = useState("")

  // Estados de logros
  const [achievements, setAchievements] = useState([
    { id: "first_estimate", title: "Primera Estimación", description: "Haz tu primera estimación de c", unlocked: false },
    { id: "eagle_eye", title: "Ojo de Águila", description: "Estima c con error < 0.2", unlocked: false },
    { id: "perfectionist", title: "Perfeccionista", description: "Consigue 3 estimaciones excelentes", unlocked: false },
    { id: "explorer", title: "Explorador", description: "Prueba los 5 ejemplos", unlocked: false },
    { id: "speedster", title: "Velocista", description: "Completa un ejemplo en < 30s", unlocked: false },
  ])
  const [excellentCount, setExcellentCount] = useState(0)
  const [showNotification, setShowNotification] = useState(false)
  const [currentNotification, setCurrentNotification] = useState<any>(null)

  // Aplicar datos del ejemplo cuando se carguen
  useEffect(() => {
    if (exampleData) {
      setA(exampleData.a)
      setB(exampleData.b)
      setFunctionType(exampleData.functionType)
      setCustomFunction(exampleData.customFunction)
      setUserEstimateC(null) // Limpiar estimación anterior
      setResult(null) // Limpiar resultado anterior
      setIsLocked(false) // Desbloquear para nueva estimación
    }
  }, [exampleData])

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
            
            if (!isFinite(result)) return 0
            
            // Escalado automático para funciones personalizadas
            // Encuentra el rango de la función en el intervalo visible
            const samplePoints = 100
            let minVal = Infinity
            let maxVal = -Infinity
            
            for (let i = 0; i <= samplePoints; i++) {
              const testX = -4 + (i / samplePoints) * 8
              const testY = func(testX)
              if (isFinite(testY)) {
                minVal = Math.min(minVal, testY)
                maxVal = Math.max(maxVal, testY)
              }
            }
            
            // Escalar proporcionalmente manteniendo la forma natural
            const range = maxVal - minVal
            if (range === 0) return 0
            
            // Escalar para que quepa en el rango [-4, 4] manteniendo la forma
            const scale = 8 / range  // 8 es el rango total de -4 a 4
            const scaledResult = result * scale
            
            // Para funciones como x², mantener la forma natural sin centrar
            // Si la función es siempre positiva (como x²), mantenerla arriba
            if (minVal >= 0) {
              // Función siempre positiva: escalar y mantener arriba
              const finalResult = scaledResult - (minVal * scale)
              return Math.max(-4, Math.min(4, finalResult))
            } else if (maxVal <= 0) {
              // Función siempre negativa: escalar y mantener abajo
              const finalResult = scaledResult - (maxVal * scale)
              return Math.max(-4, Math.min(4, finalResult))
            } else {
              // Función mixta: centrar normalmente
              const center = (maxVal + minVal) / 2
              const scaledCenter = center * scale
              const offset = -scaledCenter
              const finalResult = scaledResult + offset
              return Math.max(-4, Math.min(4, finalResult))
            }
          }
          return 0
        default:
          return (x * x) / 4  // Por defecto x² escalada
      }
    } catch {
      return 0
    }
  }, [functionType, customFunction])

  // Validar función personalizada
  const validateFunction = useCallback((func: string, a: number, b: number) => {
    try {
      const testFunc = new Function("x", `return ${func}`)
      const testValue = testFunc(1)
      
      if (!isFinite(testValue)) {
        setFunctionError("Error: La función produce valores no finitos.")
        return false
      }
      
      const numPoints = 20
      const step = (b - a) / numPoints
      
      for (let i = 0; i <= numPoints; i++) {
        const x = a + i * step
        const y = testFunc(x)
        
        if (!isFinite(y)) {
          setFunctionError(`Error: La función tiene una discontinuidad en x ≈ ${x.toFixed(2)}`)
          return false
        }
        
        if (Math.abs(y) > 1e6) {
          setFunctionError(`Error: La función tiene valores muy grandes cerca de x ≈ ${x.toFixed(2)}`)
          return false
        }
      }
      
      setFunctionError("")
      return true
    } catch {
      setFunctionError("Error: Función inválida. Verifica la sintaxis.")
      return false
    }
  }, [])

  // Manejar cambio de función personalizada
  const handleCustomFunctionChange = (value: string) => {
    setCustomFunction(value)
    if (functionType === "custom") {
      validateFunction(value, a, b)
    }
  }

  // Manejar estimación del usuario
  const handleEstimateC = useCallback((c: number) => {
    setUserEstimateC(c)
    setIsVerifying(false)
    setResult(null)

    // Iniciar cronómetro si no está corriendo
    if (setTimerState && !timerState?.isRunning) {
      setTimerState({
        startTime: Date.now(),
        elapsedTime: 0,
        isRunning: true,
      })
    }

    // Verificar logro de primera estimación
    checkAchievement("first_estimate")
  }, [setTimerState, timerState?.isRunning])

  // Verificar c real
  const handleVerifyC = useCallback(() => {
    if (userEstimateC === null) return

    setIsVerifying(true)

    // Calcular derivada numérica
    const fPrime = (x: number): number => {
      const h = 0.0001
      return (f(x + h) - f(x - h)) / (2 * h)
    }

    // Calcular pendiente de la secante
    const fa = f(a)
    const fb = f(b)
    const slope = (fb - fa) / (b - a)

    // Buscar c usando método de Newton
    let actualC = (a + b) / 2
    for (let i = 0; i < 20; i++) {
      const error = fPrime(actualC) - slope
      if (Math.abs(error) < 0.0001) break
      
      const derivative = (fPrime(actualC + 0.001) - fPrime(actualC - 0.001)) / 0.002
      if (Math.abs(derivative) < 0.0001) break
      
      actualC = actualC - error / derivative
      
      if (actualC < a || actualC > b) {
        actualC = (a + b) / 2
        break
      }
    }

    const error = Math.abs(actualC - userEstimateC)
    const newResult = { found: true, actualC, userC: userEstimateC, error }
    setResult(newResult)
    setIsVerifying(false)
    setIsLocked(true) // Bloquear C después de buscar

    // Detener cronómetro
    if (setTimerState) {
      setTimerState({
        startTime: null,
        elapsedTime: timerState?.elapsedTime || 0,
        isRunning: false,
      })
    }

    // Verificar logros
    checkAchievement("eagle_eye", { error })
    if (error < 0.3) {
      checkAchievement("excellent_estimate", { error })
    }
    checkAchievement("speedster", { time: timerState?.elapsedTime || 0 })
  }, [userEstimateC, functionType, customFunction, a, b, f, setTimerState, timerState?.elapsedTime])

  // Sistema de logros
  const checkAchievement = (type: string, data?: any) => {
    if (type === "first_estimate" && !achievements.find(a => a.id === "first_estimate")?.unlocked) {
      unlockAchievement("first_estimate")
    }
    
    if (type === "eagle_eye" && data?.error < 0.2 && !achievements.find(a => a.id === "eagle_eye")?.unlocked) {
      unlockAchievement("eagle_eye")
    }
    
    if (type === "excellent_estimate" && data?.error < 0.3) {
      const newCount = excellentCount + 1
      setExcellentCount(newCount)
      if (newCount >= 3 && !achievements.find(a => a.id === "perfectionist")?.unlocked) {
        unlockAchievement("perfectionist")
      }
    }
    
    if (type === "speedster" && data?.time < 30 && !achievements.find(a => a.id === "speedster")?.unlocked) {
      unlockAchievement("speedster")
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

  // Resetear
  const handleReset = useCallback(() => {
    setUserEstimateC(null)
    setIsVerifying(false)
    setResult(null)
    setIsLocked(false) // Desbloquear C para permitir nueva estimación
    if (setTimerState) {
      setTimerState({
        startTime: null,
        elapsedTime: 0,
        isRunning: false,
      })
    }
  }, [setTimerState])

  return (
    <div className="space-y-6">
      {/* Notificación de logros */}
      {showNotification && currentNotification && (
        <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 animate-in slide-in-from-top">
          <Trophy className="w-5 h-5 text-yellow-600" />
          <AlertDescription>
            <strong>Logro Desbloqueado:</strong> {currentNotification.title}
            <br />
            <span className="text-sm text-muted-foreground">{currentNotification.description}</span>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel izquierdo - Controles */}
        <div className="space-y-4">
          {/* Controles Interactivos */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Controles Interactivos
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Ajusta los parámetros para explorar el teorema
            </p>

            {/* Parámetros del intervalo */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Punto inicial a = {a.toFixed(1)}
                </label>
                <Slider
                  value={[a]}
                  onValueChange={(value) => setA(value[0])}
                  min={-3}
                  max={0}
                  step={0.1}
                  disabled={userEstimateC !== null}
                  className="w-full mt-2"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Punto final b = {b.toFixed(1)}
                </label>
                <Slider
                  value={[b]}
                  onValueChange={(value) => setB(value[0])}
                  min={0}
                  max={3}
                  step={0.1}
                  disabled={userEstimateC !== null}
                  className="w-full mt-2"
                />
              </div>
            </div>

            {/* Selección de función */}
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                Tipo de función
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => setFunctionType("quadratic")}
                  variant={functionType === "quadratic" ? "default" : "outline"}
                  size="sm"
                  disabled={userEstimateC !== null}
                >
                  x²
                </Button>
                <Button
                  onClick={() => setFunctionType("cubic")}
                  variant={functionType === "cubic" ? "default" : "outline"}
                  size="sm"
                  disabled={userEstimateC !== null}
                >
                  x³
                </Button>
                <Button
                  onClick={() => setFunctionType("sin")}
                  variant={functionType === "sin" ? "default" : "outline"}
                  size="sm"
                  disabled={userEstimateC !== null}
                >
                  sin(x)
                </Button>
                <Button
                  onClick={() => setFunctionType("custom")}
                  variant={functionType === "custom" ? "default" : "outline"}
                  size="sm"
                  disabled={userEstimateC !== null}
                >
                  f(x)
                </Button>
              </div>
            </div>

            {/* Función personalizada */}
            {functionType === "custom" && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Función personalizada
                </label>
                <div className="space-y-2">
                  <Input
                    value={customFunction}
                    onChange={(e) => handleCustomFunctionChange(e.target.value)}
                    placeholder="x**2 + 2*x - 1"
                    className="font-mono"
                    disabled={userEstimateC !== null}
                  />
                  {functionError && (
                    <p className="text-sm text-red-600 dark:text-red-400">{functionError}</p>
                  )}
                  <Button
                    onClick={() => setShowKeyboard(!showKeyboard)}
                    variant="outline"
                    size="sm"
                    disabled={userEstimateC !== null}
                  >
                    {showKeyboard ? "Ocultar" : "Mostrar"} Teclado
                  </Button>
                </div>
              </div>
            )}

            {/* Teclado matemático */}
            {showKeyboard && functionType === "custom" && (
              <div className="mt-4">
                <MathKeyboard
                  onInput={handleCustomFunctionChange}
                  onDelete={() => setCustomFunction(prev => prev.slice(0, -1))}
                  onClear={() => setCustomFunction("")}
                  currentValue={customFunction}
                />
              </div>
            )}

            {/* Instrucciones */}
            <div className="mt-6 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-purple-700 dark:text-purple-300">
                <strong>Paso 1:</strong> Haz clic en la gráfica o torre para colocar tu estimación de c.
              </p>
            </div>
          </Card>

          {/* Sistema de Logros */}
          <AchievementsSystem achievements={achievements} />

          {/* Cronómetro */}
          <TimerDisplay
            isRunning={timerState?.isRunning || false}
            externalTime={timerState?.elapsedTime || 0}
            onTimeUpdate={(time) => {
              if (setTimerState) {
                setTimerState({
                  ...timerState!,
                  elapsedTime: time,
                })
              }
            }}
          />
        </div>

        {/* Panel derecho - Visualizaciones */}
        <div className="lg:col-span-2 space-y-4">
          {/* Torre del Valor Medio */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Torre del Valor Medio
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Representación visual de la función
            </p>
            <TowerVisualization
              functionType={functionType}
              customFunction={customFunction}
              a={a}
              b={b}
              userEstimateC={userEstimateC}
              actualC={result?.actualC}
              onEstimateC={handleEstimateC}
              isLocked={isLocked}
            />
          </Card>

          {/* Gráfica Cartesiana */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Plano Cartesiano
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Haz clic para colocar tu estimación de c
            </p>
            <MeanValueGraph
              functionType={functionType}
              customFunction={customFunction}
              a={a}
              b={b}
              userEstimateC={userEstimateC}
              actualC={result?.actualC}
              onEstimateC={handleEstimateC}
              isLocked={isLocked}
            />
          </Card>

          {/* Controles de verificación */}
          <Card className="p-4">
            <div className="flex gap-3">
              <Button
                onClick={handleVerifyC}
                disabled={userEstimateC === null || isVerifying}
                className="flex-1"
              >
                <Target className="w-4 h-4 mr-2" />
                {isVerifying ? "Buscando c..." : "Buscar c"}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                disabled={userEstimateC === null}
              >
                Intentar de nuevo
              </Button>
            </div>

            {/* Resultado */}
            {result && (
              <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                  Resultado
                </h4>
                  <div className="text-xs font-medium">
                    {result.error < 0.1 ? (
                      <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
                        🎯 Perfecto
                      </span>
                    ) : result.error < 0.3 ? (
                      <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
                        ✨ Excelente
                      </span>
                    ) : result.error < 0.6 ? (
                      <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-1 rounded-full">
                        👍 Bueno
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded-full">
                        🔄 Intenta
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="text-center">
                    <div className="text-gray-500 dark:text-gray-400">c real</div>
                    <div className="font-mono font-semibold">{result.actualC.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 dark:text-gray-400">Tu c</div>
                    <div className="font-mono font-semibold">{result.userC.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 dark:text-gray-400">Error</div>
                    <div className="font-mono font-semibold">{result.error.toFixed(2)}</div>
                  </div>
                </div>
                
                {/* Explicación corta */}
                <div className="mt-3 text-xs text-gray-600 dark:text-gray-400 text-center">
                  {result.error < 0.1 ? (
                    "¡Encontraste el punto exacto donde la pendiente de la tangente coincide con la secante!"
                  ) : result.error < 0.3 ? (
                    "Muy cerca del punto correcto. La derivada en tu punto es casi igual a la pendiente de la secante."
                  ) : result.error < 0.6 ? (
                    "Buen intento. Recuerda que c debe estar donde f'(c) = (f(b)-f(a))/(b-a)."
                  ) : (
                    "Intenta buscar un punto donde la curva tenga la misma pendiente que la línea secante."
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
