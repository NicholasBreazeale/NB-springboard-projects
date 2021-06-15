const express = require("express");
const router = new express.Router();

const ExpressError = require("../expressError");
const Message = require("../models/message");
const { ensureLoggedIn } = require("../middleware/auth");

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get("/:id", ensureLoggedIn, async (req, res, next) => {
  try {
    const username = req.user.username;
    const message = await Message.get(req.params.id);

    if (username === message.from_username || username === message.to_username) {
      return res.json({message});
    }
    else {
      throw new ExpressError("Unauthorized", 401);
    }
  }
  catch (err) {
    return next(err);
  }
});

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const from_username = req.user.username;
    const {to_username, body} = req.body;

    const message = await Message.create({from_username, to_username, body});
    return res.json({message});
  }
  catch (err) {
    return next(err);
  }
});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.post("/:id/read", ensureLoggedIn, async (req, res, next) => {
  try {
    const m = await Message.get(req.params.id);
    if (req.user.username === m.to_username) {
      const message = await Message.markRead(req.params.id);
      return res.json({message});
    }
    else {
      throw new ExpressError("Unauthorized", 401);
    }
  }
  catch (err) {
    return next(err);
  }
});


module.exports = router;