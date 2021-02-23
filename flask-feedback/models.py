from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy

bcrypt = Bcrypt()
db = SQLAlchemy()

def connect_db(app):
    db.app = app
    db.init_app(app)

class User(db.Model):
    __tablename__ = "users"
    username = db.Column(db.String(20), primary_key=True)
    password = db.Column(db.String(60), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)
        self.password = bcrypt.generate_password_hash(self.password, rounds=14).decode("utf8")

    @classmethod
    def authenticate(cls, username, password):
        user = User.query.get(username)
        return user if user and bcrypt.check_password_hash(user.password, password) else None

class Feedback(db.Model):
    _tablename__ = "feedback"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.String(1000), nullable=False)
    username = db.Column(db.String(20), db.ForeignKey("users.username"), nullable=False)

    user = db.relationship("User", backref="feedback")