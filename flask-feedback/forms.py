from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField
from wtforms.validators import Email, InputRequired, Length

class RegisterForm(FlaskForm):
    username = StringField("Username:", validators=[InputRequired(), Length(min=1, max=20, message="Username must be between %(min)d and %(max)d characters long.")])
    password = PasswordField("Password:", validators=[InputRequired(), Length(min=1, message="Password must be at least 1 character long.")])
    email = StringField("Email:", validators=[Email(), InputRequired(), Length(min=1, max=50, message="Email must be between %(min)d and %(max)d characters long.")])
    first_name = StringField("First name:", validators=[InputRequired(), Length(min=1, max=30, message="First name must be between %(min)d and %(max)d characters long.")])
    last_name = StringField("Last name:", validators=[InputRequired(), Length(min=1, max=30, message="Last name must be between %(min)d and %(max)d characters long.")])

class LoginForm(FlaskForm):
    username = StringField("Username:", validators=[InputRequired(), Length(min=1, max=20, message="Username must be between %(min)d and %(max)d characters long.")])
    password = PasswordField("Password:", validators=[InputRequired(), Length(min=1, message="Password must be at least 1 character long.")])

class FeedbackForm(FlaskForm):
    title = StringField("Title:", validators=[InputRequired(), Length(min=1, max=100, message="Title must be between %(min)d and %(max)d characters long.")])
    content = TextAreaField("Content:", validators=[InputRequired(), Length(min=1, max=1000, message="Content must be between %(min)d and %(max)d characters long.")])