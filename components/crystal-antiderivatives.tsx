"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Wand2, BookOpen, Eye, Lightbulb, Star, Crown, Gem } from "lucide-react"
import { IndefiniteIntegralsSection } from "./crystal-sections/indefinite-integrals-section"
import { VariableChangeSection } from "./crystal-sections/variable-change-section"

interface CrystalAntiderivativesProps {
  width?: number
  height?: number
}

export function CrystalAntiderivatives({ 
  width = 800, 
  height = 500 
}: CrystalAntiderivativesProps) {
  const [activeTab, setActiveTab] = useState("indefinite")

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header con temática de hadas */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gem className="w-12 h-12 text-purple-600 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              El Cristal Mágico de Antiderivadas
            </h1>
            <Sparkles className="w-12 h-12 text-pink-600 animate-bounce" />
          </div>
          <p className="text-xl text-purple-700 mb-6 max-w-3xl mx-auto">
            ✨ Descubre los secretos de las integrales indefinidas y el cambio de variable 
            con la ayuda de las hadas matemáticas ✨
          </p>
          
          {/* Información del cristal */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-purple-300 p-6 shadow-lg max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Wand2 className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-bold text-purple-800">Cristal de Poder Matemático</h2>
              <Crown className="w-8 h-8 text-yellow-600" />
            </div>
            <p className="text-purple-700 text-lg leading-relaxed">
              Este cristal mágico contiene dos poderes fundamentales: las <strong>Integrales Indefinidas</strong> 
              que revelan familias de antiderivadas, y el <strong>Cambio de Variable</strong> que transforma 
              funciones complejas en formas más simples. Cada poder tiene su propia teoría, visualizaciones 
              interactivas y ejemplos prácticos.
            </p>
          </div>
        </div>

        {/* Navegación por pestañas */}
        <div className="mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/90 backdrop-blur-sm border-2 border-purple-300 rounded-xl p-2">
              <TabsTrigger 
                value="indefinite" 
                className="flex items-center gap-3 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800 data-[state=active]:shadow-md"
              >
                <Star className="w-5 h-5" />
                <span className="font-semibold">Integrales Indefinidas</span>
              </TabsTrigger>
              <TabsTrigger 
                value="variable" 
                className="flex items-center gap-3 data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800 data-[state=active]:shadow-md"
              >
                <Wand2 className="w-5 h-5" />
                <span className="font-semibold">Cambio de Variable</span>
              </TabsTrigger>
            </TabsList>

            {/* Contenido de Integrales Indefinidas */}
            <TabsContent value="indefinite" className="mt-6">
              <IndefiniteIntegralsSection />
            </TabsContent>

            {/* Contenido de Cambio de Variable */}
            <TabsContent value="variable" className="mt-6">
              <VariableChangeSection />
            </TabsContent>
          </Tabs>
        </div>

      </div>
    </div>
  )
}