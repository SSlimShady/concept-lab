from fastapi import FastAPI
from app.routers import react, python, sql

app = FastAPI()

app.include_router(react.router, prefix="/api/react", tags=["react"])
app.include_router(python.router, prefix="/api/python", tags=["python"])
app.include_router(sql.router, prefix="/api/sql", tags=["sql"])
