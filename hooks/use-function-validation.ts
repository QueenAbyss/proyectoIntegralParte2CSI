"use client"

import { useState, useCallback } from "react"

export function useFunctionValidation() {
  const [error, setError] = useState("")

  const validateFunction = useCallback((func: string, a: number, b: number) => {
    try {
      const testFunc = new Function("x", `return ${func}`)
      const testValue = testFunc(1)
      
      if (!isFinite(testValue)) {
        setError("Error: La función produce valores no finitos.")
        return false
      }
      
      const numPoints = 20
      const step = (b - a) / numPoints
      
      for (let i = 0; i <= numPoints; i++) {
        const x = a + i * step
        const y = testFunc(x)
        
        if (!isFinite(y)) {
          setError(`Error: La función tiene una discontinuidad en x ≈ ${x.toFixed(2)}`)
          return false
        }
        
        if (Math.abs(y) > 1e6) {
          setError(`Error: La función tiene valores muy grandes cerca de x ≈ ${x.toFixed(2)}`)
          return false
        }
      }
      
      setError("")
      return true
    } catch {
      setError("Error: Función inválida. Verifica la sintaxis.")
      return false
    }
  }, [])

  return { error, validateFunction, setError }
}
