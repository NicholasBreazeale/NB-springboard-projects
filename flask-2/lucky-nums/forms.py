from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SelectField
from wtforms.validators import DataRequired, Email, NumberRange

class LuckyForm(FlaskForm):

	name = StringField('Name', validators=[DataRequired()])
	email = StringField('Email', validators=[DataRequired(), Email()])
	year = IntegerField('Year', validators=[DataRequired(), NumberRange(min=1900, max=2000)])
	color = SelectField('Color', choices=[('red', 'Red'), ('green', 'Green'), ('orange', 'Orange'), ('blue', 'Blue')], validators=[DataRequired()])