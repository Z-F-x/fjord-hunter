import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ygshxyczhslqphudwchp.supabase.co'
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlnc2h4eWN6aHNscXBodWR3Y2hwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTM2NzcwMCwiZXhwIjoyMDc2OTQzNzAwfQ.XTV5MNuYVRCKxebfzMo5dejkM6FC9SdCoJAPx4BJwwk'

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function setupDatabase() {
  console.log('Testing database connection...')

  // First, let's test if we can connect and see existing tables
  const { data: tables, error: tablesError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')

  if (tablesError) {
    console.error('Connection error:', tablesError)
    return
  }

  console.log('Existing tables:', tables?.map(t => t.table_name) || [])

  // Try to insert sample data directly
  console.log('Inserting sample high scores...')

  const sampleScores = [
    { player_name: 'Magnus', score: 15420, time_played: 180000, fish_caught: 42, targets_hit: 28 },
    { player_name: 'Astrid', score: 12890, time_played: 165000, fish_caught: 38, targets_hit: 25 },
    { player_name: 'Björn', score: 11230, time_played: 142000, fish_caught: 35, targets_hit: 22 },
    { player_name: 'Ingrid', score: 9876, time_played: 120000, fish_caught: 29, targets_hit: 19 },
    { player_name: 'Erik', score: 8654, time_played: 98000, fish_caught: 24, targets_hit: 16 }
  ]

  const { data, error } = await supabase
    .from('high_scores')
    .insert(sampleScores)

  if (error) {
    console.error('Insert error:', error)
  } else {
    console.log('✓ Sample data inserted successfully!')
  }

  // Test reading the data
  const { data: scores, error: readError } = await supabase
    .from('high_scores')
    .select('*')
    .order('score', { ascending: false })
    .limit(5)

  if (readError) {
    console.error('Read error:', readError)
  } else {
    console.log('✓ Top scores from database:', scores)
  }
}

setupDatabase().catch(console.error)
