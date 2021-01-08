from flask import Flask, jsonify, redirect, render_template, request, session
from boggle import Boggle

app = Flask(__name__)
app.config["SECRET_KEY"] = "foobarbaz"
boggle_game = Boggle()

@app.route("/")
def root():
	board = boggle_game.make_board()
	session["board"] = board
	return render_template("boggle.html", board=board)

@app.route("/search")
def search_word():
	result = boggle_game.check_valid_word(session["board"], request.args.get("w"))
	# Fix not-word result format
	if result == "not-word":
		result = "not-a-word"
	return jsonify(request=result)

@app.route("/score", methods=["GET", "POST"])
def scores():
	if request.method == "POST":
		score = request.json.get("s", 0)
		# If high score does not exist or the current high score is lower than the new, set the high score to the new score
		if "score" not in session or session["score"] < score:
			session["score"] = score

	# Return the high score
	return jsonify(high=session.get("score", 0))