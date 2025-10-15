"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Star, Sparkles, Crown, Gem, Wand2 } from "lucide-react"

export function IndefiniteIntegralsTheory() {
  return (
    <div className="space-y-6">
      {/* Concepto Principal */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <Crown className="w-8 h-8 text-purple-600" />
          <h3 className="text-2xl font-bold text-purple-800">¿Qué son las Integrales Indefinidas?</h3>
        </div>
        <p className="text-lg text-purple-700 leading-relaxed">
          Las integrales indefinidas son como encontrar la "familia" de funciones que, al derivarlas, 
          nos dan la función original. Es el proceso inverso de la derivación.
        </p>
        <div className="mt-4 p-4 bg-white/80 rounded-lg border border-purple-300">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-800 mb-2">∫ f(x) dx = F(x) + C</div>
            <p className="text-purple-700">
              Donde F(x) es una antiderivada de f(x) y C es la constante de integración
            </p>
          </div>
        </div>
      </Card>

      {/* Propiedades Fundamentales */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <Star className="w-8 h-8 text-blue-600" />
          <h3 className="text-2xl font-bold text-blue-800">Propiedades Mágicas del Cristal</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/80 rounded-lg border border-blue-300">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Gem className="w-5 h-5" />
              Linealidad
            </h4>
            <div className="text-center text-lg font-mono text-blue-700">
              ∫[f(x) + g(x)] dx = ∫f(x) dx + ∫g(x) dx
            </div>
          </div>
          
          <div className="p-4 bg-white/80 rounded-lg border border-blue-300">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Wand2 className="w-5 h-5" />
              Constante
            </h4>
            <div className="text-center text-lg font-mono text-blue-700">
              ∫k·f(x) dx = k·∫f(x) dx
            </div>
          </div>
        </div>
      </Card>

      {/* Fórmulas Básicas */}
      <Card className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 text-pink-600" />
          <h3 className="text-2xl font-bold text-pink-800">Fórmulas del Poder</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="p-3 bg-white/80 rounded-lg border border-pink-300">
              <div className="text-center">
                <div className="text-lg font-mono text-pink-700">∫ xⁿ dx = xⁿ⁺¹/(n+1) + C</div>
                <p className="text-sm text-pink-600">(n ≠ -1)</p>
              </div>
            </div>
            
            <div className="p-3 bg-white/80 rounded-lg border border-pink-300">
              <div className="text-center">
                <div className="text-lg font-mono text-pink-700">∫ eˣ dx = eˣ + C</div>
              </div>
            </div>
            
            <div className="p-3 bg-white/80 rounded-lg border border-pink-300">
              <div className="text-center">
                <div className="text-lg font-mono text-pink-700">∫ sin(x) dx = -cos(x) + C</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-white/80 rounded-lg border border-pink-300">
              <div className="text-center">
                <div className="text-lg font-mono text-pink-700">∫ 1/x dx = ln|x| + C</div>
              </div>
            </div>
            
            <div className="p-3 bg-white/80 rounded-lg border border-pink-300">
              <div className="text-center">
                <div className="text-lg font-mono text-pink-700">∫ cos(x) dx = sin(x) + C</div>
              </div>
            </div>
            
            <div className="p-3 bg-white/80 rounded-lg border border-pink-300">
              <div className="text-center">
                <div className="text-lg font-mono text-pink-700">∫ sec²(x) dx = tan(x) + C</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* La Constante C */}
      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
        <div className="flex items-center gap-3 mb-4">
          <Crown className="w-8 h-8 text-yellow-600" />
          <h3 className="text-2xl font-bold text-yellow-800">El Misterio de la Constante C</h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-lg text-yellow-700 leading-relaxed">
            La constante C es como el "poder oculto" de cada antiderivada. Representa que hay infinitas 
            funciones que pueden ser antiderivadas de la misma función original.
          </p>
          
          <div className="p-4 bg-white/80 rounded-lg border border-yellow-300">
            <h4 className="font-semibold text-yellow-800 mb-2">¿Por qué existe C?</h4>
            <p className="text-yellow-700 text-sm">
              Si F(x) es una antiderivada de f(x), entonces F(x) + C también lo es, porque:
            </p>
            <div className="text-center mt-2">
              <div className="text-lg font-mono text-yellow-800">
                d/dx[F(x) + C] = F'(x) + 0 = f(x)
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
              ✨ Infinitas posibilidades
            </Badge>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
              🔮 Poder oculto
            </Badge>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
              🌟 Familia de funciones
            </Badge>
          </div>
        </div>
      </Card>

      {/* Interpretación Geométrica */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 text-green-600" />
          <h3 className="text-2xl font-bold text-green-800">Interpretación Geométrica</h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-lg text-green-700 leading-relaxed">
            Las integrales indefinidas representan <strong>familias de curvas</strong> que son 
            traslaciones verticales unas de otras. Cada valor de C desplaza la curva hacia arriba o abajo.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/80 rounded-lg border border-green-300">
              <h4 className="font-semibold text-green-800 mb-2">Ejemplo Visual</h4>
              <p className="text-green-700 text-sm mb-2">
                Para f(x) = x², la familia de antiderivadas es:
              </p>
              <div className="text-center text-lg font-mono text-green-800">
                F(x) = x³/3 + C
              </div>
              <p className="text-green-600 text-xs mt-2">
                Donde C puede ser cualquier número real
              </p>
            </div>
            
            <div className="p-4 bg-white/80 rounded-lg border border-green-300">
              <h4 className="font-semibold text-green-800 mb-2">Significado</h4>
              <p className="text-green-700 text-sm">
                Cada curva de la familia tiene la misma forma, pero está desplazada verticalmente 
                según el valor de C. Es como tener infinitas copias de la misma función, 
                cada una en una "altura" diferente.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
