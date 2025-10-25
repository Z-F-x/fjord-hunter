"use server"

import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function saveHighScore(data: {
  playerName: string
  score: number
  timePlayed: number
  fishCaught: number
  targetsHit: number
  collectiblesFound: number
}) {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase.from("high_scores").insert({
    player_name: data.playerName,
    score: data.score,
    time_played: data.timePlayed,
    fish_caught: data.fishCaught,
    targets_hit: data.targetsHit,
    collectibles_found: data.collectiblesFound,
  })

  if (error) {
    console.error("Error saving high score:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function getTopScores(limit = 10) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from("high_scores")
    .select("*")
    .order("score", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching high scores:", error)
    return []
  }

  return data
}
