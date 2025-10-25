"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Play, Settings, Trophy, Info, Volume2 } from "lucide-react"
import { useGameStore } from "@/store/game-store"

interface MainMenuProps {
  onStartGame: () => void
  onShowLeaderboard: () => void
}

export function MainMenu({ onStartGame, onShowLeaderboard }: MainMenuProps) {
  const [currentView, setCurrentView] = useState<'main' | 'settings' | 'about'>('main')
  const [playerName, setPlayerName] = useState('')
  const [audioVolume, setAudioVolume] = useState(30)
  const [enableEffects, setEnableEffects] = useState(true)
  const [difficulty, setDifficulty] = useState('normal')
  
  const setAudioVolume_store = useGameStore((state) => state.setAudioVolume)
  const setPlayerName_store = useGameStore((state) => state.setPlayerName)
  const setDifficulty_store = useGameStore((state) => state.setDifficulty)

  // Load saved settings on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('fjord-hunter-player-name') || ''
      const savedVolume = parseInt(localStorage.getItem('fjord-hunter-audio-volume') || '30')
      const savedEffects = localStorage.getItem('fjord-hunter-enable-effects') === 'true'
      const savedDifficulty = localStorage.getItem('fjord-hunter-difficulty') || 'normal'
      
      setPlayerName(savedName)
      setAudioVolume(savedVolume)
      setEnableEffects(savedEffects)
      setDifficulty(savedDifficulty)
    }
  }, [])

  const handleStartGame = () => {
    if (!playerName.trim()) {
      alert('Vennligst skriv inn et spillernavn!')
      return
    }
    
    // Store player settings in localStorage
    localStorage.setItem('fjord-hunter-player-name', playerName.trim())
    localStorage.setItem('fjord-hunter-audio-volume', audioVolume.toString())
    localStorage.setItem('fjord-hunter-enable-effects', enableEffects.toString())
    localStorage.setItem('fjord-hunter-difficulty', difficulty)
    
    // Apply settings to game store
    setPlayerName_store(playerName.trim())
    setDifficulty_store(difficulty)
    setAudioVolume_store(audioVolume / 100)
    
    onStartGame()
  }

  if (currentView === 'settings') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-600 p-4">
        <Card className="w-full max-w-md bg-black/80 p-6 backdrop-blur-sm">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">Innstillinger</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Lydvolum</Label>
                <div className="flex items-center space-x-4">
                  <Volume2 className="h-4 w-4 text-white" />
                  <Slider
                    value={[audioVolume]}
                    onValueChange={(value: number[]) => setAudioVolume(value[0])}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-sm text-white w-12">{audioVolume}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-white">Visuelle effekter</Label>
                <Switch
                  checked={enableEffects}
                  onCheckedChange={setEnableEffects}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Vanskelighetsgrad</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['lett', 'normal', 'vanskelig'].map((level) => (
                    <Button
                      key={level}
                      variant={difficulty === level ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDifficulty(level)}
                      className={difficulty === level ? "bg-blue-600" : ""}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentView('main')}
                variant="outline"
                className="flex-1"
              >
                Tilbake
              </Button>
              <Button
                onClick={() => {
                  setAudioVolume_store(audioVolume / 100)
                  setCurrentView('main')
                }}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Lagre
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (currentView === 'about') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-600 p-4">
        <Card className="w-full max-w-md bg-black/80 p-6 backdrop-blur-sm">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">Om Fjord Hunter</h2>
            </div>

            <div className="space-y-4 text-sm text-white/90">
              <p>
                Utforsk de magiske norske fjordene med din båt! Fisk, skyt mål, 
                og samle skatter mens du navigerer gjennom vakre landskap.
              </p>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-white">Kontroller:</h3>
                <div className="space-y-1 text-xs">
                  <div>W/↑ - Fremover</div>
                  <div>S/↓ - Bakover</div>
                  <div>A/← - Venstre</div>
                  <div>D/→ - Høyre</div>
                  <div>SPACE - Fiske</div>
                  <div>SHIFT - Skyte</div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-white">Mål:</h3>
                <div className="text-xs">
                  Samle poeng ved å fiske, treffe mål og finne skatter. 
                  Bygg opp kombo for høyere poengmultiplikator!
                </div>
              </div>
            </div>

            <Button
              onClick={() => setCurrentView('main')}
              variant="outline"
              className="w-full"
            >
              Tilbake
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-600 p-4">
      <div className="text-center space-y-8">
        {/* Game Title */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white drop-shadow-lg">
            FJORD HUNTER
          </h1>
          <p className="text-xl text-blue-100">
            Norsk Båt Eventyr
          </p>
        </div>

        {/* Main Menu Card */}
        <Card className="w-full max-w-md bg-black/80 p-6 backdrop-blur-sm">
          <div className="space-y-6">
            {/* Player Name Input */}
            <div className="space-y-2">
              <Label htmlFor="playerName" className="text-white">
                Spillernavn
              </Label>
              <Input
                id="playerName"
                type="text"
                placeholder="Skriv inn ditt navn..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-white/50"
                maxLength={20}
              />
            </div>

            <Separator className="bg-white/20" />

            {/* Menu Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleStartGame}
                disabled={!playerName.trim()}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                size="lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Start Spill
              </Button>

              <Button
                onClick={onShowLeaderboard}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
                size="lg"
              >
                <Trophy className="mr-2 h-5 w-5" />
                Leaderboard
              </Button>

              <Button
                onClick={() => setCurrentView('settings')}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
                size="lg"
              >
                <Settings className="mr-2 h-5 w-5" />
                Innstillinger
              </Button>

              <Button
                onClick={() => setCurrentView('about')}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
                size="lg"
              >
                <Info className="mr-2 h-5 w-5" />
                Om Spillet
              </Button>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-blue-200">
          <p>Versjon 1.0 • Laget med ❤️ for Norge</p>
        </div>
      </div>
    </div>
  )
}