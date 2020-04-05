// database.js
//
// Helper functions for common database queries.

const bcrypt = require("bcrypt");



const getUserWithEmail = (email, db) => {
  return db
    .query("SELECT * FROM users WHERE email = $1", [ email ])
    .then((res) => res.rows[0])
    .catch((err) => console.error("getUserWithEmail error:", err));
};

const getUserWithId = (id, db) => {
  return db
    .query("SELECT * FROM users WHERE id = $1", [ id ])
    .then((res) => res.rows[0])
    .catch((err) => console.error("getUserWithId error:", err));
};

const addUser = (user, db) => {
  const userVals = Object.values(user); // name,email,password,avatar
  return db
    .query("INSERT INTO users (name, email, password, avatar) " +
           "VALUES ($1, $2, $3, $4) RETURNING *", userVals)
    .then((res) => res.rows[0])
    .catch((err) => console.error("addUser error:", err));
};

const updateUser = (db, user) => {
  return db
    .query("UPDATE users SET name = $1, avatar = $2 WHERE id = $3 RETURNING *", user)
    .then((res) => res.rows[0])
    .catch((err) => console.error("updateUser error:", err));
};

const updateUserWithCreds = (db, user) => {
  return db
    .query("UPDATE users SET email = $1, password = $2, name = $3, avatar = $4 WHERE id = $5 RETURNING *", user)
    .then((res) => res.rows[0])
    .catch((err) => console.error("updateUser error:", err));
};

const validatePassword = (db, userID, password) => {
  return db
    .query("SELECT password FROM users WHERE id = $1", [ userID ])
    .then((res) => bcrypt.compare(password, res.rows[0].password))
    // Do not use arrow function here or pwMatch will be undefined:
    //    I swear, I've had it with arrow functions......
    .then(function(pwMatch) {
      return (pwMatch ? Promise.resolve() : Promise.reject("Password mismatch"));
    });
};


module.exports = { getUserWithEmail, getUserWithId, addUser, updateUser, updateUserWithCreds, validatePassword };
