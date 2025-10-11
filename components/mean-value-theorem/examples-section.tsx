"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Lightbulb } from "lucide-react"

interface Example {
  id: string
  title: string
  description: string
  equation: string
  interval: [number, number]
  cValue: string
  insight: string
}

export function ExamplesSection() {
  const examples: Example[] = [
    {
      id: "quadratic",
      title: "Función Cuadrática Simétrica",
      description: "Una parábola centrada en el origen",
      equation: "x**2",
      interval: [-2, 2],
      cValue: "c = 0 (en el centro)",
      insight: "En funciones simétricas, el punto c está exactamente en el medio del intervalo."
    },
    {
      id: "cubic",
      title: "Función Cúbica Asimétrica",
      description: "Una curva con crecimiento acelerado",
      equation: "x**3",
      interval: [0, 2],
      cValue: "c ≈ 1.15",
      insight: "El punto c NO está en el medio porque la función crece más rápido al final."
    },
    {
      id: "trigonometric",
      title: "Función Trigonométrica",
      description: "Una onda sinusoidal",
      equation: "Math.sin(x)",
      interval: [0, Math.PI],
      cValue: "c ≈ π/2",
      insight: "En funciones trigonométricas, c se encuentra donde la derivada es máxima."
    },
    {
      id: "linear",
      title: "Función Lineal",
      description: "Una línea recta",
      equation: "2*x + 1",
      interval: [0, 3],
      cValue: "c = cualquier punto",
      insight: "En funciones lineales, cualquier punto c cumple el teorema porque la pendiente es constante."
    }
  ]

  const handleLoadExample = (example: Example) => {
    // Esta función se conectaría con el sistema de visualizaciones
    // Por ahora solo mostramos un mensaje
    console.log("Cargando ejemplo:", example.title)
    // En una implementación completa, esto cambiaría los parámetros
    // de la sección de visualizaciones automáticamente
  }

  return (
    <div className="space-y-6">
      {/* Header de la sección */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Ejemplos Mágicos
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Haz clic en un ejemplo para cargarlo y explorar cómo funciona el teorema
          </p>
        </div>
      </div>

      {/* Grid de ejemplos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {examples.map((example) => (
          <Card key={example.id} className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Header del ejemplo */}
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                    {example.title}
                  </h3>
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
                  <span className="text-sm text-gray-600 dark:text-gray-400">Valor de c:</span>
                  <Badge variant="outline" className="font-mono">
                    {example.cValue}
                  </Badge>
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Cargar ejemplo
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Información adicional */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
              ¿Cómo usar los ejemplos?
            </h3>
            <div className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
              <p>1. <strong>Selecciona un ejemplo</strong> que te interese explorar</p>
              <p>2. <strong>Haz clic en "Cargar ejemplo"</strong> para configurar automáticamente los parámetros</p>
              <p>3. <strong>Ve a la pestaña "Visualizaciones"</strong> para interactuar con el ejemplo</p>
              <p>4. <strong>Estima el valor de c</strong> haciendo clic en la gráfica o torre</p>
              <p>5. <strong>Verifica tu respuesta</strong> y aprende del feedback</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
