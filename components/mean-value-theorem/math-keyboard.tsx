"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface MathKeyboardProps {
  onInput: (value: string) => void
  onDelete: () => void
  onClear: () => void
  currentValue: string
}

export function MathKeyboard({ onInput, onDelete, onClear }: MathKeyboardProps) {
  const keys = [
    ["(", ")", "x", "^", "^2", "^3"],
    ["7", "8", "9", "/", "*", "-"],
    ["4", "5", "6", "+", ".", "π"],
    ["1", "2", "3", "sin", "cos", "ln"],
    ["0", "⌫", "C", "sqrt", "Math.PI", "**"],
  ]

  const handleKeyClick = (key: string) => {
    if (key === "⌫") {
      onDelete()
    } else if (key === "C") {
      onClear()
    } else if (key === "^2") {
      onInput("^2")
    } else if (key === "^3") {
      onInput("^3")
    } else if (key === "sqrt") {
      onInput("Math.sqrt(")
    } else if (key === "sin") {
      onInput("Math.sin(")
    } else if (key === "cos") {
      onInput("Math.cos(")
    } else if (key === "ln") {
      onInput("Math.log(")
    } else if (key === "π") {
      onInput("Math.PI")
    } else if (key === "^") {
      onInput("**")
    } else {
      onInput(key)
    }
  }

  return (
    <Card className="p-4 bg-gray-50 dark:bg-gray-800">
      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
        Teclado Matemático
      </h4>
      <div className="grid grid-cols-6 gap-2">
        {keys.flat().map((key, index) => (
          <Button
            key={index}
            onClick={() => handleKeyClick(key)}
            variant="outline"
            size="sm"
            className={`h-8 text-xs ${
              key === "⌫" || key === "C"
                ? "bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                : key === "sin" || key === "cos" || key === "ln" || key === "sqrt"
                ? "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            {key}
          </Button>
        ))}
      </div>
    </Card>
  )
}
