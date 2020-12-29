import random

"""Word Finder: finds random words from a dictionary."""


class WordFinder:
    """ List of words with random access to them

    >>> wf = WordFinder("words.txt")
    235886 words read

    >>> simple = WordFinder("simple_words.txt")
    3 words read

    >>> simple.random() in ["cat", "dog", "porcupine"]
    True

    >>> simple.random() in ["cat", "dog", "porcupine"]
    True

    >>> simple.random() in ["cat", "dog", "porcupine"]
    True
    """
    def __init__(self, path):
        "Reads a list of new-line separated words from a given file"
        self.words = []

        f = open(path)
        for word in f.read().splitlines():
            self.words.append(word)
        f.close()

        print(f"{len(self.words)} words read")

    def random(self):
        "Return a random word from the list"
        return random.choice(self.words)

class SpecialWordFinder(WordFinder):
    """ List of non-empty or commented words with random access to them

    >>> wf = WordFinder("special_words.txt")
    9 words read

    >>> swf = SpecialWordFinder("special_words.txt")
    4 words read

    >>> swf.random() in ["kale", "parsnips", "apple", "mango"]
    True

    >>> swf.random() in ["kale", "parsnips", "apple", "mango"]
    True

    >>> swf.random() in ["kale", "parsnips", "apple", "mango"]
    True

    >>> swf.random() in ["kale", "parsnips", "apple", "mango"]
    True
    """
    def __init__(self, path):
        "Reads a list of new-line separated words from a given file, excluding empty lines and comments"
        self.words = []

        f = open(path)
        for word in f.read().splitlines():
            if len(word) > 0 and word[0] != "#":
                self.words.append(word)
        f.close()

        print(f"{len(self.words)} words read")