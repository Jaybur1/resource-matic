// likes.js
//
// Routes related to resource likes.

const router = require("express").Router();

const util = require("../util");



module.exports = (db) => {

  // GET /like
  //    Get likes for a resource.
  // Arguments:
  //    resourceId   Integer: Resource ID of the like to delete.
  // Returns: {
  //   numLikes: <like_count>
  // }

  router.get("/", (req, res) => {
    const userId     = req.session.userId;
    const resourceId = req.query.resourceId;
    if (!userId) {
      util.httpError("GET /like failed:", "No session", res, 403);
    } else if (!resourceId) {
      util.httpError("GET /like failed:", "Resource ID not specified", res, 400);
    } else {
      db.query("SELECT * FROM likes WHERE user_id = $1 AND resource_id = $2", [ userId, resourceId ])
        .then((likeQueryRes) => {
          //db.query("SELECT COUNT(*) AS numLikes, emoji_id FROM likes WHERE resource_id = $1 GROUP BY emoji_id", [ resourceId ])
          db.query("SELECT COUNT(*) FROM likes WHERE resource_id = $1", [ resourceId ])
            .then((countQueryRes) => {
              res.status(200).json({
                likedByCurrentUser: likeQueryRes.rows.length === 1,
                numLikes:           countQueryRes.rows[0].count
              });
            }).catch((err) => {
              util.httpError("GET /like SELECT COUNT failed:", err, res, 500);
            });
        }).catch((err) => {
          util.httpError("GET /like SELECT * failed:", err, res, 500);
        });
    }
  });

  // POST /like
  //    Add a like to a resource.
  // Arguments:
  //    resourceId   Integer: Resource ID of the like to delete.
  // Returns:
  //    Nothing.

  router.post("/", (req, res) => {
    const userId     = req.session.userId;
    const resourceId = req.body.resourceId;
    if (!userId) {
      util.httpError("GET /like failed:", "No session", res, 403);
    } else if (!resourceId) {
      util.httpError("GET /like failed:", "Resource ID not specified", res, 400);
    } else {
      db.query("INSERT INTO likes (user_id, resource_id) VALUES ($1, $2)", [ userId, resourceId ])
        .then((_queryRes) => {
          res.status(200).end();
        }).catch((err) => {
          util.httpError("POST /like INSERT failed:", err, res, 500);
        });
    }
  });

  // DELETE /like
  //    Remove a like from a resource.
  // Arguments:
  //    resourceId   Integer: Resource ID of the like to delete.
  // Returns:
  //    Nothing.

  router.delete("/", (req, res) => {
    const userId     = req.session.userId;
    const resourceId = req.body.resourceId;
    if (!userId) {
      util.httpError("GET /like failed:", "No session", res, 403);
    } else if (!resourceId) {
      util.httpError("GET /like failed:", "Resource ID not specified", res, 400);
    } else {
      db.query("DELETE FROM likes WHERE user_id = $1 AND resource_id = $2", [ userId, resourceId ])
        .then((_queryRes) => {
          res.status(200).end();
        }).catch((err) => {
          util.httpError("DELETE /like DELETE failed:", err, res, 500);
        });
    }
  });

  return router;

};



