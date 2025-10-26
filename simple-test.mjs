import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ygshxyczhslqphudwchp.supabase.co'
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlnc2h4eWN6aHNscXBodWR3Y2hwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTM2NzcwMCwiZXhwIjoyMDc2OTQzNzAwfQ.XTV5MNuYVRCKxebfzMo5dejkM6FC9SdCoJAPx4BJwwk'

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function testConnection() {
  console.log('Testing simple database connection...')

  // Try to insert a test score first to see if the table exists
  const { data, error } = await supabase
    .from('high_scores')
    .insert([
      { player_name: 'Test Player', score: 1000, time_played: 60000, fish_caught: 5, targets_hit: 3 }
    ])
    .select()

  if (error) {
    console.error('Insert error (table might not exist):', error)

    // If table doesn't exist, let's try creating it via SQL
    console.log('Attempting to create table...')

    const { data: sqlResult, error: sqlError } = await supabase.rpc('sql', {
      query: `
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

    if (sqlError) {
      console.error('SQL error:', sqlError)
    } else {
      console.log('✓ Table created successfully')
    }
  } else {
    console.log('✓ Successfully inserted test data:', data)
  }

  // Now try to read data
  const { data: scores, error: readError } = await supabase
    .from('high_scores')
    .select('*')
    .order('score', { ascending: false })
    .limit(5)

  if (readError) {
    console.error('Read error:', readError)
  } else {
    console.log('✓ Successfully read scores:', scores)
  }
}

testConnection().catch(console.error)
