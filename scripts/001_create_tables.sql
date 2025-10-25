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
