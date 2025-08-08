from bs4 import BeautifulSoup
import requests
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk
import uuid

from app.core.es_lifecycle import create_ilm_policy, apply_ilm_policy_to_index


def get_text_from_url(url: str) -> str:
    """Fetches and extracts text from a URL."""
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "lxml")
        return soup.get_text()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching URL: {e}")
        return ""


def split_text(text: str) -> list[str]:
    """Splits text into chunks."""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, chunk_overlap=200, length_function=len
    )
    return text_splitter.split_text(text)


def get_embeddings(chunks: list[str]) -> list[list[float]]:
    """Generates embeddings for text chunks."""
    model = SentenceTransformer("all-MiniLM-L6-v2")
    return model.encode(chunks).tolist()


def create_and_index_embeddings(
    es_client: Elasticsearch, chunks: list[str], embeddings: list[list[float]]
) -> str:
    """Creates a temporary Elasticsearch index and indexes the embeddings."""
    create_ilm_policy(es_client)  # Create the policy if it doesn't exist
    index_name = f"rag-context-{uuid.uuid4()}"
    print(f"Creating Elasticsearch index: {index_name}")
    mapping = {
        "properties": {
            "text": {"type": "text"},
            "vector": {"type": "dense_vector", "dims": len(embeddings[0])},
        }
    }
    print(f"Index mapping: {mapping}")
    es_client.indices.create(index=index_name, mappings=mapping)
    apply_ilm_policy_to_index(es_client, index_name)

    actions = [
        {
            "_index": index_name,
            "_source": {"text": chunk, "vector": embedding, "metadata": {}},
        }
        for chunk, embedding in zip(chunks, embeddings)
    ]
    print(
        f"Indexing {len(actions)} documents. First document sample: {actions[0] if actions else 'N/A'}"
    )
    bulk(es_client, actions)
    return index_name
