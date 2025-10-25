"use server"

import { generateText, generateObject } from "ai"
import { z } from "zod"

const challengeSchema = z.object({
  title: z.string().describe("Catchy Norwegian title for the challenge"),
  description: z.string().describe("Detailed Norwegian description of what to do"),
  goal: z.object({
    type: z.enum(["fish", "targets", "collectibles", "score", "time"]),
    amount: z.number(),
  }),
  reward: z.number().describe("Bonus points for completing the challenge"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tip: z.string().describe("Helpful Norwegian tip for completing the challenge"),
})

export async function generateDailyChallenge() {
  try {
    const { object } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: challengeSchema,
      prompt: `Generate a fun and engaging daily challenge for a Norwegian boat adventure game. 
      The game involves fishing, shooting targets (birds), and collecting items while sailing a boat.
      Make it exciting for 13-year-old boys who love outdoor activities.
      Use Norwegian language for all text.
      Make the challenge achievable but not too easy.`,
    })

    return object
  } catch (error) {
    console.error("Error generating challenge:", error)
    return {
      title: "Dagens Utfordring",
      description: "Fang 15 fisk og treff 10 mål",
      goal: { type: "fish" as const, amount: 15 },
      reward: 100,
      difficulty: "medium" as const,
      tip: "Kjør sakte når du fisker for bedre presisjon!",
    }
  }
}

export async function generateGameTip(playerStats: {
  score: number
  fishCaught: number
  targetsHit: number
  collectiblesFound: number
}) {
  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are a helpful game coach for a Norwegian boat adventure game.
      
      Player stats:
      - Score: ${playerStats.score}
      - Fish caught: ${playerStats.fishCaught}
      - Targets hit: ${playerStats.targetsHit}
      - Collectibles found: ${playerStats.collectiblesFound}
      
      Give ONE short, encouraging tip in Norwegian (max 2 sentences) to help them improve their gameplay.
      Focus on what they're doing well and one area they could improve.`,
      maxOutputTokens: 100,
    })

    return text
  } catch (error) {
    console.error("Error generating tip:", error)
    return "Fortsett å øve! Du gjør det bra!"
  }
}

export async function generateWeatherDescription() {
  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Generate a short, atmospheric Norwegian description (1-2 sentences) of weather conditions in a Norwegian fjord. 
      Make it immersive and suitable for a boat adventure game.
      Include details about the sky, water, or wind.`,
      maxOutputTokens: 80,
    })

    return text
  } catch (error) {
    console.error("Error generating weather:", error)
    return "Perfekt vær for en båttur i fjorden!"
  }
}

export async function generateEncouragingMessage(score: number) {
  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Generate a short, enthusiastic Norwegian message (1 sentence) congratulating a player who just scored ${score} points in a boat adventure game. Make it exciting and age-appropriate for 13-year-olds.`,
      maxOutputTokens: 50,
    })

    return text
  } catch (error) {
    console.error("Error generating message:", error)
    return "Fantastisk jobba!"
  }
}
