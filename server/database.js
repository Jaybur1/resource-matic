// database.js
//
// Helper functions for common database queries.

const bcrypt = require("bcrypt");



const getUserWithEmail = (db, email) => {
  return db
    .query("SELECT * FROM users WHERE email = $1", [ email ])
    .then((res) => res.rows[0])
    .catch((err) => console.error("getUserWithEmail error:", err));
};

const getUserWithId = (db, id) => {
  return db
    .query("SELECT * FROM users WHERE id = $1", [ id ])
    .then((res) => res.rows[0])
    .catch((err) => console.error("getUserWithId error:", err));
};

const addUser = (db, user) => {
  const userVals = Object.values(user); // name,email,password,avatar
  return db
    .query("INSERT INTO users (name, email, password) " +
           "VALUES ($1, $2, $3) RETURNING *", userVals)
    .then((res) => res.rows[0])
    .catch((err) => console.error("addUser error:", err));
};

const deleteUser = (db, userID) => {
  return db
    .query("DELETE users WHERE id = $1", [ userID ])
    .then((res) => res.rows[0])
    .catch((err) => console.error("deleteUser error:", err));
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

// ! Function that retrieves resources from db based on various options --------------------------- //
// Options:
// {
//   comments: true,
//   likes: true,
//   avgRatings: true,
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

// Examples
// ? Landing-page popular resources simple
// getResources(db, {likes: true, sorts: {byMostPopular: true}, limit: 8});

// ? My resources
// getResources(db, {currentUser: "Ali", comments: true, likes: true});

// ? Liked, Rated, Commented resources (each can be on it's own)
// getResources(db, {currentUser: "Alice", filterByLiked: true, filterByRated: true, filterByCommented: true});

// ? All resources, feed page (different sorts can be applied)
// getResources(db, {likes: true, comments: true, avgRatings: true, sorts: {byLeastPopular: true}});
// getResources(db, {likes: true, comments: true, avgRatings: true, sorts: {byMostPopular: true}});
// getResources(db, {likes: true, comments: true, avgRatings: true, sorts: {byHighestRating: true}});
// getResources(db, {likes: true, comments: true, avgRatings: true, sorts: {byLowestRating: true}});
// getResources(db, {likes: true, comments: true, avgRatings: true, sorts: {byLatest: true, byHighestRating: true}});
// getResources(db, {likes: true, comments: true, avgRatings: true, sorts: {byOldest: true, byHighestRating: true}});

// ? Category or multiple categories (different sorts can be applied)
// getResources(db, { categories: ["Art"]});
// getResources(db, {likes: true, avgRatings: true, categories: ["Art"]});
// getResources(db, {likes: true, avgRatings: true, categories: ["Art", "Tech"]});
// getResources(db, {likes: true, avgRatings: true, categories: ["Art", "Tech"], sorts: {byLeastPopular: true}});
// getResources(db, {likes: true, avgRatings: true, categories: ["Art", "Tech"], sorts: {byLowestRating: true}});
// getResources(db, {likes: true, avgRatings: true, categories: ["Art", "Tech"], sorts: {byHighestRating: true}});

// ? Categories for single user
// getResources(null, {likes: true, avgRatings: true, categories: ["Art", "Tech"], currentUser: "Ali"});
// ! ---------------------------------------------------------------------------------------------------- //
const getResources = (db, options) => {
  const queryParams = [];

  // ? SELECT section of query
  // Initialize query
  let queryString = `SELECT resources.*`;

  // Comments are requested
  options.comments ? queryString += `, comments.body AS comment, comments.created as comment_created_at` : null;

  // Likes are requested
  options.likes ? queryString += `, count(likes) AS likes` : null;

  // Average ratings are requested
  options.avgRatings ? queryString += `, avg(ratings.rating) AS avg_ratings` : null;

  // Users or current user are requested
  options.users || options.currentUser ? queryString += `, u1.name AS poster, u1.avatar AS poster_avatar, u2.name AS commenter, u2.avatar AS commenter_avatar` : null;

  // Categories are requested
  options.categories ? queryString += `, categories.name AS categories` : null;
  // ?

  // ? FROM section of query
  queryString += ` FROM resources `;
  // ?

  // ? JOIN section of query
  // Comments are requested
  options.comments ? queryString += `LEFT JOIN comments ON comments.resource_id = resources.id ` : null;

  // Likes are requested
  options.likes ? queryString += `LEFT JOIN likes ON likes.resource_id = resources.id ` : null;

  // Average ratings or all ratings are requested
  options.avgRatings || options.ratings ? queryString += `LEFT JOIN ratings ON ratings.resource_id = resources.id ` : null;

  // Users or current user are requested
  options.users || options.currentUser && !options.filterByLiked && !options.filterByCommented && !options.filterByRated ? queryString += `JOIN users u1 ON resources.user_id = u1.id LEFT JOIN users u2 ON comments.user_id = u2.id ` : null;

  // Categories are requested
  options.categories ? queryString += `JOIN categories ON resources.category_id = categories.id ` : null;

  let alreadyFiltered = false;

  // Liked by user
  if (options.filterByLiked) {
    queryString += `JOIN likes ON likes.resource_id = resources.id `;
    alreadyFiltered ? null : queryString += `JOIN users ON users.id = likes.user_id `;
    alreadyFiltered = true;
  }

  // Commented by user
  if (options.filterByCommented) {
    queryString += `JOIN comments ON comments.resource_id = resources.id `;
    alreadyFiltered ? null : queryString += `JOIN users ON users.id = comments.user_id `;
    alreadyFiltered = true;
  }

  // Rated by user
  if (options.filterByRated) {
    queryString += `JOIN ratings ON ratings.resource_id = resources.id `;
    alreadyFiltered ? null : queryString += `JOIN users ON users.id = ratings.user_id `;
    alreadyFiltered = true;
  }
  // ?


  // ? WHERE section of query
  let alreadyWhere = false;

  // Current user is requested
  if (options.currentUser) {
    queryParams.push(`${options.currentUser}`);
    queryString += ` WHERE users.name = $${queryParams.length} `;
    alreadyWhere = true;
  }

  // Categories requested
  if (options.categories) {
    // Can be filtered by multiple categories
    options.categories.forEach((category, index) => {
      queryParams.push(`%${category}%`);

      if (index === 0) {
        alreadyWhere ? queryString += ` AND ` :  queryString += ` WHERE `;
      } else {
        queryString += ` OR `;
      }

      queryString += `categories.name LIKE $${queryParams.length} `;
    });
  }
  // ?

  // ? GROUP BY section of query
  let alreadyGrouped = false;

  // Likes are requested
  if (options.likes && !options.filterByLiked && !options.filterByCommented && !options.filterByRated) {
    queryString += ` GROUP BY resources.id`;
    alreadyGrouped = true;
  }

  // Comments are requested
  if (options.comments && !options.filterByLiked && !options.filterByCommented && !options.filterByRated) {
    alreadyGrouped ? queryString += `, ` : queryString += ` GROUP BY resources.id, `;
    queryString += `comments.body, comments.created`;
    alreadyGrouped = true;
  }

  // Categories are requested
  if (options.categories && !options.filterByLiked && !options.filterByCommented && !options.filterByRated) {
    alreadyGrouped ? queryString += `, ` : queryString += ` GROUP BY resources.id, `;
    queryString += `categories.name `;
    alreadyGrouped = true;
  }

  // Users or current user are requested
  if (options.users || options.currentUser && !options.filterByLiked && !options.filterByCommented && !options.filterByRated) {
    alreadyGrouped ? queryString += `, ` : queryString += ` GROUP BY resources.id, `;
    queryString += `u1.name, u1.avatar, u2.name, u2.avatar `;
    alreadyGrouped = true;
  }
  // ?

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
  queryParams.push(Number(options.limit) || 50);
  queryString += ` LIMIT $${queryParams.length};`;
  // ?

  console.log(queryString);

  return db
    .query(queryString, queryParams)
    .then((res) => res.rows)
    .catch((err) => console.error("getResources error:", err));
};

module.exports = { getUserWithEmail, getUserWithId, addUser, deleteUser, updateUser, updateUserWithCreds, validatePassword, getResources };
