import os

import pytest
from fastapi.testclient import TestClient
from mongomock import MongoClient

from main import app
from db import get_db


client = TestClient(app)


@pytest.fixture(scope="module")
def mock_db():
    db = MongoClient(
        "mongodb+srv://rodgers_at_reech:reechUnitT3sts_pswd@reechunittestscluster.2tdosjx.mongodb.net?authSource=admin&retryWrites=true&w=majority").get_default_database()
    yield db
    """db.client.drop_database(db)"""


@pytest.fixture(scope="module")
def test_client():
    os.environ["DATABASE_LINK"] = "mongodb+srv://rodgers_at_reech:reechUnitT3sts_pswd@reechunittestscluster.2tdosjx.mongodb.net/?retryWrites=true&w=majority"
    yield client
    del os.environ["DATABASE_LINK"]


@pytest.fixture(scope="function")
async def db(test_client):
    db = get_db()
    await db.items.delete_many({})
    yield db
    await db.items.delete_many({})


async def test_create_item(test_client, db):
    data = {"name": "item1", "price": 100}
    response = await test_client.post("/", json=data)
    assert response.status_code == 200
    result = response.json()
    assert "id" in result
    assert isinstance(result["id"], str)

    item = await db.items.find_one({"_id": result["id"]})
    assert item is not None
    assert item["name"] == data["name"]
    assert item["price"] == data["price"]


async def test_read_item(test_client, db):
    data = {"name": "item1", "price": 100}
    result = await db.items.insert_one(data)
    id_ = str(result.inserted_id)

    response = await test_client.get(f"/{id_}")
    assert response.status_code == 200
    result = response.json()
    assert "id" in result
    assert result["id"] == id_
    assert "name" in result
    assert result["name"] == data["name"]
    assert "price" in result
    assert result["price"] == data["price"]


async def test_update_item(test_client, db):
    data = {"name": "item1", "price": 100}
    result = await db.items.insert_one(data)
    id_ = str(result.inserted_id)

    new_data = {"name": "item2", "price": 200}
    response = await test_client.put(f"/{id_}", json=new_data)
    assert response.status_code == 200
    result = response.json()
    assert "message" in result
    assert result["message"] == f"Item {id_} updated"

    item = await db.items.find_one({"_id": id_})
