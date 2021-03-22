from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy

bcrypt = Bcrypt()
db = SQLAlchemy()

def connect_db(app):
    db.app = app
    db.init_app(app)

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, nullable=False, unique=True)
    password = db.Column(db.Text, nullable=False)

    def set_password(self, pwd):
        self.password = bcrypt.generate_password_hash(pwd, rounds=14).decode("utf-8")

    @classmethod
    def authenticate(cls, username, password):
        user = User.query.filter_by(username=username).first()
        return user if user and bcrypt.check_password_hash(user.password, password) else None