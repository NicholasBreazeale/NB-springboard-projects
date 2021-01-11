from unittest import TestCase
from app import app
from flask import session, json
from boggle import Boggle
import re

class FlaskTests(TestCase):

	def test_root(self):
		with app.test_client() as client:
			resp = client.get("/")
			self.assertEqual(resp.status_code, 200)

			# Test session board variable
			self.assertIsInstance(session["board"], list)
			self.assertEqual(len(session["board"]), 5)
			# Test multidimensionality
			for row in session["board"]:
				self.assertIsInstance(row, list)
				self.assertEqual(len(row), 5)
				# Each entry must be a single character string with a value between A and Z
				for entry in row:
					self.assertIsInstance(entry, str)
					self.assertEqual(len(entry), 1)
					self.assertGreaterEqual(entry, "A")
					self.assertLessEqual(entry, "Z")

			html = re.sub("\n|\t", "", resp.get_data(as_text=True))
			# Test board generation
			self.assertNotEqual(re.search("<table><tbody>(<tr>(<td>[A-Z]</td>){5}</tr>){5}</tbody></table>", html), None)

	def test_search(self):
		with app.test_client() as client:
			client.get("/")

			# Positive result
			search_resp = client.get("/search?w=test")
			self.assertEqual(search_resp.status_code, 200)
			search_json = json.loads(search_resp.get_data(as_text=True))
			self.assertNotEqual(search_json["request"], "not-a-word")

			# Negative result
			search_resp = client.get("/search?w=asdf")
			self.assertEqual(search_resp.status_code, 200)
			search_json = json.loads(search_resp.get_data(as_text=True))
			self.assertEqual(search_json["request"], "not-a-word")

	def test_score(self):
		with app.test_client() as client:
			client.get("/")

			# No high score
			score_resp = client.get("/score")
			self.assertEqual(score_resp.status_code, 200)
			score_json = json.loads(score_resp.get_data(as_text=True))
			self.assertEqual(score_json["high"], 0)

			# New high score
			score_resp = client.post("/score", data={"s": 5})
			self.assertEqual(score_resp.status_code, 200)
			score_json = json.loads(score_resp.get_data(as_text=True))
			self.assertEqual(score_json["high"], 5)

			# High score not beat
			score_resp = client.post("/score", data={"s": 3})
			self.assertEqual(score_resp.status_code, 200)
			score_json = json.loads(score_resp.get_data(as_text=True))
			self.assertEqual(score_json["high"], 5)