function sortedFrequency(arr, val) {
  // [leftIdx, rightIdx]
  const idx = [0, arr.length];

  // Find the left limit
  while (idx[0] < idx[1]) {
    const middleIdx = Math.floor((idx[0] + idx[1]) / 2);

    if (arr[middleIdx] < val) {
      idx[0] = middleIdx + 1;
    } else {
      idx[1] = middleIdx;
    }
  }
  const leftLimit = idx[0];

  idx[1] = arr.length;

  // Find the right limit
  while (idx[0] < idx[1]) {
    const middleIdx = Math.floor((idx[0] + idx[1]) / 2);

    if (arr[middleIdx] === val) {
      idx[0] = middleIdx + 1;
    } else {
      idx[1] = middleIdx;
    }
  }

  // If number was not found, return -1
  return (idx[0] - leftLimit) || -1;
}

module.exports = sortedFrequency