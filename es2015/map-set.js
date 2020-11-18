// Quick Question # 1

new Set([1,1,2,2,3,4]); // Set{1, 2, 3, 4}

// Quick Question # 2

[...new Set("referee")].join(""); // "ref"

// Quick Question # 3

let m = new Map();
m.set([1,2,3], true); // Map{[1,2,3]: true}
m.set([1,2,3], false); // Map{[1,2,3]: true, [1,2,3]: false}

// hasDuplicate

const hasDuplicate = arr => new Set(arr).size !== arr.length;

// vowelCount

function vowelCount(str) {
	let vowels = new Map();
	for (const character of str.toLowerCase()) {
		if ("aeiou".includes(character)) {
			if (vowels.has(character)) {
				vowels.set(character, vowels.get(character)+1);
			} else {
				vowels.set(character, 1);
			}
		}
	}
	return vowels;
}