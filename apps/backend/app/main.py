from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware import Middleware
from app.routers import react, python, sql

app = FastAPI(
    title="Concept Lab API",
    description="API for the Concept Lab project, demonstrating various programming concepts.",
)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(react.router, prefix="/api/react", tags=["react"])
app.include_router(python.router, prefix="/api/python", tags=["python"])
app.include_router(sql.router, prefix="/api/sql", tags=["sql"])
