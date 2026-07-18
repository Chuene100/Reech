from fastapi import APIRouter
import pandas as pd
from typing import Dict, List, Tuple
from fastapi import FastAPI, Request, Query
from code.models.social_graph import ShortestPathResponse
from code.models.social_graph import ShortestPathRequest
from code.handlers.social_graph import find_shortest_path
from code.handlers.social_graph import get_network
from code.handlers.social_graph import calculate_shortest_path
from code.handlers.social_graph import data

from . import router


@router.post("/shortest-path", response_model=ShortestPathResponse)
async def shortest_path(request: ShortestPathRequest, source_node: str, target_node: str):
    return find_shortest_path(request, source_node, target_node)


@router.get("/network", response_model=Dict[str, List])
async def network():
    return get_network


@router.get("/shortest-path", response_model=ShortestPathResponse)
#async def shortest_path(source_node: str, target_node: str):
async def shortest_path(source_node: str = Query(...), target_node: str = Query(...)):
    data
    shortest_path = calculate_shortest_path(data, source_node, target_node)
    return ShortestPathResponse(shortestPath=shortest_path)
