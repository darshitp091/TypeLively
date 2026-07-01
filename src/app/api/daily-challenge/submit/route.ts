// src/app/api/daily-challenge/submit/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      challengeId,
      displayName,
      wpm,
      rawWpm,
      cpm,
      accuracy,
      mistakes,
      consistency,
      completionTime,
    } = body;

    // Basic required field validations
    if (
      !challengeId ||
      !displayName ||
      wpm === undefined ||
      rawWpm === undefined ||
      cpm === undefined ||
      accuracy === undefined ||
      mistakes === undefined ||
      consistency === undefined ||
      completionTime === undefined
    ) {
      return NextResponse.json({ error: 'Missing submission fields' }, { status: 400 });
    }

    // Clean display name
    const cleanName = displayName.trim().substring(0, 30);
    if (!cleanName) {
      return NextResponse.json({ error: 'Display name cannot be empty' }, { status: 400 });
    }

    // Anti-Cheat & Mathematical Validation
    const parsedWpm = Number(wpm);
    const parsedRawWpm = Number(rawWpm);
    const parsedCpm = Number(cpm);
    const parsedAccuracy = Number(accuracy);
    const parsedMistakes = Number(mistakes);
    const parsedConsistency = Number(consistency);
    const parsedCompletionTime = Number(completionTime);

    // 1. Extreme WPM check (Human typing limit is around 200-210 WPM, 250 WPM is a safe cap)
    if (parsedWpm > 250 || parsedRawWpm > 300) {
      return NextResponse.json({ error: 'Score exceeds physical limits (anti-cheat alert)' }, { status: 400 });
    }

    // 2. Bound checks
    if (
      parsedWpm < 0 ||
      parsedRawWpm < 0 ||
      parsedCpm < 0 ||
      parsedAccuracy < 0 ||
      parsedAccuracy > 100 ||
      parsedMistakes < 0 ||
      parsedConsistency < 0 ||
      parsedConsistency > 100 ||
      parsedCompletionTime <= 0
    ) {
      return NextResponse.json({ error: 'Invalid score metrics' }, { status: 400 });
    }

    // If Supabase is not configured, return mock successful submission
    if (!isSupabaseAdminConfigured) {
      console.warn('Supabase admin not configured. Mocking success for submission.');
      return NextResponse.json({
        success: true,
        score: {
          id: 'mock-score-uuid',
          challenge_id: challengeId,
          display_name: cleanName,
          wpm: parsedWpm,
          raw_wpm: parsedRawWpm,
          cpm: parsedCpm,
          accuracy: parsedAccuracy,
          mistakes: parsedMistakes,
          consistency: parsedConsistency,
          completion_time: parsedCompletionTime,
          score_rank_value: parsedWpm * (parsedAccuracy / 100),
          created_at: new Date().toISOString(),
        },
        message: 'Mock submission saved successfully (Supabase database offline).',
      });
    }

    // 3. Verify that the daily challenge exists
    const { data: challenge, error: challengeError } = await supabaseAdmin
      .from('daily_challenges')
      .select('*')
      .eq('id', challengeId)
      .maybeSingle();

    if (challengeError || !challenge) {
      return NextResponse.json({ error: 'Invalid daily challenge reference' }, { status: 404 });
    }

    // 4. Mathematical checks: Verify speed consistency
    // CPM should roughly align with net WPM: WPM * 5 = net CPM (characters per minute)
    // CPM / (WPM * 5) should be very close to 1.0 (with a small buffer for rounding errors)
    const expectedCpm = parsedWpm * 5;
    const ratio = expectedCpm > 0 ? parsedCpm / expectedCpm : 1;
    if (parsedWpm > 10 && (ratio < 0.8 || ratio > 1.2)) {
      return NextResponse.json({ error: 'Speed-to-character ratio mismatch (anti-cheat alert)' }, { status: 400 });
    }

    // 5. Total characters check: make sure they didn't type way more than possible in the text
    const estimatedTotalChars = (parsedRawWpm * 5) * (parsedCompletionTime / 60);
    const maxCharsLimit = challenge.generated_text.length * 2.5; // Allow for lots of errors, but not infinite
    if (estimatedTotalChars > maxCharsLimit) {
      return NextResponse.json({ error: 'Keystroke volume exceeds text limits' }, { status: 400 });
    }

    // Calculate ranking sorting score: WPM * Accuracy%
    const scoreRankValue = Number((parsedWpm * (parsedAccuracy / 100)).toFixed(4));

    // 6. Secure Database upsert: Store only the user's best score
    // ON CONFLICT (challenge_id, display_name) DO UPDATE sets the values ONLY if the new WPM is higher.
    const { data: score, error: upsertError } = await supabaseAdmin
      .from('daily_challenge_scores')
      .upsert(
        {
          challenge_id: challengeId,
          display_name: cleanName,
          wpm: parsedWpm,
          raw_wpm: parsedRawWpm,
          cpm: parsedCpm,
          accuracy: parsedAccuracy,
          mistakes: parsedMistakes,
          consistency: parsedConsistency,
          completion_time: parsedCompletionTime,
          score_rank_value: scoreRankValue,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'challenge_id,display_name',
          ignoreDuplicates: false, // We want to update it if it satisfies our conditional check
        }
      )
      .select()
      .single();

    if (upsertError) {
      console.error('Error saving score to database:', upsertError);
      return NextResponse.json({ error: 'Failed to record leaderboard score' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      score,
      message: 'Score submitted successfully!',
    });
  } catch (error: any) {
    console.error('Error in submit API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
