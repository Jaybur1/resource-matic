-- Drop and recreate Likes table

DROP TABLE IF EXISTS likes
CASCADE;

CREATE TABLE likes
(
  id SERIAL NOT NULL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  resource_id INTEGER NOT NULL REFERENCES resources(id)
  --  emoji_id INTEGER NOT NULL DEFAULT 0
);
