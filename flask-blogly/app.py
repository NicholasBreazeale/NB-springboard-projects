"""Blogly application."""

from flask import Flask, flash, redirect, render_template, request
from models import db, connect_db, User, Post, Tag, PostTag

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

tag_mapper = {
  "name": "name"
}

##################
# Root directory #
##################

@app.route("/", methods=["GET"])
def user_redirect():
  return render_template("root.html")

##################
# Table Listings #
##################

@app.route("/users", methods=["GET"])
def user_listing():
  return render_template("listing.html", type_singular="user", type_plural="users", entries=User.query.order_by(User.last_name, User.first_name).all(), add_btn=True)

@app.route("/posts", methods=["GET"])
def post_listing():
  return render_template("listing.html", type_singular="post", type_plural="posts", entries=Post.query.all())

@app.route("/tags", methods=["GET"])
def tag_listing():
  return render_template("listing.html", type_singular="tag", type_plural="tags", entries=Tag.query.all(), add_btn=True)

#################
# Entry Details #
#################

@app.route("/users/<int:user_id>", methods=["GET"])
def user_details(user_id):
  return render_template("user.html", user=User.query.get_or_404(user_id))

@app.route("/posts/<int:post_id>", methods=["GET"])
def post_details(post_id):
  return render_template("post.html", post=Post.query.get_or_404(post_id))

@app.route("/tags/<int:tag_id>", methods=["GET"])
def tag_details(tag_id):
  return render_template("tag.html", tag=Tag.query.get_or_404(tag_id))

######################
# GET Add/Edit Forms #
######################

@app.route("/users/new", methods=["GET"])
@app.route("/users/<int:user_id>/edit", methods=["GET"])
def user_form(user_id=None):
  return render_template("user_form.html", user=None if user_id==None else User.query.get_or_404(user_id))

@app.route("/users/<int:user_id>/posts/new", methods=["GET"])
def post_new_get(user_id):
  return render_template("post_new.html", user=User.query.get_or_404(user_id), tags=Tag.query.all(0))

@app.route("/posts/<int:post_id>/edit", methods=["GET"])
def post_edit_get(post_id):
  return render_template("post_edit.html", post=Post.query.get_or_404(post_id), tags=Tag.query.all())

@app.route("/tags/new", methods=["GET"])
@app.route("/tags/<int:tag_id>/edit", methods=["GET"])
def tag_form(tag_id=None):
  return render_template("tag_form.html", tag=None if tag_id==None else Tag.query.get_or_404(tag_id))

#######################
# POST Add/Edit Forms #
#######################

@app.route("/users/new", methods=["POST"])
@app.route("/users/<int:user_id>/edit", methods=["POST"])
def user_new_edit(user_id=None):
  user = None
  if user_id != None:
    user = User.query.get(user_id)
    if user == None:
      return redirect("/users")

  args = {}
  for key, val in request.form.to_dict().items():
    if key not in user_mapper:
      flash(f"Unknown argument: \"{key}\"")
      return redirect(request.url)
    val = val.strip()
    args[key] = None if not val else val

  if user_id == None:
    user = User()
  for key, val in args.items():
    setattr(user, key, val)
  if user_id == None:
    db.session.add(user)

  try:
    db.session.commit()
  except Exception:
    flash("Error: first and last names are required")
    return redirect(request.url)

  return redirect(f"/users/{user.id}")

@app.route("/users/<int:user_id>/posts/new", methods=["POST"])
@app.route("/posts/<int:post_id>/edit", methods=["POST"])
def post_new_post(user_id=None, post_id=None):
  entry = User.query.get(user_id) if user_id else Post.query.get(post_id)
  if entry == None:
    return redirect("/users")

  # Validate arguments
  args = {}
  tags = []
  for key, val in request.form.to_dict().items():
    # Tag argument
    if key[0:4] == "tag-":
      tag = Tag.query.filter(Tag.name == key[4:]).first()
      if tag == None or val != "1":
        flash(f"Unknown argument: \"{key}\"")
        return redirect(request.url)
      else:
        tags.append(tag)
    # Normal argument
    else:
      if key not in post_mapper:
        flash(f"Unknown argument: \"{key}\"")
        return redirect(request.url)
      val = val.strip()
      args[key] = None if not val else val

  # Create/edit post
  post = Post(created_at=db.func.now(), user_id=user_id) if post_id == None else entry
  for key, val in args.items():
    setattr(post, key, val)
  if user_id != None:
    db.session.add(post)

  # Delete tags
  for tag in post.tags:
    if tag not in tags:
      db.session.delete(PostTag.query.filter(PostTag.post_id==post_id, PostTag.tag_id==tag.id).first())
  # Add tags
  for tag in tags:
    db.session.add(PostTag(post_id=post.id, tag_id=tag.id))

  # Commit changes to DB
  try:
    db.session.commit()
  except:
    flash("Error: a title is required")
    return redirect(request.url)

  return redirect(f"/users/{user_id}" if user_id != None else f"/posts/{post_id}")

@app.route("/tags/new", methods=["POST"])
@app.route("/tags/<int:tag_id>/edit", methods=["POST"])
def tags_form_post(tag_id=None):
  # Verify tag exists if ID is provided
  tag = None
  if tag_id != None:
    tag = Tag.query.get(tag_id)
    if tag == None:
      return redirect("/tags")

  # Validate request arguments
  args = {}
  for key, val in request.form.to_dict().items():
    if key not in tag_mapper:
      flash(f"Unknown argument: \"{key}\"")
      return redirect(request.url)
    val = val.strip()
    args[key] = None if not val else val

  # Create a new tag if needed
  if tag_id == None:
    tag = Tag()
  # Set tag attributes
  for key, val in args.items():
    setattr(tag, key, val)
  # Add new tag to DB if needed
  if tag_id == None:
    db.session.add(tag)

  # Catch any errors that might arise
  try:
    db.session.commit()
  except:
    flash("Error: name is required and must be unique")
    return redirect(request.url)

  return redirect(f"/tags/{tag.id}")

################
# Delete Entry #
################

@app.route("/users/<int:user_id>/delete", methods=["POST"])
def user_delete(user_id):
  user = User.query.get(user_id)
  if user != None:
    db.session.delete(user)
    db.session.commit()

  return redirect("/users")

@app.route("/posts/<int:post_id>/delete", methods=["POST"])
def post_delete(post_id):
  post = Post.query.get(post_id)
  if post != None:
    user_id = post.user_id
    db.session.delete(post)
    db.session.commit()
    return redirect(f"/users/{user_id}")

  return redirect("/users")

@app.route("/tags/<int:tag_id>/delete", methods=["POST"])
def tags_delete(tag_id):
  tag = Tag.query.get(tag_id)
  if tag != None:
    db.session.delete(PostTag.query.filter(PostTag.tag_id == tag_id).all())
    db.session.delete(tag)
    db.session.commit()

  return redirect("/tags")