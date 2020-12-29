"""Python serial number generator."""

class SerialGenerator:
    """Machine to create unique incrementing serial numbers.
    
    >>> serial = SerialGenerator(start=100)

    >>> serial.generate()
    100

    >>> serial.generate()
    101

    >>> serial.generate()
    102

    >>> serial.reset()

    >>> serial.generate()
    100

    >>> serial
    <SerialGenerator start=100 next=101>
    """
    def __init__(self, start=0):
        "Set the starting value for the generator"
        self.start = start
        self.next = start

    def __repr__(self):
        return f"<SerialGenerator start={self.start} next={self.next}>"

    def generate(self):
        "Get the next sequential number"
        self.next += 1
        return self.next - 1

    def reset(self):
        "Reset the generated numbers back to the start"
        self.next = self.start