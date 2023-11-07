from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Text(BaseModel):
    text: str

@app.get("/text")
async def classify_text(text: Text):

    return {"message": text}