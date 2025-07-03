import uuid
from fastapi.websockets import WebSocket


class Session:
    UUID:str
    socket:WebSocket
    def __init__(self, wsocket: WebSocket):
        self.UUID: str = str(uuid.uuid4())
        self.socket: WebSocket = wsocket
    async def send_message(self, message: str):
        await self.socket.send_text(message)

