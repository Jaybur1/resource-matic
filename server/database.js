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
//   sort {
//     byLatest: true,
//     byOldest: true,
//     byHighestRating: true,
//     byLowestRating: true,
//     byMostPopular: true,
//     byLeastPopular: true,
//   },
//   limit: 0,
//   filterByLiked: true,
//   filterByCommented: true,
//   filterByRated: true,
// }

const getResources = (db, options) => {
  const queryParams = [];

  // ? SELECT section of query
  // Initialize query
  let queryString = `SELECT resources.*`;

  // Comments are requested
  options.comments ? queryString += `, comments.body AS comments` : null;

  // Likes are requested
  options.likes ? queryString += `, count(likes) AS likes` : null;

  // Average ratings are requested
  options.avgRatings ? queryString += `, avg(ratings.rating) AS avgRatings` : null;

  // All ratings are requested
  options.ratings ? queryString += `, ratings.rating AS rating` : null;

  // Users or current user are requested
  options.users || options.currentUser ? queryString += `, users.name AS users` : null;

  // Categories are requested
  options.categories ? queryString += `, categories.name AS categories` : null;
  // ?
  
  // ? FROM section of query
  queryString += ` FROM resources `;
  // ?

  // ? JOIN section of query
  // Comments are requested
  options.comments ? queryString += `JOIN comments ON comments.resource_id = resources.id ` : null;

  // Likes are requested
  options.likes ? queryString += `JOIN likes ON likes.resource_id = resources.id ` : null;

  // Average ratings or all ratings are requested
  options.avgRatings || options.ratings ? queryString += `JOIN ratings ON ratings.resource_id = resources.id ` : null;

  // Users or current user are requested
  options.users || options.currentUser ? queryString += `JOIN users ON resources.user_id = users.id ` : null;
  
  // Categories are requested
  options.categories ? queryString += `JOIN categories ON resources.category_id = categories.id ` : null;
  // ?
  

  // ? WHERE section of query
  // Current user is requested
  if (options.currentUser) {
    queryParams.push(`${options.currentUser}`);
    queryString += ` WHERE users.name = $${queryParams.length} `;
  }
  
  // Categories requested
  if (options.categories) {
    // Can be filtered by multiple categories
    options.categories.forEach(category => {
      queryParams.push(`%${category}%`);
      queryString += ` AND categories.name LIKE $${queryParams.length} `;
    });
  }
  // ?
  
  // ? GROUP BY section of query
  let alreadyGrouped = false;

  // Likes are requested
  if (options.likes) {
    queryString += ` GROUP BY resources.id`;
    alreadyGrouped = true;
  }
  
  if (options.comments) {
    alreadyGrouped ? queryString += `, ` : queryString += ` GROUP BY `;
    queryString += `comments.body`;
    alreadyGrouped = true;
  }
  
  if (options.ratings) {
    alreadyGrouped ? queryString += `, ` : queryString += ` GROUP BY `;
    queryString += `ratings.rating `;
    alreadyGrouped = true;
  }
  // ?

  // if (options.minimum_rating) {
  //   queryParams.push(options.minimum_rating);
  //   queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  // }
  
  // ? ORDER BY section of query
  // Any sorts needed
  if (options.sorts) {
    queryString += ` ORDER BY `;
    
    let alreadySorted = false;

    // Sort by latest requested
    if (options.sorts.byLatest) {
      queryString += `resources.created DESC`;
      alreadySorted = true;
    }
    
    // Sort by oldest requested
    if (options.sorts.byOldest) {
      alreadySorted ? queryString += `, ` : null;
      queryString += `resources.created ASC`;
      alreadySorted = true;
    }
    
    // Sort by highest average rating requested
    if (options.sorts.byHighestRating) {
      alreadySorted ? queryString += `, ` : null;
      queryString += `avg(ratings.rating) DESC`;
      alreadySorted = true;
    }
    
    // Sort by lowest average rating requested
    if (options.sorts.byLowestRating) {
      alreadySorted ? queryString += `, ` : null;
      queryString += `avg(ratings.rating) ASC`;
      alreadySorted = true;
    }
    
    // Sort by most popular requested
    if (options.sorts.byMostPopular) {
      alreadySorted ? queryString += `, ` : null;
      queryString += `likes DESC`;
      alreadySorted = true;
    }
    
    // Sort by least popular requested
    if (options.sorts.byLeastPopular) {
      alreadySorted ? queryString += `, ` : null;
      queryString += `likes ASC`;
      alreadySorted = true;
    }
  }
  // ?
  
  // ? Limit section of query
  queryParams.push(options.limit || 10);
  queryString += ` LIMIT $${queryParams.length};`;
  // ?

  console.log(queryString);

  // return queryExecute(queryString, queryParams, (rows) => rows);
};
// ! ---------------------------------------------------------------------------------------- //

// getResources(null, {});
// getResources(null, {currentUser: "Ali"});
// getResources(null, {currentUser: "Ali", comments: true});
// getResources(null, {comments: true});
// getResources(null, {comments: true, likes: true, ratings: true});
// getResources(null, {likes: true, ratings: true});
// getResources(null, {likes: true, avgRatings: true});
// getResources(null, {likes: true, avgRatings: true, sorts: {byHighestRating: true}});
// getResources(null, {likes: true, avgRatings: true, sorts: {byLowestRating: true}});
// getResources(null, {likes: true, avgRatings: true, sorts: {byMostPopular: true}});
// getResources(null, {likes: true, avgRatings: true, sorts: {byLeastPopular: true}});
// getResources(null, {likes: true, avgRatings: true, sorts: {byLatest: true}});
// getResources(null, {likes: true, avgRatings: true, sorts: {byOldest: true}});
// getResources(null, {likes: true, avgRatings: true, sorts: {byOldest: true, byLeastPopular: true}});
// getResources(null, {likes: true, avgRatings: true, sorts: {byOldest: true, byMostPopular: true}});

module.exports = { getUserWithEmail, getUserWithId, addUser, updateUser, updateUserWithCreds, validatePassword, getResources };
