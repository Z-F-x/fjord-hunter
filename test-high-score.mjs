// Test script to verify high score tracking
import { saveHighScore, getTopScores } from './app/actions.js'

async function testHighScoreTracking() {
  console.log('🧪 Testing high score tracking system...')

  // Clear test data
  console.log('\n1. Testing saveHighScore function...')

  // Test data
  const testScore = {
    playerName: 'TestPlayer',
    score: 1500,
    timePlayed: 300, // 5 minutes
    fishCaught: 10,
    targetsHit: 8,
    collectiblesFound: 3
  }

  try {
    const result = await saveHighScore(testScore)
    if (result.success) {
      console.log('✅ High score saved successfully!')
    } else {
      console.log('❌ Failed to save high score:', result.error)
      return
    }
  } catch (error) {
    console.error('❌ Error saving high score:', error)
    return
  }

  console.log('\n2. Testing getTopScores function...')

  try {
    const topScores = await getTopScores(5)
    console.log('✅ Top scores retrieved successfully:')
    console.log('Top 5 scores:')
    topScores.forEach((score, index) => {
      console.log(`${index + 1}. ${score.player_name}: ${score.score} poeng`)
    })

    if (topScores.length > 0 && topScores[0].score >= testScore.score) {
      console.log('\n✅ High score tracking system working correctly!')
      console.log(`Current high score: ${topScores[0].score} by ${topScores[0].player_name}`)
    }

  } catch (error) {
    console.error('❌ Error getting top scores:', error)
  }
}

testHighScoreTracking()
