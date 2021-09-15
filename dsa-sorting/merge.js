function merge(arr1, arr2) {
  const sortedArr = [];

  const idx = [0, 0]
  // Merge comparatively
  while (idx[0] < arr1.length && idx[1] < arr2.length) sortedArr.push(arr1[idx[0]] < arr2[idx[1]] ? arr1[idx[0]++] : arr2[idx[1]++]);
  // Merge what remains
  while (idx[0] < arr1.length) sortedArr.push(arr1[idx[0]++]);
  while (idx[1] < arr2.length) sortedArr.push(arr2[idx[1]++]);

  return sortedArr;
}

function mergeSort(arr) {
  // Arrays of size 0 or 1 are already sorted
  if (arr.length <= 1) return arr;

  // Slice array in half and sort those halves recursively
  const halfLength = Math.floor(arr.length / 2);
  return merge(mergeSort(arr.slice(0, halfLength)), mergeSort(arr.slice(halfLength, arr.length)));
}

module.exports = { merge, mergeSort };