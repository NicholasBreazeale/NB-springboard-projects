def print_upper_words(wordList):
	"""Print out a list of words, each on separate lines, and all uppercase"""

	for word in wordList:
		if word[0] == "e" or word[0] == "E":
			print(word.upper())