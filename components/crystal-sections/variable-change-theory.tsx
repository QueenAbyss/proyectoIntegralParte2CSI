"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wand2, Star, Sparkles, Crown, Gem, BookOpen } from "lucide-react"

export function VariableChangeTheory() {
  return (
    <div className="space-y-6">
      {/* Concepto Principal */}
      <Card className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200">
        <div className="flex items-center gap-3 mb-4">
          <Wand2 className="w-8 h-8 text-pink-600" />
          <h3 className="text-2xl font-bold text-pink-800">¿Qué es el Cambio de Variable?</h3>
        </div>
        <p className="text-lg text-pink-700 leading-relaxed">
          El cambio de variable es una técnica mágica que transforma integrales complejas en formas más simples. 
          Es como usar una varita mágica que convierte funciones difíciles en funciones que sabemos integrar.
        </p>
        <div className="mt-4 p-4 bg-white/80 rounded-lg border border-pink-300">
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-800 mb-2">∫ f(g(x)) · g'(x) dx = ∫ f(u) du</div>
            <p className="text-pink-700">
              Donde u = g(x) y du = g'(x) dx
            </p>
          </div>
        </div>
      </Card>

      {/* Pasos del Proceso Mágico */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <Star className="w-8 h-8 text-blue-600" />
          <h3 className="text-2xl font-bold text-blue-800">Los 4 Pasos de la Transformación</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="p-4 bg-white/80 rounded-lg border border-blue-300">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                <h4 className="font-semibold text-blue-800">Identificar la Sustitución</h4>
              </div>
              <p className="text-blue-700 text-sm">
                Busca una función dentro de otra función. La función interna será tu nueva variable u.
              </p>
            </div>
            
            <div className="p-4 bg-white/80 rounded-lg border border-blue-300">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                <h4 className="font-semibold text-blue-800">Calcular du</h4>
              </div>
              <p className="text-blue-700 text-sm">
                Deriva u con respecto a x para obtener du/dx, luego multiplica por dx para obtener du.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-white/80 rounded-lg border border-blue-300">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                <h4 className="font-semibold text-blue-800">Sustituir</h4>
              </div>
              <p className="text-blue-700 text-sm">
                Reemplaza todas las ocurrencias de la función original con u y dx con du.
              </p>
            </div>
            
            <div className="p-4 bg-white/80 rounded-lg border border-blue-300">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
                <h4 className="font-semibold text-blue-800">Integrar y Sustituir</h4>
              </div>
              <p className="text-blue-700 text-sm">
                Integra con respecto a u, luego sustituye u de vuelta con la función original.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Ejemplo Paso a Paso */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 text-green-600" />
          <h3 className="text-2xl font-bold text-green-800">Ejemplo Mágico</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-white/80 rounded-lg border border-green-300">
            <h4 className="font-semibold text-green-800 mb-2">Problema: ∫ (2x + 1)³ · 2 dx</h4>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="bg-green-200 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <p className="text-green-700 text-sm font-semibold">Identificar sustitución:</p>
                  <div className="text-lg font-mono text-green-800">u = 2x + 1</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="bg-green-200 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <p className="text-green-700 text-sm font-semibold">Calcular du:</p>
                  <div className="text-lg font-mono text-green-800">du/dx = 2 → du = 2 dx</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="bg-green-200 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                <div>
                  <p className="text-green-700 text-sm font-semibold">Sustituir:</p>
                  <div className="text-lg font-mono text-green-800">∫ u³ du</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="bg-green-200 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
                <div>
                  <p className="text-green-700 text-sm font-semibold">Integrar y sustituir:</p>
                  <div className="text-lg font-mono text-green-800">u⁴/4 + C = (2x + 1)⁴/4 + C</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tipos de Sustituciones Comunes */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <Crown className="w-8 h-8 text-purple-600" />
          <h3 className="text-2xl font-bold text-purple-800">Sustituciones Mágicas Comunes</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="p-3 bg-white/80 rounded-lg border border-purple-300">
              <h4 className="font-semibold text-purple-800 mb-2">Función Lineal</h4>
              <div className="text-sm text-purple-700">
                <div className="font-mono">u = ax + b</div>
                <div className="font-mono">du = a dx</div>
              </div>
            </div>
            
            <div className="p-3 bg-white/80 rounded-lg border border-purple-300">
              <h4 className="font-semibold text-purple-800 mb-2">Función Cuadrática</h4>
              <div className="text-sm text-purple-700">
                <div className="font-mono">u = x² + c</div>
                <div className="font-mono">du = 2x dx</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-white/80 rounded-lg border border-purple-300">
              <h4 className="font-semibold text-purple-800 mb-2">Función Trigonométrica</h4>
              <div className="text-sm text-purple-700">
                <div className="font-mono">u = sin(x) o cos(x)</div>
                <div className="font-mono">du = cos(x) dx o -sin(x) dx</div>
              </div>
            </div>
            
            <div className="p-3 bg-white/80 rounded-lg border border-purple-300">
              <h4 className="font-semibold text-purple-800 mb-2">Función Exponencial</h4>
              <div className="text-sm text-purple-700">
                <div className="font-mono">u = eˣ</div>
                <div className="font-mono">du = eˣ dx</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Errores Comunes */}
      <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200">
        <div className="flex items-center gap-3 mb-4">
          <Gem className="w-8 h-8 text-red-600" />
          <h3 className="text-2xl font-bold text-red-800">Trampas Mágicas a Evitar</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-white/80 rounded-lg border border-red-300">
            <h4 className="font-semibold text-red-800 mb-2">❌ Error: Olvidar el du</h4>
            <p className="text-red-700 text-sm">
              Siempre debes incluir el du en tu sustitución. Si no aparece naturalmente, 
              debes multiplicar y dividir por la constante apropiada.
            </p>
          </div>
          
          <div className="p-4 bg-white/80 rounded-lg border border-red-300">
            <h4 className="font-semibold text-red-800 mb-2">❌ Error: No sustituir de vuelta</h4>
            <p className="text-red-700 text-sm">
              Después de integrar con respecto a u, siempre debes sustituir u de vuelta 
              con la función original para obtener la respuesta final.
            </p>
          </div>
          
          <div className="p-4 bg-white/80 rounded-lg border border-red-300">
            <h4 className="font-semibold text-red-800 mb-2">❌ Error: Elegir mal la sustitución</h4>
            <p className="text-red-700 text-sm">
              La sustitución debe simplificar la integral, no complicarla. 
              Si tu sustitución hace la integral más difícil, intenta otra.
            </p>
          </div>
        </div>
      </Card>

      {/* Consejos Finales */}
      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 text-yellow-600" />
          <h3 className="text-2xl font-bold text-yellow-800">Consejos de las Hadas</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💫</span>
            <p className="text-yellow-700">
              <strong>Practica mucho:</strong> El cambio de variable se vuelve más intuitivo con la práctica.
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="text-2xl">🌟</span>
            <p className="text-yellow-700">
              <strong>Verifica tu respuesta:</strong> Deriva tu resultado para confirmar que es correcto.
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="text-2xl">✨</span>
            <p className="text-yellow-700">
              <strong>No te rindas:</strong> Si una sustitución no funciona, intenta otra. 
              La práctica te ayudará a reconocer patrones.
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            🎯 Identifica patrones
          </Badge>
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            🔮 Practica regularmente
          </Badge>
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            🌈 Verifica siempre
          </Badge>
        </div>
      </Card>
    </div>
  )
}
