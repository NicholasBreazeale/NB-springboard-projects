def includes(collection, sought, start=None):
    """Is sought in collection, starting at index start?

    Return True/False if sought is in the given collection:
    - lists/strings/sets/tuples: returns True/False if sought present
    - dictionaries: return True/False if *value* of sought in dictionary

    If string/list/tuple and `start` is provided, starts searching only at that
    index. This `start` is ignored for sets/dictionaries, since they aren't
    ordered.

        >>> includes([1, 2, 3], 1)
        True

        >>> includes([1, 2, 3], 1, 2)
        False

        >>> includes("hello", "o")
        True

        >>> includes(('Elmo', 5, 'red'), 'red', 1)
        True

        >>> includes({1, 2, 3}, 1)
        True

        >>> includes({1, 2, 3}, 1, 3)  # "start" ignored for sets!
        True

        >>> includes({"apple": "red", "berry": "blue"}, "blue")
        True
    """
    if isinstance(collection, dict):
        try:
            list(collection.values()).index(sought)
        except:
            return False
        return True

    if isinstance(collection, set):
        return not not collection & {sought}

    sought_idx = None
    try:
        sought_idx = collection.index(sought)
    except:
        return False

    if start != None:
        start_idx = None
        try:
            start_idx = collection.index(start)
        except:
            return True

        return sought_idx >= start_idx
    return True