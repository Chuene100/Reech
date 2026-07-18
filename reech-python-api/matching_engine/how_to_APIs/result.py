from matching_engine.models.MAB import MABAgent
from matching_engine.models.QNN import QNNAgent
from matching_engine.models.hyperparameters import response_result_dict
from matching_engine.utilities.mongoDB_utility import update_seen_objects
from bson.objectid import ObjectId
from typing import Literal

'''
This is the api for sending the result of user interactions from the "home -> be reached" page
'''


def handle_result(
        mode: Literal['home.be_reached', 'home.reach_for'],
        response: Literal['pin', 'apply', 'reject'],
        subject_id: ObjectId,
        object_id: ObjectId
) -> None:
    """
    Handles result of user interaction on be_reached page
    :param: str {pin, apply, reject}, response
    :param: ObjectId, _id
    :param: ObjectId, _id of object being interacted with
    :return: string
    """

    if mode == "home.be_reached":
        source_collection = "profiles"
    elif mode == "home.reach_for":
        source_collection = "opportunities"
    else:
        raise ValueError('Mode must be one of ["home.be_reached", "home.reach_for"]')

    if response not in ["pin", "apply", "reject"]:
        raise ValueError('response must be one of ["pin", "apply", "reject"]')

    # noinspection PyTypeChecker
    update_seen_objects(source_collection, subject_id, object_id, response)

    if response == "pin":
        return  # We do not update the models when cards are pinned

    result = response_result_dict[response]

    qnn = QNNAgent(mode, subject_id)
    mab = MABAgent(mode, subject_id)
    qnn.update_agent(result, object_id)
    mab.update_agent(result, object_id)

    return
