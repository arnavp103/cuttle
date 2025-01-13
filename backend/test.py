# test client. in reality this should be the js frontend client

from websockets.sync.client import connect


def hello():
    with connect("ws://localhost:8765") as websocket:
        websocket.send("Hello world!")
        message = websocket.recv()
        print(f"Received: {message}")


hello()
