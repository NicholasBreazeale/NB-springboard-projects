from flask import Flask, request, render_template
from stories import *

app = Flask(__name__)

@app.route("/")
def form():
    return render_template("form.html", questions=story.prompts)

@app.route("/story")
def finished_story():
    return render_template("story.html", story=story.generate(request.args))