import json
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from src.main.stateshaper import RunEngine


app = FastAPI(
    title="Vercel + FastAPI",
    description="Vercel + FastAPI",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    # allow_origins=["https://stateshaper-ml-demo.vercel.app"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Input(BaseModel):
    message: str

run = RunEngine()
run.start_engine()



@app.post("/api/define")
def define(input: Input):
    input = json.loads(input.message)
    print(f"Received 'define' input: {input}")
    run.define_engine(initial_state=input["state"], constants=input["constants"], mod=input["mod"])
    input["index"] = run.engine.iteration - 1
    return {"response": {"data": input}}


@app.post("/api/generate")
def generate(input: Input):
    input = json.loads(input.message)
    print(f"Received 'generate' input: {input}")
    tokens = run.run_engine(token_count=input["token_count"])
    input["index"] = run.engine.iteration - 1
    return {"response": {"tokens": tokens, "data": input}}


@app.post("/api/forward")
def forward(input: Input):
    input = json.loads(input.message)
    print(f"Received 'forward' input: {input}")  
    tokens = run.run_engine(token_count=input["token_count"])
    input["index"] = run.engine.iteration - 1
    return {"response": {"tokens": tokens, "data": input}}


@app.post("/api/reverse")
def reverse(input: Input):
    input = json.loads(input.message)
    print(f"Received 'reverse' input: {input}")
    tokens = run.reverse(token_count=input["token_count"])
    input["index"] = run.engine.iteration - 1
    return {"response": {"tokens": tokens, "data": input}}


@app.post("/api/jump")
def jump(input: Input):
    input = json.loads(input.message)
    print(f"Received 'jump' input: {input}")
    run.define_engine(initial_state=input["state"], constants=input["constants"], mod=input["mod"])  
    tokens = run.jump(index=input["index"]) - 1
    return {"response": {"tokens": tokens, "data": input}}