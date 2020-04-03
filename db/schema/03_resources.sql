-- Drop and recreate Resources table

DROP TABLE IF EXISTS resources
CASCADE;

CREATE TABLE resources
(
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  thumbnail_photo TEXT NOT NULL DEFAULT ''
);