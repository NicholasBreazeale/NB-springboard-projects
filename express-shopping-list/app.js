const express = require("express");
const itemRoutes = require("./routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/items", itemRoutes);

// Error handling
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json("Malformed JSON.");
  }
  else return res.status(err.status).json(err.message);
});

module.exports = app;