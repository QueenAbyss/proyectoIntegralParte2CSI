"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Eye, Lightbulb, Wand2, Sparkles, Crown, Gem } from "lucide-react"
import { VariableChangeTheory } from "./variable-change-theory"
import { VariableChangeVisualization } from "./variable-change-visualization"
import { VariableChangeExamples } from "./variable-change-examples"

export function VariableChangeSection() {
  const [activeSubTab, setActiveSubTab] = useState("theory")

  return (
    <div className="space-y-6">
      {/* Header de la sección */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Wand2 className="w-10 h-10 text-pink-600" />
          <h2 className="text-3xl font-bold text-pink-800">Cambio de Variable</h2>
          <Sparkles className="w-10 h-10 text-purple-600 animate-pulse" />
        </div>
        <p className="text-lg text-pink-700 max-w-2xl mx-auto">
          ✨ Aprende el arte de la transformación mágica que simplifica las integrales más complejas ✨
        </p>
      </div>

      {/* Navegación por sub-pestañas */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/90 backdrop-blur-sm border-2 border-pink-300 rounded-xl p-2">
          <TabsTrigger 
            value="theory" 
            className="flex items-center gap-2 data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800 data-[state=active]:shadow-md"
          >
            <BookOpen className="w-4 h-4" />
            <span className="font-semibold">Teoría</span>
          </TabsTrigger>
          <TabsTrigger 
            value="visualization" 
            className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800 data-[state=active]:shadow-md"
          >
            <Eye className="w-4 h-4" />
            <span className="font-semibold">Visualización</span>
          </TabsTrigger>
          <TabsTrigger 
            value="examples" 
            className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 data-[state=active]:shadow-md"
          >
            <Lightbulb className="w-4 h-4" />
            <span className="font-semibold">Ejemplos</span>
          </TabsTrigger>
        </TabsList>

        {/* Contenido de Teoría */}
        <TabsContent value="theory" className="mt-6">
          <VariableChangeTheory />
        </TabsContent>

        {/* Contenido de Visualización */}
        <TabsContent value="visualization" className="mt-6">
          <VariableChangeVisualization />
        </TabsContent>

        {/* Contenido de Ejemplos */}
        <TabsContent value="examples" className="mt-6">
          <VariableChangeExamples />
        </TabsContent>
      </Tabs>
    </div>
  )
}
