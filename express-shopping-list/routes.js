const express = require("express");
const ExpressError = require("./expressError");
const items = require("./fakeDb");

const router = new express.Router();

function validateItemProps(item) {
  const targetProps = {
    "name": "string",
    "price": "number"
  };

  // Check for unknown properties and validate types
  for (const prop in item) {
    if (!(prop in targetProps)) throw new ExpressError(`Unknown property "${prop}".`, 400);
    if (typeof item[prop] !== targetProps[prop]) throw new ExpressError(`"${prop}" is of type ${typeof item[prop]}, expecting ${targetProps[prop]}.`, 400);
  }
  // Check for any missing properties
  for (const prop in targetProps) {
    if (!(prop in item)) throw new ExpressError(`Missing required property "${prop}".`, 400);
  }
}

// Return a list of all items
router.get("", (req, res) => {
  return res.json(items);
});

// Add a new item to the DB
router.post("", (req, res) => {
  validateItemProps(req.body);
  if (items.find(elem => elem.name === req.body.name) !== undefined) throw new ExpressError(`An item with the name "${req.body.name}" already exists.`, 409)

  items.push(req.body);
  return res.status(201).json({added:req.body});
});

// Return a single item
router.get("/:name", (req, res) => {
  const item = items.find(elem => elem.name === req.params.name);
  if (item === undefined) throw new ExpressError(`Could not find item with the name "${req.params.name}".`, 404);

  return res.json(item);
});

// Update an item's info
router.patch("/:name", (req, res) => {
  const itemIdx = items.findIndex(elem => elem.name === req.params.name);
  if (itemIdx === -1) throw new ExpressError(`Could not find item with the name "${req.params.name}".`, 404);

  validateItemProps(req.body);

  items[itemIdx] = req.body;
  return res.send({updated:req.body});
});

// Remove item from the DB
router.delete("/:name", (req, res) => {
  const itemIdx = items.findIndex(elem => elem.name === req.params.name);
  if (itemIdx === -1) throw new ExpressError(`Could not find item with the name "${req.params.name}".`, 404);

  items.splice(itemIdx, 1);
  return res.send({message:"Deleted"});
});

module.exports = router;