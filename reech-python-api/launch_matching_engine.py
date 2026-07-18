# -*- coding: utf-8 -*-

from matching_engine.utilities.mongoDB_utility import mongodb_connection
from matching_engine.utilities.utility import df_to_json, list_to_json
from matching_engine.utilities.embeddings import embed_job_title, embed_job_description, init_doc_embeddings
from matching_engine.bubble_page_APIs.result import handle_result as handle_result_bubble
from matching_engine.bubble_page_APIs.main import agent as agent_bubble
from matching_engine.home_page_APIs.result import handle_result as handle_result_home
from matching_engine.home_page_APIs.main import agent as agent_home
from matching_engine.suggestion_APIs.suggestion_engine import suggest
import json

from bson import ObjectId, errors
from sentence_transformers import SentenceTransformer
from fastapi import HTTPException, Request, Response
from fastapi import APIRouter

# app = FastAPI()
router = APIRouter()

# import the embedding model
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

client = mongodb_connection()
db = client.ReechDatabase  # access test database from client


@router.get("/")
async def test_index_route() -> str:
    """
    Takes no arguments
    http://<local socket>/
    :return: str, response code: 200
    """
    return "Testing, Flask!"


@router.post("/utilities/init_doc/")
async def init_doc(request: Request) -> Response:
    """
    http://<local socket>/home/utilities/init_doc/?_id=<_id>&collection=collection

    fields currently being embedded:
        'jobTitle', # str
        'jobDescription', # str
        'skillIds' # list(str)
        'rate', # int
        'experience' # int

    :param: _id, ObjectId, corresponding to a mongoDB document
    :param: collection, str, the name of the collection that this document will be inserted into
    :return: status code
    """
    request_args = dict(request.query_params)
    if "_id" not in request_args.keys():
        errmsg = "_id field must be passed"
        raise HTTPException(status_code=400, detail=errmsg)
    else:
        _id = request_args["_id"]

        try:
            _id = ObjectId(_id)
        except errors.InvalidId:
            print(_id)
            errmsg = "_id must be convertible to ObjectId"
            raise HTTPException(status_code=400, detail=errmsg)

    if "collection" not in request_args.keys():
        errmsg = "collection field must be passed"
        raise HTTPException(status_code=400, detail=errmsg)
    else:
        collection = request_args["collection"]
        try:
            collection = str(collection)
        except ValueError:
            errmsg = "collection must be convertible to string"
            raise HTTPException(status_code=400, detail=errmsg)

    if collection not in {"profiles", "opportunities"}:
        errmsg = '"collection parameter" must be one of ["profiles", "opportunities"]. Instead collection ' \
                 'parameter was: {}'.format(collection)
        print(errmsg)
        raise HTTPException(status_code=400, detail=errmsg)

    init_doc_embeddings(_id, collection, model)
    return Response(status_code=200)


@router.get("/utilities/embed_job_title/")
async def get_job_title_embedding(request: Request) -> str:
    """
    http://<local socket>/home/utilities/embed_job_title/?jobTitle=jobTitle
    Returns vector embedding of job title as array.

    :param: string, jobTitle being embedded
    :param: int, n
    :return: json list of floats
    """

    request_args = dict(request.query_params)
    if "jobTitle" not in request_args.keys():
        errmsg = "jobTitle field must be passed"
        raise HTTPException(status_code=400, detail=errmsg)
    else:
        jobTitle = request_args["jobTitle"]
        try:
            jobTitle = str(jobTitle)
        except ValueError:
            errmsg = "jobTitle must be convertible to string"
            raise HTTPException(status_code=400, detail=errmsg)
    embedding = embed_job_title(jobTitle, model)
    return json.dumps(embedding)  # .JSONEncoder().encode(embedding)


@router.get("/utilities/embed_job_description/")
async def get_job_description_embedding(request: Request) -> str:
    """
    http://<local socket>/home/utilities/embed_job_description/?jobDescription=jobDescription
    Returns vector embedding of job title as array.

    :param: string, jobDescription being embedded
    :param: int, n
    :return: json list of floats
    """

    request_args = dict(request.query_params)
    if "jobDescription" not in request_args.keys():
        errmsg = "jobDescription field must be passed"
        raise HTTPException(status_code=400, detail=errmsg)
    else:
        jobDescription = request_args["jobDescription"]
        try:
            jobDescription = str(jobDescription)
        except ValueError:
            errmsg = "jobDescription must be convertible to string"
            raise HTTPException(status_code=400, detail=errmsg)
    embedding = embed_job_description(jobDescription, model)
    return json.dumps(embedding)


@router.get("/home/reach_for/fetch/")
async def reach_for_fetch(query: Request) -> str:
    """
    http://<local socket>/home/reach_for/fetch/?_id=<_id>&n=<number>&hard_filter=<bool>
    Returns n home page -> reach for posts in json format.

    :param: string, _id of opportunity reach_for-ing
    :param: int, n (optional)
    :param: bool, hard_filter (optional) whether to perform hard filtering or not
    :return: json list of dicts: [{"_id":str,"score":float}],
             response code: 200 or 204 (empty return)
    """

    request_args = dict(query.query_params)
    
    if "_id" not in request_args.keys():
        errmsg = "_id field must be passed"
        raise HTTPException(status_code=400, detail=errmsg)
    else:
        _id = request_args["_id"]
        try:
            _id = ObjectId(_id)
        except errors.InvalidId:
            errmsg = "_id must be convertible to ObjectId"
            raise HTTPException(status_code=400, detail=errmsg)

    if "n" not in request_args.keys():
        n = 10
    else:
        n = request_args["n"]
        try:
            n = int(n)
        except ValueError:
            errmsg = "n must be convertible to int"
            raise HTTPException(status_code=400, detail=errmsg)

    if db.opportunities.count_documents({'_id': _id}, limit=1) == 0:
        errmsg = '"_id" must be present in opportunities collection'
        print(errmsg)
        raise HTTPException(status_code=400, detail=errmsg)

    hard_filter = True
    if 'hard_filter' in request_args.keys():
        hard_filter = request_args["hard_filter"]
        try:
            hard_filter = bool(int(hard_filter))
        except ValueError:
            # Handle the exception
            errmsg = '"hard_filter" must be convertible to bool'
            print(errmsg)
            raise HTTPException(status_code=400, detail=errmsg)

    include_fake = True
    if 'include_fake' in request_args.keys():
        include_fake = request_args["include_fake"]
        try:
            include_fake = bool(int(include_fake))
        except ValueError:
            # Handle the exception
            errmsg = '"include_fake" must be convertible to bool'
            print(errmsg)
            raise HTTPException(status_code=400, detail=errmsg)

    if "agent_architecture" not in request_args.keys():
        agent_architecture = "cosine_similarity"
    else:
        agent_architecture = request_args["agent_architecture"]
        try:
            agent_architecture = str(agent_architecture)
        except ValueError:
            errmsg = "agent_architecture must be convertible to str"
            raise HTTPException(status_code=400, detail=errmsg)
        if agent_architecture not in ['cosine_similarity', 'qnn', 'mab']:
            errmsg = "agent_architecture must be one of ['cosine_similarity', 'qnn', 'mab']"
            raise HTTPException(status_code=400, detail=errmsg)

    df = agent_home("home.reach_for", _id, n, hard_filter, include_fake, agent_architecture)
    return df_to_json(df)


@router.post("/home/reach_for/response/")
async def reach_for_response(query: Request) -> Response:
    """
    http://<local socket>/home/reach_for/response/?response=<response>&_id=<opportunity_id>&profile_id=<profile_id>
    Updates DB based off of response from user interaction

    :param: str {pin, apply, reject}, response
    :param: string, _id, _id of opportunity performing interaction
    :param: string, profile_id, _id of profile interacted with
    :return: response code: 200
    """

    request_args = dict(query.query_params)
    #  ========== _id ==========
    if "_id" not in request_args.keys():
        errmsg = "_id field must be passed"
        raise HTTPException(status_code=400, detail=errmsg)
    else:
        _id = request_args["_id"]
        try:
            _id = ObjectId(_id)
        except errors.InvalidId:
            errmsg = "_id must be convertible to ObjectId"
            raise HTTPException(status_code=400, detail=errmsg)

    if db.opportunities.count_documents({'_id': _id}, limit=1) == 0:
        errmsg = '_id must exist in opportunities collection'
        print(errmsg)
        raise HTTPException(status_code=400, detail=errmsg)

    #  ========== profile_id ==========
    if "profile_id" not in request_args.keys():
        errmsg = "profile_id field must be passed"
        raise HTTPException(status_code=400, detail=errmsg)
    else:
        profile_id = request_args["profile_id"]
        try:
            profile_id = ObjectId(profile_id)
        except errors.InvalidId:
            errmsg = "profile_id must be convertible to ObjectId"
            raise HTTPException(status_code=400, detail=errmsg)

    #  ========== response ==========
    if "response" not in request_args.keys():
        errmsg = "response field must be passed"
        raise HTTPException(status_code=400, detail=errmsg)
    else:
        response = request_args["response"]
        try:
            response = str(response)
        except ValueError:
            errmsg = "response must be convertible to str"
            raise HTTPException(status_code=400, detail=errmsg)
    if response not in ["pin", "apply", "reject"]:
        errmsg = 'response must be one of ["pin", "apply", "reject"]'
        raise HTTPException(status_code=400, detail=errmsg)

    if db.profiles.count_documents({'_id': profile_id}, limit=1) == 0:
        errmsg = 'profile_id must exist in profiles collection'
        print(errmsg)
        raise HTTPException(status_code=400, detail=errmsg)

    # noinspection PyTypeChecker
    handle_result_home("home.reach_for", response, subject_id=_id, object_id=profile_id)
    return Response(status_code=200)


@router.get("/home/be_reached/fetch/")
async def be_reached_fetch(query: Request) -> str:
    """
    http://<local socket>/home/be_reached/fetch/?_id=<_id>&n=<number>&hard_filter=<bool>
    Returns n home page -> be reached posts in json format.

    :param: string, _id of profile be_reached-ing
    :param: int, n (optional)
    :param: bool, hard_filter (optional) whether to perform hard filtering or not
    :return: json list of dicts: [{"_id":str,"score":float}],
             response code: 200 or 204 (empty return)
    """
    # _id: str, requested_job: str, n: int = 10
    request_args = dict(query.query_params)
    if "_id" not in request_args.keys():
        errmsg = '"_id" must be present in request params'
        print(errmsg)
        raise HTTPException(status_code=400, detail=errmsg)
    else:
        _id = request_args["_id"]
        try:
            _id = ObjectId(_id)
        except errors.InvalidId:
            # Handle the exception
            errmsg = '"_id" must be convertible to ObjectId'
            print(errmsg)
            raise HTTPException(status_code=400, detail=errmsg)

    if db.profiles.count_documents({'_id': _id}, limit=1) == 0:
        errmsg = '"_id" must be present in profiles collection'
        print(errmsg)
        raise HTTPException(status_code=400, detail=errmsg)

    if "n" not in request_args.keys():
        n = 10
    else:
        n = request_args["n"]
        try:
            n = int(n)
        except ValueError:
            # Handle the exception
            errmsg = '"n" must be convertible to int'
            print(errmsg)
            raise HTTPException(status_code=400, detail=errmsg)

    hard_filter = True
    if 'hard_filter' in request_args.keys():
        hard_filter = request_args["hard_filter"]
        try:
            hard_filter = bool(int(hard_filter))
        except ValueError:
            # Handle the exception
            errmsg = '"hard_filter" must be convertible to bool'
            print(errmsg)
            raise HTTPException(status_code=400, detail=errmsg)

    include_fake = True
    if 'include_fake' in request_args.keys():
        include_fake = request_args["include_fake"]
        try:
            include_fake = bool(int(include_fake))
        except ValueError:
            # Handle the exception
            errmsg = '"include_fake" must be convertible to bool'
            print(errmsg)
            raise HTTPException(status_code=400, detail=errmsg)

    if "agent_architecture" not in request_args.keys():
        agent_architecture = "cosine_similarity"
    else:
        agent_architecture = request_args["agent_architecture"]
        try:
            agent_architecture = str(agent_architecture)
        except ValueError:
            errmsg = "agent_architecture must be convertible to str"
            raise HTTPException(status_code=400, detail=errmsg)
        if agent_architecture not in ['cosine_similarity', 'qnn', 'mab']:
            errmsg = "agent_architecture must be one of ['cosine_similarity', 'qnn', 'mab']"
            raise HTTPException(status_code=400, detail=errmsg)

    df = agent_home("home.be_reached", _id, n, hard_filter, include_fake, agent_architecture)
    return df_to_json(df)


@router.post("/home/be_reached/response/")
async def be_reached_response(query: Request) -> Response:
    """
    http://<local socket>/home/reach_for/response/?response=<request>&_id=<_id>&opportunity_id=<opportunity_id>
    Updates DB based off of response from user interaction

    :param: str {pin, apply, reject}, response
    :param: string, _id, _id of profile performing interaction
    :param: string, opportunity_id, _id of opportunity interacted with
    :return: response code: 200
    """

    request_args = dict(query.query_params)
    #  ========== _id ==========
    if "_id" not in request_args.keys():
        errmsg = "_id field must be passed"
        raise HTTPException(status_code=400, detail=errmsg)
    else:
        _id = request_args["_id"]
        try:
            _id = ObjectId(_id)
        except errors.InvalidId:
            errmsg = "_id must be convertible to ObjectId"
            raise HTTPException(status_code=400, detail=errmsg)

    if db.profiles.count_documents({'_id': _id}, limit=1) == 0:
        errmsg = '"_id" must be present in profiles collection'
        print(errmsg)
        raise HTTPException(status_code=400, detail=errmsg)

    #  ========== opportunity_id ==========
    if "opportunity_id" not in request_args.keys():
        errmsg = "opportunity_id field must be passed"
        raise HTTPException(status_code=400, detail=errmsg)
    else:
        opportunity_id = request_args["opportunity_id"]
        try:
            opportunity_id = ObjectId(opportunity_id)
        except errors.InvalidId:
            errmsg = "opportunity_id must be convertible to ObjectId"
            raise HTTPException(status_code=400, detail=errmsg)

    if db.opportunities.count_documents({'_id': opportunity_id}, limit=1) == 0:
        errmsg = '"opportunity_id" must be present in opportunities collection'
        print(errmsg)
        raise HTTPException(status_code=400, detail=errmsg)

    #  ========== response ==========
    if "response" not in request_args.keys():
        errmsg = "response field must be passed"
        raise HTTPException(status_code=400, detail=errmsg)
    else:
        response = request_args["response"]
        try:
            response = str(response)
        except ValueError:
            errmsg = "response must be convertible to str"
            raise HTTPException(status_code=400, detail=errmsg)
    if response not in ["pin", "apply", "reject"]:
        errmsg = 'response must be one of ["pin", "apply", "reject"]'
        raise HTTPException(status_code=400, detail=errmsg)

    # noinspection PyTypeChecker
    handle_result_home("home.be_reached", response, subject_id=_id, object_id=opportunity_id)
    return Response(status_code=200)


@router.get("/bubble/fetch/")
def bubble_fetch(query: Request) -> str:
    """
    http://<local socket>/bubble/fetch/?_id=<_id>&n=<number>
    Returns n bubble posts in json format.

    :param: int, n, number of objects to return
    :param: str _id, _id of user
    :return: json list of dicts: [{"_id":str,"score":float}],
             response code: 200 or 204 (empty return)
    """

    request_args = dict(query.query_params)

    #  ========== _id ==========
    if "_id" not in request_args.keys():
        errmsg = "_id field must be passed"
        raise HTTPException(status_code=400, detail=errmsg)
    else:
        _id = request_args["_id"]
        try:
            _id = ObjectId(_id)
        except errors.InvalidId:
            errmsg = "_id must be convertible to ObjectId"
            raise HTTPException(status_code=400, detail=errmsg)

    if db.users.count_documents({'_id': _id}, limit=1) == 0:
        errmsg = '"_id" must be present in users collection'
        print(errmsg)
        raise HTTPException(status_code=400, detail=errmsg)

    #  ========== n ==========
    if "n" not in request_args.keys():
        n = 10
    else:
        n = request_args["n"]
        try:
            n = int(n)
        except ValueError:
            errmsg = "n must be convertible to int"
            raise HTTPException(status_code=400, detail=errmsg)

    df = agent_bubble(_id, n)
    return df_to_json(df)


@router.post("/bubble/response/")
def bubble_response(query: Request) -> Response:
    """
    http://<local socket>/home/be_reached/response/?result=<request>&_id=<_id>
    Updates DB based off of response from user interaction

    :param: string, _id of object interacted with
    :param: int, result of interaction. 0 if no interaction, 1 if interacted with
    :return: response code: 200 if successful
                            204 if successful but no more content to show
                            400 if unsuccessful (invalid parameters passed)
    """

    request_args = dict(query.query_params)
    if "_id" not in request_args.keys():
        errmsg = "_id field must be passed"
        raise HTTPException(status_code=400, detail=errmsg)
    else:
        _id = request_args['_id']
        try:
            _id = ObjectId(_id)
        except errors.InvalidId:
            # Handle the exception
            errmsg = '"_id" must be convertible to ObjectId'
            print(errmsg)
            raise HTTPException(status_code=400, detail=errmsg)

    if db.fake_bubbles.count_documents({'_id': _id}, limit=1) == 0:
        errmsg = '"_id" must be present in bubbles collection'
        print(errmsg)
        raise HTTPException(status_code=400, detail=errmsg)

    #  ========== n ==========
    if "result" not in request_args.keys():
        errmsg = "result field must be passed"
        raise HTTPException(status_code=400, detail=errmsg)
    else:
        result = request_args["result"]
        try:
            result = float(result)
        except ValueError:
            errmsg = "result must be convertible to float"
            raise HTTPException(status_code=400, detail=errmsg)

    handle_result_bubble(result, _id)
    return Response(status_code=200)


@router.get("/suggest/users/")
def suggest_users(query: Request) -> Response:
    """
    http://<local socket>/suggest/users/?_id=<ObjectId>
    Returns _ids corresponding to search criteria in json format.

    :param: ObjectId, _id of user being searched
    :return: json list of ObjectIds: [ObjectId],
             response code: 200 or 204 (empty return)
    """

    request_args = dict(query.query_params)
    if "_id" not in request_args.keys():
        errmsg = "_id field must be passed"
        raise HTTPException(status_code=400, detail=errmsg)
    else:
        _id = request_args["_id"]
        try:
            _id = ObjectId(_id)
        except errors.InvalidId:
            errmsg = "_id must be convertible to ObjectId"
            raise HTTPException(status_code=400, detail=errmsg)

    if db.users.count_documents({'_id': _id}, limit=1) == 0:
        errmsg = '"_id" must be present in users collection'
        print(errmsg)
        raise HTTPException(status_code=400, detail=errmsg)

    arr = suggest(_id=_id)
    return list_to_json(list(arr))
