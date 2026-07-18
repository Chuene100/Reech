import pymongo 
import json

def main():
    file_name = str(input("JSON file to upload:"))
    collection_name = str(input("Collection name to upload file to:"))
    
    CLIENT_STRING = "mongodb://ml-API:r7ncfi2oLUYaOXHJ@reechdb-shard-00-00.ojmoq.mongodb.net:27017," \
                    "reechdb-shard-00-01.ojmoq.mongodb.net:27017," \
                    "reechdb-shard-00-02.ojmoq.mongodb.net:27017/?ssl=true&replicaSet=atlas-v664uk-shard-0&authSource" \
                    "=admin&retryWrites=true&w=majority"
                    
    client = pymongo.MongoClient(CLIENT_STRING)
    db = client.ReechDatabase
    collection = db[collection_name]

    with open(file_name, encoding='utf-8') as json_file:
        data = json.load(json_file)

    collection.insert_many(data)
    client.close()
    print("Success!")

if __name__ == "__main__":
    main()