"""User View tests."""

# run these tests like:
#
#    FLASK_ENV=production python -m unittest test_user_views.py


import os
from unittest import TestCase

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

        self.testuser1 = User.signup(username="testuser1",
                                    email="test@test.com",
                                    password="testuser1",
                                    image_url=None)

        self.testuser2 = User.signup(username="testuser2",
                                    email="test@test.net",
                                    password="testuser2",
                                    image_url=None)

        self.testuser1.following.append(self.testuser2)

        db.session.commit()

    def test_login_follow(self):
        """Test followers and following pages when a user is logged in."""

        # Mimic a login using the changing-session trick
        with self.client.session_transaction() as sess:
            sess[CURR_USER_KEY] = self.testuser1.id

        # Fix error due to lazy loading, http://sqlalche.me/e/13/bhk3
        db.session.add(self.testuser2)

        # When logged in, users shold be able to view their own followers page as well as other's
        resp = self.client.get(f"/users/{self.testuser1.id}/followers")
        self.assertEqual(resp.status_code, 200)
        resp = self.client.get(f"/users/{self.testuser2.id}/followers")
        self.assertEqual(resp.status_code, 200)
        self.assertIn('@testuser1', resp.get_data(as_text=True))

        # When logged in, users shold be able to view their own following page as well as other's
        resp = self.client.get(f"/users/{self.testuser1.id}/following")
        self.assertEqual(resp.status_code, 200)
        self.assertIn('@testuser2', resp.get_data(as_text=True))
        resp = self.client.get(f"/users/{self.testuser2.id}/following")
        self.assertEqual(resp.status_code, 200)

    def test_logout_follow(self):
        """Test followers and following pages when a user is not logged in."""

        # When not logged in, visiting a users's followers page should redirect to the home page with an error message
        resp = self.client.get(f"/users/{self.testuser1.id}/followers")
        self.assertEqual(resp.status_code, 302)
        self.assertEqual(resp.location, "http://localhost/")
        resp = self.client.get(f"/users/{self.testuser1.id}/followers", follow_redirects=True)
        self.assertEqual(resp.status_code, 200)
        self.assertIn('<div class="alert alert-danger">Access unauthorized.</div>', resp.get_data(as_text=True))

        # When not logged in, visiting a users's following page should redirect to the home page with an error message
        resp = self.client.get(f"/users/{self.testuser1.id}/following")
        self.assertEqual(resp.status_code, 302)
        self.assertEqual(resp.location, "http://localhost/")
        resp = self.client.get(f"/users/{self.testuser1.id}/following", follow_redirects=True)
        self.assertEqual(resp.status_code, 200)
        self.assertIn('<div class="alert alert-danger">Access unauthorized.</div>', resp.get_data(as_text=True))
