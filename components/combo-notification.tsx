"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGameStore } from "@/store/game-store"

interface ComboNotificationProps {
  combo: number
  multiplier: number
}

export function ComboNotification({ combo, multiplier }: ComboNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentCombo, setCurrentCombo] = useState(0)
  const playSoundEffect = useGameStore((state) => state.playSoundEffect)

  useEffect(() => {
    if (combo > currentCombo && combo > 1) {
      setCurrentCombo(combo)
      setIsVisible(true)

      // Play level up sound for combo achievements
      if (combo >= 3) {
        playSoundEffect.levelUp()
      } else {
        playSoundEffect.bonus()
      }

      // Skjul MYE raskere - kun 1.5 sekunder!
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 1500)

      return () => clearTimeout(timer)
    } else if (combo <= 1) {
      setCurrentCombo(0)
      setIsVisible(false)
    }
  }, [combo, currentCombo]) // Fjernet playSoundEffect fra dependencies!

  return (
    <AnimatePresence>
      {isVisible && combo > 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 pointer-events-none z-40
                     md:bottom-24 md:left-1/2 md:-translate-x-1/2"
        >
          <div className="rounded-lg bg-gradient-to-r from-yellow-500/90 to-orange-500/90
                          backdrop-blur-sm shadow-lg px-4 py-2 text-center
                          md:px-6 md:py-3">
            <div className="text-2xl md:text-3xl font-bold text-white">
              {combo}x COMBO!
            </div>
            {multiplier > 1 && (
              <div className="text-sm md:text-lg font-semibold text-white/90">
                {multiplier}x Poeng
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
