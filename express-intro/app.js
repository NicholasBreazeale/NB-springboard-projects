const express = require("express");
const ExpressError = require("./expressError");

const app = express();

/**************************************************************
 * Data set operations
 */

function mean(nums) {
  return nums.reduce((total, val) => total + val, 0) / nums.length;
}

function median(nums) {
  nums.sort((a, b) => a - b);
  return nums.length % 2 ? nums[Math.floor(nums.length/2)] : (nums[nums.length/2-1]+nums[nums.length/2])/2;
}

function mode(nums) {
  nums.sort((a, b) => a -b);
  const modes = nums.reduce((total, val) => {
    // When the tracked value changes, reset the counter
    if (total.oldVal != val) {
      total.oldVal = val;
      total.counter = 0;
    }
    // Increment counter for the current value
    total.counter++;
    // If the max counter is exceeded, increase the max counter and delete the lesser modes
    if (total.maxCount < total.counter) {
      total.maxCount = total.counter;
      if (total.modes[0] != val) total.modes.splice(0, total.modes.length-1);
    }
    // If the max counter is matched, add the current value to the save array
    else if (total.maxCount === total.counter) {
      total.modes.push(total.oldVal);
    }
    return total;
  }, {oldVal:0,counter:0,maxCount:0,modes:[nums[0]]}).modes;
  return modes.length === 1 ? modes[0] : modes;
}

/**************************************************************
 * Web request preprocessing
 */

// Parse and validate argument
app.use((req, res, next) => {
  if (req.query.nums === undefined) throw new ExpressError("nums are required.", 400);
  const nums = req.query.nums.trim();
  if (nums.length === 0) throw new ExpressError("nums is empty.", 400);
  res.locals.nums = nums.split(",").map(val => {
    const num = Number(val);
    if (isNaN(num)) throw new ExpressError(`${val} is not a number.`, 400);
    return num;
  });
  next();
});

/**************************************************************
 * Web request routing
 */

// Calculate the mean
app.get("/mean", (req, res) => res.send({
  operation: "mean",
  value: mean(res.locals.nums)
}));

// Calculate the median
app.get("/median", (req, res) => res.send({
  operation: "median",
  value: median(res.locals.nums)
}));

// Calculate the mode
app.get("/mode", (req, res) => res.send({
  operation: "mode",
  value: mode(res.locals.nums)
}));

// Calculate all operations
app.get("/all", (req, res) => res.send({
  operation: "all",
  mean: mean(res.locals.nums),
  median: median(res.locals.nums),
  mode: mode(res.locals.nums)
}));

/**************************************************************
 * Misc functions
 */

// Error handling
app.use((err, req, res, next) => {
  console.log(err);
  return res.status(err.status).json(err.message);
});

// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});