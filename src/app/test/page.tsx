"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

const TestPage = () => {
    const [response, setResponse] = useState('');
    const [progress, setProgress] = useState('');
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('imapotatoes11')

    const generateResponse = async () => {
        try {
            setLoading(true);
            setResponse(''); // Reset previous response
            // setProgress('')

            // const eventSource = new EventSource(`/api/byUsername?username=${encodeURIComponent(username)}`)

            // eventSource.onmessage = (event) => {
            //     const data = JSON.parse(event.data)

            //     if (data.type === 'progress') {
            //         setProgress(data.message)
            //     } else if (data.type === 'response') {
            //         setResponse(data.message)
            //         setLoading(false)
            //         eventSource.close()
            //     }
            // }

            // eventSource.onerror = (error) => {
            //     console.error('EventSource failed:', error)
            //     setLoading(false)
            //     eventSource.close()
            // }
            const res = await fetch('/api/byUsername', {
                method: 'POST',
                body: JSON.stringify({
                    username: username
                })
            });

            const reader = res.body?.getReader();
            if (!reader) return;

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const text = new TextDecoder().decode(value).replace(/\n/g, '<br>');
                setResponse((prev) => prev + text);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
            />
            <Button onClick={generateResponse} disabled={loading}>
                Generate Response
            </Button>
            {loading && <div>{progress || 'Loading...'}</div>}
            {/* {response && <div>{response}</div>} */}
            {response && (
                <div
                    className="whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: response }}
                />
            )}
        </div>
    );
};

export default TestPage;
