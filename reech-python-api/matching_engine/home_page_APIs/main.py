# -*- coding: utf-8 -*-
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from matching_engine.models.QNN import QNNAgent
from matching_engine.models.MAB import MABAgent
from matching_engine.utilities.mongoDB_utility import fetch_data, filter_similarity_threshold
from bson.objectid import ObjectId
from typing import Literal
import pandas as pd

'''
API for home page for users that want to be reached
Returns profile cards
'''


def agent(
        mode: Literal['home.be_reached', 'home.reach_for'], _id: ObjectId, n: int, hard_filter: bool, include_fake: bool,
        agent_architecture: Literal['cosine_similarity', 'qnn', 'mab']
) -> pd.DataFrame:
    """
    :param: ObjectId, _id
    :param: array[float], embedded query
    :param: int, n
    :return: pandas.DataFrame, Keys: {_id, score}, length<=n
    """

    #print(_id)
    data = fetch_data(mode, _id, n, hard_filter=hard_filter, include_fake=include_fake)
    #print(data)
    data = filter_similarity_threshold(mode, _id, data)

    if agent_architecture == 'cosine_similarity':
        return data
    elif agent_architecture == 'qnn':
        sorting_agent = QNNAgent(mode, _id)
    elif agent_architecture == 'mab':
        sorting_agent = MABAgent(mode, _id)
    else:
        raise NotImplementedError("agent_architecture must be one of 'cosine_similarity', 'qnn', 'mab' ")

    return sorting_agent.greedy_agent(data, n)
