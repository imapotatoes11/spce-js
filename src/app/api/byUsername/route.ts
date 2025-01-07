import { DiscordMessageFetcher, AUTHORS } from '@/lib/messages';
import { NextResponse } from 'next/server';
import { replaceUsernames, gpt_response } from '@/lib/middleman';

export async function POST(req: Request) {
    try {
        // const { username } = await req.json();
        const { searchParams } = new URL(req.url)
        const username = searchParams.get('username') || "imapotatoes11";

        // if (!username || typeof username !== 'string') {
        //     return new NextResponse('Invalid username parameter', { status: 400 });
        // }

        // if (!Object.values(AUTHORS as Record<string, string>).includes(username)) {
        //     return new NextResponse('Username not found', { status: 404 });
        // }

        // STREAM PROGRESS
        // const encoder = new TextEncoder()
        // const stream = new TransformStream();
        // const writer = stream.writable.getWriter();

        // const writeProgress = async (status: string) => {
        //     await writer.write(encoder.encode(`data: ${JSON.stringify({ type: 'progress', message: status })}\n\n`));
        // }

        // const fetcher = new DiscordMessageFetcher();
        // const messages = await fetcher.getMessagesAfterDate(
        //     await fetcher.getLastMessageTimestampFromUser(AUTHORS[username as keyof typeof AUTHORS]),
        //     writeProgress
        // );

        // const mappedMessages = replaceUsernames(messages);
        // const gptStream = await gpt_response(JSON.stringify(mappedMessages))

        // await writer.write(encoder.encode(`data: ${JSON.stringify({ type: 'response', message: gptStream })}\n\n`));
        // await writer.close();

        // return new Response(stream.readable, {
        //     headers: {
        //         'Content-Type': 'text/event-stream',
        //         'Cache-Control': 'no-cache',
        //         'Connection': 'keep-alive',
        //     },
        // });

        const fetcher = new DiscordMessageFetcher();
        const messages = await fetcher.getMessagesAfterDate(
            await fetcher.getLastMessageTimestampFromUser(AUTHORS[username as keyof typeof AUTHORS])
        );
        const mappedMessages = replaceUsernames(messages);
        let stream = await gpt_response(JSON.stringify(mappedMessages));

        return new NextResponse(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
