"use client"

import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import type { Achievement } from "@/lib/achievements"

interface AchievementNotificationProps {
  achievement: Achievement | null
  onClose: () => void
}

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(onClose, 4000)
      return () => clearTimeout(timer)
    }
  }, [achievement, onClose])

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="pointer-events-none fixed left-1/2 top-6 z-50 -translate-x-1/2"
        >
          <Card className="bg-gradient-to-r from-yellow-500/95 to-orange-500/95 p-6 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{achievement.icon}</div>
              <div>
                <div className="text-sm font-semibold text-white/90">ACHIEVEMENT UNLOCKED!</div>
                <div className="text-2xl font-bold text-white">{achievement.name}</div>
                <div className="text-sm text-white/80">{achievement.description}</div>
                <div className="mt-1 text-xs font-semibold text-yellow-200">+{achievement.points} XP</div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
