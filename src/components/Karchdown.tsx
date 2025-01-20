'use client'

import { useState, useEffect } from 'react';
import { TextAnimate } from "./ui/text-animate";
import { AnimatePresence } from "motion/react";

interface KarchdownProps {
    className: string;
    raw: string;
}

interface Token {
    text: string;
    id: number;
    animated: boolean;
    delay: number;
}

export default function Karchdown({ className = '', raw = '' }: KarchdownProps) {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [nextId, setNextId] = useState(0);
    const [lastDelay, setLastDelay] = useState(0);

    useEffect(() => {
        if (raw.length < tokens.reduce((acc, t) => acc + t.text.length, 0)) {
            setTokens([{
                text: raw,
                id: nextId,
                animated: false,
                delay: 0
            }]);
            setNextId(prev => prev + 1);
            setLastDelay(0);
        } else {
            const newContent = raw.slice(tokens.reduce((acc, t) => acc + t.text.length, 0));
            if (newContent) {
                const newDelay = lastDelay + 0.15;
                setTokens(prev => [...prev, {
                    text: newContent,
                    id: nextId,
                    animated: false,
                    delay: newDelay
                }]);
                setNextId(prev => prev + 1);
                setLastDelay(newDelay);
            }
        }
    }, [raw]);

    return (
        <div className={className}>
            <AnimatePresence mode="sync">
                {tokens.map(({ text, id, animated, delay }) => (
                    <span key={id} style={{ display: 'inline-block' }}>
                        {!animated ? (
                            <TextAnimate
                                animation="slideLeft"
                                by="character"
                                delay={delay}
                                startOnView={false}
                                onAnimationComplete={() => {
                                    setTokens(prev =>
                                        prev.map(t => t.id === id ? { ...t, animated: true } : t)
                                    );
                                }}
                            >
                                {text}
                            </TextAnimate>
                        ) : (
                            text
                        )}
                    </span>
                ))}
            </AnimatePresence>
        </div>
    );
}