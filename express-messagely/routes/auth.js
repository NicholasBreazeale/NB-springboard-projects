const jwt = require("jsonwebtoken");
const express = require("express");
const router = new express.Router();

const ExpressError = require("../expressError");
const { SECRET_KEY } = require("../config");
const User = require("../models/user");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post("/login", async (req, res, next) => {
  try {
    const {username, password} = req.body;

    if (await User.authenticate(username, password)) {
      const token = jwt.sign({username}, SECRET_KEY);
      User.updateLoginTimestamp(username);
      return res.json({token});
    }
    else {
      throw new ExpressError("Invalid username/password", 400);
    }
  }
  catch (err) {
    return next (err);
  }
});

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post("/register", async (req, res, next) => {
  try {
    const {username} = await User.register(req.body);
    const token = jwt.sign({username}, SECRET_KEY);
    User.updateLoginTimestamp(username);
    return res.json({token});
  }
  catch (err) {
    return next(err);
  }
});

module.exports = router;