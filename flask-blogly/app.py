"""Blogly application."""

from flask import Flask, flash, redirect, render_template, request
from models import db, connect_db, User, Post

app = Flask(__name__)
app.config['SECRET_KEY'] = 'foobarbaz'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres@localhost/blogly'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

connect_db(app)
db.create_all()

user_mapper = {
  "firstName": "first_name",
  "lastName": "last_name",
  "imageUrl": "image_url"
}

post_mapper = {
  "title": "title",
  "content": "content"
}

@app.route("/", methods=["GET"])
def user_redirect():
  return redirect("/users")

@app.route("/users", methods=["GET"])
def user_list():
  return render_template("user_list.html", users=User.query.order_by(User.last_name, User.first_name).all())

@app.route("/users/new", methods=["GET"])
def user_new_form():
  return render_template("user_new.html")

@app.route("/users/new", methods=["POST"])
@app.route("/users/<int:user_id>/edit", methods=["POST"])
def user_new_edit(user_id=None):
  user = User()
  # Use a prexisting user if defined
  if user_id != None:
    user = User.query.get(user_id)
    if user == None:
      return redirect("/users")

  for key, val in request.form.to_dict().items():
    # Invalid argument
    if key not in user_mapper:
      flash(f"Error: unknown argument \"{key}\"")
      return redirect(request.url)
    # Remove leading and trailing whitespace and treat an empty string as None
    val = val.strip()
    setattr(user, user_mapper[key], None if not val else val)

  # Add user if does not exist
  if user_id == None:
    db.session.add(user)

  try:
    db.session.commit()
  except Exception:
    flash("Error: first and last names are required")
    return redirect(request.url)

  return redirect(f"/users/{user.id}")

@app.route("/users/<int:user_id>", methods=["GET"])
def user_details(user_id):
  return render_template("user.html", user=User.query.get_or_404(user_id), posts=Post.query.filter_by(user_id=user_id).all())

@app.route("/users/<int:user_id>/edit", methods=["GET"])
def user_edit_get(user_id):
  return render_template("user_edit.html", user=User.query.get_or_404(user_id))

@app.route("/users/<int:user_id>/delete", methods=["POST"])
def user_delete(user_id):
  user = User.query.get(user_id)
  if user != None:
    db.session.delete(user)
    db.session.commit()

  return redirect("/users")

@app.route("/users/<int:user_id>/posts/new", methods=["GET"])
def post_new_get(user_id):
  return render_template("post_new.html", user=User.query.get_or_404(user_id))

@app.route("/users/<int:user_id>/posts/new", methods=["POST"])
def post_new_post(user_id):
  user = User.query.get(user_id)
  # User does not exist, return to the user directory
  if user == None:
    return redirect("/users")

  post = Post()
  for key, val in request.form.to_dict().items():
    # Invalid argument
    if key not in post_mapper:
      flash(f"Unknown argument: \"{key}\"")
      return redirect(request.url)
    # Remove leading and trailing whitespace and treat an empty string as None
    val = val.strip()
    setattr(post, post_mapper[key], None if not val else val)

  post.created_at = db.func.now()
  post.user_id = user_id

  db.session.add(post)
  try:
    db.session.commit()
  except:
    flash("Error: a title is required")
    return redirect(request.url)

  return redirect(f"/users/{user_id}")

@app.route("/posts/<int:post_id>", methods=["GET"])
def post_get(post_id):
  post = Post.query.get_or_404(post_id)
  return render_template("post.html", post=post, user=User.query.get(post.user_id))

@app.route("/posts/<int:post_id>/edit", methods=["GET"])
def post_edit_get(post_id):
  return render_template("post_edit.html", post=Post.query.get_or_404(post_id))

@app.route("/posts/<int:post_id>/edit", methods=["POST"])
def post_edit_post(post_id):
  post = Post.query.get(post_id)
  if post_id == None:
    return redirect("/users")

  for key, val in request.form.to_dict().items():
    # Invalid argument
    if key not in post_mapper:
      flash(f"Unknown argument: \"{key}\"")
      return redirect(request.url)
    # Remove leading and trailing whitespace and treat an empty string as None
    val = val.strip()
    setattr(post, post_mapper[key], None if not val else val)

  try:
    db.session.commit()
  except:
    flash("Error: a title is required")
    return redirect(request.url)

  return redirect(f"/posts/{post_id}")

@app.route("/posts/<int:post_id>/delete", methods=["POST"])
def post_delete(post_id):
  post = Post.query.get(post_id)
  if post != None:
    user_id = post.user_id
    db.session.delete(post)
    db.session.commit()
    return redirect(f"/users/{user_id}")

  return redirect("/users")