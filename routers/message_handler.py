import json

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

    globals.UNAUTHORIZED_SESSIONS.append(current_session)
    await logger.info(f"WebSocket connected: SessionUUID {current_session.UUID}")

    # while True:
    try:
        while True:
            data = await websocket.receive_json()
            if not current_session.authorized:
                if data["type"]=="auth":
                    if data.get("name"):
                        globals.UNAUTHORIZED_SESSIONS.remove(current_session)
                        globals.ACTIVE_SESSIONS.append(current_session)
                        current_session.authorized=True
                        await websocket.send_text(json.dumps({"type":"auth","result":"success"}))
                        current_session.name = data["name"]
                        for client in globals.ACTIVE_SESSIONS:
                            await client.send_message(json.dumps({"type": "join", "name": data["name"]}, ensure_ascii=False))
                    else:
                        await websocket.send_text(json.dumps({"type":"auth","result":"failed", "message":"Missing name"}))
            # Здесь твоя логика обработки сообщений
            # await websocket.send_text(f"Echo: {data}")
    except:
        globals.ACTIVE_SESSIONS.remove(current_session)
        # Здесь обработка отключения
        await logger.info(f"WebSocket disconnected: SessionUUID {current_session.UUID}")
        for client in globals.ACTIVE_SESSIONS:
            await client.send_message(json.dumps({"type": "leave", "name": current_session.name}, ensure_ascii=False))

@router.post("/send")
async def handle_message(request: fastapi.Request):
    data = await request.json()
    message = data.get("message")
    for client in globals.ACTIVE_SESSIONS:
        await client.send_message(json.dumps({"type":"message","content":message},ensure_ascii=False))
    return {"status": "Success"}
