// messages.ts
import dotenv from 'dotenv';
import axios from 'axios';
import { DateTime } from 'luxon';

dotenv.config();

// Constants
const DEFAULT_CHANNEL = '1151707062208827414';
export const CHANNELS = {
    'woment': '1151707062208827414',
    'beans': '1250975268739485817',
    'beans2': '1320234641868722256'
}
const AUTHORS = {
    'imapotatoes11': '642455272702345247',
    'piano201': '573338203654717441',
    '_no.u': '642237307465760768',
    'jmstng': '573338203654717441',
} as const;

// Interfaces
interface DiscordMessage {
    author: {
        global_name: string;
    };
    content: string;
    timestamp: string;
}

interface SearchResponse {
    messages: [DiscordMessage][];
}

class DiscordMessageFetcher {
    private token: string;
    private channelId: string;
    private baseUrl: string;

    constructor(channelId: string = DEFAULT_CHANNEL) {
        this.token = process.env.DISCORD_AUTHORIZATION || '';
        if (!this.token) throw new Error('DISCORD_AUTHORIZATION not found in .env');

        this.channelId = channelId;
        this.baseUrl = `https://discord.com/api/v9/channels/${this.channelId}`;
    }

    private get headers() {
        return { Authorization: this.token };
    }

    private dateToSnowflake(date: string): string {
        const timestamp = DateTime.fromFormat(date, 'MM-dd-yyyy').toMillis();
        return ((timestamp - 1420070400000) * Math.pow(2, 22)).toString();
    }

    async getMessagesAfterDate(date: string, onProgress?: (status: string) => void): Promise<string[]> {
        const allMessages: string[] = [];
        let offset = 0;

        onProgress?.('retrieving messages...');
        while (true) {
            try {
                const url = `${this.baseUrl}/messages/search?min_id=${this.dateToSnowflake(date)}&offset=${offset}`;
                const response = await axios.get<SearchResponse>(url, { headers: this.headers });

                const messages = response.data.messages;
                if (!messages || messages.length === 0) {
                    console.log('No more messages found');
                    break;
                }

                const batch = messages.map(m =>
                    `${m[0].author.global_name}: ${m[0].content}`
                );
                allMessages.push(...batch);

                process.stdout.write(`retrieving messages (${offset}, ${batch.length} messages)\r`);
                onProgress?.(`retrieving messages (${offset}, ${batch.length} messages)`);
                offset += 25;

            } catch (error: any) {
                // If we're rate-limited, wait the suggested time and retry
                if (error.response?.status === 429) {
                    const retryAfter = parseInt(error.response.headers['retry-after']) || 1;
                    console.warn(`Rate limited. Retrying after ${retryAfter} seconds`);
                    await new Promise(res => setTimeout(res, retryAfter * 1000));
                    continue;
                }
                // Stop when no more messages
                if (error.response?.status === 400 || error.response?.status === 404) {
                    console.log(`Reached end with status code: ${error.response.status}`);
                    break;
                }
                // Other errors: abort
                console.error('Failed to retrieve messages:', error.response?.status);
                break;
            }
        }

        console.log(`Total messages found: ${allMessages.length}`);
        onProgress?.(`Total messages found: ${allMessages.length}`);
        return allMessages.reverse();
    }

    async getLastMessageTimestampFromUser(userId: string): Promise<string> {
        try {
            const url = `${this.baseUrl}/messages/search?author_id=${userId}`;
            const response = await axios.get<SearchResponse>(url, { headers: this.headers });

            const timestamp = response.data.messages[0][0].timestamp;
            return DateTime.fromISO(timestamp).toFormat('MM-dd-yyyy');
        } catch (error: any) {
            console.error('Failed to retrieve messages:', error.response?.status);
            console.error(error.response?.data);
            return 'nil';
        }
    }
}

export { DiscordMessageFetcher, AUTHORS };