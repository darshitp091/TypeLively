// src/app/api/daily-challenge/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase';
import { generateParagraph } from '@/lib/groq';

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];

    // If Supabase is not configured, return a mock challenge to keep development clean
    if (!isSupabaseAdminConfigured) {
      console.warn('Supabase admin client not configured. Returning mock daily challenge.');
      return NextResponse.json({
        id: 'mock-challenge-uuid',
        challenge_date: today,
        mode_type: 'time',
        duration_value: 60,
        page_count: null,
        difficulty: 'medium',
        content_type: 'general',
        language: 'english',
        coding_language: null,
        generated_text: 'This is a mock daily challenge text because Supabase is not fully configured in your environment variables. Please check your .env.local setup to connect to a real database.',
        word_count: 27,
      });
    }

    // Check if challenge exists for today
    const { data: existingChallenge, error: fetchError } = await supabaseAdmin
      .from('daily_challenges')
      .select('*')
      .eq('challenge_date', today)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching today\'s challenge:', fetchError);
      return NextResponse.json({ error: 'Database fetch error' }, { status: 500 });
    }

    if (existingChallenge) {
      if (existingChallenge.language === 'english') {
        return NextResponse.json(existingChallenge);
      } else {
        // Automatically delete legacy non-English challenge so a correct English one is generated
        await supabaseAdmin
          .from('daily_challenges')
          .delete()
          .eq('id', existingChallenge.id);
      }
    }

    // Generate a surprise challenge configuration for today (English only, surprise type)
    const selectedLanguage = 'english';

    const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
    const selectedDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

    // Surprise type: general prose, quotes, or story elements (No coding, no Indic scripts)
    const types = ['general', 'quote', 'story'] as const;
    const selectedContentType = types[Math.floor(Math.random() * types.length)];
    const selectedCodingLanguage = undefined;

    // Timed (60%) or Page-based (40%) surprise formats
    const selectedModeType = Math.random() < 0.6 ? 'time' : 'page';
    let selectedDuration: number | null = null;
    let selectedPageCount: number | null = null;

    if (selectedModeType === 'time') {
      const durations = [60, 180, 300]; // 1, 3, 5 minutes
      selectedDuration = durations[Math.floor(Math.random() * durations.length)];
    } else {
      const pages = [1, 2];
      selectedPageCount = pages[Math.floor(Math.random() * pages.length)];
    }

    // Generate typing paragraph content using Groq helper
    const result = await generateParagraph({
      testMode: selectedModeType,
      duration: selectedDuration || undefined,
      pageCount: selectedPageCount || undefined,
      difficulty: selectedDifficulty,
      contentType: selectedContentType,
      language: selectedLanguage,
      codingLanguage: selectedCodingLanguage,
    });

    // Try to insert today's challenge
    const { data: newChallenge, error: insertError } = await supabaseAdmin
      .from('daily_challenges')
      .insert({
        challenge_date: today,
        mode_type: selectedModeType,
        duration_value: selectedDuration,
        page_count: selectedPageCount,
        difficulty: selectedDifficulty,
        content_type: selectedContentType,
        language: selectedLanguage,
        coding_language: null,
        generated_text: result.text,
        word_count: result.wordCount,
      })
      .select()
      .single();

    if (insertError) {
      // In case of parallel execution conflict, query again for today's challenge
      if (insertError.code === '23505') {
        const { data: doubleCheck, error: doubleCheckError } = await supabaseAdmin
          .from('daily_challenges')
          .select('*')
          .eq('challenge_date', today)
          .single();

        if (doubleCheckError) {
          console.error('Error fetching challenge on concurrency conflict:', doubleCheckError);
          return NextResponse.json({ error: 'Database conflict resolving failed' }, { status: 500 });
        }
        return NextResponse.json(doubleCheck);
      }

      console.error('Error inserting today\'s challenge:', insertError);
      return NextResponse.json({ error: 'Failed to save daily challenge' }, { status: 500 });
    }

    return NextResponse.json(newChallenge);
  } catch (error: any) {
    console.error('Error in daily-challenge API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
