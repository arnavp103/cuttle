import React from 'react';
import { useDrag } from 'react-dnd'

interface CardProps {
    suit: string;
    rank: string;
}

function PlayingCard({ suit, rank }: CardProps) {

    const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
        type: 'CARD',
        // The collect function utilizes a "monitor" instance (see the Overview for what this is)
        // to pull important pieces of state from the DnD system.
        item: { suit, rank },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    }))



    return (
        <div className="flex justify-center items-center h-48 w-32 bg-white border-2 rounded-lg text-black">
            {/* <img src={`./assets/${rank}_of_${suit}.png`} alt={`${rank} of ${suit}`} /> */}
            {rank} of {suit}
        </div>
    )
}

export default PlayingCard;