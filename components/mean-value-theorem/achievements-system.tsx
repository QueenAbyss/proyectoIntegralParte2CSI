"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Star, Award, Zap, Clock } from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  unlocked: boolean
}

interface AchievementsSystemProps {
  achievements: Achievement[]
}

export function AchievementsSystem({ achievements }: AchievementsSystemProps) {
  const getAchievementIcon = (id: string) => {
    switch (id) {
      case "first_estimate":
        return <Target className="w-5 h-5" />
      case "eagle_eye":
        return <Star className="w-5 h-5" />
      case "perfectionist":
        return <Award className="w-5 h-5" />
      case "explorer":
        return <Zap className="w-5 h-5" />
      case "speedster":
        return <Clock className="w-5 h-5" />
      default:
        return <Trophy className="w-5 h-5" />
    }
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800">
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Logros</h3>
      </div>
      <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
        {unlockedCount} de {achievements.length} desbloqueados
      </p>
      
      <div className="grid grid-cols-1 gap-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-3 rounded-lg border transition-all duration-200 ${
              achievement.unlocked
                ? "bg-white border-yellow-400 shadow-md"
                : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 opacity-50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 ${
                achievement.unlocked 
                  ? "text-yellow-600 dark:text-yellow-400" 
                  : "text-gray-400"
              }`}>
                {getAchievementIcon(achievement.id)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium ${
                  achievement.unlocked 
                    ? "text-gray-800 dark:text-gray-100" 
                    : "text-gray-500 dark:text-gray-400"
                }`}>
                  {achievement.title}
                </h4>
                <p className={`text-sm ${
                  achievement.unlocked 
                    ? "text-gray-600 dark:text-gray-300" 
                    : "text-gray-400 dark:text-gray-500"
                }`}>
                  {achievement.description}
                </p>
                {achievement.unlocked && (
                  <Badge className="mt-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs">
                    Desbloqueado
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
