"use client"

import { Button } from "@/components/ui/button"
import { useGameStore } from "@/store/game-store"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Fish, Target } from "lucide-react"

export function MobileControls() {
  const setMobileControls = useGameStore((state) => state.setMobileControls)
  const setIsFishing = useGameStore((state) => state.setIsFishing)
  const setIsShooting = useGameStore((state) => state.setIsShooting)

  const handleControl = (control: string, active: boolean) => {
    setMobileControls(control, active)
  }

  const handleFish = () => {
    // Trigger F-key press for fishing (samme som keyboard)
    const event = new KeyboardEvent('keydown', { key: 'f' })
    document.dispatchEvent(event)
  }

  const handleShoot = () => {
    const now = Date.now()
    const lastShotKey = 'lastMobileShot'
    const lastShot = parseInt(localStorage.getItem(lastShotKey) || '0')

    if (now - lastShot < 300) return // Cooldown
    localStorage.setItem(lastShotKey, now.toString())

    // Trigger the same shooting system as keyboard/mouse
    const event = new KeyboardEvent('keydown', { key: ' ' }) // Space bar
    document.dispatchEvent(event)
  }

  return (
    <div className="pointer-events-auto fixed inset-0 z-20 md:hidden">
      {/* D-pad controls - left side - responsive positioning */}
      <div className="absolute bottom-4 left-4 landscape:bottom-2 landscape:left-2">
        <div className="relative h-32 w-32 landscape:h-28 landscape:w-28">
          {/* Up */}
          <Button
            size="icon"
            className="absolute left-1/2 top-0 h-10 w-10 -translate-x-1/2 landscape:h-8 landscape:w-8"
            onTouchStart={() => handleControl("forward", true)}
            onTouchEnd={() => handleControl("forward", false)}
            title="Fremover"
          >
            <ArrowUp className="h-5 w-5 landscape:h-4 landscape:w-4" />
          </Button>

          {/* Down */}
          <Button
            size="icon"
            className="absolute bottom-0 left-1/2 h-10 w-10 -translate-x-1/2 landscape:h-8 landscape:w-8"
            onTouchStart={() => handleControl("backward", true)}
            onTouchEnd={() => handleControl("backward", false)}
            title="Bakover"
          >
            <ArrowDown className="h-5 w-5 landscape:h-4 landscape:w-4" />
          </Button>

          {/* Left */}
          <Button
            size="icon"
            className="absolute left-0 top-1/2 h-10 w-10 -translate-y-1/2 landscape:h-8 landscape:w-8"
            onTouchStart={() => handleControl("left", true)}
            onTouchEnd={() => handleControl("left", false)}
            title="Venstre"
          >
            <ArrowLeft className="h-5 w-5 landscape:h-4 landscape:w-4" />
          </Button>

          {/* Right */}
          <Button
            size="icon"
            className="absolute right-0 top-1/2 h-10 w-10 -translate-y-1/2 landscape:h-8 landscape:w-8"
            onTouchStart={() => handleControl("right", true)}
            onTouchEnd={() => handleControl("right", false)}
            title="Høyre"
          >
            <ArrowRight className="h-5 w-5 landscape:h-4 landscape:w-4" />
          </Button>
        </div>
      </div>

      {/* Action buttons - right side - responsive positioning */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-3 landscape:bottom-2 landscape:right-2 landscape:gap-2">
        <Button
          size="lg"
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 landscape:h-12 landscape:w-12"
          onTouchStart={handleFish}
          title="Fiske"
        >
          <Fish className="h-7 w-7 landscape:h-6 landscape:w-6" />
        </Button>

        <Button
          size="lg"
          className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700 landscape:h-12 landscape:w-12"
          onTouchStart={handleShoot}
          title="Skyte"
        >
          <Target className="h-7 w-7 landscape:h-6 landscape:w-6" />
        </Button>
      </div>
    </div>
  )
}
