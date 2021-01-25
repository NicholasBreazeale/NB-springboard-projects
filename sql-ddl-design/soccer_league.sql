DROP DATABASE IF EXISTS soccer_league;

CREATE DATABASE soccer_league;

\c soccer_league;

CREATE TABLE teams
(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE players
(
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  team_id INTEGER REFERENCES teams,
  jersey_number INTEGER
);

CREATE TABLE games
(
  id SERIAL PRIMARY KEY,
  play_date TIMESTAMP NOT NULL,
  home_team INTEGER REFERENCES teams NOT NULL,
  away_team INTEGER REFERENCES teams NOT NULL
);

CREATE TABLE goals
(
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players,
  game_id INTEGER REFERENCES games,
  goal_count INTEGER
);

CREATE TABLE referees
(
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL
);

CREATE TABLE game_referees
(
  id SERIAL PRIMARY KEY,
  game_id INTEGER REFERENCES games NOT NULL,
  referee_id INTEGER REFERENCES referees NOT NULL
);

CREATE TABLE season
(
  id SERIAL PRIMARY KEY,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL
);