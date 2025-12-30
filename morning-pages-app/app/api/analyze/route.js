import Anthropic from '@anthropic-ai/sdk';

export async function POST(request) {
  try {
    const { text } = await request.json();
    
    if (!text || text.split(/\s+/).length < 200) {
      return Response.json(
        { error: 'Need at least 200 words for analysis' },
        { status: 400 }
      );
    }
    
    const client = new Anthropic();
    
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a writing coach analyzing morning pages — private, stream-of-consciousness writing. Your job is to identify craft patterns and give specific, actionable suggestions for improvement.

Analyze this writing and respond in this exact JSON format (no markdown, no backticks, just raw JSON):

{
  "voiceObservation": "One sentence about the writer's unique voice or style you notice",
  "emotionalUndercurrent": "One sentence about what emotional current runs beneath the surface",
  "hiddenStrength": "One specific strength in their writing they might not see themselves",
  "primaryWeakness": {
    "name": "Name of the main craft issue (3-5 words)",
    "observation": "What you noticed in their writing (1-2 sentences)",
    "whyItMatters": "Why this limits their writing (1 sentence)",
    "tomorrowFocus": "Specific thing to focus on tomorrow (1-2 sentences)",
    "microExercise": "A 5-minute exercise they can do right now (2-3 sentences)"
  },
  "secondaryWeakness": {
    "name": "Name of secondary issue (3-5 words)",
    "observation": "What you noticed (1 sentence)",
    "quickFix": "One specific technique to try (1-2 sentences)"
  },
  "sentenceToRevise": {
    "original": "Copy one sentence from their writing that could be stronger",
    "revised": "Show them how you'd revise it",
    "principle": "The craft principle this demonstrates (5-10 words)"
  },
  "questionToSitWith": "One reflective question based on what they wrote that might unlock something"
}

Here is the writing to analyze:

${text.substring(0, 6000)}`
        }
      ]
    });
    
    const responseText = message.content[0].text;
    const cleanedText = responseText.replace(/```json|```/g, '').trim();
    const analysis = JSON.parse(cleanedText);
    
    return Response.json(analysis);
    
  } catch (error) {
    console.error('Analysis error:', error);
    return Response.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}
