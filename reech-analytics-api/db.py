import os
import pymongo
from pymongo.errors import ServerSelectionTimeoutError


class Database:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.client = None
        return cls._instance

    def connect(self):
        if self.client is None:
            db_link = os.environ.get('mongodb+srv://Reech:amazingDev!1@reechdb.ojmoq.mongodb.net/?retryWrites=true&w=majority')
            print("db_link = ", db_link)
            if not db_link:
                raise ValueError("Missing environment variable: DATABASE_LINK")

            try:
                self.client = pymongo.MongoClient(
                    db_link, serverSelectionTimeoutMS=5000)
                self.client.server_info()  # test connection
            except ServerSelectionTimeoutError:
                raise ValueError("Failed to connect to database")

        return self.client.get_database()


db = Database()


def get_db():
    return db.connect()
