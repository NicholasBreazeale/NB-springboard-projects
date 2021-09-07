/** product: calculate the product of an array of numbers. */

function product(nums) {
  return nums[0] * (nums.length > 1 ? product(nums.slice(1)) : 1);
}

/** longest: return the length of the longest word in an array of words. */

function longest(words) {
  return (words.length > 1 ? Math.max(words[0].length, longest(words.slice(1))) : words[0].length);
}

/** everyOther: return a string with every other letter. */

function everyOther(str) {
  return str[0] + (str.length > 2 ? everyOther(str.substring(2)) : "");
}

/** isPalindrome: checks whether a string is a palindrome or not. */

function isPalindrome(str) {
  return str[0] === str[str.length-1] && (str.length > 3 ? isPalindrome(str.substring(1, str.length-1)) : true);
}

/** findIndex: return the index of val in arr (or -1 if val is not present). */

function findIndex(arr, val) {
  // Index of val found
  if (arr[0] === val) return 0;
  // Keep searching
  if (arr.length > 1) {
    const idx = findIndex(arr.slice(1), val);
    return (idx < 0 ? idx : idx + 1);
  }
  // Val not in arr
  return -1;
}

/** revString: return a copy of a string, but in reverse. */

function revString(str) {
  return (str.length > 1 ? revString(str.substring(1)) : "") + str[0];
}

/** gatherStrings: given an object, return an array of all of the string values. */

function gatherStrings(obj) {
  const strs = [];

  for (const val of Object.values(obj)) {
    switch (typeof val) {
      case "object":
        strs.push(...gatherStrings(val));
        break;
      case "string":
        strs.push(val);
        break;
    }
  }

  return strs;
}

/** binarySearch: given a sorted array of numbers, and a value,
 * return the index of that value (or -1 if val is not present). */

function binarySearch(arr, val) {
  const midIdx = Math.floor(arr.length/2)
  const midVal = arr[midIdx];

  // Index of val found
  if (midVal === val) return midIdx;
  // Val not in arr
  if (arr.length === 1) return -1;

  // Search left side
  if (midVal > val) return binarySearch(arr.slice(0, midIdx), val);
  // Search right side
  const idx = binarySearch(arr.slice(midIdx, arr.length), val);
  return (idx >= 0 ? idx + midIdx : idx);
}

module.exports = {
  product,
  longest,
  everyOther,
  isPalindrome,
  findIndex,
  revString,
  gatherStrings,
  binarySearch
};
