from abc import ABC, abstractmethod
from bson.objectid import ObjectId
import pandas as pd
from typing import List, Literal


class Agent(ABC):
    @abstractmethod
    def greedy_agent(self, data: pd.DataFrame, n: int) -> pd.DataFrame:
        pass

    @abstractmethod
    def update_agent(self, result: float, object_id: ObjectId) -> None:
        pass
