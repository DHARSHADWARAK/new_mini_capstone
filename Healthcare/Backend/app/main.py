from fastapi import FastAPI
from app.api.router import api_router
from app.exceptions.exception_handlers import app_exception_handler
from app.exceptions.custom_exceptions import AppException

app = FastAPI()

app.add_exception_handler(AppException, app_exception_handler)

app.include_router(api_router)