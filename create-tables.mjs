import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ygshxyczhslqphudwchp.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlnc2h4eWN6aHNscXBodWR3Y2hwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTM2NzcwMCwiZXhwIjoyMDc2OTQzNzAwfQ.XTV5MNuYVRCKxebfzMo5dejkM6FC9SdCoJAPx4BJwwk'

// Use service key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTables() {
  console.log('🔍 Creating database tables...')

  try {
    // Create high_scores table
    const createHighScoresSQL = `
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
    `

    const { data: highScoresResult, error: highScoresError } = await supabase.rpc('exec_sql', {
      sql: createHighScoresSQL
    })

    if (highScoresError) {
      console.log('❌ Failed to create high_scores table:', highScoresError)
    } else {
      console.log('✅ High scores table created successfully!')
    }

    // Create index for high_scores
    const createIndexSQL = `
      CREATE INDEX IF NOT EXISTS idx_high_scores_score ON high_scores(score DESC);
    `

    const { data: indexResult, error: indexError } = await supabase.rpc('exec_sql', {
      sql: createIndexSQL
    })

    if (indexError) {
      console.log('❌ Failed to create index:', indexError)
    } else {
      console.log('✅ Index created successfully!')
    }

    // Create achievements table
    const createAchievementsSQL = `
      CREATE TABLE IF NOT EXISTS achievements (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        player_name TEXT NOT NULL,
        achievement_type TEXT NOT NULL,
        achievement_name TEXT NOT NULL,
        unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    const { data: achievementsResult, error: achievementsError } = await supabase.rpc('exec_sql', {
      sql: createAchievementsSQL
    })

    if (achievementsError) {
      console.log('❌ Failed to create achievements table:', achievementsError)
    } else {
      console.log('✅ Achievements table created successfully!')
    }

    // Create achievements index
    const createAchievementsIndexSQL = `
      CREATE INDEX IF NOT EXISTS idx_achievements_player ON achievements(player_name);
    `

    const { data: achIndexResult, error: achIndexError } = await supabase.rpc('exec_sql', {
      sql: createAchievementsIndexSQL
    })

    if (achIndexError) {
      console.log('❌ Failed to create achievements index:', achIndexError)
    } else {
      console.log('✅ Achievements index created successfully!')
    }

    // Test if tables now exist
    console.log('\n🔍 Testing tables...')

    const { data: testHighScores, error: testHighScoresError } = await supabase
      .from('high_scores')
      .select('*')
      .limit(1)

    if (testHighScoresError) {
      console.log('❌ High scores table test failed:', testHighScoresError.message)
    } else {
      console.log('✅ High scores table is working!')
    }

    const { data: testAchievements, error: testAchievementsError } = await supabase
      .from('achievements')
      .select('*')
      .limit(1)

    if (testAchievementsError) {
      console.log('❌ Achievements table test failed:', testAchievementsError.message)
    } else {
      console.log('✅ Achievements table is working!')
    }

  } catch (error) {
    console.error('❌ Error creating tables:', error)
  }
}

createTables()
