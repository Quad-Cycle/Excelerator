from fastapi import FastAPI
from pydantic import BaseModel

import GPT2Model
import Question

app = FastAPI()

@app.get("/api/text")
async def classify_text(text: str):
    label = GPT2Model.find_classification(text)
    question = Question.find_question(label)

    return {"label": label, "question": question}