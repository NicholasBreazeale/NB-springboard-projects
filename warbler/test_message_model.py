"""Message model tests."""

# run these tests like:
#
#    python -m unittest test_message_model.py


import os
from unittest import TestCase
from sqlalchemy.exc import IntegrityError, InvalidRequestError

from models import db, User, Message

# BEFORE we import our app, let's set an environmental variable
# to use a different database for tests (we need to do this
# before we import our app, since that will have already
# connected to the database

os.environ['DATABASE_URL'] = "postgresql:///warbler-test"


# Now we can import app

from app import app

# Create our tables (we do this here, so we only create the tables
# once for all tests --- in each test, we'll delete the data
# and create fresh new clean test data

db.drop_all()
db.create_all()


class MessageModelTestCase(TestCase):
    """Test views for messages."""

    def setUp(self):
        """Create sample data."""

        self.user = MessageModelTestCase.user

    @classmethod
    def setUpClass(cls):
        """Create consistent test data, and test creating new users"""

        super(MessageModelTestCase, cls).setUpClass()

        cls.user = User.signup(
            email="test@test.net",
            username="testuser2",
            password="HASHED_PASSWORD",
            image_url=None
        )

        db.session.commit()

    def test_relationship(self):
        """Is the relationship between users and messages working?"""

        m = Message(
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            user_id=self.user.id
        )
        db.session.add(m)
        db.session.commit()

        self.assertTrue(m in self.user.messages)
        self.assertEqual(m.user, self.user)
        self.user.messages.remove(m)
        self.assertFalse(m in self.user.messages)

    def test_bad_create(self):
        """Are errors raised when trying to create a message with invalid credentials?"""

        # No text
        badmessage = Message(
            text=None,
            user_id=self.user.id
        )
        with self.assertRaises(IntegrityError):
            db.session.add(badmessage)
            db.session.commit()

        # Too much text
        badmessage.text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        with self.assertRaises(InvalidRequestError):
            db.session.add(badmessage)
            db.session.commit()

        # No user_id
        badmessage.text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        badmessage.user_id=None
        with self.assertRaises(InvalidRequestError):
            db.session.add(badmessage)
            db.session.commit()

        # Invalid user_id
        badmessage.user_id=42
        with self.assertRaises(InvalidRequestError):
            db.session.add(badmessage)
            db.session.commit()

        db.session.rollback()