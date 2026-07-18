# Reech Python API


Documentation: https://docs.google.com/document/d/1d75mh_wkSc9SaemS7g4izdzlDLT2KffL8kDE5CDFYYQ/edit?usp=sharing

## Requirements for running project:


#### 1 Navigate to /reech-python-api directory in terminal
#### 2 Set up a Python 3 virtual Env (Skip to 4 if done already)
    python3 -m venv venv
#### 3 Source virtual environment
##### 3.1 For linux
    source venv/bin/activate
##### 3.2 For windows
    .\venv\Scripts\activate
#### 4 Install package requirements by running this line in terminal (skip to 5 if done already):
    python3 -m pip install -r requirements.txt
#### 5 Add env variables 
##### 5.1 Create .env.bat file and define DATABASE_LINK env variable there (see [.env.bat-example](https://github.com/Reecheble2022/reech-python-api/blob/feature/database_link_env_variable/.env.bat-example) for reference):
##### 5.2 run the following line
    call .env.bat
##### 5.3 If using pytest, run the following line running pytest
    call .env.bat py.test
    
#### 6 to test API, run pytest:
    pytest
   
#### 7 to run API locally
    uvicorn main:app --reload

To access the various APIs, enter one of the following urls (potentially in a browser of your choice).

    http://<local socket>/
    http://<local socket>/home/reach_for/fetch/?_id=<_id>&n=<number>
    http://<local socket>/home/reach_for/response/?result=<request>&_id=<_id>
    http://<local socket>/home/be_reached/fetch/?_id=<_id>&n=<number>
    http://<local socket>/home/be_reached/response/?result=<request>&_id=<_id>
    http://<local socket>/bubble/fetch/?_id=<_id>
    
 

Examples:

    http://127.0.0.1:8080/home/reach_for/fetch/?_id=<_id>


# Useful docs:
- https://pymongo.readthedocs.io/en/stable/atlas.html
- https://pymongo.readthedocs.io/en/stable/tutorial.html
- https://realpython.com/python-web-applications/

# Accessing MongoDB Atlas:
    https://cloud.mongodb.com/v2/62ddbe387eedc62af303cb1e#clusters
    
# Federated Q-learning Model:
![Federated Q-learning](https://github.com/Reecheble2022/reech-python-api/blob/development/assets/Federated%20Q-learning.png)


mongodb://ml-API:r7ncfi2oLUYaOXHJ@reechdb-shard-00-00.ojmoq.mongodb.net:27017,reechdb-shard-00-01.ojmoq.mongodb.net:27017,reechdb-shard-00-02.ojmoq.mongodb.net:27017/?ssl=true&replicaSet=atlas-v664uk-shard-0&authSource=admin&retryWrites=true&w=majority


'mongodb+srv://Reech:amazingDev!1@reechdb.ojmoq.mongodb.net/?retryWrites=true&w=majority'
