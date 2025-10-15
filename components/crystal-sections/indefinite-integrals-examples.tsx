"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Lightbulb, Star, Sparkles, Crown, Gem, Wand2, CheckCircle, XCircle, RotateCcw, ChevronDown, ChevronUp } from "lucide-react"

interface Example {
  id: string
  title: string
  problem: string
  solution: string
  steps: string[]
  fairyName: string
  color: string
  difficulty: "easy" | "medium" | "hard"
}

export function IndefiniteIntegralsExamples() {
  const [selectedExample, setSelectedExample] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [showSolution, setShowSolution] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [hasAttempted, setHasAttempted] = useState(false)
  const [showFormatHelp, setShowFormatHelp] = useState(true)

  const examples: Example[] = [
    {
      id: "basic_power",
      title: "Poder Básico",
      problem: "∫ x² dx",
      solution: "x³/3 + C",
      steps: [
        "Aplicar la regla de la potencia: ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C",
        "Para n = 2: ∫ x² dx = x²⁺¹/(2+1) + C",
        "Simplificar: x³/3 + C"
      ],
      fairyName: "🌺 Hada Cuadrática",
      color: "#FF6B6B",
      difficulty: "easy"
    },
    {
      id: "exponential",
      title: "Crecimiento Exponencial",
      problem: "∫ eˣ dx",
      solution: "eˣ + C",
      steps: [
        "La derivada de eˣ es eˣ",
        "Por tanto, la antiderivada de eˣ es eˣ + C",
        "∫ eˣ dx = eˣ + C"
      ],
      fairyName: "✨ Hada Exponencial",
      color: "#45B7D1",
      difficulty: "easy"
    },
    {
      id: "trigonometric",
      title: "Ondas Mágicas",
      problem: "∫ sin(x) dx",
      solution: "-cos(x) + C",
      steps: [
        "Recordar que d/dx[cos(x)] = -sin(x)",
        "Por tanto, d/dx[-cos(x)] = sin(x)",
        "La antiderivada de sin(x) es -cos(x) + C"
      ],
      fairyName: "🌊 Hada Ondulante",
      color: "#4ECDC4",
      difficulty: "medium"
    },
    {
      id: "polynomial",
      title: "Polinomio Complejo",
      problem: "∫ (3x² + 2x + 1) dx",
      solution: "x³ + x² + x + C",
      steps: [
        "Aplicar linealidad: ∫ (3x² + 2x + 1) dx = 3∫x² dx + 2∫x dx + ∫1 dx",
        "Calcular cada integral: 3(x³/3) + 2(x²/2) + x + C",
        "Simplificar: x³ + x² + x + C"
      ],
      fairyName: "📏 Hada Lineal",
      color: "#96CEB4",
      difficulty: "medium"
    },
    {
      id: "advanced_trig",
      title: "Trigonometría Avanzada",
      problem: "∫ sec²(x) dx",
      solution: "tan(x) + C",
      steps: [
        "Recordar que d/dx[tan(x)] = sec²(x)",
        "Por tanto, la antiderivada de sec²(x) es tan(x) + C",
        "∫ sec²(x) dx = tan(x) + C"
      ],
      fairyName: "🌟 Hada Trigonométrica",
      color: "#9370DB",
      difficulty: "hard"
    }
  ]

  const currentExample = examples[selectedExample]

  const checkAnswer = () => {
    const normalizedUserAnswer = userAnswer.trim().toLowerCase()
    const normalizedSolution = currentExample.solution.toLowerCase()
    
    // Verificar si la respuesta es correcta (considerando variaciones)
    let isAnswerCorrect = false
    
    // Validación específica para cada tipo de ejemplo
    switch (currentExample.id) {
      case "basic_power":
        // ∫ x² dx = x³/3 + C
        isAnswerCorrect = normalizedUserAnswer === normalizedSolution ||
                         normalizedUserAnswer === normalizedSolution.replace(/\s/g, '') ||
                         (normalizedUserAnswer.includes('x³/3') || normalizedUserAnswer.includes('x^3/3')) && normalizedUserAnswer.includes('c')
        break
        
      case "exponential":
        // ∫ eˣ dx = eˣ + C
        isAnswerCorrect = normalizedUserAnswer === normalizedSolution ||
                         normalizedUserAnswer === normalizedSolution.replace(/\s/g, '') ||
                         (normalizedUserAnswer.includes('eˣ') || normalizedUserAnswer.includes('e^x')) && normalizedUserAnswer.includes('c')
        break
        
      case "trigonometric":
        // ∫ sin(x) dx = -cos(x) + C
        isAnswerCorrect = normalizedUserAnswer === normalizedSolution ||
                         normalizedUserAnswer === normalizedSolution.replace(/\s/g, '') ||
                         normalizedUserAnswer.includes('-cos(x)') && normalizedUserAnswer.includes('c')
        break
        
      case "polynomial":
        // ∫ (3x² + 2x + 1) dx = x³ + x² + x + C
        isAnswerCorrect = normalizedUserAnswer === normalizedSolution ||
                         normalizedUserAnswer === normalizedSolution.replace(/\s/g, '') ||
                         (normalizedUserAnswer.includes('x³') || normalizedUserAnswer.includes('x^3')) &&
                         normalizedUserAnswer.includes('x²') && normalizedUserAnswer.includes('x') && normalizedUserAnswer.includes('c')
        break
        
      case "advanced_trig":
        // ∫ sec²(x) dx = tan(x) + C
        isAnswerCorrect = normalizedUserAnswer === normalizedSolution ||
                         normalizedUserAnswer === normalizedSolution.replace(/\s/g, '') ||
                         normalizedUserAnswer.includes('tan(x)') && normalizedUserAnswer.includes('c')
        break
        
      default:
        isAnswerCorrect = normalizedUserAnswer === normalizedSolution ||
                         normalizedUserAnswer === normalizedSolution.replace(/\s/g, '')
    }
    
    setIsCorrect(isAnswerCorrect)
    setHasAttempted(true)
  }

  const showSolutionClick = () => {
    setShowSolution(true)
  }

  const resetExample = () => {
    setUserAnswer("")
    setShowSolution(false)
    setIsCorrect(null)
    setHasAttempted(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800 border-green-300"
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "hard": return "bg-red-100 text-red-800 border-red-300"
      default: return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "🌱"
      case "medium": return "🌟"
      case "hard": return "💎"
      default: return "⭐"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Lightbulb className="w-8 h-8 text-yellow-600" />
          <h3 className="text-2xl font-bold text-yellow-800">Ejemplos Mágicos</h3>
          <Sparkles className="w-8 h-8 text-pink-600" />
        </div>
        <p className="text-lg text-yellow-700">
          ✨ Practica con estos ejemplos y domina el poder de las antiderivadas ✨
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Ejemplos */}
        <div className="space-y-4">
          <Card className="p-4 bg-white/90 backdrop-blur">
            <h4 className="font-semibold mb-3 text-purple-800 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Ejemplos Disponibles
            </h4>
            <div className="space-y-2">
              {examples.map((example, index) => (
                <Button
                  key={example.id}
                  onClick={() => {
                    setSelectedExample(index)
                    resetExample()
                  }}
                  variant={selectedExample === index ? "default" : "outline"}
                  className="w-full justify-start"
                >
                  <div className="flex items-center gap-2">
                    <span>{example.fairyName}</span>
                    <Badge className={`text-xs ${getDifficultyColor(example.difficulty)}`}>
                      {getDifficultyIcon(example.difficulty)} {example.difficulty}
                    </Badge>
                  </div>
                </Button>
              ))}
            </div>
          </Card>
        </div>

        {/* Ejemplo Actual */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <Gem className="w-8 h-8 text-purple-600" />
              <div>
                <h4 className="text-xl font-bold text-purple-800">{currentExample.fairyName}</h4>
                <Badge className={`text-xs ${getDifficultyColor(currentExample.difficulty)}`}>
                  {getDifficultyIcon(currentExample.difficulty)} {currentExample.difficulty}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-white/80 rounded-lg border border-purple-300">
                <h5 className="font-semibold text-purple-800 mb-2">Problema:</h5>
                <div className="text-2xl font-mono text-center text-purple-700 bg-purple-100 p-3 rounded">
                  {currentExample.problem}
                </div>
              </div>

              <div className="p-4 bg-white/80 rounded-lg border border-purple-300">
                <h5 className="font-semibold text-purple-800 mb-2">Tu Respuesta:</h5>
                
                {/* Mensaje de ayuda desplegable */}
                <div className="mb-3">
                  <Button
                    onClick={() => setShowFormatHelp(!showFormatHelp)}
                    variant="outline"
                    size="sm"
                    className="w-full justify-between bg-blue-50 border-blue-200 hover:bg-blue-100"
                  >
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-800">💡 Formato sugerido</span>
                    </div>
                    {showFormatHelp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                  
                  {showFormatHelp && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-700">
                        {currentExample.id === "basic_power" && "Usa: x^3/3 + C (o x³/3 + C)"}
                        {currentExample.id === "exponential" && "Usa: e^x + C (o eˣ + C)"}
                        {currentExample.id === "trigonometric" && "Usa: -cos(x) + C"}
                        {currentExample.id === "polynomial" && "Usa: x^3 + x^2 + x + C (o x³ + x² + x + C)"}
                        {currentExample.id === "advanced_trig" && "Usa: tan(x) + C"}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mb-3">
                  <Input
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Escribe tu respuesta aquí..."
                    className="flex-1"
                  />
                  <Button onClick={checkAnswer} disabled={!userAnswer.trim()}>
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Retroalimentación específica */}
                {hasAttempted && (
                  <div className={`p-3 rounded-lg border ${
                    isCorrect 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className={`font-semibold ${
                        isCorrect ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {isCorrect ? '¡Correcto!' : 'Incorrecto'}
                      </span>
                    </div>
                    <p className={`text-sm ${
                      isCorrect ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {isCorrect 
                        ? '¡Excelente! Has aplicado correctamente la regla de integración. Recuerda que la constante C es fundamental en las integrales indefinidas.'
                        : 'No te preocupes, las integrales requieren práctica. Revisa los pasos y recuerda incluir la constante C. Puedes ver la solución para aprender el método correcto.'
                      }
                    </p>
                  </div>
                )}
                
                {/* Botón Ver Solución */}
                <div className="flex gap-2 mt-3">
                  <Button 
                    onClick={showSolutionClick} 
                    variant="outline" 
                    className="flex-1"
                    disabled={showSolution}
                  >
                    {showSolution ? 'Solución Visible' : 'Ver Solución'}
                  </Button>
                  <Button 
                    onClick={resetExample} 
                    variant="outline" 
                    size="sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {showSolution && (
                <div className="p-4 bg-white/80 rounded-lg border border-purple-300">
                  <div className="flex items-center gap-2 mb-3">
                    <h5 className="font-semibold text-purple-800">Solución:</h5>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                      Solución Revelada
                    </Badge>
                  </div>
                  
                  <div className="text-2xl font-mono text-center text-purple-700 bg-purple-100 p-3 rounded mb-4">
                    {currentExample.solution}
                  </div>

                  <div className="space-y-2">
                    <h6 className="font-semibold text-purple-800">Pasos Detallados:</h6>
                    {currentExample.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-purple-700">
                        <span className="bg-purple-200 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button onClick={resetExample} variant="outline" className="flex-1">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Nuevo Ejemplo
                    </Button>
                    <Button 
                      onClick={() => setSelectedExample((selectedExample + 1) % examples.length)}
                      className="flex-1"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Consejos */}
          <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              <h5 className="font-semibold text-yellow-800">Consejos de las Hadas</h5>
            </div>
            <div className="text-sm text-yellow-700 space-y-2">
              <p>💫 <strong>Recuerda:</strong> Siempre incluye la constante C en tu respuesta</p>
              <p>🌟 <strong>Tip:</strong> Verifica tu respuesta derivando para confirmar</p>
              <p>✨ <strong>Mágico:</strong> Las antiderivadas son familias de funciones</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
