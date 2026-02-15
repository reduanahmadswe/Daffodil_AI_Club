'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, MessageSquare } from 'lucide-react';
import chatbotData from '@/data/chatbotQuestions.json';

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

type Message = {
    id: string;
    type: 'bot' | 'user';
    text: string;
};

type Question = {
    id: number;
    question: string;
    answer: string;
};

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [suggestedQuestions, setSuggestedQuestions] = useState<Question[]>([]);
    const [animationData, setAnimationData] = useState(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load Lottie animation
    useEffect(() => {
        fetch('/animations/livechatbot.json')
            .then((res) => res.json())
            .then((data) => setAnimationData(data))
            .catch((err) => console.error('Failed to load chatbot animation:', err));
    }, []);

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Initialize chat when opened
    useEffect(() => {
        if (isOpen) {
            if (messages.length === 0) {
                setMessages([
                    {
                        id: 'welcome',
                        type: 'bot',
                        text: 'Hi there! 👋 I am the DAIC AI Assistant. Ask me anything about the Daffodil AI Club website!',
                    },
                ]);
            }
            // Randomly select 5 questions
            const shuffled = [...chatbotData.questions].sort(() => 0.5 - Math.random());
            setSuggestedQuestions(shuffled.slice(0, 5));
        }
    }, [isOpen]);

    const handleSendMessage = (text: string) => {
        if (!text.trim()) return;

        // Add user message
        const mid = Date.now().toString();
        setMessages((prev) => [...prev, { id: mid, type: 'user', text }]);
        setInputValue('');

        // Simulate thinking delay
        setTimeout(() => {
            const response = findAnswer(text);
            setMessages((prev) => [
                ...prev,
                { id: mid + '_bot', type: 'bot', text: response },
            ]);
        }, 600);
    };

    const findAnswer = (input: string): string => {
        const normalize = (str: string) => str.toLowerCase().replace(/[^\w\s]/gi, '');
        const cleanInput = normalize(input);

        // 1. Direct match with stored questions
        const exactMatch = chatbotData.questions.find((q) =>
            normalize(q.question) === cleanInput
        );
        if (exactMatch) return exactMatch.answer;

        // 2. Fuzzy/Keyword match
        // Check if the question text contains the user input keywords or vice versa
        const bestMatch = chatbotData.questions.find((q) => {
            const qText = normalize(q.question);
            // Simple heuristic: if input is part of question or question is part of input (if long enough)
            return qText.includes(cleanInput) || (cleanInput.length > 5 && cleanInput.includes(qText));
        });

        if (bestMatch) return bestMatch.answer;

        // 3. Keyword scoring (fallback for more loose matching)
        const keywords = cleanInput.split(' ').filter(w => w.length > 3);
        if (keywords.length > 0) {
            const scored = chatbotData.questions.map(q => {
                const qText = normalize(q.question);
                let score = 0;
                keywords.forEach(k => {
                    if (qText.includes(k)) score++;
                });
                return { ...q, score };
            });

            const topScored = scored.sort((a, b) => b.score - a.score)[0];
            if (topScored && topScored.score > 0) return topScored.answer;
        }

        // 4. Default fallback
        return 'I can only help with questions related to the Daffodil AI Club website. Please try selecting a topic from the suggestions.';
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-[90vw] md:w-[400px] h-[500px] bg-nexus-surface-1/95 backdrop-blur-xl border border-nexus-border rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 pointer-events-auto"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-nexus-purple/20 to-nexus-pink/20 border-b border-nexus-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nexus-purple to-nexus-pink flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-nexus-text" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-nexus-text text-sm">DAIC Assistant</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] text-white/50">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-nexus-glass rounded-lg transition-colors text-nexus-text/70 hover:text-nexus-text"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.type === 'user'
                                            ? 'bg-nexus-purple text-nexus-text rounded-br-none'
                                            : 'bg-nexus-glass text-nexus-text/90 rounded-bl-none border border-nexus-border'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Suggested Questions */}
                            {messages.length === 1 && (
                                <div className="grid gap-2 mt-4">
                                    <p className="text-xs text-white/40 mb-1 ml-1">Suggested topics:</p>
                                    {suggestedQuestions.map((q) => (
                                        <button
                                            key={q.id}
                                            onClick={() => handleSendMessage(q.question)}
                                            className="text-left p-2.5 rounded-xl bg-nexus-glass hover:bg-nexus-glass border border-nexus-border hover:border-nexus-purple/30 transition-all text-xs text-nexus-text/80 hover:text-nexus-purple"
                                        >
                                            {q.question}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-nexus-glass border-t border-nexus-border">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage(inputValue);
                                }}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask about DAIC..."
                                    className="flex-1 bg-black/50 border border-nexus-border rounded-xl px-4 py-2.5 text-sm text-nexus-text focus:outline-none focus:border-nexus-purple/50 placeholder:text-white/20"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="p-2.5 bg-nexus-purple hover:bg-nexus-purple/80 text-nexus-text rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center relative pointer-events-auto drop-shadow-2xl hover:drop-shadow-[0_0_25px_rgba(123,97,255,0.5)] transition-all"
            >
                {animationData ? (
                    <div className="w-full h-full">
                        <Lottie animationData={animationData} loop={true} />
                    </div>
                ) : (
                    <div className="w-14 h-14 rounded-full bg-nexus-purple flex items-center justify-center shadow-lg">
                        <MessageSquare className="w-7 h-7 text-nexus-text" />
                    </div>
                )}
            </motion.button>
        </div>
    );
}
