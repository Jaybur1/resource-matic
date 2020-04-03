-- Drop and recreate Users table

DROP TABLE IF EXISTS users
CASCADE;

CREATE TABLE users
(
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar TEXT NOT NULL DEFAULT 'https://static.boredpanda.com/blog/wp-content/uploads/2017/03/58d8b70b540f3_GkyKh__880.jpg'
);







