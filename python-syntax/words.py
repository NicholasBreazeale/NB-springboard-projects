def print_upper_words(wordList, must_start_with):
	"""Print out a list of words if they start with a specific letter, each on separate lines, and all uppercase"""

	for word in wordList:
		for letter in must_start_with:
			if word[0] == letter[0]:
				print(word.upper())
				break