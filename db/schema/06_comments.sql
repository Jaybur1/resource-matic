-- Drop and recreate Comments table

DROP TABLE IF EXISTS comments
CASCADE;

CREATE TABLE comments
(
  id SERIAL NOT NULL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  resource_id INTEGER NOT NULL REFERENCES resources(id),
  body TEXT NOT NULL DEFAULT ''
);
