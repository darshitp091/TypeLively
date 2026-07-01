// src/app/api/daily-challenge/leaderboard/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let challengeId = searchParams.get('challengeId');

    // Return high quality dummy list if Supabase is offline
    if (!isSupabaseAdminConfigured) {
      console.warn('Supabase not configured. Returning mock leaderboard.');
      return NextResponse.json([
        { id: 'm1', display_name: 'SpeedyNinja', wpm: 135.20, raw_wpm: 138.00, accuracy: 98.50, cpm: 676, mistakes: 2, consistency: 94.20, completion_time: 25.40, score_rank_value: 133.17, created_at: new Date().toISOString() },
        { id: 'm2', display_name: 'KeyboardWizard', wpm: 121.40, raw_wpm: 122.50, accuracy: 99.10, cpm: 607, mistakes: 1, consistency: 92.50, completion_time: 28.30, score_rank_value: 120.30, created_at: new Date().toISOString() },
        { id: 'm3', display_name: 'AdaLovelace', wpm: 104.80, raw_wpm: 110.20, accuracy: 95.10, cpm: 524, mistakes: 6, consistency: 88.00, completion_time: 32.10, score_rank_value: 99.66, created_at: new Date().toISOString() },
        { id: 'm4', display_name: 'TypeFaster', wpm: 87.50, raw_wpm: 89.00, accuracy: 98.30, cpm: 437, mistakes: 2, consistency: 91.00, completion_time: 38.60, score_rank_value: 86.01, created_at: new Date().toISOString() },
        { id: 'm5', display_name: 'NoviceNoodle', wpm: 54.10, raw_wpm: 60.50, accuracy: 89.40, cpm: 270, mistakes: 11, consistency: 78.40, completion_time: 62.40, score_rank_value: 48.36, created_at: new Date().toISOString() },
      ]);
    }

    if (!challengeId) {
      // Find today's challenge
      const today = new Date().toISOString().split('T')[0];
      const { data: challenge, error: challengeError } = await supabaseAdmin
        .from('daily_challenges')
        .select('id')
        .eq('challenge_date', today)
        .maybeSingle();

      if (challengeError) {
        console.error('Error fetching today\'s challenge in leaderboard:', challengeError);
        return NextResponse.json({ error: 'Database error finding challenge' }, { status: 500 });
      }

      if (!challenge) {
        return NextResponse.json([]); // No daily challenge generated yet
      }
      
      challengeId = challenge.id;
    }

    // Fetch scores from Supabase sorted by ranking score descending
    const { data: scores, error: scoresError } = await supabaseAdmin
      .from('daily_challenge_scores')
      .select('*')
      .eq('challenge_id', challengeId)
      .order('score_rank_value', { ascending: false })
      .limit(100);

    if (scoresError) {
      console.error('Error querying leaderboard:', scoresError);
      return NextResponse.json({ error: 'Failed to retrieve leaderboard scores' }, { status: 500 });
    }

    return NextResponse.json(scores);
  } catch (error: any) {
    console.error('Error in leaderboard API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
