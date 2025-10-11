"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, BookOpen, Eye, Lightbulb } from "lucide-react"
import { TheorySection } from "./mean-value-theorem/theory-section"
import { VisualizationSection } from "./mean-value-theorem/visualization-section"
import { ExamplesSection } from "./mean-value-theorem/examples-section"

export function MeanValueTower() {
  const [mainTab, setMainTab] = useState("teoria")
  const [subTab, setSubTab] = useState("teoria")
  const [mvtTimerState, setMvtTimerState] = useState({
    startTime: null as number | null,
    elapsedTime: 0,
    isRunning: false,
  })

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
                  />
                )}
                {subTab === "ejemplos" && <ExamplesSection />}
              </div>
            </TabsContent>

            <TabsContent value="teorema-fundamental" className="p-6">
              <div className="text-center py-12">
                <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Próximamente: 2do Teorema Fundamental
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Esta sección estará disponible en futuras actualizaciones
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}