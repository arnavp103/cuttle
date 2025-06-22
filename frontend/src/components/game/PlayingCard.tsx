import { useDrag } from 'react-dnd'
// import { useEffect } from 'react';

export interface CardProps {
    suit?: string;
    rank?: string;
    revealed?: boolean;
    sourceZone?: string;
    onDragEnd?: (didDrop: boolean, dropResult: any) => void;
}

function PlayingCard({ suit, rank, revealed, sourceZone, onDragEnd }: CardProps) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'CARD',
        item: { suit, rank, revealed, sourceZone },
        end: (_item, monitor) => {
            // Call onDragEnd when drag operation completes
            if (onDragEnd) {
                const didDrop = monitor.didDrop();
                const dropResult = monitor.getDropResult();
                onDragEnd(didDrop, dropResult);
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }))

    // useEffect(() => {
    //     if (isDragging && onDragStart) {
    //         onDragStart();
    //     }
    //     // Only call onDragStart when drag starts, not when it ends.
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [isDragging]);
    
    return (
        <div ref={drag} className="flex justify-center items-center h-44 w-32 bg-white border-2 rounded-lg text-black mx-2 py-2">
            {(revealed) ?  <img src={`./assets/${rank}_of_${suit}.png`} alt={`${rank} of ${suit}`} /> : <img src={`./assets/card-back.png`} alt="Card Back" />}
        </div>
    )
}

export default PlayingCard;