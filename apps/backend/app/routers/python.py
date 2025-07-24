from fastapi import APIRouter

router = APIRouter()


def my_decorator(func):
    def wrapper(*args, **kwargs):
        return f"Decorated: {func(*args, **kwargs)}"

    return wrapper


@router.get("/decorators")
def decorators_example():
    @my_decorator
    def hello():
        return "Hello from Python!"

    return {"result": hello()}
