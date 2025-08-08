from fastapi import APIRouter
import time
from functools import wraps

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


# --- For Iterator vs Generator Page ---


class NumberIterator:
    """A custom iterator that yields numbers up to a max value."""

    def __init__(self, max_val):
        self.max_val = max_val
        self.current = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.current < self.max_val:
            self.current += 1
            return self.current
        else:
            raise StopIteration


@router.get("/iterator-class")
def iterator_class_example():
    """Demonstrates a custom iterator class by collecting its results."""
    iterator = NumberIterator(5)
    # In a real app, you'd loop over this. Here, we collect to show the output.
    result_list = list(iterator)
    return {
        "description": "A custom iterator class that counts from 1 to 5. The API collects all yielded values into a list for this demonstration.",
        "result": result_list,
    }


@router.get("/generators")
def slow_generator():
    """A generator that yields data with a delay."""
    for i in range(5):
        # The 'yield' keyword pauses the function and returns a value.
        # State is saved until the next call.

        yield f"Item {i + 1}"
        time.sleep(0.5)


@router.get("/memory-demo")
def memory_demo():
    """Compares memory usage of a list vs a generator for a large dataset."""
    num_elements = 1_000_000
    return {
        "list_comprehension": {
            "explanation": f"Creates a list of {num_elements:,} items in memory all at once. This can consume a large amount of RAM.",
            "memory_impact": "High",
        },
        "generator_expression": {
            "explanation": f"Creates a generator object. It produces each item one by one, only when requested. It does not store the whole sequence.",
            "memory_impact": "Very Low",
        },
    }
