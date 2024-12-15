import controller
import json
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

@app.get("/opening")
def hello_world():
    data = controller.get_all_openings()
    return json.dumps(data)