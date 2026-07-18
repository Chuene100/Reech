from fastapi import HTTPException, Response
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from code.models.shaply import ModelInput, Shaply
from typing import List

import json
from bson import ObjectId
import shap
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import pickle
import random

from db import get_db


async def read_item_handler(id: str):
    db = get_db()
    result = await db.items.find_one({"_id": id})
    if result is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return result


async def create_item_handler(data):
    db = get_db()
    result = await db.items.insert_one(data)
    return {"message": "Item inserted successfully", "id": str(result.inserted_id)}


async def update_item_handler(id: str, data):
    db = get_db()
    result = await db.items.update_one({"_id": id}, {"$set": data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    # set Response(status_code=200)
    return {"message": f"Item {id} updated"}


async def delete_item_handler(id: str):
    db = get_db()
    result = await db.items.delete_one({"_id": id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": f"Item {id} deleted"}


with open('/Users/chuene/Desktop/Reechable/backend/knn_model.pkl', 'rb') as f:
    model = pickle.load(f)

neighbors = np.arange(1, 9)
train_accuracy = np.empty(len(neighbors))
test_accuracy = np.empty(len(neighbors))


# Read the data
data = pd.read_csv('/Users/chuene/Desktop/Reechable/Decoded/MOCK_DATA.csv')

# creating the employment type feature
employment_type = ["full-time", "part-time", "contract"]
random_employment_data = []
for i in range(len(data)):
    employmnet = random.choice(employment_type)
    random_employment_data.append(employmnet)

dataframe_employment = pd.DataFrame(
    {"employment_type": random_employment_data})
data['employment_type'] = dataframe_employment

# convert timestamp to datetime
data["posted_date"] = pd.to_datetime(
    data["posted_date"]).values.astype(np.int64)

# Label Encoder
label_encoder = LabelEncoder()


# transform industry column
data["industry"] = label_encoder.fit_transform(data["industry"].astype(str))

# perform label encoding
columns_to_encode = ['first_name', 'last_name', 'company', 'city',
                     'country', 'skills', 'industry', 'job title', 'employment_type']
for column in columns_to_encode:
    data[column] = label_encoder.fit_transform(data[column])

# Split dataset into training set and test set
X = data.drop("employment_type", axis=1)
y = data["employment_type"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3)  # 70% training and 30% test


def calculate_shap_values(X_test):
    # Sample X_test and calculate SHAP values
    X_test_summary = shap.sample(X_test, 10)
    explainer = shap.KernelExplainer(
        model.predict_proba, X_test_summary, keep_index=True)
    shap_values = explainer.shap_values(X_test_summary)

    for index in shap_values:
        shaply_values = index.tolist()
    return shaply_values


async def model_predictor(input_parameters: ModelInput):
    """ API endpoint that predicts the employment """
    input_dictionary = input_parameters.dict()

    input_list = [input_dictionary['id'], input_dictionary['posted_date'], input_dictionary['first_name'],
                  input_dictionary['last_name'], input_dictionary['company'], input_dictionary['city'],
                  input_dictionary['country'], input_dictionary['skills'], input_dictionary['industry'],
                  input_dictionary['experience'],  input_dictionary['application'], input_dictionary['job_title']]

    prediction = model.predict([input_list])

    if (prediction[0] == 0):
        prediction = "Contract"
    elif prediction[0] == 1:
        prediction = "Part-time"
    else:
        prediction = "Full-time"

    return {
        'prediction': prediction
    }


async def plotting_handler():
    """API endpoint that calculates the shap values and returns them as JSON data"""

    # Calculate SHAP values for two plots
    shaply_first = calculate_shap_values(X_test)
    shaply_second = calculate_shap_values(X_test)

    # Return JSON data
    return {'shaply_first': shaply_first, 'shaply_second': shaply_second}


async def shaply_values_insert(data: List[Shaply]):
    """API endpoint that calculates shap values and connect to mongo database and returns a JSON data"""

    # TODO: read and create X_test variable from the database
    # X_test = ????????????????

    data = calculate_shap_values(X_test)

    # flatten the nested list and remove 0 values
    new_values = [index for shap in data for index in shap if index != 0]

    # connect to MongoDB
    dbclient = get_db()

    info = await dbclient.shaply_values.insert_one(new_values)

    # return details of the inserted document
    details = {'inserted_id': info.inserted_id, 'shap_values': new_values}
    return details
