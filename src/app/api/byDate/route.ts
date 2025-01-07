import { DiscordMessageFetcher, CHANNELS } from '@/lib/messages';
import { NextResponse } from 'next/server';
import { replaceUsernames, gpt_response } from '@/lib/middleman';

// export async function OLDPOST(req: Request) {
//     try {
//         const { searchParams } = new URL(req.url)
//         const date = searchParams.get('selectedDate') || new Date().toLocaleDateString('en-US').split('/').join('-');
//         console.log(searchParams)

//         // if (!date || isNaN(Date.parse(date))) {
//         //     return new NextResponse('Invalid date parameter', { status: 400 });
//         // }
//         console.log(`!! new request for date: ${date}`);

//         const fetcher = new DiscordMessageFetcher();
//         const messages = await fetcher.getMessagesAfterDate(date);
//         const mappedMessages = replaceUsernames(messages);
//         let stream = await gpt_response(JSON.stringify(mappedMessages));

//         return new NextResponse(stream, {
//             headers: {
//                 'Content-Type': 'text/event-stream',
//                 'Cache-Control': 'no-cache',
//                 'Connection': 'keep-alive',
//             },
//         });
//     } catch (error) {
//         return new NextResponse('Internal Server Error', { status: 500 });
//     }
// }


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const date = body.selectedDate || new Date().toLocaleDateString('en-US').split('/').join('-');
        console.log('Received date:', date);
        const channel = CHANNELS[body.channel as keyof typeof CHANNELS] || CHANNELS.woment

        const fetcher = new DiscordMessageFetcher(channel);
        const messages = await fetcher.getMessagesAfterDate(date);
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
        console.error('Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}