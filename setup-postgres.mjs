import { Client } from 'pg'

const client = new Client({
  connectionString: 'postgres://postgres.ygshxyczhslqphudwchp:z8MSG6FtU4mst8pH@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
})

async function setupDatabase() {
  try {
    await client.connect()
    console.log('✓ Connected to PostgreSQL database')

    // Create high_scores table
    await client.query(`
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
    `)
    console.log('✓ high_scores table created')

    // Create index
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_high_scores_score ON high_scores(score DESC);
    `)
    console.log('✓ Index created')

    // Create achievements table
    await client.query(`
      CREATE TABLE IF NOT EXISTS achievements (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        player_name TEXT NOT NULL,
        achievement_type TEXT NOT NULL,
        achievement_name TEXT NOT NULL,
        unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)
    console.log('✓ achievements table created')

    // Create achievements index
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_achievements_player ON achievements(player_name);
    `)
    console.log('✓ Achievements index created')

    // Insert sample data
    console.log('Adding sample high scores...')

    const sampleScores = [
      ['Magnus', 15420, 180000, 42, 28, 5],
      ['Astrid', 12890, 165000, 38, 25, 4],
      ['Björn', 11230, 142000, 35, 22, 3],
      ['Ingrid', 9876, 120000, 29, 19, 2],
      ['Erik', 8654, 98000, 24, 16, 1]
    ]

    for (const [name, score, time, fish, targets, collectibles] of sampleScores) {
      try {
        await client.query(`
          INSERT INTO high_scores (player_name, score, time_played, fish_caught, targets_hit, collectibles_found)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id) DO NOTHING;
        `, [name, score, time, fish, targets, collectibles])
      } catch (insertError) {
        // Ignore duplicates
        console.log(`Sample data for ${name} might already exist`)
      }
    }

    // Verify the data
    const result = await client.query('SELECT * FROM high_scores ORDER BY score DESC LIMIT 5')
    console.log('✓ Top 5 scores in database:')
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.player_name}: ${row.score} points`)
    })

    console.log('✓ Database setup complete!')

  } catch (error) {
    console.error('Database setup error:', error)
  } finally {
    await client.end()
  }
}

setupDatabase()
