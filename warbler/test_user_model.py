"""User model tests."""

# run these tests like:
#
#    python -m unittest test_user_model.py


import os
from unittest import TestCase
from sqlalchemy.exc import IntegrityError, InvalidRequestError

from models import db, User

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


class UserModelTestCase(TestCase):
    """Test views for users."""

    def setUp(self):
        """Create test users."""

        self.user1 = UserModelTestCase.user1
        self.user2 = UserModelTestCase.user2

    @classmethod
    def setUpClass(cls):
        """Create consistent test data, and test creating new users"""

        super(UserModelTestCase, cls).setUpClass()

        cls.user1 = User(
            email="test@test.com",
            username="testuser1",
            password="UNHASHED_PASSWORD"
        )
        db.session.add(cls.user1)

        cls.user2 = User.signup(
            email="test@test.net",
            username="testuser2",
            password="HASHED_PASSWORD",
            image_url=None
        )

        db.session.commit()

    def test_repr(self):
        """Is the repr function working?"""

        self.assertEqual(repr(self.user1), "<User #1: testuser1, test@test.com>")

    def test_is_following(self):
        """Is the "is_following" function working?"""

        self.assertEqual(self.user1.is_following(self.user2), False)
        # Follow
        self.user1.following.append(self.user2)
        db.session.commit()
        self.assertEqual(self.user1.is_following(self.user2), True)
        # Unfollow
        self.user1.following.remove(self.user2)
        db.session.commit()
        self.assertEqual(self.user1.is_following(self.user2), False)

    def test_is_followed_by(self):
        """Is the "is_followed_by" function working?"""

        self.assertEqual(self.user1.is_followed_by(self.user2), False)
        # Follow
        self.user2.following.append(self.user1)
        db.session.commit()
        self.assertEqual(self.user1.is_followed_by(self.user2), True)
        # Unfollow
        self.user2.following.remove(self.user1)
        db.session.commit()
        self.assertEqual(self.user1.is_followed_by(self.user2), False)

    def test_bad_create(self):
        """Are errors raised when trying to create a user with invalid credentials?"""

        # Duplicate email
        baduser = User(
            email="test@test.com",
            username="testuser3",
            password="HASHED_PASSWORD"
        )
        with self.assertRaises(IntegrityError):
            db.session.add(baduser)
            db.session.commit()

        # No email
        baduser.email=None
        with self.assertRaises(InvalidRequestError):
            db.session.add(baduser)
            db.session.commit()

        # Duplicate username
        baduser.email="test@test.org"
        baduser.username="testuser1"
        with self.assertRaises(InvalidRequestError):
            db.session.add(baduser)
            db.session.commit()

        # No username
        baduser.username=None
        with self.assertRaises(InvalidRequestError):
            db.session.add(baduser)
            db.session.commit()

        # No password
        baduser.username="testuser3"
        baduser.password=None
        with self.assertRaises(InvalidRequestError):
            db.session.add(baduser)
            db.session.commit()

        db.session.rollback()

    def test_authenticate(self):
        """Is user authentication working?"""

        self.assertIsNotNone(User.authenticate("testuser2", "HASHED_PASSWORD"))
        self.assertFalse(User.authenticate("baduser", "HASHED_PASSWORD"))
        self.assertFalse(User.authenticate("testuser2", "BAD_PASSWORD"))