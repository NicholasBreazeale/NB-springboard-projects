### Conceptual Exercise

Answer the following questions below:

- What is RESTful routing?
	- An API that a website provides that other websites or services are able to utilize. Access is usually done via specific routes that return formated data, typically in JSON.
- What is a resource?
	- Anything from a file to an entry in a database.
- When building a JSON API why do you not include routes to render a form that when submitted creates a new user?
	- JSON APIs are normally separated from the normal website that average users access. The API should only return JSON data where as the regular webiste is able to render information in a more pleasing manner as well as present forms for users to fill in. Logins should be handled on the latter forms as they usually have added security measures.
- What does idempotent mean? Which HTTP verbs are idempotent?
	- Accessing the same route at different times on a website should recieve the same response each time.
- What is the difference between PUT and PATCH?
	- PUT updates an entire resource whereas PATCH is only a partial modification.
- What is one way encryption?
	- Once data has been encrypted, it is impossible to decrypt.
- What is the purpose of a `salt` when hashing a password?
	- Additional data added to the input of an encryption function which makes encryption breaking harder.
- What is the purpose of the Bcrypt module?
	- Password encryption and authentication
- What is the difference between authorization and authentication?
	- Authorization is when you allow another person to access your private data. Authentication is when you are able to verify that you own a set of private data and should be given access.