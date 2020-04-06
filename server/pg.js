// pg.js
//
// Postgres interface module.
//  Module returns a new PG Pool object.

let dbParams = {};

if (process.env.DATABASE_URL) {
  dbParams.connectionString = process.env.DATABASE_URL;
} else {
  dbParams = {
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT,
    user:     process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  };
}
const { Pool } = require("pg");
const pool = new Pool(dbParams);



module.exports = {

  connect: () => pool.connect(),

  query: (sql, params, callback) => {
    const start = Date.now();
    if (typeof callback === "function") {
      return pool.query(sql, params, (err, res) => {
        const duration = Date.now() - start;
        console.log(`${sql}\n  duration: ${duration}ms\n  rows: ${res.rowCount}`);
        callback(err, res);
      });
    } else {
      return pool.query(sql, params)
        .then((res) => {
          const duration = Date.now() - start;
          console.log(`${sql}\n  duration: ${duration}ms\n  rows: ${res.rowCount}`);
          return res;
        }).catch((err) => {
          const duration = Date.now() - start;
          console.log(`${sql}\n  duration: ${duration}ms\n  ${err}`);
          return Promise.reject(err);
        });
    }
  }

};



