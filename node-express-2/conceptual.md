### Conceptual Exercise

Answer the following questions below:

- What is a JWT?
  - JSON Web Token. An encrypted token generated on the server and saved on the client for later use.
- What is the signature portion of the JWT?  What does it do?
  - The header and payload signed with a secret key.
- If a JWT is intercepted, can the attacker see what's inside the payload?
  - Yes.
- How can you implement authentication with a JWT?  Describe how it works at a high level.
  - Using express.js you can specify some middleware for any given route to use. This middleware verifys the JWT and either accepts it and allows the route to process normally or rejects it and throws an unauthorized error.
- Compare and contrast unit, integration and end-to-end tests.
  - Integration testing ensures that different systems within a code base work together whereas end-to-end testing ensures that the program works how an end-user expects.
- What is a mock? What are some things you would mock?
  - In a programming sense, mocks are imitations of an end product features used for testing. Some things that programmers mock are database entries or external APIs.
- What is continuous integration?
  - The automated testing of a code base whenever a change is made.
- What is an environment variable and what are they used for?
  - A variable that's scoped to the current process.
- What is TDD? What are some benefits and drawbacks?
  - Test Driven Development, a method of writing code that aims to pass a set of test cases.
- What is the value of using JSONSchema for validation?
  - Validate incoming JSON documents to makes sure they conform to a certain pattern.
- What are some ways to decide which code to test?
  - Ideally, all code should be tested with as much coverage as possible, though code that will be more commonly used should be prioritized.
- What are some differences between Web Sockets and HTTP?
  - Web Sockets creates a bidirectional session that stays open until either end closes it. An HTTP session closes immediately once all data has been delivered to the end point.
- Did you prefer using Flask over Express? Why or why not (there is no right 
  answer here --- we want to see how you think about technology)?
  - Express, it keeps the language used on both the server-side and client-side consistent. Plus I'm not a fan of indentation-based languages like Python.