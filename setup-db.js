const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://ygshxyczhslqphudwchp.supabase.co'
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlnc2h4eWN6aHNscXBodWR3Y2hwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTM2NzcwMCwiZXhwIjoyMDc2OTQzNzAwfQ.XTV5MNuYVRCKxebfzMo5dejkM6FC9SdCoJAPx4BJwwk'

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function setupDatabase() {
  console.log('Setting up database tables...')

  // Create high_scores table
  const { error: highScoresError } = await supabase.rpc('exec_sql', {
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
    `
  })

  if (highScoresError && !highScoresError.message.includes('already exists')) {
    console.error('Error creating high_scores table:', highScoresError)
  } else {
    console.log('✓ high_scores table ready')
  }

  // Create index
  const { error: indexError } = await supabase.rpc('exec_sql', {
    sql: 'CREATE INDEX IF NOT EXISTS idx_high_scores_score ON high_scores(score DESC);'
  })

  if (indexError && !indexError.message.includes('already exists')) {
    console.error('Error creating index:', indexError)
  } else {
    console.log('✓ Index created')
  }

  // Create achievements table
  const { error: achievementsError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS achievements (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        player_name TEXT NOT NULL,
        achievement_type TEXT NOT NULL,
        achievement_name TEXT NOT NULL,
        unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  })

  if (achievementsError && !achievementsError.message.includes('already exists')) {
    console.error('Error creating achievements table:', achievementsError)
  } else {
    console.log('✓ achievements table ready')
  }

  // Insert some sample data
  console.log('Adding sample data...')

  const sampleScores = [
    { player_name: 'Magnus', score: 15420, time_played: 180000, fish_caught: 42, targets_hit: 28 },
    { player_name: 'Astrid', score: 12890, time_played: 165000, fish_caught: 38, targets_hit: 25 },
    { player_name: 'Björn', score: 11230, time_played: 142000, fish_caught: 35, targets_hit: 22 },
    { player_name: 'Ingrid', score: 9876, time_played: 120000, fish_caught: 29, targets_hit: 19 },
    { player_name: 'Erik', score: 8654, time_played: 98000, fish_caught: 24, targets_hit: 16 }
  ]

  for (const score of sampleScores) {
    const { error } = await supabase
      .from('high_scores')
      .insert(score)

    if (error) {
      console.log(`Sample data might already exist: ${error.message}`)
    }
  }

  console.log('✓ Database setup complete!')

  // Test the connection
  const { data, error } = await supabase
    .from('high_scores')
    .select('*')
    .order('score', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Error testing connection:', error)
  } else {
    console.log('✓ Connection test successful!')
    console.log('Top scores:', data)
  }
}

setupDatabase().catch(console.error)
