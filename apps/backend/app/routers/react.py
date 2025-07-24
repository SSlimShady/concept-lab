from fastapi import APIRouter
from datetime import datetime

router = APIRouter()


@router.get("/use-effect")
def use_effect_example():
    return {"time": datetime.utcnow().isoformat()}
