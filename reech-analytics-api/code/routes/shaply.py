from . import router
from typing import List
from code.models.shaply import ModelInput
from code.models.shaply import Shaply
from fastapi import Response, status
from code.models.shaply import Item
from handlers.shaply import read_item_hander, create_item_handler
from handlers.shaply import update_item_handler, delete_item_handler
from handlers.shaply import model_predictor, plotting_handler, shaply_values_insert

# router = APIRouter()
from . import router


@router.get("/")
async def read_root():
    return {"message": "Reech Analytics API - Running."}


@router.get("/{id}")
async def read_item(id: str):
    return read_item_hander(id)


@router.post("/", status_code=201)
async def create_item(data: Item, response: Response):
    response.status_code = status.HTTP_201_CREATED
    return create_item_handler(data)


@router.put("/{id}")
async def update_item(id: str, data: Item):
    return update_item_handler(id, data)


@router.delete("/{id}")
async def delete_item(id: str):
    return delete_item_handler(id)


@router.post('/model_prediction')
def model_prediction(input_parameters: ModelInput):
    return model_predictor(input_parameters)


@router.get('/shaply_plots', status_code=200)
async def display_shap():
    return plotting_handler()


@router.post('/shaply_to_mongo', status_code=200)
async def save_shaply_values_to_db(data: List[Shaply]):
    return shaply_values_insert(data)
