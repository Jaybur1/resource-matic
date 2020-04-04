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

const addUser = (user,db) => {
  const userVals = Object.values(user); // name,email,password,avatar
  return db
    .query(
      `INSERT INTO users (name,email,password,avatar) VALUES ($1,$2,$3,$4) RETURNING *;`,
      userVals
    )
    .then(res => {
      return res.rows[0];
    })
    .catch(err => console.error("query error", err));
}


module.exports = { getUserWithEmail, getUserWithId, addUser};