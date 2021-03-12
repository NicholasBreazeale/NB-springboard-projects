"""Message View tests."""

# run these tests like:
#
#    FLASK_ENV=production python -m unittest test_message_views.py


import os
from unittest import TestCase
from sqlalchemy.orm.exc import NoResultFound

from models import db, connect_db, Message, User

# BEFORE we import our app, let's set an environmental variable
# to use a different database for tests (we need to do this
# before we import our app, since that will have already
# connected to the database

os.environ['DATABASE_URL'] = "postgresql:///warbler-test"


# Now we can import app

from app import app, CURR_USER_KEY

# Create our tables (we do this here, so we only create the tables
# once for all tests --- in each test, we'll delete the data
# and create fresh new clean test data

db.drop_all()
db.create_all()

# Don't have WTForms use CSRF at all, since it's a pain to test

app.config['WTF_CSRF_ENABLED'] = False


class MessageViewTestCase(TestCase):
    """Test views for messages."""

    def setUp(self):
        """Create test client, add sample data."""

        User.query.delete()
        Message.query.delete()

        self.client = app.test_client()

        self.testuser = User.signup(username="testuser",
                                    email="test@test.com",
                                    password="testuser",
                                    image_url=None)

        db.session.commit()

    def test_add_delete_message(self):
        """Can you add and delete a message?"""

        # Since we need to change the session to mimic logging in,
        # we need to use the changing-session trick:

        with self.client as c:
            with c.session_transaction() as sess:
                sess[CURR_USER_KEY] = self.testuser.id

            # Now, that session setting is saved, so we can have
            # the rest of ours test

            resp = c.post("/messages/new", data={"text": "Hello"})

            # Make sure it redirects
            self.assertEqual(resp.status_code, 302)

            msg = Message.query.one()
            self.assertEqual(msg.text, "Hello")

            # Delete the message
            resp = c.post(f"/messages/{msg.id}/delete")
            self.assertEqual(resp.status_code, 302)

            # No message should be found
            with self.assertRaises(NoResultFound):
                Message.query.one()

    def test_logout_message(self):
        """Are you prevented from adding or deleteing messages while logged out?"""

        # Fix error caused by lazy loading, https://docs.sqlalchemy.org/en/13/errors.html#error-bhk3
        db.session.refresh(self.testuser)

        # When logged out, trying to create a new message should redirect to the home page with an error
        resp = self.client.post("/messages/new", data={"text": "World"})
        self.assertEqual(resp.status_code, 302)
        self.assertEqual(resp.location, "http://localhost/")
        with self.assertRaises(NoResultFound):
            Message.query.one()
        resp = self.client.post("/messages/new", data={"text": "World"}, follow_redirects=True)
        self.assertEqual(resp.status_code, 200)
        self.assertIn('<div class="alert alert-danger">Access unauthorized.</div>', resp.get_data(as_text=True))

        # Add sample message
        msg = Message(text="World", user_id=self.testuser.id)
        db.session.add(msg)
        db.session.commit()

        # When logged out, trying to delete a new should redirect to the home page with an error
        resp = self.client.post(f"/messages/{msg.id}/delete")
        self.assertEqual(resp.status_code, 302)
        self.assertEqual(resp.location, "http://localhost/")
        self.assertEqual(Message.query.one().text, "World")
        resp = self.client.post(f"/messages/{msg.id}/delete", follow_redirects=True)
        self.assertEqual(resp.status_code, 200)
        self.assertIn('<div class="alert alert-danger">Access unauthorized.</div>', resp.get_data(as_text=True))

    def test_delete_other_message(self):
        """Users should not be able to delete messages that they didn't create."""

        dummyuser = User.signup(username="dummyuser",
                                email="dummy@user.com",
                                password="password",
                                image_url=None)

        msg = Message(text="Hello World")
        dummyuser.messages.append(msg)

        db.session.commit()

        # Fix error caused by lazy loading, https://docs.sqlalchemy.org/en/13/errors.html#error-bhk3
        db.session.refresh(msg)

        with self.client.session_transaction() as sess:
            sess[CURR_USER_KEY] = self.testuser.id

        resp = self.client.post(f"/messages/{msg.id}/delete")
        self.assertEqual(resp.status_code, 302)
        self.assertEqual(Message.query.one().text, "Hello World")
        resp = self.client.post(f"/messages/{msg.id}/delete", follow_redirects=True)
        self.assertIn('<div class="alert alert-danger">Access unauthorized.</div>', resp.get_data(as_text=True))