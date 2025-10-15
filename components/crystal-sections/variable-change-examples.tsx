"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Lightbulb, Wand2, Sparkles, Crown, Gem, CheckCircle, XCircle, RotateCcw } from "lucide-react"

interface Example {
  id: string
  title: string
  problem: string
  solution: string
  steps: string[]
  fairyName: string
  color: string
  difficulty: "easy" | "medium" | "hard"
  substitution: string
}

export function VariableChangeExamples() {
  const [selectedExample, setSelectedExample] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [showSolution, setShowSolution] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [hasAttempted, setHasAttempted] = useState(false)

  const examples: Example[] = [
    {
      id: "basic_linear",
      title: "Transformación Lineal",
      problem: "∫ (2x + 1)³ · 2 dx",
      solution: "(2x + 1)⁴/4 + C",
      steps: [
        "Identificar sustitución: u = 2x + 1",
        "Calcular du: du/dx = 2 → du = 2 dx",
        "Sustituir: ∫ u³ du",
        "Integrar: u⁴/4 + C",
        "Sustituir de vuelta: (2x + 1)⁴/4 + C"
      ],
      fairyName: "🌺 Hada Lineal",
      color: "#FF6B6B",
      difficulty: "easy",
      substitution: "u = 2x + 1"
    },
    {
      id: "quadratic",
      title: "Poder Cuadrático",
      problem: "∫ x · (x² + 1)⁴ dx",
      solution: "(x² + 1)⁵/10 + C",
      steps: [
        "Identificar sustitución: u = x² + 1",
        "Calcular du: du/dx = 2x → du = 2x dx",
        "Ajustar: x dx = du/2",
        "Sustituir: ∫ u⁴ · (du/2) = (1/2)∫ u⁴ du",
        "Integrar: (1/2) · u⁵/5 + C = u⁵/10 + C",
        "Sustituir de vuelta: (x² + 1)⁵/10 + C"
      ],
      fairyName: "🌟 Hada Cuadrática",
      color: "#4ECDC4",
      difficulty: "medium",
      substitution: "u = x² + 1"
    },
    {
      id: "exponential",
      title: "Crecimiento Exponencial",
      problem: "∫ eˣ · (eˣ + 1)² dx",
      solution: "(eˣ + 1)³/3 + C",
      steps: [
        "Identificar sustitución: u = eˣ + 1",
        "Calcular du: du/dx = eˣ → du = eˣ dx",
        "Sustituir: ∫ u² du",
        "Integrar: u³/3 + C",
        "Sustituir de vuelta: (eˣ + 1)³/3 + C"
      ],
      fairyName: "✨ Hada Exponencial",
      color: "#45B7D1",
      difficulty: "medium",
      substitution: "u = eˣ + 1"
    },
    {
      id: "trigonometric",
      title: "Ondas Mágicas",
      problem: "∫ sin(x) · cos(x) dx",
      solution: "sin²(x)/2 + C",
      steps: [
        "Identificar sustitución: u = sin(x)",
        "Calcular du: du/dx = cos(x) → du = cos(x) dx",
        "Sustituir: ∫ u du",
        "Integrar: u²/2 + C",
        "Sustituir de vuelta: sin²(x)/2 + C"
      ],
      fairyName: "🌊 Hada Ondulante",
      color: "#96CEB4",
      difficulty: "medium",
      substitution: "u = sin(x)"
    },
    {
      id: "advanced_trig",
      title: "Trigonometría Avanzada",
      problem: "∫ sin(x) · cos²(x) dx",
      solution: "-cos³(x)/3 + C",
      steps: [
        "Identificar sustitución: u = cos(x)",
        "Calcular du: du/dx = -sin(x) → du = -sin(x) dx",
        "Ajustar: sin(x) dx = -du",
        "Sustituir: ∫ u² · (-du) = -∫ u² du",
        "Integrar: -u³/3 + C",
        "Sustituir de vuelta: -cos³(x)/3 + C"
      ],
      fairyName: "🌟 Hada Trigonométrica",
      color: "#9370DB",
      difficulty: "hard",
      substitution: "u = cos(x)"
    }
  ]

  const currentExample = examples[selectedExample]

  const checkAnswer = () => {
    const normalizedUserAnswer = userAnswer.trim().toLowerCase()
    const normalizedSolution = currentExample.solution.toLowerCase()
    
    // Verificar si la respuesta es correcta (considerando variaciones)
    const isAnswerCorrect = normalizedUserAnswer === normalizedSolution ||
                           normalizedUserAnswer === normalizedSolution.replace(/\s/g, '') ||
                           normalizedUserAnswer.includes('(2x + 1)⁴/4') && normalizedUserAnswer.includes('c') ||
                           normalizedUserAnswer.includes('(x² + 1)⁵/10') && normalizedUserAnswer.includes('c') ||
                           normalizedUserAnswer.includes('(eˣ + 1)³/3') && normalizedUserAnswer.includes('c') ||
                           normalizedUserAnswer.includes('sin²(x)/2') && normalizedUserAnswer.includes('c') ||
                           normalizedUserAnswer.includes('-cos³(x)/3') && normalizedUserAnswer.includes('c')
    
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
          <Wand2 className="w-8 h-8 text-pink-600" />
          <h3 className="text-2xl font-bold text-pink-800">Transformaciones Mágicas</h3>
          <Sparkles className="w-8 h-8 text-purple-600" />
        </div>
        <p className="text-lg text-pink-700">
          ✨ Practica el arte de la transformación y domina el cambio de variable ✨
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Ejemplos */}
        <div className="space-y-4">
          <Card className="p-4 bg-white/90 backdrop-blur">
            <h4 className="font-semibold mb-3 text-pink-800 flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Transformaciones Disponibles
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
          <Card className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200">
            <div className="flex items-center gap-3 mb-4">
              <Gem className="w-8 h-8 text-pink-600" />
              <div>
                <h4 className="text-xl font-bold text-pink-800">{currentExample.fairyName}</h4>
                <Badge className={`text-xs ${getDifficultyColor(currentExample.difficulty)}`}>
                  {getDifficultyIcon(currentExample.difficulty)} {currentExample.difficulty}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-white/80 rounded-lg border border-pink-300">
                <h5 className="font-semibold text-pink-800 mb-2">Problema:</h5>
                <div className="text-2xl font-mono text-center text-pink-700 bg-pink-100 p-3 rounded">
                  {currentExample.problem}
                </div>
              </div>

              <div className="p-4 bg-white/80 rounded-lg border border-pink-300">
                <h5 className="font-semibold text-pink-800 mb-2">Sustitución Sugerida:</h5>
                <div className="text-lg font-mono text-center text-pink-700 bg-pink-100 p-2 rounded">
                  {currentExample.substitution}
                </div>
              </div>

              <div className="p-4 bg-white/80 rounded-lg border border-pink-300">
                <h5 className="font-semibold text-pink-800 mb-2">Tu Respuesta:</h5>
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
                        ? '¡Excelente! Has aplicado correctamente el cambio de variable. La transformación mágica ha funcionado perfectamente.'
                        : 'No te preocupes, el cambio de variable requiere práctica. Revisa los pasos de transformación y recuerda incluir la constante C. Puedes ver la solución para aprender el método correcto.'
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
                <div className="p-4 bg-white/80 rounded-lg border border-pink-300">
                  <div className="flex items-center gap-2 mb-3">
                    <h5 className="font-semibold text-pink-800">Solución:</h5>
                    <Badge className="bg-pink-100 text-pink-800 border-pink-300">
                      Solución Revelada
                    </Badge>
                  </div>
                  
                  <div className="text-2xl font-mono text-center text-pink-700 bg-pink-100 p-3 rounded mb-4">
                    {currentExample.solution}
                  </div>

                  <div className="space-y-2">
                    <h6 className="font-semibold text-pink-800">Pasos de la Transformación:</h6>
                    {currentExample.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-pink-700">
                        <span className="bg-pink-200 text-pink-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
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
              <p>💫 <strong>Identifica patrones:</strong> Busca funciones dentro de otras funciones</p>
              <p>🌟 <strong>Calcula du cuidadosamente:</strong> No olvides el dx en tu sustitución</p>
              <p>✨ <strong>Verifica tu respuesta:</strong> Deriva para confirmar que es correcta</p>
              <p>🔮 <strong>Practica mucho:</strong> El cambio de variable se vuelve intuitivo con la práctica</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
