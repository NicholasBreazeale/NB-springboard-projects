def reverse_vowels(s):
    """Reverse vowels in a string.

    Characters which re not vowels do not change position in string, but all
    vowels (y is not a vowel), should reverse their order.

    >>> reverse_vowels("Hello!")
    'Holle!'

    >>> reverse_vowels("Tomatoes")
    'Temotaos'

    >>> reverse_vowels("Reverse Vowels In A String")
    'RivArsI Vewols en e Streng'

    reverse_vowels("aeiou")
    'uoiea'

    reverse_vowels("why try, shy fly?")
    'why try, shy fly?''
    """
    char_list = list(s)
    vowel_pos = []
    for i in range(len(char_list)):
        if char_list[i] in 'aeiouAEIOU':
            vowel_pos.append(i)
    for i in range(len(vowel_pos)//2):
        j = len(vowel_pos) - i - 1
        char_list[vowel_pos[i]], char_list[vowel_pos[j]] = char_list[vowel_pos[j]], char_list[vowel_pos[i]]
    return "".join(char_list)