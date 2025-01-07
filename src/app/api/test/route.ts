import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(req: Request) {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { "role": "system", "content": "You are a helpful assistant." }, // Changed role to system
            { "role": "user", "content": "Pros and cons of using rust" }
        ],
        stream: true,
    });

    // Create a readable stream
    const stream = new ReadableStream({
        async start(controller) {
            for await (const chunk of completion) {
                const content = chunk.choices[0].delta.content;
                if (content) {
                    controller.enqueue(new TextEncoder().encode(content));
                }
            }
            controller.close();
        },
    });

    // Return streaming response
    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
