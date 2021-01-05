from flask import Flask, flash, redirect, render_template, request
from surveys import *

app = Flask(__name__)
responses = []

app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
flashing = False

@app.route("/")
def root():
	return render_template("survey.html", survs=surveys)

@app.route("/questions")
def questions():
	survey = request.args.get('s')
	question_ID = int(request.args.get('q'))

	global flashing
	print("question routed")
	if flashing:
		print("Flashing message")
		flashing = False

	if question_ID != len(responses):
		flash("Redirected: tried to access an invalid question")
		flashing = True
		return redirect(f"/questions?s={survey}&q={len(responses)}")
	return render_template("question.html", survs=surveys, s=survey, q=question_ID)

@app.route("/answer", methods=["POST"])
def answer():
	s = request.form['s']
	q = int(request.form['q']) + 1
	responses.append(request.form['ans'])
	return redirect(f"/questions?s={s}&q={q}" if q < len(surveys[s].questions) else "/thank")

@app.route("/thank")
def thank():
	return render_template("thank.html")