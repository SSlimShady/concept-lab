from elasticsearch import Elasticsearch

POLICY_NAME = "rag_index_lifecycle_policy"


def create_ilm_policy(es_client: Elasticsearch):
    """Creates an ILM policy to delete indices after 24 hours."""
    policy = {"phases": {"delete": {"min_age": "1h", "actions": {"delete": {}}}}}
    es_client.ilm.put_lifecycle(name=POLICY_NAME, policy=policy)


def apply_ilm_policy_to_index(es_client: Elasticsearch, index_name: str):
    """Applies the ILM policy to a given index."""
    es_client.indices.put_settings(
        index=index_name, body={"index.lifecycle.name": POLICY_NAME}
    )
