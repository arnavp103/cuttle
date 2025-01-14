"""Handle client updates from websockets and sends new state to clients."""

import asyncio
from websockets.server import serve

from game import Game

GAME_STATE = Game()

async def game_loop():
    """Game loop for game that receives moves from players and updates game state."""
    # player1 on firerox on website in na connected to the room
    # send message to server through websocket
    # that looks like 
    # {
    #    "data": { 
    #        "player": 1,
    #        "move": "play point card",
    #        "card": "7 clubs"
    #    }  
    # }     
    # server recieves the message
    # and updates the game state
    # GAME_STATE.

    # GAME_STATE.play_point_card("7 clubs")
    
    # once updated game state
    # send the updated game state to all players
    # to render on the client




async def main():
    # serves the echo function on localhost:8765
    # ws://localhost:8765
    async with serve(echo, "localhost", 8765):
        await asyncio.get_running_loop().create_future()  # run forever



asyncio.run(main())
