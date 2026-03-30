from fastapi import FastAPI
from app.api.router import api_router
from app.exceptions.exception_handlers import app_exception_handler
from app.exceptions.custom_exceptions import AppException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_exception_handler(AppException, app_exception_handler)

app.include_router(api_router)

origins = [
    "http://localhost:5173",  # your frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # allowed origins
    allow_credentials=True,
    allow_methods=["*"],          # allow all methods (GET, POST, etc.)
    allow_headers=["*"],          # allow all headers
)