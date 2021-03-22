from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import InputRequired, Length

class LoginForm(FlaskForm):
	username = StringField("Username", validators=[InputRequired(), Length(min=8, message="Must be at least %(min)d characters.")])
	password = PasswordField("Password", validators=[InputRequired(), Length(min=8, max=64, message="Must be %(min)d-%(max)d characters.")])