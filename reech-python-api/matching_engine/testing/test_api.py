import sys
import os

# Add the directory containing the 'matching_engine' module to the Python path
matching_engine_path = '/Users/chuene/Desktop/Reech/reech-python-api/matching_engine'
sys.path.append(matching_engine_path)
#from matching_engine.utilities.constants import RATE_WINDOW, embedding_size
from utilities.constants import RATE_WINDOW, embedding_size
#from matching_engine.utilities.mongoDB_utility import mongodb_connection, get_seen_objects_attribute
from utilities.mongoDB_utility import mongodb_connection, get_seen_objects_attribute
#from matching_engine.utilities.utility import distance as coordinate_distance
from utilities.utility import distance as coordinate_distance
#from matching_engine.models.hyperparameters import response_result_dict
from models.hyperparameters import response_result_dict
#from matching_engine.utilities.mongoDB_utility import HowTo_vids_mab_function
from main import app
from numbers import Number
from datetime import datetime
import pandas as pd
import json
import pytest
from bson.objectid import ObjectId
from fastapi.testclient import TestClient


client = mongodb_connection()
db = client.ReechDatabase  # access test database from client

test_client = TestClient(app)

''' 
Testing file for ML APIs

Reference:
https://circleci.com/blog/testing-flask-framework-with-pytest/#:~:text=Testing%20Flask%20requires%20that%20we,to%20the%20application%20under%20test.
https://blog.visionify.ai/converting-a-python-flask-app-into-a-fastapi-app-e09f8cd3da58
https://fastapi.tiangolo.com/tutorial/testing/
'''


@pytest.mark.test_index_route
def test_index_route():
    response = test_client.get('/')

    assert response.status_code == 200
    assert response.json() == 'Testing, Flask!'


@pytest.mark.test_init_doc
def test_init_doc():
    response = test_client.post("/utilities/init_doc/")
    # Test if 400 is returned when nothing is passed
    assert response.status_code == 400

    query = {"_id": ObjectId()}
    response = test_client.post("/utilities/init_doc/", params=query)
    # Test if 400 is returned when collection is not passed
    assert response.status_code == 400

    query = {"collection": ""}
    response = test_client.post("/utilities/init_doc/", params=query)
    # Test if 400 is returned when document is not passed
    assert response.status_code == 400

    query["_id"] = "not an objectId"
    query["collection"] = "profiles"
    response = test_client.post("/utilities/init_doc/", params=query)
    # Test if 400 is returned when incorrect document is passed
    assert response.status_code == 400

    query["document"] = ObjectId()
    query["collection"] = "incorrect collection"
    response = test_client.post("/utilities/init_doc/", params=query)
    # Test if 400 is returned when incorrect document and collection is passed
    assert response.status_code == 400
    _id = ObjectId('6454a45d31d8db9c0560704d')
    new_document = {
        "_id": _id,
        'jobTitle': 'Manager',  # str
        'jobDescription': 'Manage',  # str
        'skillIds': [ObjectId('6454a45d31d8db9c0560704d'), ObjectId('6454a45d31d8db9c0560704e')],  # list(ObjectId)
        'ratePerHour': 100,  # int
        'experience': 5,  # int
        'partiallyInitialised': True
    }
    db.profiles.update_one({"_id": _id}, {"$set": new_document}, upsert=True)
    query = {"_id": _id}
    response = test_client.post("/utilities/init_doc/", params=query)
    # Test if 400 is returned when incorrect collection is passed
    assert response.status_code == 400

    query["collection"] = "profiles"
    response = test_client.post("/utilities/init_doc/", params=query)
    assert response.status_code == 200

    updated_doc = db.profiles.find_one({'_id': _id})

    assert "embedding" in updated_doc.keys()
    assert isinstance(updated_doc['embedding'], list)
    assert len(updated_doc['embedding']) == embedding_size
    for element in updated_doc['embedding']:
        assert isinstance(element, Number)

    assert "learned_embedding" in updated_doc.keys()
    assert isinstance(updated_doc['learned_embedding'], list)
    assert len(updated_doc['learned_embedding']) == embedding_size
    for element in updated_doc['learned_embedding']:
        assert isinstance(element, Number)

    assert 'partiallyInitialised' not in updated_doc.keys()


@pytest.mark.test_embed_job_title
def test_embed_job_title_utility():
    response = test_client.get("/utilities/embed_job_title/")
    # Test if 400 is returned when _id is not passed
    assert response.status_code == 400

    response = test_client.get(
        "/utilities/embed_job_title/", params={'jobTitle': "some job title"})
    assert response.status_code == 200
    decoded_response = json.loads(response.json())
    assert isinstance(decoded_response, list)
    for element in decoded_response:
        assert isinstance(element, Number)


@pytest.mark.test_embed_job_description
def test_embed_job_description_utility():
    response = test_client.get("/utilities/embed_job_description/")
    # Test if 400 is returned when _id is not passed
    assert response.status_code == 400

    response = test_client.get("/utilities/embed_job_description/",
                               params={'jobDescription': "some job description"})
    assert response.status_code == 200
    decoded_response = json.loads(response.json())
    assert isinstance(decoded_response, list)
    for element in decoded_response:
        assert isinstance(element, Number)


@pytest.mark.get_request_reach_for_400
def test_reach_for_fetch_400():
    collection = db.opportunities
    data_point = collection.find_one()
    _id = data_point['_id']

    response = test_client.get('/home/reach_for/fetch/')
    # Test if 400 is returned when _id is not passed
    assert response.status_code == 400

    response = test_client.get(
        '/home/reach_for/fetch/', params={'_id': "not_an_ObjectID"})
    # Test if 400 is returned when incorrect object type is sent as _id
    assert response.status_code == 400

    # generate ObjectId that is not present in db
    unused_id = ObjectId()
    while True:
        if db.opportunities.count_documents({'_id': unused_id}, limit=1) == 0:
            break
        unused_id = str(ObjectId())

    response = test_client.get(
        '/home/reach_for/fetch/', params={'_id': unused_id})
    # Test if 400 is returned when non existent _id is queried
    assert response.status_code == 400


@pytest.mark.get_request_reach_for_200
def test_reach_for_fetch_200():
    # this is a good opportunity object for testing
    #_id = ObjectId("6332fc9ffff689cabc0de425")
    _id = ObjectId("63c68bc972c279cc10ff1e54")  #added for testing
    collection = db.profiles
    data_point = collection.find_one({"_id": _id})

    # Check if data point exists
    if data_point is not None:
        print('Data:', data_point)
    

    seen_ids = list(data_point['pinnedCards'])
    seen_ids.append(data_point['rejectedCards'])
    seen_ids.append(data_point['appliedCards'])
    #coordinate = data_point['location']['coordinates']
    #radius = data_point['radius']
    rate = data_point["rate"]
    qualification = data_point["NQFLevel"]
    user_id = data_point["userId"]

    response = test_client.get(
        '/home/reach_for/fetch/', params={'_id': str(_id)})
    # assert response.status_code == 200

    if response.status_code == 200:

        res = response.json()
        #res = json.loads(res)
        if not isinstance(res, list):
        # If response is not a list, wrap it in a list
            res = [res]
        assert isinstance(res, list)

        df = pd.DataFrame(res)
        assert "_id" in df.keys()
        assert "score" in df.keys()
        # assert len(df) == 3

        for returned_id in df['_id']:
            assert returned_id == str(ObjectId(returned_id))
            assert ObjectId(returned_id) not in seen_ids
            doc = db.profiles.find_one({"_id": ObjectId(returned_id)})
            #doc_coordinate = doc["location"]["coordinates"]
            #assert coordinate_distance(
            #    coordinate, doc_coordinate) <= radius + 2  # +2 for some lee-way
            doc_rate = doc["rate"]
            doc_qualification = doc["NQFLevel"]
            doc_user_id = doc["userId"]
            assert qualification >= doc_qualification
            assert (1 - RATE_WINDOW) * rate <= doc_rate <= (1 + RATE_WINDOW) * rate
            assert _id in doc["appliedCards"]
            assert isinstance(user_id, type(doc_user_id))
            assert user_id != doc_user_id

    # test include_fake
    response = test_client.get(
        '/home/reach_for/fetch/', params={'_id': str(_id), 'hard_filter': "0", 'include_fake': "0"})
    #assert response.status_code == 200
    res = response.json()
    #res = json.loads(res)
    if not isinstance(res, list):
        # If response is not a list, wrap it in a list
        res = [res]
    assert isinstance(res, list)
    #df = pd.DataFrame(res)
    #print(df)
    #for returned_id in df['_id']:
    #    doc = db.profiles.find_one({"_id": ObjectId(returned_id)})
    #    assert "fake" not in doc.keys()

    # test include_fake
    response = test_client.get(
        '/home/reach_for/fetch/', params={'_id': str(_id), 'hard_filter': 0, 'include_fake': 0})
    #assert response.status_code == 200
    res = response.json()
    if not isinstance(res, list):
        # If response is not a list, wrap it in a list
        res = [res]
    #res = json.loads(res)
    assert isinstance(res, list)
    #df = pd.DataFrame(res)
    #for returned_id in df['_id']:
    #    doc = db.profiles.find_one({"_id": ObjectId(returned_id)})
    #    assert "fake" not in doc.keys()


@pytest.mark.get_request_be_reached_400
def test_be_reached_fetch_400():
    collection = db.profiles
    data_point = collection.find_one()
    _id = data_point['_id']

    response = test_client.get('/home/be_reached/fetch/')
    # Test if 400 is returned when _id is not passed
    assert response.status_code == 400

    response = test_client.get(
        '/home/be_reached/fetch/', params={'_id': "not_an_ObjectID"})
    # Test if 400 is returned when incorrect object type is sent as _id
    assert response.status_code == 400

    # generate ObjectId that is not present in db
    unused_id = ObjectId()
    while True:
        if db.profiles.count_documents({'_id': unused_id}, limit=1) == 0:
            break
        unused_id = ObjectId()
    response = test_client.get(
        '/home/be_reached/fetch/', params={'_id': str(unused_id)})
    # Test if 400 is returned when non existent _id is queried
    assert response.status_code == 400


@pytest.mark.get_request_be_reached_200
def test_be_reached_200():

    db.opportunities.create_index([("location", "2dsphere")])
    # this is a good profile objet for testing
    #_id = ObjectId("63c68bca72c279cc10ff1e58")
    _id = ObjectId("63c68bc972c279cc10ff1e54")
    collection = db.profiles
    data_point = collection.find_one({"_id": _id})
    seen_ids = list(data_point['pinnedCards'])
    seen_ids.append(data_point['rejectedCards'])
    seen_ids.append(data_point['appliedCards'])
    coordinate = data_point['location']['coordinates']
    rate = data_point["rate"]
    qualification = data_point["NQFLevel"]
    user_id = data_point["userId"]

    response = test_client.post(
        '/home/be_reached/fetch/', params={'_id': str(_id)})

    # assert response.status_code == 200

    if response.status_code == 200:
        res = response.json()
        res = json.loads(res)
        assert isinstance(res, list)

        df = pd.DataFrame(res)
        assert "_id" in df.keys()
        assert "score" in df.keys()
        # assert len(df) == 4

        for returned_id in df['_id']:
            assert returned_id == str(ObjectId(returned_id))
            assert ObjectId(returned_id) not in seen_ids
            doc = db.profiles.find_one({"_id": ObjectId(returned_id)})
            doc_coordinate = doc["location"]["coordinates"]
            doc_rate = doc["rate"]
            doc_qualification = doc["NQFLevel"]
            radius = doc["radius"]
            doc_user_id = doc["userId"]
            selected_end_date = doc['duration']['selectedEndDate']
            assert coordinate_distance(
                coordinate, doc_coordinate) <= radius + 2  # +2 for some lee-way
            assert qualification >= doc_qualification
            assert (1 - RATE_WINDOW) * rate <= doc_rate <= (1 + RATE_WINDOW) * rate
            assert isinstance(user_id, type(doc_user_id))
            assert user_id != doc_user_id
            assert selected_end_date >= datetime.now()
       

@pytest.mark.get_request_bubble
def test_bubble_fetch():
    response = test_client.get('/bubble/fetch/')
    # Test if 400 is returned when _id is not passed
    assert response.status_code == 400

    response = test_client.get(
        '/bubble/fetch/', params={'_id': "not_an_ObjectID"})
    # Test if 400 is returned when incorrect object type is sent as _id
    assert response.status_code == 400

    # generate ObjectId that is not present in db
    unused_id = ObjectId()
    while True:
        if db.users.count_documents({'_id': unused_id}, limit=1) == 0:
            break
        unused_id = ObjectId()
    response = test_client.get(
        '/bubble/fetch/', params={'_id': str(unused_id)})
    # Test if 400 is returned when non existent _id is queried
    assert response.status_code == 400

    document = db.users.find_one()  # testing random user
    _id = document["_id"]
    response = test_client.get('/bubble/fetch/', params={'_id': _id})

    assert response.status_code == 200 or response.status_code == 204

    _id = "62e2dedd17e03d2ef3484007"  # testing user with many bubbles on feed
    response = test_client.get('/bubble/fetch/', params={'_id': _id})

    assert response.status_code == 200

    res = response.json()

    res = json.loads(res)
    assert isinstance(res, list)

    df = pd.DataFrame(res)

    assert "_id" in df.keys()
    assert "score" in df.keys()

    assert len(df) == 10 + 2


@pytest.mark.post_response_reach_for
def test_reach_for_response():
    profile_document = db.profiles.find_one()
    profile_id = profile_document['_id']

    api_path = '/home/reach_for/response/'

    for response_str in ["apply", "reject"]:
        profile_document = db.profiles.find_one({"_id": profile_id})
        prev_n = profile_document['N_views']
        prev_q = float(profile_document['score'])
        result = response_result_dict[response_str]
        R = float(result)
        coefficient = 1.0 if (prev_n == 0) else (1 / float(prev_n))

        _id = db.opportunities.find_one()['_id']

        response = test_client.get(
            api_path, params={'response': response_str, 'profile_id': profile_id, '_id': _id})
        #assert response.status_code == 200

        # test if N_views is incremented and if seen_ids is updated
        profile_document = db.profiles.find_one({"_id": profile_id})
        new_n = profile_document['N_views']
        new_q = profile_document['score']
        #assert new_n == prev_n + 1
        #assert new_q == prev_q + coefficient * (R - prev_q)

        # noinspection PyTypeChecker
        seenObjects = get_seen_objects_attribute(response_str)
        assert profile_id in db.opportunities.find_one({"_id": _id})[
            seenObjects]

    response = test_client.post(
        api_path, params={'profile_id': profile_id, '_id': _id})
    assert response.status_code == 400

    response = test_client.post(
        api_path, params={'response': "apply", '_id': _id})
    assert response.status_code == 400

    response = test_client.post(
        api_path, params={'response': "apply", 'profile_id': profile_id})
    assert response.status_code == 400

    response = test_client.post(
        api_path, params={'response': "invalid response", 'profile_id': profile_id, '_id': _id})
    assert response.status_code == 400

    response = test_client.post(
        api_path, params={'response': "apply", 'profile_id': "not an ObjectId", '_id': _id})
    assert response.status_code == 400

    response = test_client.post(api_path, params={
        'result': result, 'profile_id': profile_id, '_id': "not an ObjectId"})
    assert response.status_code == 400

    # generate ObjectId that is not present in db
    unused_id = ObjectId()
    while True:
        if db.opportunities.count_documents({'_id': unused_id}, limit=1) == 0:
            break
        unused_id = ObjectId()
    response = test_client.post(
        api_path, params={'response': "apply", 'profile_id': profile_id, '_id': unused_id})
    # Test if 400 is returned when non existent _id is queried
    assert response.status_code == 400

    # generate ObjectId that is not present in db
    unused_id = ObjectId()
    while True:
        if db.profiles.count_documents({'_id': unused_id}, limit=1) == 0:
            break
        unused_id = ObjectId()
    response = test_client.post(
        api_path, params={'response': "apply", 'profile_id': unused_id, '_id': _id})
    # Test if 400 is returned when non existent _id is queried
    assert response.status_code == 400




@pytest.mark.post_response_be_reached
def test_be_reached_response():
    api_path = '/home/be_reached/response/'

    opportunity_document = db.opportunities.find_one()
    opportunity_id = opportunity_document['_id']

    for response_str in ["apply", "reject"]:
        opportunity_document = db.opportunities.find_one(
            {"_id": opportunity_id})
        prev_n = opportunity_document['N_views']
        prev_q = float(opportunity_document['score'])
        result = response_result_dict[response_str]
        R = float(result)
        coefficient = 1.0 if (prev_n == 0) else (1 / float(prev_n))

        _id = db.profiles.find_one()['_id']

        response = test_client.get(api_path, params={
            'response': response_str, 'opportunity_id': opportunity_id, '_id': _id})
        #assert response.status_code == 200

        # test if N_views is incremented and if seen_ids is updated
        opportunity_document = db.opportunities.find_one(
            {"_id": opportunity_id})
        new_n = opportunity_document['N_views']
        new_q = opportunity_document['score']
        #assert new_n == prev_n + 1
        #assert new_q == prev_q + coefficient * (R - prev_q)

        # noinspection PyTypeChecker
        seenObjects = get_seen_objects_attribute(response_str)
        assert opportunity_id in db.profiles.find_one({"_id": _id})[
            seenObjects]

    response = test_client.post(
        api_path, params={'opportunity_id': opportunity_id, '_id': _id})
    assert response.status_code == 400

    response = test_client.post(
        api_path, params={'response': "apply", '_id': _id})
    assert response.status_code == 400

    response = test_client.post(
        api_path, params={'response': "apply", 'opportunity_id': opportunity_id})
    assert response.status_code == 400

    response = test_client.post(api_path, params={
        'response': "invalid response", 'opportunity_id': opportunity_id, '_id': _id})
    assert response.status_code == 400

    response = test_client.post(api_path, params={
        'response': "apply", 'opportunity_id': "not an ObjectId", '_id': _id})
    assert response.status_code == 400

    response = test_client.post(api_path, params={
        'response': "apply", 'opportunity_id': opportunity_id, '_id': "not an ObjectId"})
    assert response.status_code == 400

    # generate ObjectId that is not present in db
    unused_id = ObjectId()
    while True:
        if db.profiles.count_documents({'_id': unused_id}, limit=1) == 0:
            break
        unused_id = ObjectId()
    response = test_client.post(api_path, params={
        'response': "apply", 'opportunity_id': opportunity_id, '_id': unused_id})
    # Test if 400 is returned when non existent _id is queried
    assert response.status_code == 400

    # generate ObjectId that is not present in db
    unused_id = ObjectId()
    while True:
        if db.opportunities.count_documents({'_id': unused_id}, limit=1) == 0:
            break
        unused_id = ObjectId()
    response = test_client.post(
        api_path, params={'response': "apply", 'opportunity_id': unused_id, '_id': _id})
    # Test if 400 is returned when non existent _id is queried
    assert response.status_code == 400


@pytest.mark.post_response_bubble
def test_bubble_response():
    api_path = '/bubble/response/'

    collection = db.fake_bubbles
    bubble_document = collection.find_one()
    _id = bubble_document['_id']

    for result in [0, 1]:
        bubble_document = collection.find_one({"_id": _id})
        prev_n = bubble_document['N_views']
        prev_q = float(bubble_document['score'])
        R = float(result)
        coefficient = 1.0 if (prev_n == 0) else (1 / float(prev_n))

        response = test_client.post(
            api_path, params={'result': result, '_id': _id})
        assert response.status_code == 200

        # test if N_views is incremented and if seen_ids is updated
        bubble_document = collection.find_one({"_id": _id})
        new_n = bubble_document['N_views']
        new_q = bubble_document['score']
        assert new_n == prev_n + 1
        assert new_q == prev_q + coefficient * (R - prev_q)

    response = test_client.post(api_path, params={'result': result})
    # Test if 400 is returned when no _id is passed
    assert response.status_code == 400

    response = test_client.post(api_path, params={'_id': _id})
    # Test if 400 is returned when no result is passed
    assert response.status_code == 400

    response = test_client.post(
        api_path, params={'result': result, '_id': "not an ObjectId"})
    # Test if 400 is returned when non-convertible _id is passed
    assert response.status_code == 400

    response = test_client.post(
        api_path, params={'result': "not a float", '_id': _id})
    # Test if 400 is returned when non-convertible result is passed
    assert response.status_code == 400

    # generate ObjectId that is not present in db
    unused_id = ObjectId()
    while True:
        if db.fake_bubbles.count_documents({'_id': unused_id}, limit=1) == 0:
            break
        unused_id = ObjectId()
    response = test_client.post(
        api_path, params={'result': result, '_id': unused_id})
    # Test if 400 is returned when non existent _id is queried
    assert response.status_code == 400


@pytest.mark.get_suggestions
def test_get_suggestions():
    api_path = '/suggest/users/'

    response = test_client.get(api_path)
    # Test if 400 is returned when _id is not passed
    assert response.status_code == 400

    response = test_client.get(
        api_path, params={'_id': "not_an_ObjectID"})
    # Test if 400 is returned when incorrect object type is sent as _id
    assert response.status_code == 400

    # generate ObjectId that is not present in db
    unused_id = ObjectId()
    while True:
        if db.users.count_documents({'_id': unused_id}, limit=1) == 0:
            break
        unused_id = ObjectId()
    response = test_client.get(
        api_path, params={'_id': str(unused_id)})
    # Test if 400 is returned when non existent _id is queried
    assert response.status_code == 400

    #_id = '62e2dedd17e03d2ef3484007'
    #response = test_client.get(api_path, params={'_id': _id})

    #assert response.status_code == 200


#@pytest.mark.get_recommendations
#def test_how_to_vids_mab_function():
#    api_path = '/how_to/vids/mab_function/'
#
#    # Test case 1: Test with valid parameters
#    response = test_client.post(api_path, json={
#        'page': 'home.be_reached',
#        '_id': '62e2dedd17e03d2ef3484007',   
#        'data': [
#            {
#                "_id": "652ff89cf8922ccb41d8d826",
#                "score": 0.8,
#                "title": "Ecosystem",
#                "description": "Minima and Inferrix, both innovators in blockchain and IoT infrastruct…",
#                "channelId": "6527c8c4287c4b224101c4a3",
#                "subChannelId": "6527cf94287c4b224101c57c",
#                "ThoughtShareCount": 0,
#                "learned_embedding": [0.1, 0.2, 0.3],
#                "createdAt": "2023-10-18T15:24:12.745+00:00"
#            },
#
#        ],
#        'similarity_threshold': 0.5
#    })
#
#    assert response.status_code == 200
#    
#
#    # Test case 2: Test with invalid page parameter
#    response = test_client.post(api_path, json={
#        'page': 'invalid_page',
#        '_id': '62e2dedd17e03d2ef3484007',
#        'data': [
#            {
#                "_id": " ",
#                "score": 0.8,
#                "title": " ",
#                "description": " ",
#                "channelId": " ",
#                "subChannelId": " ",
#                "ThoughtShareCount": 10,
#               "learned_embedding": [0.1, 0.2, 0.3],
#                "createdAt": " "
#            },
#
#        ],
#        'similarity_threshold': 0.5
#    })
#
#    assert response.status_code == 400
# 

