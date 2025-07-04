import uuid
from fastapi.websockets import WebSocket


class Session:
    UUID:str
    SECRET_UUID:str
    socket:WebSocket
    authorized:bool=False
    name:str = ""
    def __init__(self, wsocket: WebSocket):
        self.UUID: str = str(uuid.uuid4())
        self.SECRET_UUID = str(uuid.uuid4())
        self.socket: WebSocket = wsocket
    async def send_message(self, message: str):
        await self.socket.send_text(message)

