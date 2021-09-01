function findFloor(arr, val) {
  // [leftIdx, rightIdx]
  const idx = [0, arr.length]

  while (idx[0] <= idx[1]) {
    const middleIdx = Math.floor((idx[0] + idx[1]) / 2);

    if (arr[middleIdx] < val) {
      idx[0] = middleIdx + 1;
    } else {
      idx[1] = middleIdx - 1;
    }
  }

  // If floor was not found, return -1
  return idx[1] === -1 ? -1 : arr[idx[1]];
}

module.exports = findFloor