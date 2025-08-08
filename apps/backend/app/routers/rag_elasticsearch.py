from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from elasticsearch import Elasticsearch
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import ElasticsearchStore
from langchain.prompts import PromptTemplate
from langchain.schema.runnable import Runnable

from app.core.config import get_es_client, get_llm, get_embedding_function

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    rag_mode: bool = False
    index_name: str | None = None


async def send_message(runnable: Runnable, message: str):
    async for chunk in runnable.astream(message):
        yield chunk.content


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
        Use the following pieces of context to answer the question at the end.
        If you don't know the answer, just say that you don't know, don't try to make up an answer.

        {context}

        Question: {question}
        Answer:
        """
        prompt = PromptTemplate(
            template=prompt_template, input_variables=["context", "question"]
        )

        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever,
            return_source_documents=True,
            chain_type_kwargs={"prompt": prompt},
        )

        # For debugging: Print the final prompt that will be sent to the LLM
        # Note: This involves an extra retrieval step for debugging purposes.
        try:
            docs = retriever.get_relevant_documents(request.message)
            context_str = "\n\n".join([doc.page_content for doc in docs])
            final_prompt_text = prompt.format(
                context=context_str, question=request.message
            )
            print(
                f"\n--- Final Prompt for LLM (RAG Mode) ---\n{final_prompt_text}\n---------------------------------------\n"
            )
        except Exception as e:
            print(f"Error generating debug prompt: {e}")

        return StreamingResponse(
            send_message(qa_chain, {"query": request.message}),
            media_type="text/event-stream",
        )
    else:
        return StreamingResponse(
            send_message(llm, request.message), media_type="text/event-stream"
        )


async def send_message(runnable: Runnable, input_data):
    async for chunk in runnable.astream(input_data):
        if isinstance(chunk, dict) and "result" in chunk:
            yield chunk["result"]
        elif isinstance(chunk, str):
            yield chunk
        else:
            # Fallback for unexpected chunk types
            yield str(chunk)
