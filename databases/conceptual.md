### Conceptual Exercise

Answer the following questions below:

- What is PostgreSQL?
  - A relation database management system.

- What is the difference between SQL and PostgreSQL?
  - SQL is a programming language used to manage databases. PostgreSql is one such database.

- In `psql`, how do you connect to a database?
  - \c <database_name>

- What is the difference between `HAVING` and `WHERE`?
  - `HAVING` can work with aggregate functions while `WHERE` cannot.

- What is the difference between an `INNER` and `OUTER` join?
  - `INNER` returns entries that share a relationship between two tables. `OUTER` returns all entries, irrespective of relationships.

- What is the difference between a `LEFT OUTER` and `RIGHT OUTER` join?
  - `LEFT OUTER` returns all entries in the left table, irrespective of relationships, and the entries from the right table that share a relationship with the left. `RIGHT OUTER` works the same way but in the opposite direction. What determines which side a table is on depends on how the query is written.

- What is an ORM? What do they do?
  - Object-relational mapping. In the context of databases, it is a way of visualizing the relationships between different tables.

- What are some differences between making HTTP requests using AJAX and from the server side using a library like `requests`?
  - HTTP and AJAX, when used together, make a request to an external databse for information which could take an unknown amount of time. The `request` Flask library parses said request and helps break down the data sent into an easy to use object.

- What is CSRF? What is the purpose of the CSRF token?
  - Cross Site Request Forgery, a website exploit that would allow a bad actor to trick a good actor into sending information they did not want.

- What is the purpose of `form.hidden_tag()`?
  - Holds the data for the CSRF key, which should be included in a form submission, but not displayed to the user.