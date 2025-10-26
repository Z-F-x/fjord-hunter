import { NextRequest, NextResponse } from 'next/server'
import { getTopScores } from '@/app/actions'

export async function GET() {
  try {
    const scores = await getTopScores(5)

    return NextResponse.json({
      success: true,
      data: scores,
      message: `Hentet ${scores.length} poengsummer fra databasen`
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Ukjent feil',
      message: 'Kunne ikke hente poengsummer fra databasen'
    }, { status: 500 })
  }
}
