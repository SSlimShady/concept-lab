from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from elasticsearch import Elasticsearch
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import ElasticsearchStore
from langchain.prompts import PromptTemplate
from langchain.schema.runnable import Runnable, RunnablePassthrough

from app.core.config import get_es_client, get_llm, get_embedding_function

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    rag_mode: bool = False
    index_name: str | None = None


async def stream_tokens(runnable: Runnable, input_data):
    async for chunk in runnable.astream(input_data):
        # LangChain chat models often yield AIMessageChunk with .content
        if hasattr(chunk, "content") and isinstance(getattr(chunk, "content"), str):
            text = getattr(chunk, "content")
            if text:
                yield text
            continue
        # Some chains yield dicts with a 'result' at the end
        if isinstance(chunk, dict):
            if "result" in chunk and isinstance(chunk["result"], str):
                yield chunk["result"]
            elif "content" in chunk and isinstance(chunk["content"], str):
                yield chunk["content"]
            # Ignore other dict-shaped internal updates
            continue
        # Raw strings
        if isinstance(chunk, str):
            if chunk:
                yield chunk
            continue
        # Ignore any other internal objects to prevent leaking repr text
        continue


def _format_docs(docs):
    try:
        return "\n\n".join([doc.page_content for doc in docs])
    except Exception:
        return ""


@router.post("/chat")
async def chat(request: ChatRequest, es_client: Elasticsearch = Depends(get_es_client)):
    """
    Handles chat requests, with or without RAG mode, and streams the response.
    """
    llm = get_llm()

    if request.rag_mode:
        if not request.index_name:
            raise HTTPException(
                status_code=400, detail="index_name is required for RAG mode."
            )

        embeddings = get_embedding_function()
        store = ElasticsearchStore(
            es_connection=es_client, index_name=request.index_name, embedding=embeddings
        )
        retriever = store.as_retriever()

        prompt_template = """
        Use the following pieces of context to answer the question at the end. But don't mention the context in your answer.
        If you don't know the answer, just say that you don't know, don't try to make up an answer.

        {context}

        Question: {question}
        Answer:
        """
        prompt = PromptTemplate(
            template=prompt_template, input_variables=["context", "question"]
        )

        # Build a streaming RAG pipeline so tokens come from LLM directly
        rag_runnable: Runnable = (
            {
                "context": retriever | _format_docs,
                "question": RunnablePassthrough(),
            }
            | prompt
            | llm
        )

        # Optional debug of final prompt (non-streaming)
        try:
            docs = retriever.get_relevant_documents(request.message)
            context_str = _format_docs(docs)
            final_prompt_text = prompt.format(
                context=context_str, question=request.message
            )
            print(
                f"\n--- Final Prompt for LLM (RAG Mode) ---\n{final_prompt_text}\n---------------------------------------\n"
            )
        except Exception as e:
            print(f"Error generating debug prompt: {e}")

        return StreamingResponse(
            stream_tokens(rag_runnable, request.message),
            media_type="text/event-stream",
        )
    else:
        return StreamingResponse(
            stream_tokens(llm, request.message), media_type="text/event-stream"
        )
