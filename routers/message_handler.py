import fastapi
from fastapi.responses import FileResponse
from fastapi import APIRouter, Depends
from fastapi.websockets import WebSocket
from starlette.websockets import WebSocketDisconnect

import globals
import logger
from routers.netcore import sessions

router = APIRouter(prefix="/msg")


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()  # Принять соединение
    current_session = sessions.Session(websocket)
    globals.ACTIVE_SESSIONS.append(current_session)
    await logger.info(f"WebSocket connected: SessionUUID {current_session.UUID}")
    while True:
        try:
            while True:
                data = await websocket.receive_text()
                # Здесь твоя логика обработки сообщений
                await websocket.send_text(f"Echo: {data}")
        except WebSocketDisconnect:
            globals.ACTIVE_SESSIONS.remove(current_session)
            # Здесь обработка отключения
            await logger.info(f"WebSocket disconnected: SessionUUID {current_session.UUID}")

@router.post("/send")
async def handle_message(request: fastapi.Request):
    data = await request.json()
    message = data.get("message")
    for client in globals.ACTIVE_SESSIONS:
        await client.send_message(message)
    return {"status": "Success"}
