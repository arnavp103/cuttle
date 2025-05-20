import { useDrop } from 'react-dnd'

interface CardProps {
    rank: string;
    suit: string;
};

// A place for cards to be dropped into on the board

function BoardZone() {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: 'CARD',
        drop: (item: CardProps) => {
            console.log(`Dropped ${item.rank} of ${item.suit}`);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }));

    return (
        <div ref={drop} className={`board-zone ${isOver ? 'hover' : ''}`}>
            {canDrop && <div className="overlay">Release to drop</div>}
        </div>
    );
}

export default BoardZone;