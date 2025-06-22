import { useState } from 'react';
import type { CardProps } from './PlayingCard';
import PlayingCard from './PlayingCard';

// Component for draw and discard decks. Cards cannot be manually dropped here, but can be drawn from the deck or discarded into it.

function CardStack({ visible = false } : { visible?: boolean }) {
    const [cards, setCards] = useState<CardProps[]>([]);

    return (
        <div className={`card-stack flex h-48 w-full bg-inherit items-center justify-center m-2 ml-0 p-4 border-2 rounded-lg`}>
            {cards.length == 0 ? <p> No Cards Here </p> : 
            (visible ? <PlayingCard suit={cards[-1].suit} rank={cards[-1].rank} revealed={visible}/> : <PlayingCard revealed={false}/>)}
        </div>
    );
}

export default CardStack;