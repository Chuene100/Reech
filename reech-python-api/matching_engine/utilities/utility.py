# Python 3 program to calculate Distance Between Two Points on Earth
from math import radians, cos, sin, asin, sqrt, trunc
import json
from bson import ObjectId
from fastapi import Response
from typing import List
import pandas as pd


def distance(coord1: List[float], coord2: List[float]):
    """
    Calculates distance between two coordinates
    :param coord1: (array) [longitude, latitude] coordinates on Earth
    :param coord2: (array) [longitude, latitude] coordinates on Earth
    :return: (float): the distance between the two coordinates over the surface of the earth.

    https://stackoverflow.com/questions/16819231/geonear-returns-incorrect-distance#:~:text=The%20default%20datum%20for%20an%20earth%2Dlike%20sphere%20in%20MongoDB%202.4%20is%20WGS84.%20Coordinate%2Daxis%20order%20is%20longitude%2C%20latitude.
    """
    lat1 = coord1[1]
    lon1 = coord1[0]

    lat2 = coord2[1]
    lon2 = coord2[0]
    # The math module contains a function named
    # radians which converts from degrees to radians.
    lon1 = radians(lon1)
    lon2 = radians(lon2)
    lat1 = radians(lat1)
    lat2 = radians(lat2)

    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2

    c = 2 * asin(sqrt(a))

    # Radius of earth in kilometers. Use 3956 for miles
    r = 6371

    # calculate the result
    return c * r


class JSONEncoder(json.JSONEncoder):
    """
    Custom JSONEncoder for MongoDB ObjectId objects
    """
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


def df_to_json(df: pd.DataFrame):
    """
    Converts pandas.DataFrame to a json response
    :param df: (pandas.DataFrame)
    :return: json Response object
    """
    if df.empty:
        return Response(status_code=204)

    data = df.T.to_dict().values()
    data = list(data)
    return JSONEncoder().encode(data)


def list_to_json(arr: list):
    """
    Converts list to a json response
    :param arr: list
    :return: json Response object
    """
    if len(arr) == 0:
        return Response(status_code=204)

    return JSONEncoder().encode(arr)


def truncate(number: float, digits: int) -> float:
    """
    from https://stackoverflow.com/questions/8595973/truncate-to-three-decimals-in-python
    Improve accuracy with floating point operations, to avoid truncate(16.4, 2) = 16.39 or truncate(-1.13, 2) = -1.12

    :param number: float
    :param digits: int
    :return: float
    """

    nb_decimals = len(str(number).split('.')[1])
    if nb_decimals <= digits:
        return number
    stepper = 10.0 ** digits
    return trunc(stepper * number) / stepper


def radians_calculation(radius: float) -> float:
    """
    Radians calculations
    in:
        - radius: float
    returns:
        - float
    """
    EARTH_RADIUS = 6378.1
    if 0.0 < radius:
        rad_value = radius / EARTH_RADIUS
        # 4 digits after the decimal is usually fine. Keep in mind that I did not round.
        return truncate(rad_value, 4)
    else:
        # The following line is not necessarily the best but we are not at 0. Why 10^-4, rule above.
        return 0.0001
