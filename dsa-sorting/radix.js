function getDigit(num, digit) {
  return Math.floor(num / Math.pow(10, digit) % 10)
}

function digitCount(num) {
  return Math.floor(Math.log10(num) + 1);
}

function mostDigits(arr) {
  if (!arr.length) return 0;
  return digitCount(arr.reduce((acc, val) => acc > val ? acc : val, 0));
}

function radixSort(arr) {
  const max = mostDigits(arr);
  for (let i = 0; i < max; i++) {
    const buckets = [[], [], [], [], [], [], [], [], [], []];
    // Sort elements into buckets
    for (let j = 0; j < arr.length; j++) {
      buckets[getDigit(arr[j], i)].push(arr[j]);
    }
    // Organize bucket contents
    for (let j = 0, k = 0; k < buckets.length; k++) {
      for (let l = 0; l < buckets[k].length; j++, l++) {
        arr[j] = buckets[k][l];
      }
    }
  }

  return arr;
}

module.exports = { getDigit, digitCount, mostDigits, radixSort };