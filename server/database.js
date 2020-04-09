// database.js
//
// Helper functions for common database queries
//    related to users, resources, and categories.

const bcrypt = require("bcrypt");

const c = require("./constants");



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
  user.avatar = c.DEFAULT_AVATAR;
  const queryParams = [ user.name, user.email, user.password, user.avatar ];
  return db
    .query("INSERT INTO users " +
           "(name, email, password, avatar) " +
           "VALUES ($1, $2, $3, $4) RETURNING *", queryParams)
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
           "SET name = $1, avatar = $2 " +
           "WHERE id = $3 RETURNING *", queryParams)
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

// getResources retrieves resources from the database with many options.
//
//    options:
//    {
//      comments:    boolean,
//      likes:       boolean,
//      avgRatings:  boolean,
//      users:       boolean,
//      currentUser: string,
//      categories:  [ string, string, string, ... ],
//      sort {
//        byLatest:        boolean,
//        byOldest:        boolean,
//        byHighestRating: boolean,
//        byLowestRating:  boolean,
//        byMostPopular:   boolean,
//        byLeastPopular:  boolean,
//      },
//      filterByLiked:     boolean,
//      filterByCommented: boolean,
//      filterByRated:     boolean,
//      limit: 0,
//    }
//
// Examples
//
// Landing-page popular resources simple
//
//    getResources(db, { likes: true, sorts: { byMostPopular: true }, limit: 8 });
//
// My resources
//
//    getResources(db, { currentUser: "Ali", comments: true, likes: true });
//
// Liked, Rated, Commented resources (each can be on it's own)
//
//    getResources(db, { currentUser: "Alice", filterByLiked: true, filterByRated: true, filterByCommented: true });
//
// All resources, feed page (different sorts can be applied)
//
//    getResources(db, { likes: true, comments: true, avgRatings: true, sorts: { byLeastPopular: true } });
//    getResources(db, { likes: true, comments: true, avgRatings: true, sorts: { byMostPopular: true } });
//    getResources(db, { likes: true, comments: true, avgRatings: true, sorts: { byHighestRating: true } });
//    getResources(db, { likes: true, comments: true, avgRatings: true, sorts: { byLowestRating: true } });
//    getResources(db, { likes: true, comments: true, avgRatings: true, sorts: { byLatest: true, byHighestRating: true } });
//    getResources(db, { likes: true, comments: true, avgRatings: true, sorts: { byOldest: true, byHighestRating: true } });
//
// Category or multiple categories (different sorts can be applied)
//
//    getResources(db, { categories: ["Art"]});
//    getResources(db, { likes: true, avgRatings: true, categories: ["Art"] });
//    getResources(db, { likes: true, avgRatings: true, categories: ["Art", "Tech"] });
//    getResources(db, { likes: true, avgRatings: true, categories: ["Art", "Tech"], sorts: { byLeastPopular: true } });
//    getResources(db, { likes: true, avgRatings: true, categories: ["Art", "Tech"], sorts: { byLowestRating: true } });
//    getResources(db, { likes: true, avgRatings: true, categories: ["Art", "Tech"], sorts: { byHighestRating: true } });
//
// Categories for single user:
//
//    getResources(null, { likes: true, avgRatings: true, categories: ["Art", "Tech"], currentUser: "Ali" });

const getResources = (db, options) => {

  const queryParams = [];

  const selectUsers = options.users      || options.currentUser;
  const joinRatings = options.avgRatings || options.ratings;
  const joinUsers   = options.users      || (options.currentUser        &&
                                             !options.filterByLiked     &&
                                             !options.filterByCommented &&
                                             !options.filterByRated);

  /////  SELECT  /////

  let queryString = `SELECT resources.*` +
                      `${options.comments   ? `, comments.body AS comments`          : ``}` +
                      `${options.likes      ? `, COUNT(likes) AS likes`              : ``}` +
                      `${options.avgRatings ? `, avg(ratings.rating) AS avg_ratings` : ``}` +
                      `${selectUsers        ? `, users.name AS users`                : ``}` +
                      `${options.categories ? `, categories.name AS categories`      : ``}` +

  /////  FROM  /////

                    ` FROM resources` +
                      `${options.comments   ? ` LEFT JOIN comments ON comments.resource_id = resources.id`     : ``}` +
                      `${options.likes      ? ` LEFT JOIN likes ON likes.resource_id = resources.id`           : ``}` +
                      `${joinRatings        ? ` LEFT JOIN ratings ON ratings.resource_id = resources.id`       : ``}` +
                      `${joinUsers          ? ` JOIN users ON resources.user_id = users.id`               : ``}` +
                      `${options.categories ? ` JOIN categories ON resources.category_id = categories.id` : ``}`;

  // users was joined above though...
  let usersNotJoined = true;
  if (options.filterByLiked) {
    queryString += ` JOIN likes ON likes.resource_id = resources.id` +
                   ` JOIN users ON users.id = likes.user_id`;
    usersNotJoined = false;
  }
  if (options.filterByCommented) {
    queryString += ` JOIN comments ON comments.resource_id = resources.id` +
                   ` ${usersNotJoined ? `JOIN users ON users.id = comments.user_id` : ``}`;
    usersNotJoined = false;
  }
  if (options.filterByRated) {
    queryString += ` JOIN ratings ON ratings.resource_id = resources.id` +
                   ` ${usersNotJoined ? `JOIN users ON users.id = ratings.user_id` : ``}`;
    usersNotJoined = false;
  }

  /////  WHERE  /////

  let addWhere = true;
  // Filter by current user:
  if (options.currentUser) {
    queryParams.push(`${options.currentUser}`.trim());
    queryString += ` WHERE users.name = $${queryParams.length}`;
    addWhere = false;
  }
  // Filter by categories:
  if (options.categories) {
    options.categories.forEach((category, i) => {
      queryParams.push(`%${category}%`);
      queryString += (i ? ` ${addWhere ? `WHERE` : `AND`}` : ` OR`) +
                     ` categories.name LIKE $${queryParams.length}`;
      addWhere = false;
    });
  }

  /////  GROUP BY  /////

  let addGroupBy = true;
  // Likes are requested
  if (options.likes &&
      !options.filterByLiked && !options.filterByCommented && !options.filterByRated) {
    queryString += ` GROUP BY resources.id`;
    addGroupBy = false;
  }
  // Comments are requested
  if (options.comments &&
      !options.filterByLiked && !options.filterByCommented && !options.filterByRated) {
    queryString += `${addGroupBy ? ` GROUP BY resources.id, ` : `, `}comments.body`;
    addGroupBy = false;
  }
  // Categories are requested
  if (options.categories &&
      !options.filterByLiked && !options.filterByCommented && !options.filterByRated) {
    queryString += `${addGroupBy ? ` GROUP BY resources.id, ` : `, `}categories.name`;
    addGroupBy = false;
  }
  // Users or current user are requested
  if (options.users ||
      (options.currentUser &&
       !options.filterByLiked && !options.filterByCommented && !options.filterByRated)) {
    queryString += `${addGroupBy ? ` GROUP BY resources.id, ` : `, `}users.name`;
    addGroupBy = false;
  }

  /////  ORDER BY  /////

  if (options.sorts) {
    const sortClause = [];
    // Sort by timestamp:
    if (options.sorts.byLatest) {
      sortClause.push("resources.created DESC");
    } else if (options.sorts.byOldest) {
      sortClause.push("resources.created ASC");
    }
    // Sort by rating:
    if (options.sorts.byHighestRating) {
      sortClause.push("AVG(ratings.rating) DESC");
    } else if (options.sorts.byLowestRating) {
      sortClause.push("AVG(ratings.rating) ASC");
    }
    // Sort by popularity:
    if (options.sorts.byMostPopular) {
      sortClause.push("likes DESC");
    } else if (options.sorts.byLeastPopular) {
      sortClause.push("likes ASC");
    }
    // Add sort clause if there is anything to sort by:
    if (sortClause.length > 0) {
      queryString += ` ORDER BY ${sortClause.join(", ")}`;
    }
  }

  /////  LIMIT  /////

  if (options.limit) {
    // queryString += ` LIMIT ${Number(options.limit) || 10}`;
    queryString += ` LIMIT ${Number(options.limit)}`;
  }

  // OMG let's execute the thing and see what happens!
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
  searchResources,
  searchResourcesWtf,
  getCategories,
  getCategoriesWithName,
  addCategory
};
