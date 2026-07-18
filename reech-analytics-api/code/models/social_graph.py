from pydantic import BaseModel, Field
from typing import List, Tuple

class Node(BaseModel):
    id: str
    label: str
    shape: str = "dot"
    size: int = 7

class Edge(BaseModel):
    id: str
    from_: str = "source"
    to: str = "target"
    width: int = 2

class EdgePath(BaseModel):
    #id: str
    source_names: str = "source"
    target_names: str = "target"
    width: int 

class ShortestPathRequest(BaseModel):
    edges: EdgePath

class ShortestPathResponse(BaseModel):
    shortestPath: List[Tuple[str, str]]
