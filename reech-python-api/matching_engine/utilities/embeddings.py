import numpy as np
from bson import ObjectId
from sentence_transformers import SentenceTransformer
from typing import List
from matching_engine.utilities.mongoDB_utility import get_object_to_init, perform_init, finalise_init, fetch_job_title
from fastapi import HTTPException


def embed_job_title(query: str, model: SentenceTransformer) -> List[float]:
    """
    Embeds Job Titles as vectors using the provided model
    :param query: (string) Job Title
    :param model: (Object) with encode() attribute, a transformer that embeds text to vectors
    :return: (list of numbers), a vector embedding of the Job Title
    """
    query = "Job Title:" + query
    vector_query = model.encode(query).tolist()
    return vector_query


def embed_job_description(query: str, model: SentenceTransformer) -> List[float]:
    """
    Embeds Job Titles as vectors using the provided model
    :param query: (string) Job Title
    :param model: (Object) with encode() attribute, a transformer that embeds text to vectors
    :return: (list of numbers), a vector embedding of the Job Title
    """
    query = "Job description:" + query
    vector_query = model.encode(query).tolist()
    return vector_query


def init_doc_embeddings(_id: ObjectId, collection: str, model: SentenceTransformer) -> None:
    """
    Initialises the document with embeddings required for ML models

    fields currently being embedded:
        'jobTitle', # str
        'jobDescription', # str
        'skillNames' # list(str)
        'rate', # int
        'experience' # int

    :param _id: ObjectId
    :param model: (Object) with encode() attribute, a transformer that embeds text to vectors
    :param collection: str, the name of the collection that this document will be inserted into
    :return: JSON dict, the updated mongoDB document
    """
    document = get_object_to_init(_id, collection)

    semi_required_fields = [
        'jobTitle',
        'jobTitleId'
    ]

    required_fields = [
        'jobDescription',  # str
        'skillIds',  # list(ObjectId)
        'ratePerHour',  # int
        'experience',  # int
        'partiallyInitialised'
    ]

    errmsg = ''
    for field in required_fields:
        if field not in document.keys():
            errmsg += '{} field must be present in document'.format(
                field) + '\n'

    jobTitleField = None
    for field in semi_required_fields:
        if field in document.keys():
            jobTitleField = field
            break
    if jobTitleField is None:
        errmsg += "At least one of [jobTitle, jobTitleId] must be present in document"
    if errmsg != '':
        print(errmsg)
        raise HTTPException(status_code=400, detail=errmsg)

    if jobTitleField == "jobTitle":
        jobTitle = document[jobTitleField]
    else:
        jobTitle = fetch_job_title(ObjectId(document[jobTitleField]))

    embedding_sentence = """Job Title: {}
                        Job Description: {}
                        Skills: {}
                        Rate: {}
                        Experience: {}""".format(
        jobTitle,
        document['jobDescription'],
        ', '.join(document['skillNames']),
        document['ratePerHour'],
        document['experience'],
    )

    search_embedding_sentence = jobTitle

    search_embedding = model.encode(search_embedding_sentence).tolist()
    embedding = model.encode(embedding_sentence).tolist()

    learned_embedding = np.ones(len(embedding)).tolist()

    document['search_embedding'] = search_embedding
    document['embedding'] = embedding
    document['learned_embedding'] = learned_embedding

    fields_to_insert = {
        "search_embedding": search_embedding,
        "embedding": embedding,
        "learned_embedding": learned_embedding
    }

    perform_init(_id, collection, fields_to_insert)
    finalise_init(_id, collection)


