import os
import sys
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from code.routes import router

# Add the root directory to the Python path
sys.path.insert(0, os.path.abspath(
    os.path.join(os.path.dirname(__file__), ".")))


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(router)

if __name__ == "__main__":
    db_link = os.environ.get('mongodb+srv://Reech:amazingDev!1@reechdb.ojmoq.mongodb.net/?retryWrites=true&w=majority')
    if not db_link:
        raise ValueError("Missing environment variable: DATABASE_LINK")
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
