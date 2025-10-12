"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Lightbulb, Calculator, BookOpen, Target, Star, Zap, Clock } from "lucide-react"

interface Example {
  id: string
  title: string
  description: string
  equation: string
  interval: [number, number]
  integral: string
  derivative: string
  insight: string
  difficulty: "Fácil" | "Intermedio" | "Avanzado"
  category: "Potencias" | "Trigonométricas" | "Exponenciales" | "Polinomios"
}

interface FundamentalTheoremExamplesProps {
  onLoadExample?: (data: {
    functionType: "linear" | "quadratic" | "cubic" | "sin" | "cos" | "custom"
    customFunction: string
    a: number
    b: number
  }) => void
}

export function FundamentalTheoremExamples({ onLoadExample }: FundamentalTheoremExamplesProps) {
  const examples: Example[] = [
    {
      id: "linear",
      title: "Función Lineal",
      description: "La función más simple para empezar",
      equation: "x",
      interval: [0, 2],
      integral: "F(x) = x²/2",
      derivative: "F'(x) = x",
      insight: "La derivada de x²/2 es x, que es la función original.",
      difficulty: "Fácil",
      category: "Potencias"
    },
    {
      id: "quadratic",
      title: "Función Cuadrática",
      description: "Una parábola para entender el teorema",
      equation: "x**2",
      interval: [0, 3],
      integral: "F(x) = x³/3",
      derivative: "F'(x) = x²",
      insight: "La derivada de x³/3 es x², que es la función original.",
      difficulty: "Fácil",
      category: "Potencias"
    },
    {
      id: "cubic",
      title: "Función Cúbica",
      description: "Una curva con crecimiento acelerado",
      equation: "x**3",
      interval: [0, 2],
      integral: "F(x) = x⁴/4",
      derivative: "F'(x) = x³",
      insight: "La derivada de x⁴/4 es x³, demostrando que F'(x) = f(x).",
      difficulty: "Intermedio",
      category: "Potencias"
    },
    {
      id: "trigonometric_sin",
      title: "Función Seno",
      description: "Una onda sinusoidal",
      equation: "Math.sin(x)",
      interval: [0, Math.PI],
      integral: "F(x) = -cos(x) + 1",
      derivative: "F'(x) = sin(x)",
      insight: "La derivada de -cos(x) + 1 es sin(x), confirmando el teorema.",
      difficulty: "Intermedio",
      category: "Trigonométricas"
    },
    {
      id: "trigonometric_cos",
      title: "Función Coseno",
      description: "Otra función trigonométrica",
      equation: "Math.cos(x)",
      interval: [0, Math.PI/2],
      integral: "F(x) = sin(x)",
      derivative: "F'(x) = cos(x)",
      insight: "La derivada de sin(x) es cos(x), mostrando la relación inversa.",
      difficulty: "Intermedio",
      category: "Trigonométricas"
    },
    {
      id: "exponential",
      title: "Función Exponencial",
      description: "Crecimiento exponencial",
      equation: "Math.exp(x)",
      interval: [0, 1],
      integral: "F(x) = eˣ - 1",
      derivative: "F'(x) = eˣ",
      insight: "La derivada de eˣ - 1 es eˣ, mostrando que F'(x) = f(x).",
      difficulty: "Avanzado",
      category: "Exponenciales"
    },
    {
      id: "polynomial",
      title: "Polinomio Complejo",
      description: "Una función polinómica de grado 3",
      equation: "x**3 + 2*x**2 + x + 1",
      interval: [0, 2],
      integral: "F(x) = x⁴/4 + 2x³/3 + x²/2 + x",
      derivative: "F'(x) = x³ + 2x² + x + 1",
      insight: "La derivada de la integral es exactamente la función original.",
      difficulty: "Avanzado",
      category: "Polinomios"
    },
    {
      id: "trigonometric_mixed",
      title: "Función Trigonométrica Mixta",
      description: "Combinación de seno y coseno",
      equation: "Math.sin(x) + Math.cos(x)",
      interval: [0, Math.PI/2],
      integral: "F(x) = -cos(x) + sin(x)",
      derivative: "F'(x) = sin(x) + cos(x)",
      insight: "La derivada de -cos(x) + sin(x) es sin(x) + cos(x).",
      difficulty: "Avanzado",
      category: "Trigonométricas"
    }
  ]

  const handleLoadExample = (example: Example) => {
    console.log("Cargando ejemplo:", example.title)
    
    // Determinar el tipo de función
    let functionType: "linear" | "quadratic" | "cubic" | "sin" | "cos" | "custom" = "custom"
    if (example.equation === "x") functionType = "linear"
    else if (example.equation === "x**2") functionType = "quadratic"
    else if (example.equation === "x**3") functionType = "cubic"
    else if (example.equation === "Math.sin(x)") functionType = "sin"
    else if (example.equation === "Math.cos(x)") functionType = "cos"
    
    // Llamar al callback con los datos del ejemplo
    if (onLoadExample) {
      onLoadExample({
        functionType,
        customFunction: example.equation,
        a: example.interval[0],
        b: example.interval[1]
      })
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "Intermedio": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "Avanzado": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Potencias": return <Zap className="w-4 h-4" />
      case "Trigonométricas": return <Clock className="w-4 h-4" />
      case "Exponenciales": return <Star className="w-4 h-4" />
      case "Polinomios": return <Calculator className="w-4 h-4" />
      default: return <Target className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header de la sección */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Ejemplos del Segundo Teorema Fundamental
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Haz clic en un ejemplo para cargarlo y explorar cómo funciona el teorema
          </p>
        </div>
      </div>

      {/* Grid de ejemplos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {examples.map((example) => (
          <Card key={example.id} className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Header del ejemplo */}
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                      {example.title}
                    </h3>
                    <Badge className={getDifficultyColor(example.difficulty)}>
                      {example.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {example.description}
                  </p>
                </div>
              </div>

              {/* Ecuación */}
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                <div className="font-mono text-sm text-gray-700 dark:text-gray-300">
                  f(x) = {example.equation}
                </div>
              </div>

              {/* Información del ejemplo */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Intervalo:</span>
                  <Badge variant="outline" className="font-mono">
                    [{example.interval[0]}, {example.interval[1]}]
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Integral F(x):</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {example.integral}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Derivada F'(x):</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {example.derivative}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Categoría:</span>
                  <div className="flex items-center gap-1">
                    {getCategoryIcon(example.category)}
                    <span className="text-xs font-medium">{example.category}</span>
                  </div>
                </div>
              </div>

              {/* Insight educativo */}
              <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>💡 Insight:</strong> {example.insight}
                </p>
              </div>

              {/* Botón de carga */}
              <Button
                onClick={() => handleLoadExample(example)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Cargar ejemplo
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Información adicional */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            ¿Cómo usar los ejemplos?
            </h3>
            <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
              <p>1. <strong>Selecciona un ejemplo</strong> que te interese explorar</p>
              <p>2. <strong>Haz clic en "Cargar ejemplo"</strong> para configurar automáticamente los parámetros</p>
              <p>3. <strong>Ve a la pestaña "Visualizaciones"</strong> para interactuar con el ejemplo</p>
              <p>4. <strong>Sigue los 4 pasos</strong> del Segundo Teorema Fundamental</p>
              <p>5. <strong>Verifica tu respuesta</strong> y aprende del feedback</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Explicación del teorema */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              ¿Qué dice el Segundo Teorema Fundamental?
            </h3>
            <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
              <p>El <strong>Segundo Teorema Fundamental del Cálculo</strong> establece que:</p>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 mt-3">
                <p className="font-mono text-center text-lg">
                  Si F(x) = ∫<sub>a</sub><sup>x</sup> f(t) dt, entonces F'(x) = f(x)
                </p>
              </div>
              <p>Esto significa que <strong>la derivada de la integral es la función original</strong>.</p>
              <div className="mt-4 p-3 bg-white/30 dark:bg-gray-800/30 rounded-lg">
                <p className="text-xs font-medium text-green-800 dark:text-green-200 mb-1">
                  Pasos del Teorema:
                </p>
                <ol className="text-xs space-y-1 text-green-700 dark:text-green-300">
                  <li>1. Identifica la función f(x) y el intervalo [a, b]</li>
                  <li>2. Encuentra la antiderivada F(x) tal que F'(x) = f(x)</li>
                  <li>3. Calcula F(b) - F(a)</li>
                  <li>4. El resultado es el valor de la integral ∫[a→b] f(x)dx</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
