import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const data = await request.json();

    // Create search prompt
    const searchPrompt = `Find 3 leading companies in ${data.industry} industry targeting ${data.targetAudience}`;

    // Get competitors using OpenAI
    const competitorsCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: searchPrompt }]
    });
    const competitors = competitorsCompletion.choices[0].message.content;

    // Create design prompt
    const designPrompt = `Based on this business idea: ${data.businessIdea}, 
      industry: ${data.industry}, target audience: ${data.targetAudience}, 
      and key features: ${data.keyFeatures}, provide website design recommendations.`;

    // Get design recommendations using OpenAI
    const designCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: designPrompt }]
    });
    const design = designCompletion.choices[0].message.content;

    // Return the response
    return NextResponse.json({
      competitors,
      design
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze business' },
      { status: 500 }
    );
  }
} 