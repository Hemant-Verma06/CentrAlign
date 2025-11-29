import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { verifyToken } from '@/lib/auth';
import { retrieveRelevantForms } from '@/lib/memory';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || ''
});

export async function POST(req: Request) {
    try {
        // 1. Auth Check
        const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
        const user = token ? verifyToken(token) : null;
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // 2. Retrieve Context (RAG)
        let contextString = '';
        try {
            const relevantForms = await retrieveRelevantForms(prompt, user.userId);
            if (relevantForms.length > 0) {
                contextString = relevantForms.map((f: any) =>
                    `- Purpose: ${f.purpose}\n  Structure: ${f.schemaSummary}`
                ).join('\n');
            }
        } catch (error) {
            console.log('Memory retrieval failed (continuing without context)');
        }

        // 3. Construct Prompt
        const systemPrompt = `You are a form schema generator. Generate ONLY valid JSON, nothing else.

Output this exact structure:
{
  "title": "Form Title",
  "description": "Brief description",
  "purpose": "Short summary",
  "schema": [
    {
      "label": "Field name",
      "type": "text|email|number|textarea|select|radio|checkbox|file|date",
      "required": true,
      "placeholder": "Hint text"
    }
  ]
}`;

        const userPrompt = `${contextString ? `Past similar forms:\n${contextString}\n\n` : ''}Create a form for: ${prompt}`;

        // 4. Call Groq API (FREE and FAST!)
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile", // Free, powerful model
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.3,
            max_tokens: 2048,
            response_format: { type: "json_object" } // Forces JSON output!
        });

        const responseText = completion.choices[0]?.message?.content || '{}';

        // 5. Parse JSON
        const formSchema = JSON.parse(responseText);

        // Validate
        if (!formSchema.title || !formSchema.schema || !Array.isArray(formSchema.schema)) {
            throw new Error('Invalid schema structure');
        }

        return NextResponse.json({ schema: formSchema }, { status: 200 });

    } catch (error: any) {
        console.error('Generation error:', error);

        return NextResponse.json({
            error: 'Failed to generate form',
            details: error.message || 'Unknown error'
        }, { status: 500 });
    }
}
