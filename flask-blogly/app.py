"""Blogly application."""

from flask import Flask, redirect, render_template, request
from models import db, connect_db, User

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///blogly'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

connect_db(app)
db.create_all()

@app.route("/", methods=["GET"])
def user_redirect():
  return redirect("/users")

@app.route("/users", methods=["GET"])
def user_list():
  return render_template("users.html", users=User.query.all())

@app.route("/users/new", methods=["GET"])
def user_new_form():
  return render_template("new.html")

@app.route("/users/new", methods=["POST"])
def user_new():
  new_user = User(first_name=request.form["firstName"], last_name=request.form["lastName"], image_url=request.form["imageUrl"])

  db.session.add(new_user)
  db.session.commit()

  return redirect("/users")

@app.route("/users/<int:user_id>", methods=["GET"])
def user_details(user_id):
  return render_template("detail.html", user=User.query.get_or_404(user_id))

@app.route("/users/<int:user_id>/edit", methods=["GET"])
def user_edit_get(user_id):
  return render_template("edit.html", user=User.query.get_or_404(user_id))

@app.route("/users/<int:user_id>/edit", methods=["POST"])
def user_edit_save(user_id):
  user = User.query.get(user_id)
  if user != None:
    user.first_name = request.form["firstName"]
    user.last_name = request.form["lastName"]
    user.image_url = request.form["imageUrl"]
    db.session.commit()

  return redirect(f"/users/{user_id}")

@app.route("/users/<int:user_id>/delete", methods=["POST"])
def user_delete(user_id):
  user = User.query.get(user_id)
  if user != None:
    db.session.remove(user)
    db.session.commit()

  return redirect ("/users")