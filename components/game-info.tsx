"use client"

import { Card } from "@/components/ui/card"
import { Info } from "lucide-react"

export function GameInfo() {
  return (
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
  )
}
