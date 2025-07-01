import fastapi
import uvicorn

import core.matrixapi
from routers import webclient, message_handler
from fastapi.staticfiles import StaticFiles

app = fastapi.FastAPI()
matrixapi = core.matrixapi.MatrixAPI()
app.include_router(webclient.router, prefix="")
app.include_router(message_handler.router, prefix="api")

app.mount("/static", StaticFiles(directory="static"), name="static")
@app.get("/api/quack")
async def quack():
    return matrixapi.quack()

uvicorn.run(app, port=33217)