from pydantic import BaseModel


class ModelInput(BaseModel):
    """ Using pydandtic to initial model inputs

    Params: base model 

    """
    id: int
    posted_date: int
    first_name: int
    last_name: int
    company: int
    city: int
    country: int
    skills: int
    industry: int
    experience: int
    application: int
    job_title: int


class Shaply(BaseModel):
    data: list


# dummy "item" for testing
class Item(BaseModel):
    name: str
    description: Union[str, None] = None
    price: float
    tax: Union[float, None] = None
