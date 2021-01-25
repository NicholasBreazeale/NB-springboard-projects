DROP DATABASE IF EXISTS medical_center;

CREATE DATABASE medical_center;

\c medical_center;

CREATE TABLE doctors
(
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL
);

CREATE TABLE patients
(
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL
);

CREATE TABLE diseases
(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE visits
(
  id SERIAL PRIMARY KEY,
  visit_date TIMESTAMP NOT NULL
);

CREATE TABLE doctor_visits
(
  id SERIAL PRIMARY KEY,
  visit_id INTEGER REFERENCES visits,
  doctor_id INTEGER REFERENCES doctors
);

CREATE TABLE patient_visits
(
  id SERIAL PRIMARY KEY,
  visit_id INTEGER REFERENCES visits,
  patient_id INTEGER REFERENCES patients
);

CREATE TABLE diagnoses
(
  id SERIAL PRIMARY KEY,
  patient_visit_id INTEGER REFERENCES patient_visits,
  disease_id INTEGER REFERENCES diseases
);