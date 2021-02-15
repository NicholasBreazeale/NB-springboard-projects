from flask_wtf import FlaskForm
from wtforms import StringField, SelectField, IntegerField, TextAreaField, BooleanField
from wtforms.validators import InputRequired, Optional, URL

class AddPetForm(FlaskForm):
  name = StringField("Pet name", validators=[InputRequired()])
  species = SelectField("Species", choices=[("cat", "Cat"), ("dog", "Dog"), ("porcupine", "Porcupine")])
  photo_url = StringField("Photo URL", validators=[Optional(), URL()])
  age = IntegerField("Age", validators=[Optional()])
  notes = TextAreaField("Notes", validators=[Optional()])

class EditPetForm(FlaskForm):
  photo_url = StringField("Photo URL", validators=[Optional()])
  notes = TextAreaField("Notes", validators=[Optional()])
  available = BooleanField("Available")