import { DiscordMessageFetcher } from '@/lib/messages';
import { NextResponse } from 'next/server';
import { replaceUsernames, gpt_response } from '@/lib/middleman';

export async function POST(req: Request) {
    const fetcher = new DiscordMessageFetcher(); //default woment channel

    // Get messages after date
    const messages = await fetcher.getMessagesAfterDate('12-30-2024');
    const mappedMessages = replaceUsernames(messages);
    let stream = await gpt_response(JSON.stringify(mappedMessages));

    // Return streaming response
    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
