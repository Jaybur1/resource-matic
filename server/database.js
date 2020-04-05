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



// ! Work in progress, don't use, add, or modify please -------------------------------------------- //
// TODO (brainstorming for full getResources - Ali)
// Options:
// {
//   comments: true,
//   likes: true,
//   avgRatings: true,
//   ratings: true,
//   users: true,
//   currentUser: "",
//   categories: ["", "", ""],
//   sortByLatest: true,
//   sortByOldest: true,
//   sortByHighestRating: true,
//   sortByLowestRating: true,
//   sortByMostPopular: true,
//   sortByLeastPopular: true,
//   limit: 0,
//   filterByLiked: true,
//   filterByCommented: true,
//   filterByRated: true,
// }

const getResources = (db, options) => {
  const queryParams = [];

  // ? SELECT section of query
  // Initialize query
  let queryString = `
    SELECT resources.*
  `;

  // Comments are requested
  options.comments ? queryString += `, comments.message AS comments` : null;

  // Likes are requested
  options.likes ? queryString += `, count(likes) AS likes` : null;

  // Average ratings are requested
  options.avgRatings ? queryString += `, average(ratings.rating) AS avgRatings` : null;

  // All ratings are requested
  options.ratings ? queryString += `, ratings.rating AS rating` : null;

  // Users or current user are requested
  options.users || options.currentUser ? queryString += `, users.name AS users` : null;

  // Categories are requested
  options.categories ? queryString += `, categories.name AS categories` : null;
  // ?

  // ? JOIN section of query
  // Comments are requested
  options.comments ? queryString += `JOIN comments ON comments.resource_id = resources.id` : null;

  // Likes are requested
  options.likes ? queryString += `JOIN likes ON likes.resource_id = resources.id` : null;

  // Average ratings or all ratings are requested
  options.avgRatings || options.ratings ? queryString += `JOIN ratings ON ratings.resource_id = resources.id` : null;

  // Users or current user are requested
  options.users || options.currentUser ? queryString += `JOIN users ON resources.user_id = users.id` : null;

  // Categories are requested
  options.categories ? queryString += `JOIN categories ON resources.category_id = categories.id` : null;
  // ?

  // ? WHERE section of query

  // ?


  // let queryString = `
  // SELECT resources.*, avg(property_reviews.rating) as average_rating
  // FROM properties
  // JOIN property_reviews ON properties.id = property_id
  // `;

  // 3
  if (Object.keys(options).length > 0) {
    queryString += "WHERE ";
  }

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryParams.indexOf(options.owner_id) > 0 ? queryString += " AND " : null;
    queryString += `properties.owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    queryParams.indexOf(options.minimum_price_per_night * 100) > 0 ? queryString += " AND " : null;
    queryString += `properties.cost_per_night >= $${queryParams.length} `;
  }

  if (options.maximum_price_per_night) {
    queryParams.push((options.maximum_price_per_night * 100));
    queryParams.indexOf(options.maximum_price_per_night * 100) > 0 ? queryString += " AND " : null;
    queryString += `properties.cost_per_night <= $${queryParams.length} `;
  }

  queryString += `
  GROUP BY properties.id
  `;

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  }

  // 4
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  // console.log(queryString, queryParams);

  // 6
  return queryExecute(queryString, queryParams, (rows) => rows);
};
// ! ---------------------------------------------------------------------------------------- //

module.exports = { getUserWithEmail, getUserWithId, addUser, updateUser, updateUserWithCreds, validatePassword, getResources };
