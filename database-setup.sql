-- Fjord Hunter Game Database Setup
-- Copy and paste this into the Supabase SQL Editor

-- Create high_scores table
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

-- Create index for faster leaderboard queries
CREATE INDEX IF NOT EXISTS idx_high_scores_score ON high_scores(score DESC);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for achievements
CREATE INDEX IF NOT EXISTS idx_achievements_player ON achievements(player_name);

-- Insert sample high scores data
INSERT INTO high_scores (player_name, score, time_played, fish_caught, targets_hit, collectibles_found) VALUES
('Magnus', 15420, 180000, 42, 28, 5),
('Astrid', 12890, 165000, 38, 25, 4),
('Björn', 11230, 142000, 35, 22, 3),
('Ingrid', 9876, 120000, 29, 19, 2),
('Erik', 8654, 98000, 24, 16, 1)
ON CONFLICT (id) DO NOTHING;

-- Verify the setup
SELECT 'High Scores Table' as table_name, COUNT(*) as row_count FROM high_scores
UNION ALL
SELECT 'Achievements Table' as table_name, COUNT(*) as row_count FROM achievements;

-- Show top 5 high scores
SELECT player_name, score, fish_caught, targets_hit
FROM high_scores
ORDER BY score DESC
LIMIT 5;
