"use client"

import React, { useState, useCallback, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Target, Calculator, CheckCircle, XCircle, Clock, Trophy, Star, Award, Zap } from "lucide-react"
import { MathKeyboard } from "@/components/mean-value-theorem/math-keyboard"

interface TimerState {
  startTime: number | null
  elapsedTime: number
  isRunning: boolean
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
}

interface FundamentalTheoremVisualizationProps {
  timerState?: TimerState
  setTimerState?: (state: TimerState) => void
  exampleData?: {
    functionType: "linear" | "quadratic" | "cubic" | "sin" | "cos" | "custom"
    customFunction: string
    a: number
    b: number
  } | null
  onExampleLoaded?: (data: any) => void
}

export function FundamentalTheoremVisualization({ 
  timerState, 
  setTimerState, 
  exampleData, 
  onExampleLoaded 
}: FundamentalTheoremVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Estados principales
  const [a, setA] = useState(0)
  const [b, setB] = useState(2)
  const [functionType, setFunctionType] = useState<"linear" | "quadratic" | "cubic" | "sin" | "cos" | "custom">("sin")
  const [customFunction, setCustomFunction] = useState("x")
  const [currentStep, setCurrentStep] = useState(2)
  const [userF, setUserF] = useState("")
  const [userF_a, setUserF_a] = useState<string>("")
  const [userF_b, setUserF_b] = useState<string>("")
  const [userResult, setUserResult] = useState<string>("")
  const [isValidating, setIsValidating] = useState(false)
  const [validationError, setValidationError] = useState("")
  const [step2Error, setStep2Error] = useState("")
  const [step3Error, setStep3Error] = useState("")

  // Estados de logros
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first_antiderivative",
      title: "Primera Antiderivada",
      description: "Encuentra tu primera antiderivada correcta",
      icon: <Target className="w-5 h-5" />,
      unlocked: false,
    },
    {
      id: "calculator_expert", 
      title: "Calculador Experto",
      description: "Calcula F(b) - F(a) correctamente",
      icon: <Star className="w-5 h-5" />,
      unlocked: false,
    },
    {
      id: "verifier",
      title: "Verificador",
      description: "Completa los 4 pasos del teorema",
      icon: <Award className="w-5 h-5" />,
      unlocked: false,
    },
    {
      id: "power_master",
      title: "Maestro de Potencias",
      description: "Completa ejemplos con x² y x³",
      icon: <Zap className="w-5 h-5" />,
      unlocked: false,
    },
    {
      id: "trigonometric",
      title: "Trigonométrico",
      description: "Completa un ejemplo con sin(x) o cos(x)",
      icon: <Clock className="w-5 h-5" />,
      unlocked: false,
    },
  ])
  const [showNotification, setShowNotification] = useState(false)
  const [currentNotification, setCurrentNotification] = useState<Achievement | null>(null)
  const [isLoadingExample, setIsLoadingExample] = useState(false)
  const [showMathKeyboard, setShowMathKeyboard] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [finalResult, setFinalResult] = useState<{
    userCalculation: number
    correctCalculation: number
    integralValue: number
    F_a: number
    F_b: number
  } | null>(null)

  // Aplicar datos del ejemplo cuando se carguen
  useEffect(() => {
    if (exampleData) {
      setIsLoadingExample(true)
      setA(exampleData.a)
      setB(exampleData.b)
      setFunctionType(exampleData.functionType)
      setCustomFunction(exampleData.customFunction)
      // Solo resetear el paso cuando se carga un ejemplo nuevo
      setCurrentStep(1)
      setUserF("")
      setUserF_a(null)
      setUserF_b(null)
      setUserResult(null)
      setValidationError("")
      setIsLoadingExample(false)
    }
  }, [exampleData])

  // Manejar cambios de a y b sin resetear el paso si no es carga de ejemplo
  useEffect(() => {
    if (!isLoadingExample && currentStep > 1) {
      // Si estamos en paso 3 o superior y cambiamos a o b manualmente,
      // solo actualizar los valores pero mantener el paso actual
      // No hacer nada aquí, solo mantener el estado actual
    }
  }, [a, b, isLoadingExample, currentStep])

  // Resetear paso cuando cambie la función a integrar
  useEffect(() => {
    if (!isLoadingExample && currentStep > 1) {
      // Si cambiamos la función, limpiar todo y volver al paso 2
      setCurrentStep(2)
      setUserF("")
      setUserF_a(null)
      setUserF_b(null)
      setUserResult(null)
      setValidationError("")
      setIsValidating(false)
    }
  }, [functionType, customFunction, isLoadingExample])

  // Función original f(x)
  const f = useCallback((x: number): number => {
    try {
      switch (functionType) {
        case "linear":
          return x
        case "quadratic":
          return x * x
        case "cubic":
          return x * x * x
        case "sin":
          return Math.sin(x)
        case "cos":
          return Math.cos(x)
        case "custom":
          if (customFunction) {
            const func = new Function("x", `return ${customFunction}`)
            return func(x)
          }
          return x
        default:
          return x
      }
    } catch {
      return 0
    }
  }, [functionType, customFunction])

  // Función para mostrar la función en formato matemático
  const getFunctionDisplay = useCallback(() => {
    switch (functionType) {
      case "linear":
        return "x"
      case "quadratic":
        return "x²"
      case "cubic":
        return "x³"
      case "sin":
        return "sin(x)"
      case "cos":
        return "cos(x)"
      case "exp":
        return "e^x"
      case "custom":
        return customFunction
      default:
        return "x"
    }
  }, [functionType, customFunction])

  // Validación de antiderivada
  const validateAntiderivative = useCallback((
    userF: string, 
    originalF: (x: number) => number,
    a: number, 
    b: number
  ): boolean => {
    try {
      // 1. Verificar que la función del usuario sea válida
      const testFunc = new Function("x", `return ${userF}`)
      const testValue = testFunc(1)
      
      if (!isFinite(testValue)) {
        setValidationError("La función produce valores no finitos")
        return false
      }

      // 2. Verificar que no contenga integrales indefinidas
      if (userF.includes("∫") || userF.includes("integral") || userF.includes("dx")) {
        setValidationError("No ingreses integrales indefinidas. Solo la función F(x)")
        return false
      }

      // 3. Verificar que no contenga variables no permitidas
      const allowedVars = ['x']
      const allowedFunctions = ['Math', 'cos', 'sin', 'tan', 'exp', 'log', 'sqrt', 'abs']
      const userVars = userF.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || []
      const invalidVars = userVars.filter(v => 
        !allowedVars.includes(v) && 
        !v.startsWith('Math.') && 
        !allowedFunctions.includes(v)
      )
      
      if (invalidVars.length > 0) {
        setValidationError(`Variables no permitidas: ${invalidVars.join(', ')}. Solo usa 'x' y funciones como Math.cos, Math.sin, etc.`)
        return false
      }

      // 4. Validación numérica en múltiples puntos
      const h = 1e-5
      const testPoints = []
      
      // Generar puntos de prueba en el intervalo [a, b]
      for (let i = 0; i <= 10; i++) {
        const x = a + (i / 10) * (b - a)
        testPoints.push(x)
      }
      
      // Agregar puntos fuera del intervalo para mayor robustez
      testPoints.push(a - 1, b + 1, 0, -2, 2)

      for (const x of testPoints) {
        try {
          const F_x_plus_h = testFunc(x + h)
          const F_x_minus_h = testFunc(x - h)
          
          if (!isFinite(F_x_plus_h) || !isFinite(F_x_minus_h)) {
            setValidationError(`La función no es válida en x = ${x.toFixed(2)}`)
            return false
          }

          // Derivada numérica de F(x)
          const F_prime_numeric = (F_x_plus_h - F_x_minus_h) / (2 * h)
          
          // Valor de la función original f(x)
          const f_x = originalF(x)
          
          // Comparar con tolerancia
          if (Math.abs(F_prime_numeric - f_x) > 1e-4) {
            setValidationError(`La derivada de F(x) no coincide con f(x) en x = ${x.toFixed(2)}`)
            return false
          }
        } catch (err) {
          setValidationError(`Error al evaluar la función en x = ${x.toFixed(2)}`)
          return false
        }
      }

      setValidationError("")
      return true

    } catch (err) {
      setValidationError("Error de sintaxis en la función")
      return false
    }
  }, [])


  // Sistema de logros
  const unlockAchievement = useCallback((achievementId: string) => {
    setAchievements(prev => prev.map(achievement => 
      achievement.id === achievementId 
        ? { ...achievement, unlocked: true }
        : achievement
    ))
    
    const achievement = achievements.find(a => a.id === achievementId)
    if (achievement) {
      setCurrentNotification(achievement)
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 5000)
    }
  }, [achievements])

  // Manejar validación de antiderivada
  const handleAntiderivativeSubmit = useCallback(() => {
    setIsValidating(true)
    
    setTimeout(() => {
      if (validateAntiderivative(userF, f, a, b)) {
        setCurrentStep(3)
        unlockAchievement("first_antiderivative")
        setStep2Error("") // Limpiar errores del paso 2
        setStep3Error("") // Limpiar errores del paso 3
        
        // Iniciar temporizador si no está corriendo
        if (setTimerState && (!timerState?.isRunning)) {
          setTimerState({
            startTime: Date.now(),
            elapsedTime: 0,
            isRunning: true,
          })
        }
      } else {
        setStep2Error("Antiderivada incorrecta. Revisa tu función F(x).")
      }
      setIsValidating(false)
    }, 1000)
  }, [userF, f, a, b, validateAntiderivative, unlockAchievement, setTimerState, timerState?.isRunning])

  // Manejar validación de F(b) - F(a)
  // Función para manejar entrada de números decimales
  const handleNumberInput = useCallback((
    value: string, 
    setter: (value: string) => void
  ) => {
    // Permitir solo números, punto decimal, signo negativo y espacios
    const validPattern = /^[-]?[0-9]*\.?[0-9]*$/
    
    if (validPattern.test(value) || value === "") {
      setter(value)
      setValidationError("")
    }
    // Si no es válido, no hacer nada (no actualizar el estado)
  }, [])

  // Función para validar si un string es un número válido
  const isValidNumber = useCallback((value: string): boolean => {
    if (value === "" || value === "." || value === "-" || value === "-.") {
      return false
    }
    const num = parseFloat(value)
    return !isNaN(num) && isFinite(num)
  }, [])

  // Función para validar F(b) - F(a) al confirmar
  const validateFTC = useCallback((
    userF: string,
    a: number,
    b: number,
    userResult: string
  ): boolean => {
    try {
      // 1. Verificar que el resultado sea un número válido
      if (!isValidNumber(userResult)) {
        return false
      }
      
      // 2. Convertir a número
      const userFTCResult = parseFloat(userResult)
      
      // 3. Calcular F(x) usando la función del usuario
      const F = new Function("x", `return ${userF}`)
      
      // 4. Calcular valor correcto
      const correctF_a = F(a)
      const correctF_b = F(b)
      const correctResult = correctF_b - correctF_a
      
      // 5. Validar con tolerancia para errores de punto flotante
      const tolerance = 1e-6
      const isResult_correct = Math.abs(userFTCResult - correctResult) < tolerance
      
      return isResult_correct
      
    } catch (err) {
      console.error("Error al validar FTC:", err)
      return false
    }
  }, [isValidNumber])

  const handleFTCSubmit = useCallback(() => {
    setIsValidating(true)
    
    setTimeout(() => {
      // Solo manejar paso 3: Validar F(b) - F(a) (campos numéricos)
      if (currentStep >= 3) {
        if (!isValidNumber(userResult)) {
          setStep3Error("El resultado debe ser un número válido")
          setIsValidating(false)
          return
        }
        
        // Validar F(b) - F(a) usando la nueva función
        if (validateFTC(userF, a, b, userResult)) {
          setCurrentStep(4)
          unlockAchievement("calculator_expert")
          unlockAchievement("verifier")
          setStep3Error("") // Limpiar errores del paso 3
          
          // Verificar logros específicos por tipo de función
          if (functionType === "quadratic" || functionType === "cubic") {
            unlockAchievement("power_master")
          }
          if (functionType === "sin" || functionType === "cos") {
            unlockAchievement("trigonometric")
          }
          
          // Calcular valores para el mensaje de éxito
          try {
            const F = new Function("x", `return ${userF}`)
            const F_a = F(a)
            const F_b = F(b)
            const correctResult = F_b - F_a
            
            setFinalResult({
              userCalculation: parseFloat(userResult),
              correctCalculation: correctResult,
              integralValue: correctResult,
              F_a: F_a,
              F_b: F_b
            })
            setShowSuccessMessage(true)
            
            // Detener temporizador
            if (setTimerState) {
              setTimerState({
                startTime: null,
                elapsedTime: timerState?.elapsedTime || 0,
                isRunning: false,
              })
            }
          } catch (error) {
            console.error("Error al calcular resultado final:", error)
          }
        } else {
          setStep3Error("Cálculo incorrecto. Revisa tus valores.")
        }
      }
      
      setIsValidating(false)
    }, 1000)
  }, [currentStep, validateFTC, isValidNumber, unlockAchievement, functionType, setFinalResult, setShowSuccessMessage, setTimerState, timerState?.isRunning, timerState?.elapsedTime, userResult, userF, a, b])

  // Manejar teclas del teclado matemático
  const handleKeyboardInput = useCallback((value: string) => {
    setUserF(prev => prev + value)
  }, [])

  const handleKeyboardDelete = useCallback(() => {
    setUserF(prev => prev.slice(0, -1))
  }, [])

  const handleKeyboardClear = useCallback(() => {
    setUserF("")
  }, [])

  // Dibujar visualización
  const drawVisualization = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 40

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height)

    // Fondo
    ctx.fillStyle = "#F8FAFC"
    ctx.fillRect(0, 0, width, height)

    // Configuración de coordenadas
    const xMin = -5, xMax = 5
    const yMin = -5, yMax = 5
    
    const graphWidth = width - 2 * padding
    const graphHeight = height - 2 * padding

    // Convertir coordenadas
    const toScreenX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * graphWidth
    const toScreenY = (y: number) => padding + ((yMax - y) / (yMax - yMin)) * graphHeight

    // Dibujar cuadrícula
    ctx.strokeStyle = "#E2E8F0"
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

    // Dibujar función f(x)
    ctx.strokeStyle = "#3B82F6"
    ctx.lineWidth = 3
    ctx.beginPath()
    
    const step = (xMax - xMin) / 200
    let firstPoint = true
    for (let x = xMin; x <= xMax; x += step) {
      const y = f(x)
      
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

    // Dibujar área sombreada entre a y b
    if (a >= xMin && a <= xMax && b >= xMin && b <= xMax) {
      ctx.fillStyle = "rgba(34, 197, 94, 0.3)"
      ctx.beginPath()
      ctx.moveTo(toScreenX(a), toScreenY(0))
      
      for (let x = a; x <= b; x += step) {
        const y = f(x)
        if (y >= yMin && y <= yMax) {
          ctx.lineTo(toScreenX(x), toScreenY(y))
        }
      }
      
      ctx.lineTo(toScreenX(b), toScreenY(0))
      ctx.closePath()
      ctx.fill()
    }

    // Dibujar líneas verticales en a y b
    ctx.strokeStyle = "#10B981"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    
    if (a >= xMin && a <= xMax) {
      ctx.beginPath()
      ctx.moveTo(toScreenX(a), toScreenY(yMin))
      ctx.lineTo(toScreenX(a), toScreenY(yMax))
      ctx.stroke()
    }
    
    if (b >= xMin && b <= xMax) {
      ctx.beginPath()
      ctx.moveTo(toScreenX(b), toScreenY(yMin))
      ctx.lineTo(toScreenX(b), toScreenY(yMax))
      ctx.stroke()
    }
    
    ctx.setLineDash([])

    // Etiquetas
    ctx.fillStyle = "#1F2937"
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "center"
    ctx.fillText("f(x) y Área bajo la curva", width / 2, 25)
    
    ctx.font = "12px Arial"
    ctx.fillText(`∫[${a.toFixed(1)} → ${b.toFixed(1)}] f(x)dx`, width / 2, height - 10)
  }, [f, a, b])

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
    drawVisualization()
  }, [drawVisualization])

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
          <Card className="p-4">
            <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Controles Interactivos
            </h3>
            
            {/* Parámetros del intervalo */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Límite inferior a = {a.toFixed(1)}
                </label>
                <Slider
                  value={[a]}
                  onValueChange={(value) => setA(value[0])}
                  min={-5}
                  max={5}
                  step={0.1}
                  disabled={false}
                  className="w-full mt-2"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Límite superior b = {b.toFixed(1)}
                </label>
                <Slider
                  value={[b]}
                  onValueChange={(value) => setB(value[0])}
                  min={-5}
                  max={5}
                  step={0.1}
                  disabled={false}
                  className="w-full mt-2"
                />
              </div>
            </div>

            {/* Selección de función */}
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                Función a integrar
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => setFunctionType("linear")}
                  variant={functionType === "linear" ? "default" : "outline"}
                  size="sm"
                  disabled={false}
                >
                  x
                </Button>
                <Button
                  onClick={() => setFunctionType("quadratic")}
                  variant={functionType === "quadratic" ? "default" : "outline"}
                  size="sm"
                  disabled={false}
                >
                  x²
                </Button>
                <Button
                  onClick={() => setFunctionType("cubic")}
                  variant={functionType === "cubic" ? "default" : "outline"}
                  size="sm"
                  disabled={false}
                >
                  x³
                </Button>
                <Button
                  onClick={() => setFunctionType("sin")}
                  variant={functionType === "sin" ? "default" : "outline"}
                  size="sm"
                  disabled={false}
                >
                  sin(x)
                </Button>
                <Button
                  onClick={() => setFunctionType("cos")}
                  variant={functionType === "cos" ? "default" : "outline"}
                  size="sm"
                  disabled={false}
                >
                  cos(x)
                </Button>
                <Button
                  onClick={() => setFunctionType("custom")}
                  variant={functionType === "custom" ? "default" : "outline"}
                  size="sm"
                  disabled={false}
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
                <div className="flex gap-2">
                  <Input
                    value={customFunction}
                    onChange={(e) => setCustomFunction(e.target.value)}
                    placeholder="x**2 + 2*x - 1"
                    className="font-mono"
                    disabled={false}
                  />
                  <Button
                    onClick={() => setShowMathKeyboard(!showMathKeyboard)}
                    variant="outline"
                    size="sm"
                    disabled={false}
                  >
                    Teclado
                  </Button>
                </div>
              </div>
            )}

            {/* Cronómetro */}
            <div className="mt-6 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Cronómetro FTC
                </span>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${timerState?.isRunning ? 'text-purple-600 animate-pulse' : 'text-gray-600'}`}>
                  {Math.floor((timerState?.elapsedTime || 0) / 60).toString().padStart(2, '0')}:
                  {((timerState?.elapsedTime || 0) % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {timerState?.isRunning ? "⏱️ Resolviendo integral..." : "⏹️ Completado"}
                </div>
              </div>
            </div>
          </Card>

          {/* Sistema de Logros */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Logros del FTC
            </h3>
            <div className="space-y-2">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`flex items-center gap-2 p-2 rounded-lg border ${
                    achievement.unlocked
                      ? 'bg-yellow-50 border-yellow-400 shadow-md'
                      : 'bg-gray-50 border-gray-300 opacity-50'
                  }`}
                >
                  <div className={`${achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${achievement.unlocked ? 'text-yellow-800' : 'text-gray-600'}`}>
                      {achievement.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {achievement.description}
                    </div>
                  </div>
                  {achievement.unlocked && (
                    <Badge variant="secondary" className="text-xs">
                      Desbloqueado
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Panel derecho - Visualización y Pasos */}
        <div className="lg:col-span-2 space-y-4">
          {/* Gráfica */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Visualización del Segundo Teorema Fundamental
            </h3>
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg"
                style={{ minHeight: '400px' }}
              />
            </div>
          </Card>

          {/* Pasos del Teorema */}
          <div className="space-y-4">
            {/* Objetivo del ejercicio */}
            <Card className="p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white border-2 border-purple-500">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5" />
                <h3 className="text-lg font-semibold">
                  Objetivo: Usa el Segundo Teorema Fundamental para calcular la integral.
                </h3>
              </div>
            </Card>

            {/* Paso 1: Función dada */}
            <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                  Paso 1: Función dada
                </h3>
              </div>
              <div className="space-y-2">
                <p className="text-blue-700 dark:text-blue-300 font-mono text-lg">
                  <strong>f(x) =</strong> {getFunctionDisplay()}
                </p>
                <p className="text-blue-700 dark:text-blue-300">
                  <strong>Queremos calcular:</strong> ∫[{a.toFixed(1)} → {b.toFixed(1)}] f(x)dx
                </p>
              </div>
            </Card>

            {/* Paso 2: Encuentra la antiderivada */}
            {currentStep >= 2 && (
              <Card className="p-4 bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                    Paso 2: Encuentra la antiderivada F(x)
                  </h3>
                </div>
                <div className="space-y-3">
                  <p className="text-green-700 dark:text-green-300">
                    <strong>Recuerda:</strong> F'(x) = f(x). ¿Qué función al derivarla da {getFunctionDisplay()}?
                  </p>
                  <div className="flex gap-2 items-center">
                    <span className="text-green-700 font-mono">F(x) =</span>
                    <Input
                      value={userF}
                      onChange={(e) => setUserF(e.target.value)}
                      placeholder="Ej: (x**2)/2, (x**3)/3"
                      className="font-mono flex-1"
                    />
                    <Button
                      onClick={() => setShowMathKeyboard(!showMathKeyboard)}
                      variant="outline"
                      size="sm"
                      className="border-green-300 text-green-700 hover:bg-green-100"
                    >
                      Teclado
                    </Button>
                    <Button
                      onClick={handleAntiderivativeSubmit}
                      disabled={!userF || isValidating}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isValidating ? "Verificando..." : "Confirmar"}
                    </Button>
                  </div>
                  {step2Error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm p-2 bg-red-50 rounded border border-red-200">
                      <XCircle className="w-4 h-4" />
                      {step2Error}
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Paso 3: Evalúa F(b) - F(a) */}
            {currentStep >= 3 && (
              <Card className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                    Paso 3: Evalúa F(b) - F(a)
                  </h3>
                </div>
                <div className="space-y-3">
                  <p className="text-yellow-700 dark:text-yellow-300 font-mono text-lg">
                    <strong>F(x) =</strong> {userF}
                  </p>
                  <div className="space-y-4">
                    {/* Mostrar valores calculados automáticamente */}
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
                      <p className="text-yellow-800 dark:text-yellow-200 font-mono text-lg">
                        <strong>F({b.toFixed(1)}) =</strong> {(() => {
                          try {
                            const F = new Function("x", `return ${userF}`)
                            return F(b).toFixed(4)
                          } catch {
                            return "Error"
                          }
                        })()}
                      </p>
                      <p className="text-yellow-800 dark:text-yellow-200 font-mono text-lg">
                        <strong>F({a.toFixed(1)}) =</strong> {(() => {
                          try {
                            const F = new Function("x", `return ${userF}`)
                            return F(a).toFixed(4)
                          } catch {
                            return "Error"
                          }
                        })()}
                      </p>
                    </div>
                    
                    {/* Solo pedir el resultado final */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                        Tu resultado: F(b) - F(a) =
                      </label>
                      <Input
                        type="text"
                        value={userResult}
                        onChange={(e) => handleNumberInput(e.target.value, setUserResult)}
                        className={`font-mono ${
                          userResult === "" 
                            ? "border-gray-300 focus:border-blue-500" 
                            : isValidNumber(userResult)
                              ? "border-green-500 bg-green-50 focus:border-green-600" 
                              : "border-red-500 bg-red-50 focus:border-red-600"
                        }`}
                        placeholder="Ej: 2.6667"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleFTCSubmit}
                    disabled={!isValidNumber(userResult) || isValidating}
                    className="bg-yellow-600 hover:bg-yellow-700 w-full"
                  >
                    {isValidating ? "Verificando..." : "Confirmar"}
                  </Button>
                  {step3Error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm p-2 bg-red-50 rounded border border-red-200">
                      <XCircle className="w-4 h-4" />
                      {step3Error}
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Paso 4: Resultado final */}
            {currentStep >= 4 && (
              <Card className="p-4 bg-purple-50 dark:bg-purple-950/20 border-2 border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                    Paso 4: Resultado Final
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-purple-300 shadow-lg">
                    <p className="text-3xl font-bold text-purple-600 font-mono">
                      ∫[{a.toFixed(1)} → {b.toFixed(1)}] f(x)dx = {userResult}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Segundo Teorema Fundamental del Cálculo
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-green-600 text-sm p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">¡Excelente! Has completado el Segundo Teorema Fundamental del Cálculo.</span>
                  </div>
                </div>
              </Card>
            )}

            {/* Mensaje de éxito detallado */}
            {showSuccessMessage && finalResult && (
              <Card className="p-6 bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <CheckCircle className="w-6 h-6" />
                    <h3 className="text-xl font-bold">¡Correcto! El teorema funciona perfectamente.</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-200">Tu cálculo:</h4>
                      <p className="font-mono text-lg">F(b) - F(a) = {finalResult.userCalculation.toFixed(3)}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-200">Cálculo correcto:</h4>
                      <p className="font-mono text-lg">
                        {finalResult.F_b.toFixed(4)} - {finalResult.F_a.toFixed(4)} = {finalResult.correctCalculation.toFixed(4)}
                      </p>
                    </div>
                    
                    <hr className="border-green-300" />
                    
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-200">Área bajo la curva:</h4>
                      <p className="font-mono text-lg">∫f(x)dx ≈ {finalResult.integralValue.toFixed(4)}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                      <span className="text-2xl">✨</span>
                      <span className="font-semibold">El teorema confirma: F(b) - F(a) = ∫f(x)dx</span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      onClick={() => {
                        setShowSuccessMessage(false)
                        setFinalResult(null)
                        setCurrentStep(2)
                        setUserF("")
                        setUserF_a(null)
                        setUserF_b(null)
                        setUserResult(null)
                        setValidationError("")
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white"
                    >
                      <span className="mr-2">✨</span>
                      Intentar Otro Problema
                    </Button>
                  </div>
                </div>
              </Card>
            )}

          </div>
        </div>
      </div>

      {/* Teclado matemático */}
      {showMathKeyboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Teclado Matemático</h3>
              <Button onClick={() => setShowMathKeyboard(false)} variant="outline" size="sm">
                ✕
              </Button>
            </div>
            <MathKeyboard
              onInput={handleKeyboardInput}
              onDelete={handleKeyboardDelete}
              onClear={handleKeyboardClear}
              currentValue={userF}
            />
          </div>
        </div>
      )}
    </div>
  )
}
