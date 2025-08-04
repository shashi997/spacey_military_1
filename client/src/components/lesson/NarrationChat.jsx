// src/components/lesson/NarrationChat.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '../../firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { sendNarrationChatMessages } from '../../api/narration_api';
import { Send, User, Bot, ArrowDown } from 'lucide-react';

const NarrationChat = ({ userId, lessonId, blockId, block }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    useEffect(() => {
        const messagesRef = collection(db, 'narrationChats', `${userId}_${lessonId}`, blockId);
        const q = query(messagesRef, orderBy('createdAt'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chatMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(chatMessages);
        });

        return () => unsubscribe();
    }, [userId, lessonId, blockId]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const handleScroll = useCallback(() => {
        if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
            setShowScrollButton(!isNearBottom);
        }
    }, []);

    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            chatContainer.addEventListener('scroll', handleScroll);
            return () => chatContainer.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    const sendMessage = useCallback(async () => {
        if (newMessage.trim() === '') return;

        setIsLoading(true);
        const messagesRef = collection(db, 'narrationChats', `${userId}_${lessonId}`, blockId);

        const newMessageObj = {
            text: newMessage,
            sender: 'user',
            createdAt: new Date()
        };

        // Optimistically add the user message to the local state
        setMessages(prevMessages => [...prevMessages, newMessageObj]);

        // Clear the input field immediately after sending
        setNewMessage('');

        // Add typing message with a unique ID
        const typingMessageId = `typing-${Date.now()}`;
        const typingMessage = {
            id: typingMessageId,
            text: "Spacey is typing...",
            sender: 'ai',
            temp: true
        };

        setMessages(prevMessages => [...prevMessages, typingMessage]);
        setIsTyping(true);

        try {
            await addDoc(messagesRef, newMessageObj); // Save user message to Firestore

            const responseData = await sendNarrationChatMessages(userId, lessonId, blockId, [...messages, newMessageObj], block);

            console.log('Message sent to backend successfully!');

            if (responseData && responseData.aiResponse) {
                const aiResponse = responseData.aiResponse;

                await addDoc(messagesRef, {
                    text: aiResponse,
                    sender: 'ai',
                    createdAt: new Date()
                });

                setMessages(prevMessages => {
                    return prevMessages.map(msg =>
                        msg.id === typingMessageId ? { ...msg, text: aiResponse, sender: 'ai', temp: false, createdAt: new Date() } : msg
                    ).filter(msg => !msg.temp); //Also filter here so only the updated typing message remains, since the map will keep it around
                });
            } else {
                throw new Error("Invalid response from backend");
            }


        } catch (error) {
            console.error('Failed to send message to backend:', error);

            setMessages(prevMessages => {
                return prevMessages.map(msg =>
                    msg.id === typingMessageId ? { ...msg, text: "Failed to get response. Please try again.", sender: 'ai', error: true, temp: false, createdAt: new Date() } : msg
                );
            });
        } finally {
            setIsTyping(false);
            setIsLoading(false);
            scrollToBottom();
        }
    }, [userId, lessonId, blockId, block, messages, scrollToBottom]);

    return (
        <div className="flex flex-col h-full border border-gray-300 rounded-md overflow-hidden">
            <div
                className="flex-1 p-3 overflow-y-auto relative scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 max-h-[60vh]"
                ref={chatContainerRef}
            >
                {messages.map(msg => (
                    <div
                        key={msg.id || Math.random()}
                        className={`mb-2 flex items-start ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'
                            }`}
                    >
                        {/* Avatar */}
                        <div className="mr-2">
                            {msg.sender === 'ai' ? <Bot size={20} className="text-gray-500" /> : <User size={20} className="text-blue-200" />}
                        </div>

                        {/* Message Bubble */}
                        <div
                            className={`rounded-2xl break-words p-3 max-w-[80%] ${msg.sender === 'ai' ? 'bg-gray-100 text-gray-800' : 'bg-blue-500 text-white'
                                } ${msg.error ? 'bg-red-500 text-white' : ''}`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />

                {showScrollButton && (
                    <button
                        onClick={scrollToBottom}
                        className="absolute bottom-4 right-4 bg-gray-200 rounded-full p-2 shadow-md hover:bg-gray-300"
                    >
                        <ArrowDown size={20} className="text-gray-700" />
                    </button>
                )}
            </div>

            {/* Input Area */}
            <div className="p-2 border-t border-gray-300 flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border border-gray-300 rounded-md mr-2 focus:outline-none focus:border-blue-500"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !isLoading && newMessage.trim() !== '') {
                            sendMessage();
                        }
                    }}
                />
                <button
                    onClick={sendMessage}
                    className={`bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 ${isLoading || newMessage.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isLoading || newMessage.trim() === ''}
                >
                    Send
                    <Send size={16} />
                </button>
            </div>
        </div>
    );
};

export default NarrationChat;
