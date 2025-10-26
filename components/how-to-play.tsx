"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, Gamepad2, Fish, Target, Gem, Shell } from "lucide-react"

export function HowToPlayModal() {
  const [isOpen, setIsOpen] = useState(false)

  // Show on first visit
  useEffect(() => {
    const hasSeenInstructions = localStorage.getItem('fjordHunter_hasSeenInstructions')
    if (!hasSeenInstructions) {
      setIsOpen(true)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('fjordHunter_hasSeenInstructions', 'true')
  }

  const handleShowAgain = () => {
    setIsOpen(true)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={handleShowAgain}
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-30 bg-white/90 hover:bg-white"
      >
        <Gamepad2 className="mr-2 h-4 w-4" />
        Hvordan å spille
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <CardTitle className="text-2xl font-bold text-center">
            🚢 Fjord Hunter - Hvordan å Spille
          </CardTitle>
          <CardDescription className="text-center">
            Et norsk fjordentyr med skyting, fishing og samling!
          </CardDescription>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Kontroller */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Gamepad2 className="mr-2 h-5 w-5" />
              Kontroller
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Keyboard:</h4>
                <div className="text-sm space-y-1">
                  <div><Badge variant="secondary">WASD</Badge> - Beveg båten</div>
                  <div><Badge variant="secondary">Space</Badge> - Skyt prosjektiler</div>
                  <div><Badge variant="secondary">Shift</Badge> - Vis sikte</div>
                  <div><Badge variant="secondary">F</Badge> - Kast fiskestang</div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Mobil:</h4>
                <div className="text-sm space-y-1">
                  <div>📱 Piltaster - Beveg båten</div>
                  <div>🎯 Rød knapp - Skyt</div>
                  <div>🎣 Blå knapp - Fiske</div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Spillmåter */}
          <div>
            <h3 className="text-lg font-semibold mb-3">🎯 Spillmåter</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fuglejakting */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <Target className="mr-2 h-5 w-5 text-red-500" />
                    <h4 className="font-medium">Jakte Fugler</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Skyt flyvende fugler med prosjektiler!
                  </p>
                  <div className="text-xs space-y-1">
                    <div>• Bruk siktet (🐦 FUGLESIKTE)</div>
                    <div>• Generøs hitbox - lett å treffe!</div>
                    <div>• <Badge variant="outline">100 poeng</Badge> per fugl</div>
                  </div>
                </CardContent>
              </Card>

              {/* Fiske */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <Fish className="mr-2 h-5 w-5 text-blue-500" />
                    <h4 className="font-medium">Fiske Fisk</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Kast fiskestang og fang fisk i fjorden!
                  </p>
                  <div className="text-xs space-y-1">
                    <div>• Trykk F eller 🎣 knapp</div>
                    <div>• Lyd og animasjoner</div>
                    <div>• Ulike fisketyper</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Samling */}
          <div>
            <h3 className="text-lg font-semibold mb-3">💎 Samle Skatter</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Perler */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <Shell className="mr-2 h-5 w-5 text-gray-400" />
                    <h4 className="font-medium">Samle Perler</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Kjør båten på hvite perler!
                  </p>
                  <div className="text-xs space-y-1">
                    <div>• Flyter på vannet</div>
                    <div>• <Badge variant="outline">25 poeng</Badge> per perle</div>
                    <div>• Respawner hver 15. sekund</div>
                  </div>
                </CardContent>
              </Card>

              {/* Diamanter */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <Gem className="mr-2 h-5 w-5 text-blue-400" />
                    <h4 className="font-medium">Samle Diamanter</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Kjør båten på blå diamanter!
                  </p>
                  <div className="text-xs space-y-1">
                    <div>• Sjeldne og verdifulle</div>
                    <div>• <Badge variant="outline">50 poeng</Badge> per diamant</div>
                    <div>• Respawner hver 30. sekund</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Tips */}
          <div>
            <h3 className="text-lg font-semibold mb-3">💡 Tips</h3>
            <div className="text-sm space-y-2">
              <div>• Dette er et <strong>casual spill</strong> - generøse hitboxer gjør det lett!</div>
              <div>• Fuglesiktet er innstilt høyt - bare sikt på fuglene og skyt</div>
              <div>• Kombiner alle aktiviteter for høyeste poengsum</div>
              <div>• Følg med på leaderboard for å se din rangering</div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button onClick={handleClose} size="lg">
              La oss spille! 🚢
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
