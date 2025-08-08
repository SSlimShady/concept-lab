from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, HttpUrl
from elasticsearch import Elasticsearch

from app.services import context_service
from app.core.config import get_es_client, get_embedding_function

router = APIRouter()


class ContextRequest(BaseModel):
    text: str | None = None
    url: HttpUrl | None = None


class ContextResponse(BaseModel):
    index_name: str


@router.post("/set", response_model=ContextResponse)
async def process_context(
    request: ContextRequest, es_client: Elasticsearch = Depends(get_es_client)
):
    """
    Processes user-provided context (text or URL) and indexes it into a temporary Elasticsearch index.
    """
    if request.text:
        text = request.text
    elif request.url:
        text = context_service.get_text_from_url(str(request.url))
    else:
        raise HTTPException(
            status_code=400, detail="Either text or url must be provided."
        )

    if not text:
        raise HTTPException(
            status_code=400, detail="Could not extract text from the provided source."
        )

    chunks = context_service.split_text(text)
    embedding_function = get_embedding_function()
    embeddings = embedding_function.embed_documents(chunks)
    index_name = context_service.create_and_index_embeddings(
        es_client, chunks, embeddings
    )

    return ContextResponse(index_name=index_name)


@router.delete("/all")
async def delete_all_contexts(es_client: Elasticsearch = Depends(get_es_client)):
    """
    Deletes all Elasticsearch indices matching the 'rag-context-*' pattern individually.
    """
    try:
        # Get all indices matching the pattern
        indices_to_delete = es_client.cat.indices(index="rag-context-*", h="index").splitlines()

        if not indices_to_delete:
            return {"message": "No RAG context indices found to delete."}

        deleted_count = 0
        for index_name in indices_to_delete:
            es_client.indices.delete(index=index_name.strip(), ignore=[400, 404])
            deleted_count += 1

        return {"message": f"Successfully deleted {deleted_count} RAG context indices."}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to delete all RAG context indices: {e}"
        )
