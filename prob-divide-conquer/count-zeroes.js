function countZeroes(arr) {
  // [leftIdx, rightIdx]
  const idx = [0, arr.length];

  while (idx[0] < idx[1]) {
    const middleIdx = Math.floor((idx[0] + idx[1]) / 2);

    if (arr[middleIdx]) {
      idx[0] = middleIdx + 1;
    } else {
      idx[1] = middleIdx;
    }
  }

  return arr.length - idx[0];
}

module.exports = countZeroes