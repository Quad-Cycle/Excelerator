from fastapi import FastAPI
from pydantic import BaseModel

import GPT2Model
import Question

app = FastAPI()

class Text(BaseModel):
    text: str

@app.get("/text")
async def classify_text(text: Text):
    label = GPT2Model.find_classification(text.text)
    question = Question.find_question(label)

    return {"label": label, "question": question}