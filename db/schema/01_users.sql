-- Drop and recreate Users table

DROP TABLE IF EXISTS users
CASCADE;

CREATE TABLE users
(
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar TEXT NOT NULL DEFAULT 'https://images.vexels.com/media/users/3/145908/preview2/52eabf633ca6414e60a7677b0b917d92-male-avatar-maker.jpg',
  created TIMESTAMP
  WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated TIMESTAMP
  WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);







