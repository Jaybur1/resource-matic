// database.js
//
// Helper functions for common database queries.

const bcrypt = require("bcrypt");

const c = require("./constants");



const getUserWithEmail = (db, email) => {
  return db
    .query("SELECT * FROM users WHERE email = $1", [email])
    .then((res) => res.rows[0])
    .catch((err) => console.error("getUserWithEmail error:", err));
};

const getUserWithId = (db, id) => {
  return db
    .query("SELECT * FROM users WHERE id = $1", [id])
    .then((res) => res.rows[0])
    .catch((err) => console.error("getUserWithId error:", err));
};

const addUser = (db, user) => {
  user.avatar = c.DEFAULT_AVATAR;
  const userVals = Object.values(user); // name,email,password,avatar
  return db
    .query("INSERT INTO users (name, email, password, avatar) " +
           "VALUES ($1, $2, $3, $4) RETURNING *", userVals)
    .then((res) => res.rows[0])
    .catch((err) => console.error("addUser error:", err));
};

const deleteUser = (db, userID) => {
  return db
    .query("DELETE users WHERE id = $1", [userID])
    .then((res) => res.rows[0])
    .catch((err) => console.error("deleteUser error:", err));
};

const updateUser = (db, user) => {
  return db
    .query(
      "UPDATE users SET name = $1, avatar = $2 WHERE id = $3 RETURNING *",
      user
    )
    .then((res) => res.rows[0])
    .catch((err) => console.error("updateUser error:", err));
};

const updateUserWithCreds = (db, user) => {
  return db
    .query(
      "UPDATE users SET email = $1, password = $2, name = $3, avatar = $4 WHERE id = $5 RETURNING *",
      user
    )
    .then((res) => res.rows[0])
    .catch((err) => console.error("updateUser error:", err));
};

const validatePassword = (db, userID, password) => {
  return (
    db
      .query("SELECT password FROM users WHERE id = $1", [userID])
      .then((res) => bcrypt.compare(password, res.rows[0].password))
      // Do not use arrow function here or pwMatch will be undefined:
      //    I swear, I've had it with arrow functions......
      .then(function(pwMatch) {
        return pwMatch
          ? Promise.resolve()
          : Promise.reject("Password mismatch");
      })
  );
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
  options.comments || options.filterByCommented ? queryString += `, comments.body AS comment, comments.created as comment_created_at, comments.id as comment_id` : null;

  // Likes are requested
  options.likes ? (queryString += `, count(l1) AS likes`) : null;

  // Average ratings are requested
  options.avgRatings
    ? (queryString += `, avg(ratings.rating) AS avg_ratings`)
    : null;

  // Users or current user are requested
  options.users || options.currentUser ? queryString += `, u1.name AS poster, u1.avatar AS poster_avatar, u2.name AS commenter, u2.avatar AS commenter_avatar` : null;

  // Categories are requested
  options.categories
    ? (queryString += `, categories.name AS categories`)
    : null;
  // ?

  // ? FROM section of query
  queryString += ` FROM resources `;
  // ?

  // ? JOIN section of query
  // Comments are requested or Commented by user
  options.comments || options.filterByCommented ? queryString += `LEFT JOIN comments ON comments.resource_id = resources.id ` : null;

  // Likes are requested
  options.likes ? queryString += `LEFT JOIN likes l1 ON l1.resource_id = resources.id ` : null;

  // Average ratings or all ratings are requested
  options.avgRatings || options.ratings ? queryString += `LEFT JOIN ratings ON ratings.resource_id = resources.id ` : null;

  // Users or current user are requested
  options.users || options.currentUser ? queryString += `JOIN users u1 ON resources.user_id = u1.id LEFT JOIN users u2 ON comments.user_id = u2.id ` : null;

  // Categories are requested
  options.categories
    ? (queryString += `JOIN categories ON resources.category_id = categories.id `)
    : null;

  // Liked by user
  options.filterByLiked ? queryString += `JOIN likes l2 ON l2.resource_id = resources.id ` : null;

  // Rated by user
  options.filterByRated ? queryString += `JOIN ratings r2 ON r2.resource_id = resources.id ` : null;
  // ?

  // ? WHERE section of query
  let alreadyWhere = false;

  // Current user is requested
  if (options.currentUser && !options.filterByLiked && !options.filterByCommented && !options.filterByRated) {
    queryParams.push(`${options.currentUser}`);
    queryString += ` WHERE u1.id = $${queryParams.length} `;
    alreadyWhere = true;
  }

  // Liked by user
  if (options.filterByLiked) {
    queryParams.push(`${options.currentUser}`);
    alreadyWhere ? (queryString += ` OR `) : (queryString += ` WHERE `);
    queryString += ` l2.user_id = $${queryParams.length} `;
    alreadyWhere = true;
  }

  // Rated by user
  if (options.filterByRated) {
    queryParams.push(`${options.currentUser}`);
    alreadyWhere ? (queryString += ` OR `) : (queryString += ` WHERE `);
    queryString += ` ratings.user_id = $${queryParams.length} `;
    alreadyWhere = true;
  }

  // Commented by user
  if (options.filterByCommented) {
    queryParams.push(`${options.currentUser}`);
    alreadyWhere ? (queryString += ` OR `) : (queryString += ` WHERE `);
    queryString += ` comments.user_id = $${queryParams.length} `;
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
    options.likes
  ) {
    queryString += ` GROUP BY resources.id`;
    alreadyGrouped = true;
  }

  // Comments are requested
  if (
    options.comments || options.filterByCommented
  ) {
    alreadyGrouped
      ? (queryString += `, `)
      : (queryString += ` GROUP BY resources.id, `);
    queryString += `comments.body, comments.created, comments.id`;
    alreadyGrouped = true;
  }

  // Categories are requested
  if (
    options.categories
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
    options.currentUser
  ) {
    alreadyGrouped
      ? (queryString += `, `)
      : (queryString += ` GROUP BY resources.id, `);
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
  if (options.limit) {
    queryParams.push(Number(options.limit));
    queryString += ` LIMIT $${queryParams.length};`;
  }
  // ?

  // console.log("____________", queryString);

  return db
    .query(queryString, queryParams)
    .then((res) => {
      for (const row of res.rows) {
        delete row.user_id;
      }
      return res.rows;
    })
    .catch((err) => console.error("getResources error:", err));
};

//handle adding a new resource
const addResource = (resource, db) => {
  const resourceVals = Object.values(resource); //$1user_id,$2content,$3title, $4category_id, $5description,$6thumbnail_photo
  console.log(resourceVals);
  return db
    .query(
      "INSERT INTO resources (user_id, category_id, title,description,content,thumbnail_photo) " +
        "VALUES ($1,$4, $3, $5, $2, $6) RETURNING *",
      resourceVals
    )
    .then((res) => res.rows[0])
    .catch((err) => console.error("addResource error:", err));
};

// searchResources searches all resources for the specified text in various places.

// SELECT resources.*, comments.body AS comment, comments.created as comment_created_at, comments.id as comment_id, count(l1) AS likes, avg(ratings.rating) AS avg_ratings, u1.name AS poster, u1.avatar AS poster_avatar, u2.name AS commenter, u2.avatar AS commenter_avatar FROM resources LEFT JOIN comments ON comments.resource_id = resources.id LEFT JOIN likes l1 ON l1.resource_id = resources.id LEFT JOIN ratings ON ratings.resource_id = resources.id JOIN users u1 ON resources.user_id = u1.id LEFT JOIN users u2 ON comments.user_id = u2.id  GROUP BY resources.id, comments.body, comments.created, comments.id, u1.name, u1.avatar, u2.name, u2.avatar  ORDER BY resources.created DESC

const searchResourcesWtf = (db, searchText) => {
  return db
    // Main SELECT copied from logged query for main feed (shown above)
    //    Added WHERE LIKE conditions for searching
    .query("SELECT resources.*, comments.body AS comment, comments.created as comment_created_at, comments.id as comment_id, count(l1) AS likes, " +
           "avg(ratings.rating) AS avg_ratings, u1.name AS poster, u1.avatar AS poster_avatar, u2.name AS commenter, u2.avatar AS commenter_avatar " +
           "FROM resources " +
           "LEFT JOIN comments ON comments.resource_id = resources.id " +
           "LEFT JOIN likes l1 ON l1.resource_id = resources.id " +
           "LEFT JOIN ratings ON ratings.resource_id = resources.id " +
           "JOIN users u1 ON resources.user_id = u1.id " +
           "LEFT JOIN users u2 ON comments.user_id = u2.id " +
           // Added WHERE clause
           "WHERE resources.title LIKE $1 OR " +
                 "resources.description LIKE $1 OR " +
                 "resources.content LIKE $1 " +
           // ------------------
           "GROUP BY resources.id, comments.body, comments.created, comments.id, u1.name, u1.avatar, u2.name, u2.avatar " +
           "ORDER BY resources.created DESC", [ `%${searchText}%` ])
    .then((res) => {
      for (const row of res.rows) {
        delete row.user_id;
      }
      return res.rows;
    })
    .catch((err) => console.log("searchResources error:", err));
};

const searchResources = (db, searchText) => {
  return db
    .query("SELECT resources.*, AVG(rating) AS avg_ratings FROM resources " +
           "LEFT JOIN ratings ON ratings.resource_id = resources.id " +
           //"JOIN comments ON comments.resource_id = resources.id " +
           "WHERE resources.title LIKE $1 OR " +
                 "resources.description LIKE $1 OR " +
                 "resources.content LIKE $1 " +
           "GROUP BY resources.id", [ `%${searchText}%` ])
    .then((res) => {
      for (const row of res.rows) {
        delete row.user_id;
      }
      return res.rows;
    })
    .catch((err) => console.log("searchResources error:", err));
};

// deleteResource deletes a resource
//    INCOMPLETE

// const deleteResource = (db, resourceId) => {
//   // Check if this resource is the last reference to its category:
//   db.query("SELECT category_id FROM resources WHERE resource_id = $1", [ resourceId ])
//     .then((queryRes) => {
//       db.query("SELECT COUNT(*) FROM resources WHERE category_id = $1", [ categoryId ])
//       return queryRes.rows[0].category_id;
//     })
//     .then((categoryId) => {
//       if (queryRes.rows[0].length) {
//         db.query("DELETE FROM categories WHERE category_id = $1", [ categoryId ]))
//       }
//     })
//     .catch((err) => err);
// };

//handling all categories
const getCategories = (db) => {

  return db
    .query("SELECT * FROM categories")
    .then((res) => res.rows)
    .catch((err) => console.log("getAllCategories error:", err));

};

//get category by name
const getCategoriesWithName = (name,db) => {
  return db
    .query("SELECT * FROM categories WHERE name = $1",[name])
    .then((res) => res.rows[0])
    .catch((err) => console.log("getCategoriesWithname error:", err));

};
//handle create new category
const addCategory = (name,db) => {
  return db
    .query("INSERT INTO categories (name) VALUES($1) RETURNING *",[name])
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
  searchResources,
  searchResourcesWtf,
  getCategories,
  getCategoriesWithName,
  addCategory
};
