import fastapi
from fastapi.responses import FileResponse
from fastapi import APIRouter, Depends

router = APIRouter(prefix="")


@router.get("/")
def root():
    return FileResponse("templates/index.html")


@router.get("/client")
def client():
    return FileResponse("templates/client.html")
