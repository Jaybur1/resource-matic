// database.js
//
// Helper functions for common database queries
//    related to users, resources, and categories.

const bcrypt = require("bcrypt");



///////////////////
/////  USERS  /////
///////////////////

// getUserWithEmail retrieves user information given an email address.

const getUserWithEmail = (db, email) => {
  return db
    .query("SELECT * FROM users WHERE email = $1", [ email ])
    .then((res) => res.rows[0])
    .catch((err) => console.error("getUserWithEmail error:", err));
};

// getUserWithId retrieves user information given a user ID.

const getUserWithId = (db, id) => {
  return db
    .query("SELECT * FROM users WHERE id = $1", [ id ])
    .then((res) => res.rows[0])
    .catch((err) => console.error("getUserWithId error:", err));
};

// addUser adds a new user to the database.

const addUser = (db, user) => {
  const queryParams = [ user.name, user.email, user.password ];
  return db
    .query("INSERT INTO users " +
           "(name, email, password) " +
           "VALUES ($1, $2, $3) RETURNING *", queryParams)
    .then((res) => res.rows[0])
    .catch((err) => console.error("addUser error:", err));
};

// deleteUser removes a user from the database given a user ID.

const deleteUser = (db, userID) => {
  return db
    .query("DELETE users WHERE id = $1", [ userID ])
    .then((res) => res.rows[0])
    .catch((err) => console.error("deleteUser error:", err));
};

// updateUser updates user information that doesn't require a password check
//    in the database given a user ID.

const updateUser = (db, user) => {
  const queryParams = [ user.name, user.avatar, user.userId ];
  return db
    .query("UPDATE users " +
           "SET name = $1, avatar = $2 WHERE id = $3 RETURNING *", queryParams)
    .then((res) => res.rows[0])
    .catch((err) => console.error("updateUser error:", err));
};

// updateUserWithCreds updates user information that requires a password check
//    in the database given a user ID.

const updateUserWithCreds = (db, user) => {
  const queryParams = [ user.email, user.pwHash, user.name, user.avatar, user.userId ];
  return db
    .query("UPDATE users " +
           "SET email = $1, password = $2, name = $3, avatar = $4 " +
           "WHERE id = $5 RETURNING *", queryParams)
    .then((res) => res.rows[0])
    .catch((err) => console.error("updateUserWithCreds error:", err));
};

// validatePassword checks that a password matches the hash stored for a user.

const validatePassword = (db, userID, password) => {
  return db
    .query("SELECT password FROM users WHERE id = $1", [ userID ])
    .then((res) => bcrypt.compare(password, res.rows[0].password))
    // Do not use arrow function here or pwMatch will be undefined:
    //    I swear, I've had it with arrow functions......
    .then(function(pwMatch) {
      return pwMatch ? Promise.resolve() : Promise.reject("Password mismatch");
    });
};



///////////////////////
/////  RESOURCES  /////
///////////////////////

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
  options.comments ? (queryString += `, comments.body AS comments`) : null;

  // Likes are requested
  options.likes ? (queryString += `, count(likes) AS likes`) : null;

  // Average ratings are requested
  options.avgRatings
    ? (queryString += `, avg(ratings.rating) AS avg_ratings`)
    : null;

  // Users or current user are requested
  options.users || options.currentUser
    ? (queryString += `, users.name AS users`)
    : null;

  // Categories are requested
  options.categories
    ? (queryString += `, categories.name AS categories`)
    : null;
  // ?

  // ? FROM section of query
  queryString += ` FROM resources `;
  // ?

  // ? JOIN section of query
  // Comments are requested
  options.comments
    ? (queryString += `JOIN comments ON comments.resource_id = resources.id `)
    : null;

  // Likes are requested
  options.likes
    ? (queryString += `JOIN likes ON likes.resource_id = resources.id `)
    : null;

  // Average ratings or all ratings are requested
  options.avgRatings || options.ratings
    ? (queryString += `JOIN ratings ON ratings.resource_id = resources.id `)
    : null;

  // Users or current user are requested
  options.users ||
  (options.currentUser &&
    !options.filterByLiked &&
    !options.filterByCommented &&
    !options.filterByRated)
    ? (queryString += `JOIN users ON resources.user_id = users.id `)
    : null;

  // Categories are requested
  options.categories
    ? (queryString += `JOIN categories ON resources.category_id = categories.id `)
    : null;

  let alreadyFiltered = false;

  // Liked by user
  if (options.filterByLiked) {
    queryString += `JOIN likes ON likes.resource_id = resources.id `;
    alreadyFiltered
      ? null
      : (queryString += `JOIN users ON users.id = likes.user_id `);
    alreadyFiltered = true;
  }

  // Commented by user
  if (options.filterByCommented) {
    queryString += `JOIN comments ON comments.resource_id = resources.id `;
    alreadyFiltered
      ? null
      : (queryString += `JOIN users ON users.id = comments.user_id `);
    alreadyFiltered = true;
  }

  // Rated by user
  if (options.filterByRated) {
    queryString += `JOIN ratings ON ratings.resource_id = resources.id `;
    alreadyFiltered
      ? null
      : (queryString += `JOIN users ON users.id = ratings.user_id `);
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
        alreadyWhere ? (queryString += ` AND `) : (queryString += ` WHERE `);
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
  if (
    options.likes &&
    !options.filterByLiked &&
    !options.filterByCommented &&
    !options.filterByRated
  ) {
    queryString += ` GROUP BY resources.id`;
    alreadyGrouped = true;
  }

  // Comments are requested
  if (
    options.comments &&
    !options.filterByLiked &&
    !options.filterByCommented &&
    !options.filterByRated
  ) {
    alreadyGrouped
      ? (queryString += `, `)
      : (queryString += ` GROUP BY resources.id, `);
    queryString += `comments.body`;
    alreadyGrouped = true;
  }

  // Categories are requested
  if (
    options.categories &&
    !options.filterByLiked &&
    !options.filterByCommented &&
    !options.filterByRated
  ) {
    alreadyGrouped
      ? (queryString += `, `)
      : (queryString += ` GROUP BY resources.id, `);
    queryString += `categories.name `;
    alreadyGrouped = true;
  }

  // Users or current user are requested
  if (
    options.users ||
    (options.currentUser &&
      !options.filterByLiked &&
      !options.filterByCommented &&
      !options.filterByRated)
  ) {
    alreadyGrouped
      ? (queryString += `, `)
      : (queryString += ` GROUP BY resources.id, `);
    queryString += `users.name `;
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
      alreadySorted ? (queryString += `, `) : null;
      queryString += `resources.created ASC`;
      alreadySorted = true;
    }

    // Sort by highest average rating requested
    if (options.sorts.byHighestRating) {
      alreadySorted ? (queryString += `, `) : null;
      queryString += `avg(ratings.rating) DESC`;
      alreadySorted = true;
    }

    // Sort by lowest average rating requested
    if (options.sorts.byLowestRating) {
      alreadySorted ? (queryString += `, `) : null;
      queryString += `avg(ratings.rating) ASC`;
      alreadySorted = true;
    }

    // Sort by most popular requested
    if (options.sorts.byMostPopular) {
      alreadySorted ? (queryString += `, `) : null;
      queryString += `likes DESC`;
      alreadySorted = true;
    }

    // Sort by least popular requested
    if (options.sorts.byLeastPopular) {
      alreadySorted ? (queryString += `, `) : null;
      queryString += `likes ASC`;
      alreadySorted = true;
    }
  }
  // ?

  // ? Limit section of query
  queryParams.push(Number(options.limit) || 10);
  queryString += ` LIMIT $${queryParams.length};`;
  // ?

  return db
    .query(queryString, queryParams)
    .then((res) => res.rows)
    .catch((err) => console.error("getResources error:", err));
};

// addResource adds a new resource to the database.

const addResource = (db, resource) => {
  const queryParams = [
    resource.userId, resource.category_id,
    resource.title, resource.description, resource.content,
    resource.thumbnail_photo
  ];
  return db
    .query("INSERT INTO resources " +
           "(user_id, category_id, title, description, content, thumbnail_photo) " +
           "VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", queryParams)
    .then((res) => res.rows[0])
    .catch((err) => console.error("addResource error:", err));
};

// deleteResource deletes a resource from the database.

// const deleteResource = (db, resourceId) => {
//   // Check if this resource holds the last trace of the current category
// };



////////////////////////
/////  CATEGORIES  /////
////////////////////////

// getCategories retrieves all the categories from the database.

const getCategories = (db) => {
  return db
    .query("SELECT * FROM categories")
    .then((res) => res.rows)
    .catch((err) => console.log("getCategories error:", err));
};

// getCategoriesWithName retrieves a category given its name.

const getCategoriesWithName = (db, name) => {
  return db
    .query("SELECT * FROM categories WHERE name = $1", [ name ])
    .then((res) => res.rows[0])
    .catch((err) => console.log("getCategoriesWithName error:", err));
};

// addCategory adds a new category to the database.

const addCategory = (db, name) => {
  return db
    .query("INSERT INTO categories (name) VALUES ($1) RETURNING *", [ name ])
    .then((res) => res.rows[0])
    .catch((err) => console.log("addCategory error:", err));
};



module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  deleteUser,
  updateUser,
  updateUserWithCreds,
  validatePassword,
  getResources,
  addResource,
  // deleteResource,
  getCategories,
  getCategoriesWithName,
  addCategory
};
