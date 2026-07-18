from matching_engine.utilities.mongoDB_utility import fetch_suggestion, fetch_cards_of_user, fetch_user_of_card
from bson.objectid import ObjectId
import pandas as pd
from typing import List

'''
API for home page for users that want to be reached
Returns profile cards
'''


def suggest(_id: ObjectId) -> List[ObjectId]:
    """
    :param: ObjectId, _id
    :param: array[float], embedded query
    :param: int, n
    :return: List[ObjectId]
    """

    # fetch the profile and opportunity cards owned by this user
    profileIds, opportunityIds = fetch_cards_of_user(_id)

    # fetch the list of suggested profile/opportunity cards based off of this user's profiles/opportunities
    profile_suggestions = set().union(*[fetch_suggestion(collection='profiles', _id=card_id)
                                        for card_id in profileIds])

    opportunity_suggestions = set().union(*[fetch_suggestion(collection='opportunities', _id=card_id)
                                        for card_id in opportunityIds])

    # fetch the users that own the suggested profiles/opportunity cards
    profile_users = {
        fetch_user_of_card(collection='profiles', _id=profile_suggestion)
        for profile_suggestion in profile_suggestions}

    opportunity_users = {
        fetch_user_of_card(collection='opportunities', _id=opportunity_suggestion)
        for opportunity_suggestion in opportunity_suggestions}

    return list(profile_users.union(opportunity_users))
