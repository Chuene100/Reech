import os
import pytest
from bson.objectid import ObjectId
from matching_engine.utilities.mongoDB_utility import mongodb_connection
from matching_engine.models.QNN import QNNAgent
from matching_engine.models.MAB import MABAgent

client = mongodb_connection()
db = client.ReechDatabase  # access test database from client


@pytest.mark.test_QNNAgent
def test_qnn_agent():
    #opportunity_id = ObjectId('6332fc9ffff689cabc0de425')
    opportunity_id = ObjectId('66164f13264c5ff03b51bd92')
    reach_for_agent = QNNAgent("home.reach_for", opportunity_id)
    #profile_id = ObjectId('63c68bc972c279cc10ff1e54')
    profile_id = ObjectId('63c68bc972c279cc10ff1e54')
    be_reached_agent = QNNAgent('home.be_reached', profile_id)

    assert reach_for_agent.init_message.startswith('Loading pre-trained weights')  # Test if pretrained weights found
    stamp = os.stat(reach_for_agent.PATH).st_mtime

    try:
        reach_for_agent.update_agent(1, profile_id)  # test if update_agent runs without error
    except Exception as e:
        pytest.fail(f"Function raised an exception: {e}")

    assert stamp != os.stat(reach_for_agent.PATH).st_mtime  # test if saved model is updated
    assert isinstance(reach_for_agent.get_score(profile_id), float)  # test if get_score works

    assert be_reached_agent.init_message.startswith('Loading pre-trained weights')  # Test if pretrained weights found
    stamp = os.stat(reach_for_agent.PATH).st_mtime

    try:
        be_reached_agent.update_agent(1, opportunity_id)  # test if update_agent runs without error
    except Exception as e:
        pytest.fail(f"Function raised an exception: {e}")

    assert stamp != os.stat(be_reached_agent.PATH).st_mtime  # test if saved model is updated
    assert isinstance(be_reached_agent.get_score(opportunity_id), float)  # test if get_score works


@pytest.mark.test_MABAgent
def test_mab_agent():
    #opportunity_id = ObjectId('6332fc9ffff689cabc0de425')
    opportunity_id = ObjectId('66164f13264c5ff03b51bd92')
    profile_id = ObjectId('63c68bc972c279cc10ff1e54')
    agents = [MABAgent("home.reach_for", opportunity_id), MABAgent('home.be_reached', profile_id)]
    for agent in agents:
        assert agent.__incremental_update__(1, 0, 1) == 1.
        assert agent.__incremental_update__(1, 0, 2) == 2.
        assert agent.__incremental_update__(2, 0, 1) == 1.
        assert agent.__incremental_update__(2, 1, 1) == 1.
        assert agent.__incremental_update__(2, 2, 1) == 1.5
