import asyncio
from websockets.server import serve


async def echo(websocket):
    async for message in websocket:
        print(f"Received: {message}")
        await websocket.send(message)


async def main():
    # serves the echo function on localhost:8765
    # ws://localhost:8765
    async with serve(echo, "localhost", 8765):
        await asyncio.get_running_loop().create_future()  # run forever


asyncio.run(main())
