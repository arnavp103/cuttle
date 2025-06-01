import BoardZone from './BoardZone';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// import { useState } from 'react';
import CardStack from './CardStack';
import PlayingCard from './PlayingCard';

function Board() {
    // Need: draw deck, discard, point, perms, divider(?), player hand, opp hand(Maybe show only half of the cards?)

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-row background-gray-800 text-white w-full h-full p-4 gap-4 bg-inherit">
                <div className="flex flex-col w-3/4 h-full outline outline-offset-2 outline-color-cyan-500 rounded-lg p-4 m-4">
                    {/* Opponent */}
                    {/* Hand */}
                    <BoardZone zoneId='opp-hand'/>
                    <div className="flex flex-row h-full rounded-lg p-2">
                        <BoardZone zoneId='opp-point'/>
                        <BoardZone zoneId='opp-perm'/>
                    </div>
                    {/* Player */}
                    <div className="flex flex-row h-full rounded-lg p-2">
                        <BoardZone visible={true} zoneId='player-point'/>
                        <BoardZone visible={true} zoneId='player-perm'/>
                    </div>
                    {/* Hand */}
                    <BoardZone visible={true} zoneId='player-hand'/>
                </div>  
                {/* Draw and discard zones */}
                <div className="flex flex-col w-48 h-full outline outline-offset-2 outline-color-cyan-500 rounded-lg mt-4 p-2"> 
                    {/* Need a way to link the cards between backend deck and frontend */}
                    <p> Draw pile </p>
                    <CardStack />
                    <CardStack visible={true}/>
                    <p> Discard pile </p>
                </div>
            </div>
            <div className="temp">
                <PlayingCard suit="hearts" rank="A" revealed={true} />
                <PlayingCard suit="hearts" rank="J" revealed={true} />
            </div>
        </DndProvider>
    )
}

export default Board