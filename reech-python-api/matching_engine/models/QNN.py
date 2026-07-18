import torch
import torch.nn as nn
import torch.nn.functional as f
import os
from matching_engine.utilities.constants import embedding_size as n, learning_rate as lr, model_saving_path
from matching_engine.utilities.mongoDB_utility import fetch_embeddings, update_learned_embedding
from matching_engine.models.agent import Agent
from typing import Literal, List
from bson.objectid import ObjectId
import pandas as pd


class QNNAgent(Agent):
    """
    Documentation: https://github.com/Reecheble2022/reech-python-api/blob/development/assets/Federated%20Q-learning.pdf
    """
    def __init__(self, mode: Literal['home.be_reached', 'home.reach_for', 'bubble'], object_id: ObjectId) -> None:
        """
        :param mode: str, must be one of ["be_reached", "reach_for"]
        :param object_id: ObjectId, _id of object for which the QNNAgent is ranking recommendations
        """
        if mode == "home.be_reached":
            self.source_collection = "profiles"
            self.target_collection = "opportunities"
        elif mode == "home.reach_for":
            self.source_collection = "opportunities"
            self.target_collection = "profiles"
        else:
            raise ValueError('Mode must be one of ["home.be_reached", "home.reach_for"]')
        self.mode = mode
        # noinspection PyTypeChecker
        self.source_x = fetch_embeddings(self.source_collection, object_id)
        self.model = self.Net()
        self.PATH = model_saving_path + "/" + mode + "/QNN.pt"
        if os.path.exists(self.PATH):
            self.load_model()
            self.init_message = 'Loading pre-trained weights. Found pre-trained weights at {}'.format(self.PATH)
        else:
            self.init_message = "Loading random weights. No previously saved model found at location: {} - is this " \
                                "the first run?".format(self.PATH)
        print(self.init_message)

    def load_model(self) -> None:
        """
        Loads the saved model, QNN.pt, from saving directory specified by constants.py file
        :return: Net(nn.Module)
        """
        self.model.load_state_dict(torch.load(self.PATH))

    def save_model(self) -> None:
        """
        Saves model, QNN.pt, in saving directory specified by constants.py file
        :return: None
        """
        torch.save(self.model.state_dict(), self.PATH)

    def get_score(self, object_id: ObjectId) -> float:
        """

        :param object_id: Card being evaluated
        :return: float, scalar Q(S,A) for object being evaluated
        """
        # noinspection PyTypeChecker
        target_x = fetch_embeddings(self.target_collection, object_id)
        return self.model(self.source_x, target_x).item()

    def greedy_agent(self, data: pd.DataFrame, num_docs: int) -> pd.DataFrame:
        """
        :param: pandas.DataFrame, data, empty or with keys {_id,score}
        :param: int, num_docs
        :return: pandas.DataFrame, data, empty or with keys {_id,score}, sorted as per agent's discretion

        This agent decides what order to show cards to the user, greedily chooses option with highest score.
        Note that as the scores are optimistically initialised, this is an optimistic greedy agent.
        """

        if data.empty:
            return data
        else:
            data = data[['_id', 'score']]
            data['score'] = data['_id'].apply(lambda x: self.get_score(x))
            top_n = data.sort_values(by="score", ascending=False)[:num_docs]
            return top_n

    def update_agent(self, result: float, object_id: ObjectId) -> None:
        """
        Update's agent's model weights according to learning rule
        :param result: {0,1}, result of user interactions
        :param object_id: _id of object interacted with
        :return: 200 if success
        """

        # noinspection PyTypeChecker
        target_x = fetch_embeddings(self.target_collection, object_id)

        self.load_model()

        self.model.init_learned_embedding_layers(self.source_x, target_x)  # update the learned embedding layers of QNN

        target = torch.Tensor([float(result)])  # R is the reward, element of {0,1}, Tensor

        criterion = nn.MSELoss()  # specify the loss function
        optimizer = torch.optim.SGD(self.model.parameters(), lr=lr)  # specify the optimizer
        optimizer.zero_grad()  # zero the gradient buffers
        output = self.model(self.source_x, target_x)  # get the model output, Q(S,A)
        loss = criterion(output, target)  # R - Q
        loss.backward()  # backprop the error gradients
        optimizer.step()  # perform the update step according to the specified optimizer

        source_learned_embedding = torch.diag(self.model.learned_embedding_layer_source.weight).tolist()
        target_learned_embedding = torch.diag(self.model.learned_embedding_layer_target.weight).tolist()
        # noinspection PyTypeChecker
        update_learned_embedding(self.source_collection, object_id, source_learned_embedding)
        # noinspection PyTypeChecker
        update_learned_embedding(self.target_collection, object_id, target_learned_embedding)

        self.model.reset_learned_embedding_layers()
        self.save_model()

    class Net(nn.Module):
        def __init__(self) -> None:
            super(QNNAgent.Net, self).__init__()
            self.learned_embedding_layer_source = nn.Linear(n, n)
            self.learned_embedding_layer_target = nn.Linear(n, n)
            self.reset_learned_embedding_layers()
            self.fc0 = nn.Linear(2*(n+n), n+n)
            self.fc1 = nn.Linear(n + n, 120)
            self.fc2 = nn.Linear(120, 84)
            self.fc3 = nn.Linear(84, 10)
            self.fc4 = nn.Linear(10, 1)

        def reset_learned_embedding_layers(self) -> None:
            """
            Sets learned embedding layer weights to all zeros
            :return: None
            """
            with torch.no_grad():
                w = torch.zeros(n, n)
                self.learned_embedding_layer_source.weight.copy_(w)
                self.learned_embedding_layer_target.weight.copy_(w)

        def init_learned_embedding_layers(self, source_x: List['float'], target_x: List['float']) -> None:
            """
            Sets learned embedding layer weights to be a diagonal matrix of the learned_embedding values
            :param target_x: (Any, Array: learned_embedding)
            :param source_x: (Any, Array: learned_embedding)
            :return: None
            """
            _, learned_embedding_source = source_x
            _, learned_embedding_target = target_x
            w_source = torch.diag(torch.Tensor(learned_embedding_source))
            w_target = torch.diag(torch.Tensor(learned_embedding_target))
            with torch.no_grad():
                self.learned_embedding_layer_source.weight.copy_(w_source)
                self.learned_embedding_layer_target.weight.copy_(w_target)

        def forward(self, source_x: List['float'], target_x: List['float']) -> torch.Tensor:
            """

            :param source_x: The state (a Card object)
            :param target_x: The available action (a Card object of the opposite sex)
            :return: float, Q(S,A) The value of
            """
            source_embedding, source_learned_embedding = source_x
            source_embedding = torch.Tensor(source_embedding)

            target_embedding, target_learned_embedding = target_x
            target_embedding = torch.Tensor(target_embedding)

            self.init_learned_embedding_layers(source_x, target_x)

            x = torch.concat((source_embedding, self.learned_embedding_layer_source(source_embedding),
                              target_embedding, self.learned_embedding_layer_target(target_embedding)))

            x = f.relu(self.fc0(x))
            x = f.relu(self.fc1(x))
            x = f.relu(self.fc2(x))
            x = f.relu(self.fc3(x))
            x = torch.sigmoid(self.fc4(x))
            return x
