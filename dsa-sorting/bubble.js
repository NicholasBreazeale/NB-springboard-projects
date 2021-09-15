function bubbleSort(arr) {
  let sorted = false;
  do {
    sorted = false;
    for (let i = 1; i < arr.length; i++) {
      if (arr[i-1] > arr[i]) {
        sorted = true;
        [arr[i-1], arr[i]] = [arr[i], arr[i-1]];
      }
    }
  } while (sorted);

  return arr;
}

module.exports = bubbleSort;