function findRotationCount(arr) {
  // [leftIdx, rightIdx]
  const idx = [0, arr.length - 1];

  while (true) {
    const middleIdx = Math.floor((idx[0] + idx[1]) / 2);
    const middleVal = arr[middleIdx];

    // If left index is greater than middle, move right index down
    if (arr[idx[0]] > middleVal) {
      idx[1] = middleIdx;
    }
    // If right index is less than middle, move left index up
    else if (arr[idx[1]] < middleVal) {
      idx[0] = middleIdx + 1;
    }
    // Rotation count found
    else {
      return idx[0];
    }
  }
}

module.exports = findRotationCount