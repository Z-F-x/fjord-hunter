"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import type { Achievement } from "@/lib/achievements"
import { useGameStore } from "@/store/game-store"

interface AchievementNotificationProps {
  achievement: Achievement | null
  onClose: () => void
}

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const playSoundEffect = useGameStore((state) => state.playSoundEffect)
  const lastAchievementId = useRef<string | null>(null)

  useEffect(() => {
    if (achievement && achievement.id !== lastAchievementId.current) {
      // Only play sound for NEW achievements, not repeated ones!
      lastAchievementId.current = achievement.id
      playSoundEffect.achievement()

      const timer = setTimeout(onClose, 1500) // MYE raskere - kun 1.5 sekunder!
      return () => clearTimeout(timer)
    } else if (!achievement) {
      lastAchievementId.current = null
    }
  }, [achievement, onClose]) // Fjernet playSoundEffect fra dependencies!

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="pointer-events-none fixed bottom-4 left-1/2 z-50 -translate-x-1/2
                     md:bottom-6 md:left-4 md:translate-x-0 md:translate-y-0"
        >
          <Card className="bg-gradient-to-r from-yellow-500/90 to-orange-500/90
                          backdrop-blur-sm shadow-lg
                          p-3 md:p-4 max-w-xs md:max-w-sm">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="text-2xl md:text-3xl flex-shrink-0">{achievement.icon}</div>
              <div className="min-w-0">
                <div className="text-xs md:text-sm font-semibold text-white/90 truncate">
                  ACHIEVEMENT!
                </div>
                <div className="text-sm md:text-lg font-bold text-white truncate">
                  {achievement.name}
                </div>
                <div className="text-xs text-white/80 truncate">
                  {achievement.description}
                </div>
                <div className="text-xs font-semibold text-yellow-200">
                  +{achievement.points} XP
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
