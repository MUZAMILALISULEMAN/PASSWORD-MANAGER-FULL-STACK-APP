from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def func():
    print("HELLO WORLD")
    return {"res":"HELLO WORLD"}
