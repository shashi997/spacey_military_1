// src/components/lesson/NarrationChat.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '../../firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { sendNarrationChatMessages } from '../../api/narration_api';
import { Send, User, Bot, ArrowDown, Mic, MicOff } from 'lucide-react';
// Per-chat TTS removed; centralized avatar handles speech
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useCoordinatedSpeechSynthesis } from '../../hooks/useSpeechCoordination';

const NarrationChat = ({ userId, lessonId, blockId, block }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const { speak, cancel } = useCoordinatedSpeechSynthesis('avatar');

    const {
        isListening,
        transcript,
        startListening,
        stopListening,
        isRecognitionSupported,
        speechError,
    } = useSpeechRecognition();

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
    }, [messages]);

    useEffect(() => {
        if (transcript) {
            setNewMessage(transcript);
        }
    }, [transcript]);

    const handleScroll = useCallback(() => {
        if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            // Show the scroll-to-bottom button if the user has scrolled up more than 100px from the bottom.
            const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
            // console.log(`Scroll position: ${scrollTop}, Scroll height: ${scrollHeight}, Client height: ${clientHeight}, Is scrolled up: ${isScrolledUp}`);
            
            setShowScrollButton(isScrolledUp);
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

        if (isListening) {
            stopListening();
        }

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

                // Centralized avatar voice for Spacey's response
                speak(aiResponse);

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
    }, [userId, lessonId, blockId, block, messages, scrollToBottom, newMessage, isListening, stopListening, speak]);

    const handleMicClick = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    useEffect(() => () => cancel(), [cancel]);

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
                {isTyping && (
                    <div className="mb-2 flex items-start justify-start">
                        <div className="mr-2">
                            <Bot size={20} className="text-gray-500" />
                        </div>
                        <div className="rounded-2xl break-words p-3 max-w-[80%] bg-gray-100 text-gray-800 italic animate-pulse">
                            Spacey is typing...
                        </div>
                    </div>
                )}
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
            <div>
                <div className="p-2 border-t border-gray-300 flex items-center">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={isListening ? "Listening..." : "Type your message..."}
                        className="flex-1 p-2 border border-gray-300 rounded-md mr-2 focus:outline-none focus:border-blue-500"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !isLoading && newMessage.trim() !== '') {
                                sendMessage();
                            }
                        }}
                        disabled={isLoading}
                    />
                    {isRecognitionSupported && (
                        <button
                            type="button"
                            onClick={handleMicClick}
                            disabled={isLoading}
                            className={`p-3 rounded-md mr-2 transition-colors ${
                                isListening 
                                ? 'bg-red-500 text-white animate-pulse' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>
                    )}
                    <button
                        onClick={sendMessage}
                        className={`bg-blue-500 text-white p-3 rounded-md hover:bg-blue-700 ${isLoading || newMessage.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isLoading || newMessage.trim() === ''}
                    >
                        <Send size={20} />
                    </button>
                </div>
                {speechError && <div className="p-2 text-xs text-red-500 bg-red-100 border-t border-gray-300">{speechError}</div>}
            </div>
        </div>
    );
};

export default NarrationChat;
