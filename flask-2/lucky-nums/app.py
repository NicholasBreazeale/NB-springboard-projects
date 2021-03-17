from random import randint
from flask import Flask, render_template, request, jsonify
import json
import requests

from forms import LuckyForm

app = Flask(__name__)


@app.route("/")
def homepage():
    """Show homepage."""

    return render_template("index.html")

@app.route("/api/get-lucky-num", methods=["POST"])
def lucky_num():
    form = LuckyForm(request.form, meta={'csrf': False})

    if form.validate():
        num = randint(1, 100)
        numFact = requests.get(f"http://numbersapi.com/{num}/trivia").text
        year = form.year.data
        yearFact = requests.get(f"http://numbersapi.com/{year}/year").text
        return jsonify(num={
            "fact": numFact,
            "num": num
        },
        year={
            "fact": yearFact,
            "year": year
        })
    else:
        print(form.errors)
        return jsonify(errors={e: form.errors[e] for e in form.errors})