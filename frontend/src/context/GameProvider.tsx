import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useWebRTC } from './WebRTCProvider';

type GameContextType = {
    inGame: boolean; // Indicates if the player is in a game
    turn: number;
    legal_moves: string[];
    player: string;
    // playCard: (card: string) => void; // Uncomment if you implement playCard function
};


const GameContext = createContext<GameContextType | null>(null);


export const GameProvider = ({ children }: { children: ReactNode }) => {
    const { isHost } = useWebRTC(); // Get the isHost value from WebRTC context
    
    // The state of the game
    const [state, setState] = useState<GameContextType>({
        inGame: false, // Set to true to indicate the player is in a game
        turn: 0,
        legal_moves: [],
        player: "player1",
    });

    // const copyofState = structuredClone(state);
    // copyofState.turn += 1; // Increment turn for demonstration purposes
    // setState(copyofState);

    // const playCard = (card) => {
    //     routeCard(card, state) -> newState // exists in lib/game/logic|utils.ts decide what to do with a card
    //     setState(newState);
    //     // change local state and match state if player1 (i.e. host)
    //     // sendMove(type: "game-move")
    // }

    // Main initialization effect
    useEffect(() => {
        setState({
            ...state,
            player: isHost ? "player1" : "player2",
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHost]);


    return (
        <GameContext.Provider value={state}>
            {children}
        </GameContext.Provider>
    );
}


// eslint-disable-next-line react-refresh/only-export-components
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

