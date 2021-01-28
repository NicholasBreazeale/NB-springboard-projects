from unittest import TestCase
from app import app, db
from models import User

class FlaskTests(TestCase):
  def test_root_redirect(self):
    with app.test_client() as client:
      resp = client.get("/")
      self.assertEqual(resp.status_code, 302)
      self.assertEqual(resp.location, "http://localhost/users")

  def test_client_ids(self):
    with app.test_client() as client:
      resp = client.get("/users/0")
      self.assertEqual(resp.status_code, 404)
      resp = client.get("/users/-123")
      self.assertEqual(resp.status_code, 404)
      resp = client.get("/users/1")
      self.assertEqual(resp.status_code, 200)

  def test_bad_create(self):
    with app.test_client() as client:
      resp = client.post("/users/new", data={"firstName": "test"})
      self.assertEquals(resp.status_code, 302)
      self.assertEquals(resp.location, "http://localhost/users/new")
      resp = client.post("/users/new", follow_redirects=True, data={"firstName": "test"})
      self.assertIn("Invalid parameters, first and last names are required", resp.get_data(as_text=True))

      resp = client.post("/users/new", data={"lastName": "user"})
      self.assertEquals(resp.status_code, 302)
      self.assertEquals(resp.location, "http://localhost/users/new")
      resp = client.post("/users/new", follow_redirects=True, data={"lastName": "user"})
      self.assertIn("Invalid parameters, first and last names are required", resp.get_data(as_text=True))

  def test_create_delete(self):
    with app.test_client() as client:
      # Create test case
      resp = client.post("/users/new", data={"firstName": "test", "lastName": "user"})
      self.assertEqual(resp.status_code, 302)
      self.assertEqual(resp.location, "http://localhost/users")
      user = User.query.filter(User.first_name == "test", User.last_name == "user").first()
      self.assertNotEqual(user, None)

      # Delete test case
      resp = client.post(f"/users/{user.id}/delete")
      self.assertEqual(resp.status_code, 302)
      self.assertEqual(resp.location, "http://localhost/users")
      user = User.query.filter(User.first_name == "test", User.last_name == "user").first()
      self.assertEqual(user, None)