# Put your app in here.
from flask import Flask, request
from operations import *

app = Flask(__name__)

@app.route("/math/<op>")
def operate(op):
    if op in ["add", "sub", "mult", "div"]:
        return str(globals()[op](int(request.args.get("a")), int(request.args.get("b"))))
    return "Unknown operation"