import { useDrag } from 'react-dnd'
import { useEffect } from 'react';

export interface CardProps {
    suit?: string;
    rank?: string;
    revealed?: boolean;
    sourceZone?: string;
    onDragStart?: () => void;
}

function PlayingCard({ suit, rank, revealed, sourceZone, onDragStart }: CardProps) {
    const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
        type: 'CARD',
        item: { suit, rank, revealed, sourceZone },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
    }))

    useEffect(() => {
        if (isDragging && onDragStart) {
            onDragStart();
        }
        // Only call onDragStart when drag starts, not when it ends.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDragging]);
    
    return isDragging ? (
        <div ref={dragPreview} />
    ) : (
        <div ref={drag} className="flex justify-center items-center h-44 w-32 bg-white border-2 rounded-lg text-black mx-2 py-2">
            {(revealed) ?  <img src={`./assets/${rank}_of_${suit}.png`} alt={`${rank} of ${suit}`} /> : <img src={`./assets/card-back.png`} alt="Card Back" />}
        </div>
    )
}

export default PlayingCard;