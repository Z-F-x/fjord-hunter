import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ygshxyczhslqphudwchp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlnc2h4eWN6aHNscXBodWR3Y2hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNjc3MDAsImV4cCI6MjA3Njk0MzcwMH0.npKBvmbAh_OYIBy5IN5AxjTF45Ork_43PRaOVxq2KXc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDatabase() {
  console.log('🔍 Testing Supabase connection...')

  try {
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('test')
      .select('*')
      .limit(1)

    if (connectionError && !connectionError.message.includes('relation "test" does not exist')) {
      throw connectionError
    }

    console.log('✅ Basic connection works!')

    // Check if our tables exist
    console.log('\n🔍 Checking tables...')

    // Test leaderboard table
    const { data: leaderboardData, error: leaderboardError } = await supabase
      .from('leaderboard')
      .select('*')
      .limit(1)

    if (leaderboardError) {
      console.log('❌ Leaderboard table does not exist:', leaderboardError.message)
    } else {
      console.log('✅ Leaderboard table exists!')
      console.log('Data sample:', leaderboardData)
    }

    // Test daily_challenges table
    const { data: challengesData, error: challengesError } = await supabase
      .from('daily_challenges')
      .select('*')
      .limit(1)

    if (challengesError) {
      console.log('❌ Daily challenges table does not exist:', challengesError.message)
    } else {
      console.log('✅ Daily challenges table exists!')
      console.log('Data sample:', challengesData)
    }

    // Test achievements table
    const { data: achievementsData, error: achievementsError } = await supabase
      .from('achievements')
      .select('*')
      .limit(1)

    if (achievementsError) {
      console.log('❌ Achievements table does not exist:', achievementsError.message)
    } else {
      console.log('✅ Achievements table exists!')
      console.log('Data sample:', achievementsData)
    }

  } catch (error) {
    console.error('❌ Database connection failed:', error)
  }
}

testDatabase()
