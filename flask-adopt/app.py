from flask import Flask, abort, flash, redirect, render_template
from forms import AddPetForm, EditPetForm
from models import db, connect_db, Pet

app = Flask(__name__)
app.config['SECRET_KEY'] = 'foobarbaz'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres@localhost/adopt'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False

connect_db(app)
db.create_all()

@app.route("/", methods=["GET"])
def homepage():
  return render_template("home.html", pets=Pet.query.all())

@app.route("/add", methods=["GET", "POST"])
def add_form():
  form = AddPetForm()

  if form.validate_on_submit():
    pet = Pet(name=form.name.data, species=form.species.data, photo_url=form.photo_url.data, age=form.age.data, notes=form.notes.data)
    db.session.add(pet)
    db.session.commit()
    return redirect("/")
  return render_template("add.html", form=form)

@app.route("/<int:pet_id>", methods=["GET", "POST"])
def details(pet_id):
  pet = Pet.query.get(pet_id)
  if pet == None:
    abort(404)

  form = EditPetForm(obj=pet)
  if form.validate_on_submit():
    pet.photo_url = form.photo_url.data
    pet.notes = form.notes.data
    pet.available = form.available.data
    db.session.commit()
    flash(f"{pet.name} details have been updated.")

  return render_template("details.html", pet=pet, form=form)