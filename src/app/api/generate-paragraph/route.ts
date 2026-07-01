// src/app/api/generate-paragraph/route.ts
import { NextResponse } from 'next/server';
import { generateParagraph } from '@/lib/groq';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      testMode, 
      duration, 
      pageCount, 
      difficulty, 
      contentType, 
      language, 
      codingLanguage 
    } = body;

    // Validate parameters
    if (!testMode || !difficulty || !contentType || !language) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    if (testMode === 'time' && !duration) {
      return NextResponse.json({ error: 'Duration is required for timed mode' }, { status: 400 });
    }

    if (testMode === 'page' && !pageCount) {
      return NextResponse.json({ error: 'Page count is required for page mode' }, { status: 400 });
    }

    const result = await generateParagraph({
      testMode,
      duration: duration ? Number(duration) : undefined,
      pageCount: pageCount ? Number(pageCount) : undefined,
      difficulty,
      contentType,
      language,
      codingLanguage,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error generating paragraph API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
