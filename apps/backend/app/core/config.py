import os
from elasticsearch import Elasticsearch
from langchain_community.chat_models import ChatOllama
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_anthropic import ChatAnthropic

from app.core.embeddings import SentenceTransformerEmbeddings


# --- Elasticsearch Connection ---
def get_es_client() -> Elasticsearch:
    """Initializes and returns an Elasticsearch client."""
    return Elasticsearch([{"host": "localhost", "port": 9200, "scheme": "http"}])


# --- Embeddings ---
def get_embedding_function():
    """Returns the embedding function."""
    return SentenceTransformerEmbeddings()


# --- LLM Configuration ---
def get_llm():
    """Initializes and returns the appropriate LLM based on environment variables."""
    llm_provider = os.getenv("LLM_PROVIDER", "ollama").lower()

    if llm_provider == "ollama":
        return ChatOllama(model=os.getenv("OLLAMA_MODEL", "mistral"))
    elif llm_provider == "openai":
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable not set.")
        return ChatOpenAI(api_key=api_key)
    elif llm_provider == "google":
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable not set.")
        return ChatGoogleGenerativeAI(google_api_key=api_key, model="gemini-pro")
    elif llm_provider == "anthropic":
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY environment variable not set.")
        return ChatAnthropic(anthropic_api_key=api_key)
    else:
        raise ValueError(f"Unsupported LLM_PROVIDER: {llm_provider}")
