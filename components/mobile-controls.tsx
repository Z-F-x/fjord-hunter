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
    setIsFishing(true)
    setTimeout(() => setIsFishing(false), 500)
  }

  const handleShoot = () => {
    setIsShooting(true)
    setTimeout(() => setIsShooting(false), 250)
  }

  return (
    <div className="pointer-events-auto fixed inset-0 z-20 md:hidden">
      {/* D-pad controls - left side */}
      <div className="absolute bottom-8 left-8">
        <div className="relative h-40 w-40">
          {/* Up */}
          <Button
            size="icon"
            className="absolute left-1/2 top-0 h-12 w-12 -translate-x-1/2"
            onTouchStart={() => handleControl("forward", true)}
            onTouchEnd={() => handleControl("forward", false)}
          >
            <ArrowUp className="h-6 w-6" />
          </Button>

          {/* Down */}
          <Button
            size="icon"
            className="absolute bottom-0 left-1/2 h-12 w-12 -translate-x-1/2"
            onTouchStart={() => handleControl("backward", true)}
            onTouchEnd={() => handleControl("backward", false)}
          >
            <ArrowDown className="h-6 w-6" />
          </Button>

          {/* Left */}
          <Button
            size="icon"
            className="absolute left-0 top-1/2 h-12 w-12 -translate-y-1/2"
            onTouchStart={() => handleControl("left", true)}
            onTouchEnd={() => handleControl("left", false)}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>

          {/* Right */}
          <Button
            size="icon"
            className="absolute right-0 top-1/2 h-12 w-12 -translate-y-1/2"
            onTouchStart={() => handleControl("right", true)}
            onTouchEnd={() => handleControl("right", false)}
          >
            <ArrowRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Action buttons - right side */}
      <div className="absolute bottom-8 right-8 flex flex-col gap-4">
        <Button size="lg" className="h-16 w-16 rounded-full bg-blue-600 hover:bg-blue-700" onTouchStart={handleFish}>
          <Fish className="h-8 w-8" />
        </Button>

        <Button size="lg" className="h-16 w-16 rounded-full bg-red-600 hover:bg-red-700" onTouchStart={handleShoot}>
          <Target className="h-8 w-8" />
        </Button>
      </div>
    </div>
  )
}
