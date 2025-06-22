import { useWebRTC } from '@/context/WebRTCProvider';
import { useEffect, useState } from 'react';

interface ChatMessage {
    id: string;
    message: string;
    sender: 'me' | 'opponent';
    timestamp: Date;
}

function Chat() {
    const { peerId, connectToPeer, sendData, registerDataHandler, isConnected } = useWebRTC();
    
    
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');

    const handleChatMessage = (data: any) => {
        console.log('Received chat message:', data);
        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            message: data.message,
            sender: 'opponent',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
    };

    useEffect(() => {
        // Register game-specific handlers
        const cleanups = [
            registerDataHandler('chat', handleChatMessage)
        ];
        
        return () => cleanups.forEach(cleanup => cleanup());
    }, []);


    const sendMessage = () => {
        if (inputMessage.trim() && isConnected) {
            const newMessage: ChatMessage = {
                id: Date.now().toString(),
                message: inputMessage.trim(),
                sender: 'me',
                timestamp: new Date()
            };
            
            // Add to local messages
            setMessages(prev => [...prev, newMessage]);
            
            // Send to opponent
            sendData({ type: 'chat', message: inputMessage.trim() });
            
            // Clear input
            setInputMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen min-w-screen bg-gray-900 text-white">
            <div className="w-full max-w-2xl h-96 flex flex-col bg-gray-800 rounded-lg shadow-lg">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-semibold">Chat</h2>
                    <p className="text-sm text-gray-400">
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </p>
                    <div>
                        <p className ="text-sm text-gray-400">
                            Peer ID: { peerId || 'No Peer ID available' }
                        </p>
                        <button onClick={() => navigator.clipboard.writeText(peerId || '')} className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Copy ID</button>
                    </div>
                    <div>
                        <div className="mt-3">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    placeholder="Enter peer ID to connect..."
                                    className="flex-1 px-3 py-1 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                                <button
                                    onClick={(e) => {
                                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                        connectToPeer(input.value.trim());
                                        input.value = '';
                                    }}
                                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                >
                                    Connect
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.length === 0 ? (
                        <div className="text-center text-gray-500">
                            No messages yet. Start the conversation!
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs px-4 py-2 rounded-lg ${
                                        msg.sender === 'me'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-700 text-white'
                                    }`}
                                >
                                    <p>{msg.message}</p>
                                    <p className="text-xs mt-1 opacity-70">
                                        {msg.timestamp.toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-700">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={isConnected ? "Type a message..." : "Waiting for connection..."}
                            disabled={!isConnected}
                            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!isConnected || !inputMessage.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;