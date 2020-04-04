const getUserWithEmail = (email, db) => {
  return db
    .query(`SELECT * FROM users WHERE email = $1;`, [email])
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => console.error("querry error", err));
};


const getUserWithId = (id, db) => {
  return db
    .query(`SELECT * FROM users WHERE id = $1;`, [id])
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => console.error("querry error", err));
};

module.exports = { getUserWithEmail, getUserWithId};