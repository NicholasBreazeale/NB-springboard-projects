"""Forms for playlist app."""

from wtforms import SelectField, StringField, TextAreaField
from wtforms.validators import InputRequired, Length
from flask_wtf import FlaskForm


class PlaylistForm(FlaskForm):
    """Form for adding playlists."""

    name = StringField("Name", validators=[InputRequired(), Length(min=1, max=100, message="Name must be between %(min)d and %(max)d characters long.")])
    description = TextAreaField("Description", validators=[Length(max=500, message="Description cannot be more than %(max)d characters long.")])


class SongForm(FlaskForm):
    """Form for adding songs."""

    title = StringField("Title", validators=[InputRequired(), Length(min=1, max=100, message="Title must be between %(min)d and %(max)d characters long.")])
    artist = StringField("Artist", validators=[Length(max=100, message="Artist cannot be more than %(max)d characters long.")])


# DO NOT MODIFY THIS FORM - EVERYTHING YOU NEED IS HERE
class NewSongForPlaylistForm(FlaskForm):
    """Form for adding a song to playlist."""

    song = SelectField('Song To Add', coerce=int)
