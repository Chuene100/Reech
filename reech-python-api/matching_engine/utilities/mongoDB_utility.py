import pymongo
from matching_engine.utilities.constants import DATABASE_LINK_ENV_VARIABLE, RATE_WINDOW, n_suggestions_per_card, similarity_threshold
#from utilities.constants import DATABASE_LINK_ENV_VARIABLE, RATE_WINDOW, n_suggestions_per_card, similarity_threshold
from matching_engine.utilities.utility import radians_calculation
#from utilities.utility import radians_calculation
from bson.objectid import ObjectId
from typing import List, Tuple
from typing_extensions import Literal
from datetime import datetime
#from matching_engine.models.MAB import MABAgent
import pandas as pd
import os
import numpy as np

from dotenv import load_dotenv
load_dotenv()

def get_object_to_init(_id: ObjectId, collection: str) -> dict:
    client = mongodb_connection()
    db = client.ReechDatabase  # access test database from client
    collection = db[collection]
    doc = collection.find_one({"_id": _id})

    doc['skillNames'] = db['skills'].distinct("skillName", {"_id": {"$in": doc['skillIds']}})

    return doc


def perform_init(_id: ObjectId, collection: str, fields_to_insert: dict) -> None:
    client = mongodb_connection()
    db = client.ReechDatabase  # access test database from client
    collection = db[collection]
    collection.update_one({'_id': _id}, {"$set": fields_to_insert})


def finalise_init(_id: ObjectId, collection: str) -> None:
    client = mongodb_connection()
    db = client.ReechDatabase  # access test database from client
    collection = db[collection]
    collection.update_one({'_id': _id}, {"$unset": {'partiallyInitialised': 1}})


def get_seen_objects_attribute(response: Literal['pin', 'apply', 'reject']) -> str:
    """
    :param response: str, one of {pin, apply, reject}
    :return: str, name of seenObjects attribute corresponding to the response
    """
    response_collection_dict = {
        "apply": "appliedCards",
        "reject": "rejectedCards",
        "pin": "pinnedCards"
    }
    return response_collection_dict[response]


def mongodb_connection() -> pymongo.MongoClient:
    """
    Attempts to connect to the mongo client
    :return: pymongo.MongoClient
    """

    CLIENT_STRING = os.environ.get(DATABASE_LINK_ENV_VARIABLE)
    #CLIENT_STRING = "mongodb://ml-API:r7ncfi2oLUYaOXHJ@reechdb-shard-00-00.ojmoq.mongodb.net:27017,reechdb-shard-00-01.ojmoq.mongodb.net:27017,reechdb-shard-00-02.ojmoq.mongodb.net:27017/?ssl=true&replicaSet=atlas-v664uk-shard-0&authSource=admin&retryWrites=true&w=majority"

    print(CLIENT_STRING)
    if CLIENT_STRING is None:
        raise Exception("DATABASE_LINK env variable not found - have you set the MongoDB connection URL in your "
                        "environment variables yet?")
    try:
        return pymongo.MongoClient(CLIENT_STRING, tlsAllowInvalidCertificates=True)
    except pymongo.errors.ConnectionFailure as e:
        raise Exception("Could not connect to server: %s" % e)


def fetch_score_and_n_views(collection: Literal['profiles', 'opportunities'], object_id: ObjectId) -> (float, int):
    """
    Fetches score and N_views from MongoDB collection for object with object_id as _id
    :param collection: string, corresponds to name of mongoDB collection
    :param object_id: bson.ObjectId, _id of object in MongoDB collection
    :return: (float, int)
    """
    client = mongodb_connection()
    db = client.ReechDatabase  # access test database from client
    collection = db[collection]

    data_point = collection.find_one({"_id": object_id})

    score = float(data_point['score'])
    n_views = float(data_point['N_views'])
    return score, n_views


def fetch_embeddings(collection: Literal['profiles', 'opportunities'], object_id: ObjectId) -> (float, float):
    """
    Fetches embeddings for object from collection
    :param collection: str
    :param object_id: ObjectId
    :return: ([float],[float]), (embedding array, learned_embedding array)
    """
    client = mongodb_connection()
    db = client.ReechDatabase  # access test database from client
    collection = db[collection]

    data_point = collection.find_one({"_id": object_id})
    return data_point['embedding'], data_point['learned_embedding']


def update_score_and_n_views(
        collection: Literal['profiles', 'opportunities'], object_id: ObjectId, score: float, n_views: int
) -> None:
    """
    Updates score and n_views for object in collection
    :param collection: str
    :param object_id: ObjectId
    :param score: float
    :param n_views: int
    :return: None
    """
    client = mongodb_connection()
    db = client.ReechDatabase  # access test database from client
    collection = db[collection]

    collection.update_one(
        {'_id': object_id},
        {"$set": {'N_views': n_views, 'score': score}}
    )


def update_learned_embedding(
        collection: Literal['profiles', 'opportunities'], object_id: ObjectId, learned_embedding: List[float]
) -> None:
    """
    Updates learned embedding for object in collection
    :param collection: str
    :param object_id: ObjectId
    :param learned_embedding: array of floats
    :return: None
    """
    client = mongodb_connection()
    db = client.ReechDatabase  # access test database from client
    collection = db[collection]

    collection.update_one(
        {'_id': object_id},
        {"$set": {'learned_embedding': learned_embedding}}
    )


def update_seen_objects(
        collection: Literal['profiles', 'opportunities'], _id: ObjectId, object_id: ObjectId, response: str
) -> None:
    """
    Updates list of seen objects on mongoDB
    :param collection: string, corresponds to name of mongoDB collection
    :param _id: bson.ObjectId, _id of object being updated
    :param object_id: bson.ObjectId, _id of object being added to list of seen objects
    :param response: str, one of {pin, apply, reject}
    :return: None
    """
    client = mongodb_connection()
    db = client.ReechDatabase  # access test database from client
    collection = db[collection]

    # noinspection PyTypeChecker
    seen_objects = get_seen_objects_attribute(response)

    collection.update_one(
        {'_id': _id},
        {'$push': {seen_objects: object_id}}
    )


def filter_applied(_id: ObjectId) -> list:
    """
    This method fetches profile cards which have applied to the opportunity.


    :param: _id: ObjectId, _id of profile making the query
    :param: include_distance, optional (default=False) transformer model with method encode() user to encode the query

    :return: list, either empty or containing a dictionary {"all": list([opportunity_id,opportunity_id, *** ])}
    """
    client = mongodb_connection()
    db = client.ReechDatabase  # access test database from client
    collection = db.profiles  # access job ads collection from test database
    applied_ids = list(collection.distinct("_id", {"appliedCards": _id}))
    return applied_ids


def filter_location(_id: ObjectId, include_distance=False) -> list:
    """
    This method fetches opportunity cards for which the profile falls within their radius.
    Also filters out seen cards

    :param: _id: ObjectId, _id of profile making the query
    :param: include_distance, optional (default=False) transformer model with method encode() user to encode the query

    :return: list, either empty or containing a dictionary {"all": list([opportunity_id,opportunity_id, *** ])}
    """
    client = mongodb_connection()
    db = client.ReechDatabase  # access test database from client
    collection = db.opportunities  # access job ads collection from test database

    seen_ids = list(db.profiles.find_one({"_id": _id}, )['pinnedCards'])
    seen_ids.append(db.profiles.find_one({"_id": _id}, )['rejectedCards'])
    seen_ids.append(db.profiles.find_one({"_id": _id}, )['appliedCards'])

    center = db.profiles.find_one({"_id": _id}, )['location']
    coordinates = center['coordinates']

    # Filtering by within radius using collection's radius field
    # https://stackoverflow.com/questions/48760131/in-mongodb-how-do-i-use-a-field-in-the-document-as-input-to-a-geowithin-cente
    # https://stackoverflow.com/questions/27769348/mongodb-geonear-command-result-distance-in-kilometer/27773636#27773636

    filter_location_pipeline = [
        {"$geoNear": {
            "near": {"type": "Point", "coordinates": coordinates},
            "distanceField": "distance",
            "spherical": "true",
            "distanceMultiplier": 0.001
        }},
        {"$addFields": {"isIn": {"$subtract": ["$distance", "$radius"]}}},
        {"$match": {
            "isIn": {"$lte": 0},
            "_id": {"$nin": seen_ids}
        }}
    ]
    project_stage_basic = [
        {"$group": {"_id": "null", "all": {"$addToSet": "$_id"}}},
        {"$project": {"_id": 0, "all": 1}}
    ]

    project_stage_distance = [
        {"$project": {"_id": 1, "distance": 1, "location": 1}}
    ]

    if include_distance:
        filter_location_pipeline.extend(project_stage_distance)
    else:
        filter_location_pipeline.extend(project_stage_basic)

    filter_location_result = collection.aggregate(filter_location_pipeline)

    acceptable_ids = list(filter_location_result)
    return acceptable_ids


def fetch_data(
        page: Literal['home.be_reached', 'home.reach_for'], _id: ObjectId, n: int, hard_filter=True, include_fake=True
) -> pd.DataFrame:
    """
    This method decides what cards are shown to the user.
    Uses MongoDB's search api to find cards most appropriate for the user's request.

    :param: page, string {"home.be_reached","home.reach_for"}, corresponds to name of the page that the request is for
    :param: _id: ObjectId, _id of object making the query
    :param: n, int, number of entries tos be returned
    :param: model, transformer model with method encode() user to encode the query

    # be_reached: a profile looking for opportunities
    # reach_for: an opportunity looking for a profile

    :return: pd.Dataframe of documents
    """

    client = mongodb_connection()
    db = client.ReechDatabase  # access test database from client

    if page == "home.be_reached":
        collection = db.opportunities
        querier = db.profiles.find_one({"_id": _id})
        #print(querier)
        acceptable_ids = filter_location(_id)
        if len(acceptable_ids) == 0:  # There are no acceptable ids, nothing for user to view
            # return empty pd.df, triggers 204 return
            return pd.DataFrame(acceptable_ids)
        acceptable_ids = acceptable_ids[0]['all']
        
        # Get the current date and time
        current_date = datetime.now()
        match_filter = {
        "$and":   [
            {
                "_id": {"$in": acceptable_ids},
                "NQFLevel": {"$lte": querier['NQFLevel']}
            },
            {
                "duration.selectedEndDate": {"$gte": current_date}
            }
           ]
        }

    elif page == "home.reach_for":
        collection = db.profiles  # access users collection from test database
        #collection = db.profiles.find_one({"_id": _id})
        #print("Printinprofiles **************", collection)
        #print("*****************")
        #data_point = collection.find_one({"_id": _id})
        #print("*****************")
        #print(data_point)
        #print("*****************")
        
        # Check if data point exists
        #if data_point is not None:
        #    print('Data:', data_point)
        #else:
        #    print("Empty data")
        #print(collection)
        querier = db.opportunities.find_one({"_id": _id})
        #print(querier)
        seen_ids = list(querier['pinnedCards'])
        seen_ids.append(querier['rejectedCards'])
        seen_ids.append(querier['appliedCards'])
        #print(seen_ids)
        applied_ids = filter_applied(_id)
        #print(applied_ids)

        center = querier['location']
        radius = querier['radius']
        coordinates = center['coordinates']

        match_filter = {
            "_id": {
                "$nin": seen_ids,
                "$in": applied_ids
            },
            'location':
                {'$geoWithin': {'$centerSphere': [
                    coordinates, radians_calculation(radius)]}},
            "NQFLevel": {"$gte": querier['NQFLevel']}
        }  # MongoDB expects radius values in radians, 6378.1 is radius of earth in Km.

    else:
        raise Exception(
            "'page' parameter must be one of {'home.be_reached','home.reach_for'}")

    user_id = querier["userId"]
    rate = querier['rate']
    match_filter["rate"] = {
        "$gte": (1 - RATE_WINDOW) * rate, "$lte": (1 + RATE_WINDOW) * rate}
    embedded_query = querier['search_embedding']

    k = collection.count_documents({})
    vector_search_step = {"$search": {
        'index': 'embedding_vector_search',
        "knnBeta": {
            "vector": embedded_query,
            "path": "search_embedding",
            "k": k,
        }
    }}
    if not hard_filter:
        match_filter = {}

    if not include_fake:
        match_filter['fake'] = {
            "$exists": False  # Exclude documents with the "fake" field
        }
    match_filter["userId"] = {
        "$nin": [user_id]
    }
    match_step = {"$match": match_filter}

    projection_step = {'$project': {'_id': 1, 'score': 1, }}
    limit_step = {"$limit": n}

    pipeline = [
        vector_search_step,
        match_step,
        projection_step,
        limit_step
    ]
    #print(pipeline)
    result = collection.aggregate(pipeline)
    #print(result)
    # the data must be copied immediately or else it will be deleted
    copy = list(result)
    #print(copy)
    data = pd.DataFrame(copy)  # convert to pd.df for ease of access
    #print(data)
    return data


def filter_similarity_threshold(
        page: Literal['home.be_reached', 'home.reach_for'], _id: ObjectId, data: pd.DataFrame
) -> pd.DataFrame:
    """
    Filters a DataFrame based on cosine similarity threshold with a given profile embedding.

    Parameters:
        page (Literal['home.be_reached', 'home.reach_for']): Indicates the page context.
            Must be one of {'home.be_reached', 'home.reach_for'}.
        _id (ObjectId): Unique identifier for the profile or opportunity in MongoDB.
        data (pd.DataFrame): DataFrame containing embeddings and other data for comparison.

    Returns:
        pd.DataFrame: Filtered DataFrame containing rows with cosine similarity greater than
            the specified threshold.

    Raises:
        Exception: If 'page' parameter is not one of {'home.be_reached', 'home.reach_for'}.

    This function calculates cosine similarity between the given profile or opportunity (querier)
    and the rows in the input DataFrame based on their embeddings. Rows with cosine similarity
    greater than the similarity threshold are included in the returned DataFrame.
    """
    client = mongodb_connection()
    db = client.ReechDatabase  # access test database from client

    if page == "home.be_reached":
        collection = db.opportunities
        querier = db.profiles.find_one({"_id": _id})
        #print(querier)
    elif page == "home.reach_for":
        collection = db.profiles
        querier = db.opportunities.find_one({"_id": _id})
        #print(querier)
    else:
        raise Exception(
            "'page' parameter must be one of {'home.be_reached','home.reach_for'}")
    querier_embedding = querier["search_embedding"]


    def get_similarity(row):
        """
        Calculates cosine similarity between the given row's embedding and the querier's embedding.

        Parameters:
            row (pd.Series): A row from the input DataFrame containing an 'embedding' column.

        Returns:
            float: Cosine similarity between row's embedding and querier's embedding.
        """
        document = collection.find_one({"_id": row["_id"]})
        doc_embedding = document['search_embedding']
        
        cosine_similarity = np.dot(doc_embedding, querier_embedding) / (
                np.linalg.norm(doc_embedding)*np.linalg.norm(querier_embedding)
        )
        return cosine_similarity
    
    # Create multiple columns to store the similarity values
    #similarity_columns = [f"similarity_{i}" for i in range(len(data))]
    #print(similarity_columns)
    #data[similarity_columns] = data.apply(lambda row: pd.Series(get_similarity(row)), axis=1)
    #print(data)
     # Filter the DataFrame based on similarity threshold
    #applicable_data = data[data[similarity_columns] > similarity_threshold]
    #print(applicable_data)

    data["similarity"] = data.apply(get_similarity, axis=1)
    #print(data)
    applicable_data = data[data["similarity"] > similarity_threshold]

    return applicable_data
    #print(data)
    #data["similarity"] = data.apply(get_similarity, axis=1)
    #print('dataset_check',data["similarity"].dtype)
    #data["similarity"]=temp
    #return data


def fetch_bubbles(_id: ObjectId, n: int) -> pd.DataFrame:
    """
    This method decides what cards are shown to the user.
    Uses MongoDB's api to find bubbles fitting the user's request.
    """
    client = mongodb_connection()
    db = client.ReechDatabase  # access test database from client

    data_point = db.users.find_one({"_id": _id})
    friends = data_point['friends']

    match_step = {'$match': {"userId": {"$in": friends}, "ad": None}}
    sort_step = {"$sort": {"date": -1}}
    project_step = {'$project': {'_id': 1, 'score': 1}}
    limit_step = {"$limit": n}

    pipeline = [
        match_step,
        sort_step,
        project_step,
        limit_step
    ]

    result = db.fake_bubbles.aggregate(pipeline)

    # the data must be copied immediately or else it will be deleted
    copy = list(result)

    data = pd.DataFrame(copy)  # convert to pd.df for ease of

    return data


def fetch_bubble_ads(_id: ObjectId, n: int) -> pd.DataFrame:
    """
    This method decides what cards are shown to the user.
    Uses MongoDB's api to find bubble ads fitting the user's request.
    """
    client = mongodb_connection()
    db = client.ReechDatabase  # access test database from client

    match_step = {'$match': {"ad": True}}
    sort_step = {"$sort": {"date": -1}}
    project_step = {'$project': {'_id': 1, 'score': 1}}
    limit_step = {"$limit": n}

    pipeline = [
        match_step,
        sort_step,
        project_step,
        limit_step
    ]

    result = db.fake_bubbles.aggregate(pipeline)

    # the data must be copied immediately or else it will be deleted
    copy = list(result)

    data = pd.DataFrame(copy)  # convert to pd.df for ease of access

    return data


def fetch_suggestion(collection: Literal['profiles', 'opportunities'], _id: ObjectId) -> List[ObjectId]:
    """
    Fetches a list of suggestion IDs for the given collection and _id.

    Args:
        collection (Literal['profiles', 'opportunities']): The collection name, either 'profiles' or 'opportunities'.
        _id (ObjectId): The _id value to fetch suggestions for.

    Returns:
        List[ObjectId]: A list of suggestion IDs based on the given collection and _id.

    """

    client = mongodb_connection()
    db = client.ReechDatabase
    querier = db[collection].find_one({'_id': _id})

    embedded_query = querier['search_embedding']

    k = db[collection].count_documents({})

    vector_search_step = {"$search": {
        'index': 'embedding_vector_search',
        "knnBeta": {
            "vector": embedded_query,
            "path": "search_embedding",
            "k": k,
        }
    }}

    # projection_step = [
    #     {"$group": {"_id": "null", "all": {"$addToSet": "$_id"}}},
    #     {"$project": {"_id": 0, "all": 1}}
    # ]

    projection_step = {'$project': {'_id': 1}}

    limit_step = {"$limit": n_suggestions_per_card}

    pipeline = [
        vector_search_step,
        projection_step,
        limit_step,
    ]

    result = db[collection].aggregate(pipeline)

    # the data must be copied immediately or else it will be deleted
    copy = list(result)
    data = list(pd.DataFrame(copy)['_id'])  # convert to pd.df for ease of access, then get list of _ids
    return data


def fetch_cards_of_user(_id: ObjectId) -> Tuple[List[ObjectId], List[ObjectId]]:
    """
    Fetches profileIds and opportunityIds for a user with the given _id.

    Args:
        _id (ObjectId): The _id value of the user to fetch the cards for.

    Returns:
        Tuple[List[ObjectId], List[ObjectId]]: A tuple containing the profileIds and opportunityIds
            associated with the user.
    """

    client = mongodb_connection()
    db = client.ReechDatabase
    user_doc = db.users.find_one({'_id': _id})

    profileIds = user_doc['profileIds']  # list of ObjectIds
    opportunityIds = user_doc['opportunityIds']  # list of ObjectIds
    return profileIds, opportunityIds


def fetch_user_of_card(collection: Literal['profiles', 'opportunities'],
                       _id: ObjectId) -> ObjectId:
    """
    Fetches profileIds and opportunityIds for a user with the given _id.

    Args:
        _id (ObjectId): The _id value of the user to fetch the cards for.
        collection (str): the name of the collection where the card belongs

    Returns:
            ObjectId: The _id of the user object that owns the card
    """

    client = mongodb_connection()
    db = client.ReechDatabase
    card_doc = db[collection].find_one({'_id': _id})
    user_id = card_doc['userId']
    return user_id


def fetch_job_title(jobTitleId: ObjectId) -> str:
    """
    Fetches jobTitle corresponding to jobTitleId from jobtitles collection in mongoDB
    :param jobTitleId:
    :return: str: jobTitle
    """
    client = mongodb_connection()
    db = client.ReechDatabase
    card_doc = db['jobtitles'].find_one({'_id': jobTitleId})
    jobTitle = card_doc['jobTitle']
    return jobTitle


def fetch_HowTo(
        page: Literal['home.be_reached', 'home.reach_for'], _id: ObjectId, n: int, include_fake=True
) -> pd.DataFrame:
    """
    This method decides what videos are shown to the user.
    Uses MongoDB's search api to find cards most appropriate for the user's request.

    :param: page, string {"home.be_reached","home.reach_for"}, corresponds to name of the page that the request is for
    :param: _id: ObjectId, _id of object making the query
    :param: n, int, number of entries tos be returned
    :param: model, transformer model with method encode() user to encode the query

    # be_reached: a profile looking for opportunities
    # reach_for: an opportunity looking for a profile
    
    :return: pd.Dataframe of documents
    """

    client = mongodb_connection()
    db = client.ReechDatabase  # access test database from client

    if page == "home.be_reached":
        collection = db.thoughts
        querier = db.profiles.find_one({"_id": _id})
        acceptable_ids = filter_location(_id)
        if len(acceptable_ids) == 0:  # There are no acceptable ids, nothing for user to view
            # return empty pd.df, triggers 204 return
            return pd.DataFrame(acceptable_ids)
        acceptable_ids = acceptable_ids[0]['all']
        
        # Get the current date and time
        current_date = datetime.now()
        match_filter = {
        "$and":   [
            {
                "_id": {"$in": acceptable_ids},
                "description": {"$lte": querier['description']},
            },
            {
                "duration.selectedEndDate": {"$gte": current_date}
            }
           ]
        }

    elif page == "home.reach_for":
        collection = db.profiles  # access users collection from test database
        querier = db.opportunities.find_one({"_id": _id})
        seen_ids = list(querier['pinnedCards'])
        seen_ids.append(querier['rejectedCards'])
        seen_ids.append(querier['appliedCards'])

        applied_ids = filter_applied(_id)

        center = querier['location']
        radius = querier['radius']
        coordinates = center['coordinates']

        match_filter = {
            "_id": {
                "$nin": seen_ids,
                "$in": applied_ids
            },
            'location':
                {'$geoWithin': {'$centerSphere': [
                    coordinates, radians_calculation(radius)]}},
            "NQFLevel": {"$gte": querier['NQFLevel']}
        }  # MongoDB expects radius values in radians, 6378.1 is radius of earth in Km.

    else:
        raise Exception(
            "'page' parameter must be one of {'home.be_reached','home.reach_for'}")

    user_id = querier["userId"]
    rate = querier['rate']
    match_filter["rate"] = {
        "$gte": (1 - RATE_WINDOW) * rate, "$lte": (1 + RATE_WINDOW) * rate}
    embedded_query = querier['search_embedding']

    k = collection.count_documents({})
    vector_search_step = {"$search": {
        'index': 'embedding_vector_search',
        "knnBeta": {
            "vector": embedded_query,
            "path": "search_embedding",
            "k": k,
        }
    }}
    

    if not include_fake:
        match_filter['fake'] = {
            "$exists": False  # Exclude documents with the "fake" field
        }
    match_filter["userId"] = {
        "$nin": [user_id]
    }
    match_step = {"$match": match_filter}

    projection_step = {'$project': {'_id': 1, 'score': 1, }}
    limit_step = {"$limit": n}

    pipeline = [
        vector_search_step,
        match_step,
        projection_step,
        limit_step
    ]

    result = collection.aggregate(pipeline)

    # the data must be copied immediately or else it will be deleted
    copy = list(result)

    data = pd.DataFrame(copy)  # convert to pd.df for ease of access

    return data


#def HowTo_vids_mab_function(
#        page: Literal['home.be_reached', 'home.reach_for'], _id: ObjectId, data: pd.DataFrame, similarity_threshold: float = 0.5
#) -> pd.DataFrame:
#    """
#    Filters a DataFrame based on cosine similarity threshold with a given profile embedding and MABAgent.
#
#    Parameters:
#        page (Literal['home.be_reached', 'home.reach_for']): Indicates the page context.
#            Must be one of {'home.be_reached', 'home.reach_for'}.
#        _id (ObjectId): Unique identifier for the profile or opportunity in MongoDB.
#        data (pd.DataFrame): DataFrame containing embeddings and other data for comparison.
#
#    Returns:
#        pd.DataFrame: Filtered DataFrame containing rows with cosine similarity greater than
#            the specified threshold.
#
#    Raises:
#        Exception: If 'page' parameter is not one of {'home.be_reached', 'home.reach_for'}.
#
#    This function calculates cosine similarity between the given profile or opportunity (querier)
#    and the rows in the input DataFrame based on their embeddings. Rows with cosine similarity
#    greater than the similarity threshold are included in the returned DataFrame.
#
#    And also calcules the MABAgent's greedy agent for the given profile or opportunity (querier)
#    and the rows in the input DataFrame based on their embeddings. 
#    """
#    client = mongodb_connection()
#    db = client.ReechDatabase
#
#    if page == "home.be_reached":
#        collection = db.HowTo
#        querier = db.profiles.find_one({"_id": _id})
#    else:
#        raise ValueError("'page' parameter must be 'home.be_reached'")
#
#    def mab_function(video, querier):
#        # Extract relevant features from the user profile (querier)
#        # user_profile_data = querier.get("profile_data", {})
#
#        # Create a DataFrame with the video data
#        video_data = pd.DataFrame({
#            "_id": [video["_id"]],
#            "score": [video.get("score", 0)],  
#            "title": [video.get("title", "")],
#            "description": [video.get("description", "")],
#            "channelId": [video.get("channelId", "")],
#            "subChannelId": [video.get("subChannelId", "")],
#            "ThoughtShareCount": [video.get("ThoughtShareCount", 0)],
#            "learned_embedding": [video.get("learned_embedding", [])],
#            "createdAt": [video.get("createdAt", "")]
#        })
#
#       # Apply the MAB greedy agent to prioritize videos based on their current scores
#        top_n_videos = MABAgent.greedy_agent(video_data, n=1, similarity_threshold=0.0)
#
#        # Get the highest scoring video (if any) from the MAB greedy agent
#        recommended_video = top_n_videos.iloc[0] if not top_n_videos.empty else None
#
#        # Return the recommended video
#        return recommended_video
#
#
#
#    def mab_update_function(result, object_id):
#        update_func = MABAgent()
#        return update_func.update_agent(result, object_id)
#
#    # Apply MAB function to each video
#    data["mab_function"] = data.apply(lambda x: mab_function(x, querier), axis=1)
#    
#    # Update MAB values based on user interactions
#    applicable_data_mab_agent = data.apply(lambda x: mab_update_function(x["mab_function"], x["_id"]), axis=1)
#
#    # Get top recommendations from the MAB agent
#    recommendations = MABAgent.greedy_agent(applicable_data_mab_agent, n=10, similarity_threshold=similarity_threshold)
#
#    return recommendations


