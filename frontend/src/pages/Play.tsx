import { useState, useEffect } from 'react';

import { useWebRTC } from '@/context/WebRTCProvider';
import { useNavigate } from 'react-router';
import { nanoid } from 'nanoid';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

function Play() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [gameId, _] = useState("game#" + nanoid(7)); // Generate a unique game ID using nanoid
    const navigate = useNavigate();
    const { peerId, connectToPeer, sendData, registerDataHandler, connectionState, isConnected, isHost } = useWebRTC();
    
    
    const gameStatus = connectionState || 'waiting'; // Default to 'waiting' if no state is set
    const [opponentId, setOpponentId] = useState('');

    const handleGameMessage = (data: any) => {
        console.log('Received game message:', data);
    };

    useEffect(() => {
        // Register game-specific handlers
        const cleanups = [
            registerDataHandler('game', handleGameMessage)
        ];
        
        return () => cleanups.forEach(cleanup => cleanup());
    }, []);

    useEffect(() => {
        if (isConnected && gameStatus === 'connecting') {
            // Send game join message when connected
            sendData({ type: 'game', gameId });
        }

    }, [isConnected, gameStatus, gameId, sendData]);

    const handleConnect = () => {
        if (opponentId.trim()) {
            connectToPeer(opponentId.trim());
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleConnect();
        }
    };

    const getStatusMessage = () => {
        switch (gameStatus) {
            case 'disconnected':
                return 'Waiting for opponent to join...';
            case 'connecting':
                return 'Connecting to opponent...';
            case 'connected':
                return 'Connected! Game ready to start.';
            default:
                return 'Unknown status';
        }
    };

    const getStatusColor = () => {
        switch (gameStatus) {
            case 'disconnected':
                return 'text-yellow-400';
            case 'connecting':
                return 'text-blue-400';
            case 'connected':
                return 'text-green-400';
            default:
                return 'text-gray-400';
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen min-w-screen bg-gray-900 text-white">
            <div className="w-full max-w-2xl flex flex-col bg-gray-800 rounded-lg shadow-lg p-6">
                {/* Game Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold mb-2">Game Lobby</h1>
                    {gameId && (
                        <p className="text-lg text-gray-300">
                            <span className="font-mono text-amber-400 text-lg">{gameId}</span>
                        </p>
                    )}
                </div>

                {/* Connection Status */}
                <div className="bg-gray-700 rounded-lg p-4 mb-6">
                    <h2 className="text-xl font-semibold mb-3">Connection Status</h2>
                    <p className={`text-lg font-medium ${getStatusColor()}`}>
                        {getStatusMessage()}
                    </p>
                </div>

                {/* Your Peer ID Section */}
                <div className="bg-gray-700 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold mb-3">Your Game Code</h3>
                    <div className="flex items-center space-x-3">
                        <div className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded-md font-mono text-amber-400">
                            {peerId || 'Generating code...'}
                        </div>
                        <Button 
                            onClick={() => navigator.clipboard.writeText(peerId || '')}
                            disabled={!peerId}
                            variant="outline"
                            size="icon"
                            className="bg-gray-600 border-gray-500 hover:bg-gray-500 hover:border-gray-400 text-amber-400 hover:text-amber-300
                            px-5 py-5 hover:cursor-pointer"
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                        Share this code with your opponent so they can join your game.
                    </p>
                </div>

                {/* Join Game Section */}
                <div className="bg-gray-700 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold mb-3">Join Opponent's Game</h3>
                    <div className="flex space-x-3">
                        <input
                            type="text"
                            value={opponentId}
                            onChange={(e) => setOpponentId(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter opponent's game code..."
                            disabled={gameStatus === 'connecting' || gameStatus === 'connected'}
                            className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        />
                        <Button
                            onClick={handleConnect}
                            disabled={!opponentId.trim() || gameStatus === 'connecting' || gameStatus === 'connected'}
                            variant="default"
                            size="default"
                            className="bg-green-600 hover:bg-green-700 focus-visible:ring-green-500 hover:cursor-pointer"
                        >
                            {gameStatus === 'connecting' ? 'Connecting...' : 'Connect'}
                        </Button>
                    </div>
                </div>

                {/* Game Actions */}
                {gameStatus === 'connected' && (
                    <div className="bg-green-800 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-3 text-green-100">Ready to Play!</h3>
                        {isHost ? (
                            <div className="flex space-x-3">
                                <Button 
                                    onClick={() => navigate('/play/' + gameId)}
                                    variant="default"
                                    size="lg"
                                    className="flex-1 bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-500 font-semibold hover:cursor-pointer"
                                >
                                    Start Game
                                </Button>
                                <Button 
                                    onClick={() => navigate('/chat')}
                                    variant="default"
                                    size="lg"
                                    className="bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500 hover:cursor-pointer"
                                >
                                    Open Chat
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="text-green-100 mb-3">Waiting for host to start the match...</p>
                                <Button 
                                    onClick={() => navigate('/chat')}
                                    variant="default"
                                    size="lg"
                                    className="bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500 hover:cursor-pointer"
                                >
                                    Open Chat
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Back Button */}
                <div className="mt-6 text-center">
                    <Button 
                        onClick={() => navigate('/')}
                        size="default"
                        className="text-gray-400 hover:text-white underline hover:cursor-pointer"
                    >
                        ← Back to Home
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Play;
