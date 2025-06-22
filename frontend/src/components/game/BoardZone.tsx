import { useState } from 'react';
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
            // If dropping into the same zone, cancel the pending removal
            if (item.sourceZone === zoneId) {
                return { droppedInSameZone: true };
            }
            
            // Add card to this zone if it's from a different zone
            setCards((prevCards) => [...prevCards, { suit: item.suit, rank: item.rank }]);
            console.log(`Dropped card: ${item.rank} of ${item.suit}`);
            
            // Clear pending removal since drop was successful
            return { droppedSuccessfully: true };
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

    // Function to mark a card for removal when dragging starts
    // const handleDragStart = (cardToRemove: CardProps) => {
    //     console.log(`Starting drag for card: ${cardToRemove.rank} of ${cardToRemove.suit}`);
    //     // setPendingRemoval(cardToRemove);
    //     removeCard(cardToRemove); // Immediately remove the card from this zone
    // };

    // Function to handle drag end - if there's still a pending removal, cancel it
    const handleDragEnd = (card: CardProps, didDrop: boolean, dropResult: any) => {
        if (didDrop && !dropResult?.droppedInSameZone) {
            // Successfully dropped elsewhere, remove it from this zone
            console.log(`Removed card: ${card.rank} of ${card.suit}`);
            removeCard(card);
        } else {
            // Card was dropped in same zone or outside valid zone, keep it here
            console.log(`Keeping card: ${card.rank} of ${card.suit}`);
        }
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
                    onDragEnd={(didDrop: boolean, dropResult: any) => handleDragEnd(card, didDrop, dropResult)} // Remove when drag ends
                />
            ))}
        </div>
    );
}

export default BoardZone;