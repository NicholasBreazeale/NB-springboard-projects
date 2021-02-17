"""Flask app for Cupcakes"""

from flask import Flask, abort, jsonify, render_template, request
from flask_sqlalchemy import inspect
from models import db, connect_db, Cupcake

app = Flask(__name__)

app.config["SECRET_KEY"] = "foobarbaz"
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres@localhost/cupcakes_test"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ECHO"] = False

connect_db(app)
db.create_all()

@app.route("/")
def cupcakes_display():
  return render_template("index.html")

@app.route("/api/cupcakes")
def cupcakes_get():
  cupcakes = Cupcake.query.all()
  serialized = [c.serialize for c in cupcakes]
  return jsonify(cupcakes=serialized)

@app.route("/api/cupcakes", methods=["POST"])
def cupcakes_post():
  columns = inspect(Cupcake).columns.keys()
  for key, val in request.json.items():
    if key not in columns or key == "id":
      abort(400)

  cupcake = Cupcake(flavor=request.json["flavor"], size=request.json["size"], rating=request.json["rating"], image=request.json.get("image", "https://tinyurl.com/demo-cupcake"))
  db.session.add(cupcake)
  try:
    db.session.commit()
  except:
    db.session.rollback()
    abort(400)
  return (jsonify(cupcake=cupcake.serialize), 201)

@app.route("/api/cupcakes/<int:cupcake_id>", methods=["GET", "PATCH", "DELETE"])
def cupcakes_id(cupcake_id):
  cupcake = Cupcake.query.get(cupcake_id)
  if cupcake == None:
    abort(404)

  # DELETE entry
  if request.method == "DELETE":
    db.session.delete(cupcake)
    db.session.commit()
    return jsonify(message="Deleted")

  # PATCH entry
  if request.method == "PATCH":
    columns = inspect(Cupcake).columns.keys()
    for key, val in request.json.items():
      # Unknown key or trying to edit id
      if key not in columns or key == "id":
        db.session.rollback(0)
        abort(400)
      setattr(cupcake, key, val)
    db.session.commit()

  # Return the cupcake on a GET or PATCH request
  return jsonify(cupcake=cupcake.serialize)