"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, BookOpen, Eye, Lightbulb } from "lucide-react"
import { TheorySection } from "./mean-value-theorem/theory-section"
import { VisualizationSection } from "./mean-value-theorem/visualization-section"
import { ExamplesSection } from "./mean-value-theorem/examples-section"
import { FundamentalTheoremVisualization } from "./fundamental-theorem/visualization-section"
import { FundamentalTheoremExamples } from "./fundamental-theorem/examples-section"

export function MeanValueTower() {
  const [mainTab, setMainTab] = useState("teoria")
  const [subTab, setSubTab] = useState("teoria")
  const [mvtTimerState, setMvtTimerState] = useState({
    startTime: null as number | null,
    elapsedTime: 0,
    isRunning: false,
  })
  
  // Estado compartido para ejemplos
  const [exampleData, setExampleData] = useState<{
    functionType: "quadratic" | "cubic" | "sin" | "custom"
    customFunction: string
    a: number
    b: number
  } | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20">
      {/* Header Mágico */}
      <div className="relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-32 left-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-500"></div>
          <div className="absolute top-16 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-pulse delay-700"></div>
          <div className="absolute top-24 left-2/3 w-2 h-2 bg-green-400 rounded-full animate-pulse delay-300"></div>
        </div>

        {/* Contenido del header */}
        <div className="relative z-10 text-center py-8 px-4">
          {/* Icono del castillo */}
          <div className="flex justify-center items-center mb-4">
            <div className="relative">
              <div className="w-8 h-8 bg-black rounded-sm transform rotate-45"></div>
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-white rounded-full"></div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Título principal */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Torre del Valor Medio
          </h1>
          
          {/* Subtítulo */}
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Bienvenido al reino mágico del cálculo, donde las derivadas e integrales se encuentran en perfecta armonía
          </p>
        </div>
      </div>

      {/* Navegación principal */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-0 shadow-xl">
          <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
            {/* Pestañas principales */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <TabsList className="grid w-full grid-cols-2 bg-transparent h-auto p-0">
                <TabsTrigger 
                  value="teoria" 
                  className="flex items-center gap-2 px-6 py-4 data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
                >
                  <Sparkles className="w-4 h-4" />
                  Teorema del Valor Medio
                </TabsTrigger>
                <TabsTrigger 
                  value="teorema-fundamental" 
                  className="flex items-center gap-2 px-6 py-4 data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
                >
                  <BookOpen className="w-4 h-4" />
                  2do Teorema Fundamental
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Contenido de las pestañas */}
            <TabsContent value="teoria" className="p-0">
              <div className="p-6">
                {/* Navegación secundaria para MVT */}
                <div className="mb-6">
                  <Tabs value={subTab} onValueChange={setSubTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-gray-50 dark:bg-gray-800">
                      <TabsTrigger value="teoria" className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Teoría
                      </TabsTrigger>
                      <TabsTrigger value="visualizaciones" className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Visualizaciones
                      </TabsTrigger>
                      <TabsTrigger value="ejemplos" className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Ejemplos
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Contenido según la pestaña activa */}
                {subTab === "teoria" && <TheorySection />}
                {subTab === "visualizaciones" && (
                  <VisualizationSection 
                    timerState={mvtTimerState}
                    setTimerState={setMvtTimerState}
                    exampleData={exampleData}
                    onExampleLoaded={setExampleData}
                  />
                )}
                {subTab === "ejemplos" && (
                  <ExamplesSection 
                    onLoadExample={(data) => {
                      setExampleData(data)
                      setSubTab("visualizaciones") // Cambiar automáticamente a visualizaciones
                    }}
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent value="teorema-fundamental" className="p-0">
              <div className="p-6">
                {/* Navegación secundaria para Segundo Teorema Fundamental */}
                <div className="mb-6">
                  <Tabs value={subTab} onValueChange={setSubTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-gray-50 dark:bg-gray-800">
                      <TabsTrigger value="teoria" className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Teoría
                      </TabsTrigger>
                      <TabsTrigger value="visualizaciones" className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Visualizaciones
                      </TabsTrigger>
                      <TabsTrigger value="ejemplos" className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Ejemplos
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Contenido según la pestaña activa */}
                {subTab === "teoria" && (
                  <div className="space-y-8">
                    {/* Header */}
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-purple-800 dark:text-purple-200 mb-2">
                        Segundo Teorema Fundamental del Cálculo
                      </h2>
                      <p className="text-lg text-purple-600 dark:text-purple-300">
                        La conexión entre derivadas e integrales
                      </p>
                    </div>

                {/* Enunciado */}
                <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    Enunciado
                  </h3>
                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Si <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">f</span> es continua en <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">[a, b]</span> y <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">F</span> es una antiderivada de <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">f</span> en <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">[a, b]</span>, entonces:
                    </p>
                    
                    {/* Fórmula principal */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-700">
                      <div className="text-center">
                        <div className="text-2xl font-mono text-blue-800 dark:text-blue-300">
                          ∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) - F(a)
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* ¿Qué es una Antiderivada? */}
                <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    ¿Qué es una Antiderivada?
                  </h3>
                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">F(x)</span> es una antiderivada de <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">f(x)</span> si <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">F'(x) = f(x)</span>. Es decir, cuando derivas <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">F</span>, obtienes <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">f</span>.
                    </p>
                  </div>
                </Card>

                {/* La magia del teorema */}
                <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    La magia del teorema
                  </h3>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-yellow-300 dark:border-yellow-700">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-center font-medium">
                      En lugar de sumar infinitos rectángulos para calcular el área, solo necesitas encontrar <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">F(x)</span> y calcular <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">F(b) - F(a)</span>.
                    </p>
                  </div>
                </Card>

                {/* Ejemplos de Antiderivadas */}
                <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    Ejemplos de Antiderivadas
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Si f(x) = x</p>
                        <div className="font-mono text-lg text-purple-800 dark:text-purple-200">
                          F(x) = x²/2
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Si f(x) = x²</p>
                        <div className="font-mono text-lg text-purple-800 dark:text-purple-200">
                          F(x) = x³/3
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Si f(x) = sin(x)</p>
                        <div className="font-mono text-lg text-purple-800 dark:text-purple-200">
                          F(x) = -cos(x)
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* ¿Por qué funciona? */}
                <Card className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border-indigo-200 dark:border-indigo-800">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    ¿Por qué funciona?
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    El teorema conecta dos operaciones inversas: derivar e integrar. Si <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">F'(x) = f(x)</span>, entonces integrar <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">f</span> te devuelve <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">F</span> (más una constante que se cancela al restar).
                  </p>
                </Card>
                  </div>
                )}

                {/* Sección de Visualizaciones */}
                {subTab === "visualizaciones" && (
                  <FundamentalTheoremVisualization 
                    timerState={mvtTimerState}
                    setTimerState={setMvtTimerState}
                    exampleData={exampleData}
                    onExampleLoaded={setExampleData}
                  />
                )}

                {/* Sección de Ejemplos */}
                {subTab === "ejemplos" && (
                  <FundamentalTheoremExamples 
                    onLoadExample={(data) => {
                      setExampleData(data)
                      setSubTab("visualizaciones") // Cambiar automáticamente a visualizaciones
                    }}
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}