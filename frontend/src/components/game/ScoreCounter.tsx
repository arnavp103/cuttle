import { useState } from 'react';
import { useGame } from '@/context/GameProvider';

export interface ScoreCounterProps {
    score: number;
    playerName: string;
}

function ScoreCounter({ score, playerName }: ScoreCounterProps) {
    const [currentScore, setCurrentScore] = useState(score);
    const [winCon, setWinCon] = useState(21);

    const { player } = useGame();
    
    const updateWincon = (newScore: number) => {
        // This function can be used to update the score dynamically
        // For example, it could be called when a player scores points
        setWinCon(newScore);
    }

    const updateScore = (newScore: number) => {
        // This function can be used to update the score dynamically
        // For example, it could be called when a player scores points
        setCurrentScore(newScore);
    }

    return (
        <div className="score-counter flex flex-col items-center justify-center p-4 bg-gray-200 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">{playerName}'s Score</h2>
            <p className="text-2xl">{currentScore}/{winCon}</p>
        </div>
    );

}

export default ScoreCounter;