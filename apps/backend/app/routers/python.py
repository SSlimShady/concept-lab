from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from typing import Generator
import time
from functools import wraps
from dataclasses import dataclass, asdict

router = APIRouter()


def my_decorator(func):
    """A simple decorator that wraps the output of a function."""

    def wrapper(*args, **kwargs):
        original_result = func(*args, **kwargs)
        return f"Decorated: {original_result}"

    return wrapper


@my_decorator
def hello_for_decorator():
    """A simple function to be decorated."""
    return "Hello from Python!"


@router.get("/decorators")
def decorators_example():
    """Demonstrates a simple Python decorator."""
    return {"result": hello_for_decorator()}


def timing_decorator(func):
    """A decorator that measures the execution time of a function."""

    @wraps(func)  # Preserves the original function's metadata
    def wrapper(*args, **kwargs):
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        end_time = time.perf_counter()
        elapsed_time = end_time - start_time
        return {
            "original_result": result,
            "execution_time_seconds": round(elapsed_time, 4),
        }

    return wrapper


@router.get("/decorators/timing")
@timing_decorator
def timing_decorator_example():
    """Demonstrates a decorator used for timing a function's execution."""
    time.sleep(1)  # Simulate a slow operation
    return "Data fetched successfully!"
