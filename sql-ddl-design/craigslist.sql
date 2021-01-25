DROP DATABASE IF EXISTS craigslist;

CREATE DATABASE craigslist;

\c craigslist;

CREATE TABLE regions
(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  prefered_region INTEGER REFERENCES regions
);

CREATE TABLE categories
(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE post
(
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  user_id INTEGER REFERENCES users NOT NULL,
  address TEXT NOT NULL,
  region_id INTEGER REFERENCES regions NOT NULL,
  category_id INTEGER REFERENCES categories
);