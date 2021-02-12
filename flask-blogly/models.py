"""Models for Blogly."""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def connect_db(app):
  db.app = app
  db.init_app(app)

class User(db.Model):
  __tablename__ = "users"
  id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  first_name = db.Column(db.String(50), nullable=False)
  last_name = db.Column(db.String(50), nullable=False)
  image_url = db.Column(db.String(100))

  @property
  def full_name(self):
    return f"{self.first_name} {self.last_name}"

  @property
  def link_display(self):
    return self.full_name

class Post(db.Model):
  __tablename__ = "posts"
  id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  title = db.Column(db.String(100), nullable=False)
  content = db.Column(db.String(1000))
  created_at = db.Column(db.DateTime, nullable=False)
  user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

  user = db.relationship("User", backref="posts")

  @property
  def link_display(self):
    return self.title

class Tag(db.Model):
  __tablename__ = "tags"
  id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  name = db.Column(db.String(100), nullable=False, unique=True)

  posts = db.relationship("Post", secondary="post_tags", backref="tags")

  @property
  def link_display(self):
    return self.name

class PostTag(db.Model):
  __tablename__ = "post_tags"
  post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), primary_key=True)
  tag_id = db.Column(db.Integer, db.ForeignKey("tags.id"), primary_key=True)