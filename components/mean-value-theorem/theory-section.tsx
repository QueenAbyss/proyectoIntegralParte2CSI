"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { Info, Sparkles } from "lucide-react"

export function TheorySection() {
  return (
    <div className="space-y-6">
      {/* Header de la sección */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Teorema del Valor Medio
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Teoría y conceptos fundamentales
          </p>
        </div>
      </div>

      {/* Enunciado del teorema */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Enunciado
        </h3>
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Si <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">f</span> es una función continua en <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">[a, b]</span> y derivable en <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">(a, b)</span>, entonces existe al menos un punto <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">c ∈ (a, b)</span> tal que:
          </p>
          
          {/* Fórmula principal */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-700">
            <div className="text-center">
              <div className="text-2xl font-mono text-blue-800 dark:text-blue-300">
                f'(c) = <span className="text-3xl">f(b) - f(a)</span>
                <div className="text-3xl border-t-2 border-blue-400 w-32 mx-auto mt-2"></div>
                <span className="text-3xl">b - a</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Interpretación Geométrica */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Interpretación Geométrica
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          La derivada en algún punto <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">c</span> es igual a la pendiente de la recta secante que une los puntos <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">(a, f(a))</span> y <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">(b, f(b))</span>. En otras palabras, existe un punto donde la recta tangente es paralela a la recta secante.
        </p>
      </Card>

      {/* Significado Físico */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Significado físico:
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Si <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">f(t)</span> representa la posición de un objeto, entonces existe un instante <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">c</span> donde la velocidad instantánea <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">f'(c)</span> es igual a la velocidad promedio en el intervalo.
        </p>
      </Card>

      {/* Condiciones */}
      <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Condiciones
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">f</span> debe ser continua en <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">[a, b]</span>
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">f</span> debe ser derivable en <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">(a, b)</span>
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700 dark:text-gray-300">
              El punto <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">c</span> está en el interior del intervalo
            </p>
          </div>
        </div>
      </Card>

      {/* Footer mágico */}
      <div className="text-center pt-6">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Sparkles className="w-4 h-4" />
          <span>Creado con magia matemática en la Torre del Valor Medio</span>
        </div>
      </div>
    </div>
  )
}
