from matching_engine.models.MAB import MABAgent
from bson.objectid import ObjectId


'''
This is the api for sending the result of user interactions from the "bubble" page
'''


def handle_result(result: float, _id: ObjectId) -> None:
    """
    Handles result of user interaction on bubble page
    :param: int {0,1}, result
    :param: ObjectId, _id
    :return: string

    Updates MAB score on the MongoDB. using a simple greedy algorithm.

    result is an integer, element of {0,1}. 0 indicates negative swipe, 1 indicates positive swipe
    """

    mode = 'bubble'

    # noinspection PyTypeChecker
    mab = MABAgent(mode, _id)
    mab.update_agent(result, _id)

    return
