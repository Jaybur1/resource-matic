// pg.js
//
// Postgres setup.
//  Module returns a new PG Pool object.

module.exports = function() {

  let dbParams = {};

  if (process.env.DATABASE_URL) {
    dbParams.connectionString = process.env.DATABASE_URL;
  } else {
    dbParams = {
      host:     process.env.DB_HOST,
      port:     process.env.DB_PORT,
      user:     process.env.DB_USER,
      password: process.env.DB_PASS,
      ssl:      process.env.DB_SSL,
      database: process.env.DB_NAME
    };
  }
  const { Pool } = require("pg");
  return new Pool(dbParams);

};
