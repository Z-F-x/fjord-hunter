"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function GameInfo() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Skjul MYE raskere - kun 2 sekunder!
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-green-600/90 p-3 backdrop-blur-sm">
            <div className="flex items-start gap-2 text-white">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div className="text-xs space-y-1">
                <p className="font-semibold">100% GRATIS Å SPILLE!</p>
                <p className="text-white/80">
                  AI-funksjoner er valgfrie og krever Vercel AI Gateway. Alle andre funksjoner er gratis uten kredittkort.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
