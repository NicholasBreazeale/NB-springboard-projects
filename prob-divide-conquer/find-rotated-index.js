function findRotatedIndex(arr, val) {
  // [leftIdx, rightIdx]
  const idx = [0, arr.length - 1];

  while (idx[0] <= idx[1]) {
    const middleIdx = Math.floor((idx[0] + idx[1]) / 2);
    const middleVal = arr[middleIdx];

    // Index of val found
    if (middleVal === val) {
      return middleIdx;
    }

    if (arr[idx[0]] > val || middleVal < val) {
      idx[0] = middleIdx + 1;
    }
    else if (arr[idx[1]] < val || middleVal > val) {
      idx[1] = middleIdx;
    }
  }

  // val not found
  return -1;
}

module.exports = findRotatedIndex