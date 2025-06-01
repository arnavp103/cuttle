import { useState, useImperativeHandle } from 'react';
import { useDrop } from 'react-dnd'
import type { CardProps } from './PlayingCard';
import PlayingCard from './PlayingCard';

// A place for cards to be dropped into on the board

interface BoardZoneProps {
    visible?: boolean;
    onCardMoved?: (card: CardProps) => void; // Called when card leaves this zone
    zoneId?: string; // Unique identifier for this zone
}

function BoardZone({ visible = false, onCardMoved, zoneId } : BoardZoneProps) {
    const [cards, setCards] = useState<CardProps[]>([]);

    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: 'CARD',
        drop: (item: CardProps & { sourceZone?: string }) => {
            // Only add if not from this zone
            if (item.sourceZone !== zoneId) {
                setCards((prevCards) => [...prevCards, { suit: item.suit, rank: item.rank }]);
                console.log(`Dropped card: ${item.rank} of ${item.suit}`);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }));

    // Function to remove a card when it's dragged out
    const removeCard = (cardToRemove: CardProps) => {
        setCards((prevCards) => {
            const cardIndex = prevCards.findIndex(
                card => card.suit === cardToRemove.suit && card.rank === cardToRemove.rank
            );
            if (cardIndex !== -1) {
                const newCards = prevCards.filter((_, index) => index !== cardIndex);
                // Notify parent that a card was moved out
                if (onCardMoved) {
                    onCardMoved(cardToRemove);
                }
                return newCards;
            }
            return prevCards;
        });
    };

    return (
        <div 
            ref={drop}
            className={`board-zone ${isOver ? 'hover' : ''} flex h-48 w-full bg-inherit items-center justify-center m-2 ml-0 p-4 border-2 rounded-lg ${canDrop ? 'border-green-500' : 'border-gray-500'}`}
        >
            {cards.map((card) => (
                <PlayingCard 
                    key={`${card.suit}-${card.rank}`}
                    suit={card.suit} 
                    rank={card.rank} 
                    revealed={visible}
                    sourceZone={zoneId}
                    onDragStart={() => removeCard(card)} // Remove when drag starts
                />
            ))}
        </div>
    );
}

export default BoardZone;