import controller
import json
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

@app.get("/opening")
def get_all_openings():
    data = controller.get_all_openings()
    return json.dumps(data)

@app.get("/opening/<opening_id>/")
def get_opening_by_id(opening_id):
    data = controller.get_opening(opening_id)
    return json.dumps(data)
    
    
@app.get("/recruitment-round/<recruitment_round_id>/")
def get_recruitment_round(recruitment_round_id):
    data = controller.get_recruitment_round(recruitment_round_id)
    return json.dumps(data)


@app.get("/profile/<profile_id>/student-teams")
def get_student_teams_for_profile(profile_id):
    data = controller.get_student_teams_for_profile(profile_id)
    return json.dumps(data)


@app.get('/student-team/{student_team_id}/recruitment-round')
def get_all_recruitment_rounds_for_student_team(student_team_id):
    data = controller.get_all_recruitment_rounds_for_student_team(student_team_id)
    return json.dumps(data)

