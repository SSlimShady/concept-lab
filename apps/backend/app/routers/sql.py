from fastapi import APIRouter

router = APIRouter()


@router.get("/joins")
def sql_joins_example():
    # Simulate a SQL join result
    users = [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]
    orders = [
        {"id": 101, "user_id": 1, "item": "Book"},
        {"id": 102, "user_id": 2, "item": "Pen"},
    ]
    join_result = [
        {"user": u["name"], "item": o["item"]}
        for u in users
        for o in orders
        if u["id"] == o["user_id"]
    ]
    return {"result": join_result}
