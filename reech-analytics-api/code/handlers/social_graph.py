from fastapi import HTTPException
from typing import Dict, Any, List, Tuple
import networkx as nx
import pandas as pd
from code.models.social_graph import ShortestPathResponse
from code.models.social_graph import ShortestPathRequest
from code.models.social_graph import Node
from code.models.social_graph import Edge
from pymongo import MongoClient

from db import get_db

# Get the users datasets and put them inside a dataframe
# users = database.ReechDatabase
# usrs = users.find()
# usrs_df = pd.DataFrame(list(usrs))

db = get_db()

users = db.users

usrs_list = users.find()

usrs_df = pd.DataFrame(list(usrs_list))
# Partition the dataset into sorce and target names
usrs_df["source_names"] = usrs_df["name"].iloc[:500].dropna()

usrs_df["target_names"] = usrs_df["name"].iloc[500:]

# Clean the dataset by droping nan values
df1 = (
    usrs_df["target_names"]
    .dropna(axis=0, inplace=False, how=None)
    .reset_index(drop=True)
)
df2 = usrs_df["source_names"].dropna(axis=0, inplace=False, how=None)
# Concatenate the data and find the connections between the source and the target datasets
new_df = pd.concat([df1, df2], axis=1).reset_index(drop=True)
data = (
    new_df.groupby(["source_names", "target_names"]
                   ).size().reset_index(name="weight")
)

# Convert the data into a list
node_list = list(
    set(data["source_names"].unique().tolist() + data["target_names"].unique().tolist())
)


#print(data)

"""
# Convert the data into a list
node_list = list(
    set(data["source_names"].unique().tolist() +
        data["target_names"].unique().tolist())
)
nodes = [
    {"id": node_name, "label": node_name, "shape": "dot", "size": 7}
    for i, node_name in enumerate(node_list)
]

# create edges from df
edges = []
for row in data.to_dict(orient="records"):
    source, target = row["source_names"], row["target_names"]
    edges.append(
        {"id": source + "__" + target, "from": source, "to": target, "width": 2, })
"""


def get_network():
    nodes = [
        Node(id=node_name, label=node_name) for i, node_name in enumerate(node_list)
    ]
    edges = []
    for row in data.to_dict(orient="records"):
        source, target = row["source_names"], row["target_names"]
        edges.append(Edge(id=f"{source}__{target}", from_ =source, to=target))
    network_data = {"nodes": nodes, "edges": edges}
    return network_data



def calculate_shortest_path(data, source_node, target_node):
    print(data)
    print(source_node)
    print(target_node)
    G = nx.from_pandas_edgelist(
        data, source="source_names", target="target_names", edge_attr="weight")
    path = nx.shortest_path(G, source=source_node,
                            target=target_node, weight="weight")
    highlighted_edges = [(u, v) for u, v in zip(path[:-1], path[1:])]
    return highlighted_edges



def calculate_shortest_path(data, source_node, target_node):
    G = nx.from_pandas_edgelist(data, source="source_names", target="target_names", edge_attr="weight")
    path = nx.shortest_path(G, source=source_node, target=target_node, weight="weight")
    highlighted_edges = [(u, v) for u, v in zip(path[:-1], path[1:])]
    return highlighted_edges

async def find_shortest_path(request: ShortestPathRequest, source_node: str, target_node: str):
    # data = pd.DataFrame(request.edges)
    data = pd.DataFrame(request.edges).rename(
        columns={0: "source_names", 1: "target_names", 2: "weight"})
    shortest_path = calculate_shortest_path(data, source_node, target_node)
    response = ShortestPathResponse(shortestPath=shortest_path)

    return response
