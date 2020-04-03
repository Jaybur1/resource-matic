-- Drop and recreate Ratings table

DROP TABLE IF EXISTS ratings
CASCADE;

CREATE TABLE ratings
(
  id SERIAL NOT NULL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  resource_id INTEGER NOT NULL REFERENCES resources(id),
  rating SMALLINT NOT NULL DEFAULT 0
);