-- from the terminal run:
-- psql < outer_space.sql

DROP DATABASE IF EXISTS outer_space;

CREATE DATABASE outer_space;

\c outer_space

CREATE TABLE celestial_body_types
(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE celestial_bodies
(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  classification INTEGER REFERENCES celestial_body_types NOT NULL,
  orbits_around INTEGER REFERENCES celestial_bodies,
  orbital_period_in_years FLOAT
);

INSERT INTO celestial_body_types
  (name)
VALUES
  ('galaxy'),
  ('star'),
  ('planet'),
  ('moon');

INSERT INTO celestial_bodies
  (name, classification, orbits_around, orbital_period_in_years)
VALUES
  ('Milky Way', 1, NULL, NULL),
  ('The Sun', 2, 1, NULL),
  ('Earth', 3, 2, 1.00),
  ('The Moon', 4, 3, NULL),
  ('Mars', 3, 2, 1.88),
  ('Phobos', 4, 5, NULL),
  ('Deimos', 4, 5, NULL),
  ('Venus', 3, 2, 0.62),
  ('Neptune', 3, 2, 164.8),
  ('Naiad', 4, 9, NULL),
  ('Thalassa', 4, 9, NULL),
  ('Despina', 4, 9, NULL),
  ('Galatea', 4, 9, NULL),
  ('Larissa', 4, 9, NULL),
  ('S/2004 N 1', 4, 9, NULL),
  ('Proteus', 4, 9, NULL),
  ('Triton', 4, 9, NULL),
  ('Nereid', 4, 9, NULL),
  ('Halimede', 4, 9, NULL),
  ('Sao', 4, 9, NULL),
  ('Laomedeia', 4, 9, NULL),
  ('Psamathe', 4, 9, NULL),
  ('Neso', 4, 9, NULL),
  ('Proxima Centauri', 2, 1, NULL),
  ('Proxima Centauri b', 3, 24, 0.03),
  ('Gliese 876', 2, 1, NULL),
  ('Gliese 876 b', 3, 26, 0.23);