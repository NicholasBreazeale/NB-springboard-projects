/*
pivot accepts an array, starting index, and ending index
You can assume the pivot is always the first element
*/

function pivot(arr, idxL = 0, idxR = arr.length - 1) {
  let idx = idxR + 1;

  for (let i = idxR, pvt = arr[idxL]; i >= idxL; i--) if (arr[i] >= pvt) [arr[idx], arr[i]] = [arr[i], arr[--idx]];

  return idx;
}

/*
quickSort accepts an array, left index, and right index
*/

function quickSort(arr, idxL = 0, idxR = arr.length - 1) {
  if (idxL >= 0 && idxR >= 0 && idxL < idxR) {
    const p = pivot(arr, idxL, idxR);
    quickSort(arr, idxL, p - 1);
    quickSort(arr, p + 1, idxR);
  }

  return arr;
}

module.exports = { pivot, quickSort };