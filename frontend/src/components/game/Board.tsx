import React from 'react';

function Board() {
    // Need: draw deck, discard, point, perms, divider(?), player hand, opp hand(Maybe show only half of the cards?)

    return (
        <div className="board flex flex-row">
            <div className="play flex flex-col">
                <div className="decks flex flex-col">
                    <div className="draw">
                        <img src="./assets/card-back.png" alt="Deck" />
                    </div>
                    <div className="discard">
                        {/* This should show the top card in discard pile */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Board