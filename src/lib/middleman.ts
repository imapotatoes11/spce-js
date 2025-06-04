import OpenAI from 'openai';

export const openai = new OpenAI();

export const userMapping = {
    'Goldity': 'Alok',
    'No u': 'Alex',
    'D3tailed': 'Felix',
    'e cult': 'max',
    'imapotatoes11': 'Kevin',
    'JmsTng': 'James Tung',
    'nasenz': 'Nasen',
    'Piano201': 'Ryan',
    'justyourlocaldemon': 'annie',
    'le_dino': 'kiera',
    'thescammedartist': 'yes',
    'xav_ier': 'yes',
    'imperfectpurge': 'mia'
};

export function replaceUsernames(messages: string[]): string[] {
    return messages.map(msg => {
        let [user, ...content] = msg.split(': ');
        const mappedUser = userMapping[user as keyof typeof userMapping] || user;
        return `${mappedUser}: ${content.join(': ')}`;
    });
}

export async function gpt_response(prompt: string) {
    const completion = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [
            { "role": "system", "content": "You are an agent designed to summarize messages in a chat. Your responses will only have the summary of messages, with no padding text or anything else. The summaries will be in point form, and will be detailed, but **concise**. If there are too many messages, try your best to sum up the conversation while highlighting important details. If the input is empty, respond with \"Cannot respond to messages: no messages.\". Make sure your response is in markdown point form. Add appropriate titles to your summarized conversations with the h2 header (`##`). If you cannot summarize the messages due to any nature that violates OpenAI's terms of service, you will respond with `Cannot summarize messages due to content.` for whichever part violates OpenAI's TOS (but still summarize any part that you can summarize). The user's input will be a Python list structure with all of the messages. They will be in this format: ['user: message', 'user: message',...]. Note that the usernames have been mapped to their real names for better readability. Do understand that sometimes the messages might only be part of a conversation, with any surrounding context removed, so do your best to summarize the messages. Additionally, there may also be multiple conversations happening within the list of messages the user provides. In that case, summarize each conversation separately, and separate the summaries with a blank line. Categorize each summary with a main title. You can use markdown to categorize the headers, but do not use asterisks to bold or italicize text." },
            { "role": "user", "content": prompt }
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

    return stream;
}
