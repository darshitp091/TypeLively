-- schema.sql
-- Database schema for TypeLively Typing Platform

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table 1: Daily Challenges
CREATE TABLE IF NOT EXISTS daily_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_date DATE NOT NULL UNIQUE DEFAULT CURRENT_DATE,
    mode_type VARCHAR(50) NOT NULL,
    duration_value INT, -- Null if page-based
    page_count INT,     -- Null if timed
    difficulty VARCHAR(20) NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    language VARCHAR(50) NOT NULL,
    coding_language VARCHAR(50), -- Null if not coding mode
    generated_text TEXT NOT NULL,
    word_count INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index challenge_date for fast lookups
CREATE INDEX IF NOT EXISTS idx_daily_challenges_date ON daily_challenges (challenge_date);

-- Table 2: Daily Challenge Scores (Leaderboard)
CREATE TABLE IF NOT EXISTS daily_challenge_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID NOT NULL REFERENCES daily_challenges(id) ON DELETE CASCADE,
    display_name VARCHAR(100) NOT NULL,
    wpm NUMERIC(6, 2) NOT NULL,
    raw_wpm NUMERIC(6, 2) NOT NULL,
    cpm INT NOT NULL,
    accuracy NUMERIC(5, 2) NOT NULL,
    mistakes INT NOT NULL,
    consistency NUMERIC(5, 2) NOT NULL,
    completion_time NUMERIC(8, 2) NOT NULL, -- time taken in seconds
    score_rank_value NUMERIC(10, 2) NOT NULL, -- wpm * (accuracy/100) used for sorting
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Enforce one score per user per challenge
    UNIQUE (challenge_id, display_name)
);

-- Index challenge_id and score_rank_value for leaderboard sorting
CREATE INDEX IF NOT EXISTS idx_scores_challenge_id ON daily_challenge_scores (challenge_id);
CREATE INDEX IF NOT EXISTS idx_scores_ranking ON daily_challenge_scores (score_rank_value DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenge_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow public select access for anyone to see challenges and leaderboards
CREATE POLICY "Allow public read access to daily_challenges" 
ON daily_challenges 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to daily_challenge_scores" 
ON daily_challenge_scores 
FOR SELECT 
USING (true);

-- No public insert/update/delete policies are created.
-- All write operations are performed backend-side using the Supabase Service Role Key (admin client),
-- which bypasses RLS securely and prevents client-side database tampering.
