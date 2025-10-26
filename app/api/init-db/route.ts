import { NextRequest, NextResponse } from 'next/server'
import { saveHighScore } from '@/app/actions'

export async function POST() {
  try {
    // Add sample scores to initialize the database
    const sampleScores = [
      {
        playerName: 'Magnus',
        score: 15420,
        timePlayed: 180000,
        fishCaught: 42,
        targetsHit: 28,
        collectiblesFound: 5
      },
      {
        playerName: 'Astrid',
        score: 12890,
        timePlayed: 165000,
        fishCaught: 38,
        targetsHit: 25,
        collectiblesFound: 4
      },
      {
        playerName: 'Björn',
        score: 11230,
        timePlayed: 142000,
        fishCaught: 35,
        targetsHit: 22,
        collectiblesFound: 3
      },
      {
        playerName: 'Ingrid',
        score: 9876,
        timePlayed: 120000,
        fishCaught: 29,
        targetsHit: 19,
        collectiblesFound: 2
      },
      {
        playerName: 'Erik',
        score: 8654,
        timePlayed: 98000,
        fishCaught: 24,
        targetsHit: 16,
        collectiblesFound: 1
      }
    ]

    const results = []

    for (const score of sampleScores) {
      const result = await saveHighScore(score)
      results.push({ playerName: score.playerName, result })
    }

    return NextResponse.json({
      success: true,
      message: 'Database initialized with sample data',
      results
    })
  } catch (error) {
    console.error('Init Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
