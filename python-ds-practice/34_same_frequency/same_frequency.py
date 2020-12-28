def same_frequency(num1, num2):
    """Do these nums have same frequencies of digits?
    
        >>> same_frequency(551122, 221515)
        True
        
        >>> same_frequency(321142, 3212215)
        False
        
        >>> same_frequency(1212, 2211)
        True
    """
    def frequency(string):
        letters = {}
        for char in string:
            if char not in letters:
                letters[char] = 1
            else:
                letters[char] += 1
        return sorted(letters)

    return frequency(str(num1)) == frequency(str(num2))