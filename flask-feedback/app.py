from flask import Flask, abort, flash, redirect, render_template, session
from forms import RegisterForm, LoginForm, FeedbackForm
from models import db, connect_db, User, Feedback

app = Flask(__name__)
app.config["SECRET_KEY"] = "foobarbaz"
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres@localhost/feedback"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ECHO"] = False

connect_db(app)
db.create_all()

@app.route("/", methods=["GET"])
def home():
    return redirect("/register")

@app.route("/register", methods=["GET", "POST"])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        # If username does not exist, make a new user that does
        if not User.query.get(form.username.data):
            user = User(username=form.username.data, password=form.password.data, email=form.email.data, first_name=form.first_name.data, last_name = form.last_name.data)
            db.session.add(user)
            db.session.commit()
            session["user_id"] = user.username
            return redirect(f"/users/{user.username}")
        # Otherwise, show an error
        form.username.errors.append("Username already taken.")
    return render_template("register.html", form=form)

@app.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.authenticate(form.username.data, form.password.data)
        if not user:
            flash("Invalid username or password.")
            return redirect("")
        session["user_id"] = user.username
        return redirect(f"/users/{user.username}")
    return render_template("login.html", form=form)

@app.route("/logout", methods=["POST"])
def logout():
    for key in list(session.keys()):
        session.pop(key)
    return redirect("/")

@app.route("/users/<username>", methods=["GET"])
def user_details(username):
    if "user_id" not in session or session["user_id"] != username:
        abort(404)
    return render_template("details.html", user=User.query.get_or_404(username))

@app.route("/users/<username>/delete", methods=["POST"])
def user_delete(username):
    if "user_id" in session and session["user_id"] == username:
        user = User.query.get(username)
        if user:
            # Delete user feedback
            for feedback in user.feedback:
                db.session.delete(feedback)
            # Delete user
            db.session.delete(user)
            db.session.commit()
            # Clear session
            for key in list(session.keys()):
                session.pop(key)
    return redirect("/")

@app.route("/users/<username>/feedback/add", methods=["GET", "POST"])
def user_feedback(username):
    # Validate user
    if "user_id" not in session or session["user_id"] != username:
        abort(404)
    user = User.query.get_or_404(username)

    # Handle form
    form = FeedbackForm()
    if form.validate_on_submit():
        feedback = Feedback(title=form.title.data, content=form.content.data, username=username)
        db.session.add(feedback)
        db.session.commit()
        return redirect(f"/users/{username}")
    return render_template("feedback_add.html", form=form)

@app.route("/feedback/<int:feedback_id>/update", methods=["GET", "POST"])
def feedback_update(feedback_id):
    # Validate user and feedback data
    if "user_id" not in session:
        abort(404)
    user = User.query.get_or_404(session["user_id"])
    feedback = Feedback.query.get_or_404(feedback_id)
    if feedback.username != user.username:
        abort(404)

    # Handle form
    form = FeedbackForm()
    if form.validate_on_submit():
        feedback.title = form.title.data
        feedback.content = form.content.data
        db.session.commit()
        return redirect(f"/users/{user.username}")
    else:
        form.title.data = feedback.title
        form.content.data = feedback.content
    return render_template("feedback_update.html", form=form)

@app.route("/feedback/<int:feedback_id>/delete", methods=["POST"])
def feedback_delete(feedback_id):
    # Validate the current user
    if "user_id" in session:
        user = User.query.get(session["user_id"])
        if user:
            # Get and delete feedback if it exists
            feedback = Feedback.query.get(feedback_id)
            if feedback and feedback.username == user.username:
                db.session.delete(feedback)
                db.session.commit()
            return redirect("")
    # Return to home if user could not be validated
    return redirect("/")