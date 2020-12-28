def flip_case(phrase, to_swap):
    """Flip [to_swap] case each time it appears in phrase.

        >>> flip_case('Aaaahhh', 'a')
        'aAAAhhh'

        >>> flip_case('Aaaahhh', 'A')
        'aAAAhhh'

        >>> flip_case('Aaaahhh', 'h')
        'AaaaHHH'

    """
    phrase_lst = list(phrase)
    for i in range(len(phrase_lst)):
        if phrase_lst[i].lower() == to_swap.lower():
            phrase_lst[i] = phrase_lst[i].swapcase()
    return "".join(phrase_lst)
