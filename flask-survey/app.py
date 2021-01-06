from flask import Flask, flash, redirect, render_template, request, session
from surveys import surveys

app = Flask(__name__)
app.config["SECRET_KEY"] = "foobarbaz"

# Mock DB where the survey responses are saved
response_db = {}
for s in surveys:
	response_db[s] = []

@app.route("/")
def root():
	return render_template("survey.html", survs=surveys)

@app.route("/survey/<id>")
def select_survey(id):
	# Setup the necessary values for the survey
	session["survey"] = id
	session["questions"] = []
	return redirect("/questions/0")

@app.route("/questions/<int:qid>")
def questions(qid):
	# Must sign up for a survey before answering questions
	if "survey" not in session:
		return redirect("/")

	survey = session["survey"]
	questions = session["questions"]

	# Redirect the user to the correct question if they changed the url
	if qid != len(questions):
		flash("Redirected: tried to access an invalid question")
		return redirect(f"/questions/{len(questions)}")

	return render_template("question.html", survs=surveys, s=survey, q=qid)

@app.route("/answer", methods=["POST"])
def answer():
	survey = session["survey"]
	questions = session["questions"]

	questions.append(request.form["ans"])

	# Check if the user has answered all the questions
	if len(questions) < len(surveys[survey].questions):
		# If they have not, continue to the next question
		session["questions"] = questions
		return redirect(f"/questions/{len(questions)}")
	else:
		# If they have, save responses and thank them
		response_db[session.pop("survey")].append(session.pop("questions"))
		return redirect("/thanks")

@app.route("/thanks")
def thanks():
	return render_template("thanks.html")