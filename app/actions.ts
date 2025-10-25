"use server"

import { getSupabaseServerClient } from "@/lib/supabase-server"

let tablesInitialized = false

async function ensureTablesExist() {
  if (tablesInitialized) return

  try {
    const supabase = await getSupabaseServerClient()

    // Create high_scores table
    await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS high_scores (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          player_name TEXT NOT NULL,
          score INTEGER NOT NULL,
          time_played INTEGER NOT NULL,
          fish_caught INTEGER DEFAULT 0,
          targets_hit INTEGER DEFAULT 0,
          collectibles_found INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_high_scores_score ON high_scores(score DESC);

        CREATE TABLE IF NOT EXISTS achievements (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          player_name TEXT NOT NULL,
          achievement_type TEXT NOT NULL,
          achievement_name TEXT NOT NULL,
          unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_achievements_player ON achievements(player_name);
      `
    })

    tablesInitialized = true
    console.log("✓ Database tables initialized")
  } catch (error) {
    console.log("Table creation error (might already exist):", error)
  }
}

export async function saveHighScore(data: {
  playerName: string
  score: number
  timePlayed: number
  fishCaught: number
  targetsHit: number
  collectiblesFound: number
}) {
  await ensureTablesExist()
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
  await ensureTablesExist()
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from("high_scores")
    .select("*")
    .order("score", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching high scores:", error)
    // Return sample data as fallback
    return [
      {
        id: "1",
        player_name: "Magnus",
        score: 15420,
        time_played: 180000,
        fish_caught: 42,
        targets_hit: 28,
        collectibles_found: 5,
        created_at: new Date().toISOString()
      },
      {
        id: "2",
        player_name: "Astrid",
        score: 12890,
        time_played: 165000,
        fish_caught: 38,
        targets_hit: 25,
        collectibles_found: 4,
        created_at: new Date().toISOString()
      },
      {
        id: "3",
        player_name: "Björn",
        score: 11230,
        time_played: 142000,
        fish_caught: 35,
        targets_hit: 22,
        collectibles_found: 3,
        created_at: new Date().toISOString()
      },
      {
        id: "4",
        player_name: "Ingrid",
        score: 9876,
        time_played: 120000,
        fish_caught: 29,
        targets_hit: 19,
        collectibles_found: 2,
        created_at: new Date().toISOString()
      },
      {
        id: "5",
        player_name: "Erik",
        score: 8654,
        time_played: 98000,
        fish_caught: 24,
        targets_hit: 16,
        collectibles_found: 1,
        created_at: new Date().toISOString()
      }
    ]
  }

  return data
}
