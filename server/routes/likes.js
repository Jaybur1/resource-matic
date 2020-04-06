// likes.js
//
// Routes related to resource likes.

const router = require("express").Router();

const util = require("../util");



module.exports = (db) => {

  // GET /like
  //    Get likes for a resource.

  router.get("/", (req, res) => {
    const userId     = req.session.userId;
    const resourceID = req.query.resourceID;
    if (!userId) {
      util.httpError("GET /like failed:", "No session", res, 403);
    } else if (!resourceID) {
      util.httpError("GET /like failed:", "Resource ID not specified", res, 400);
    } else {
      //db.query("SELECT COUNT(*) AS numLikes, emoji_id FROM likes WHERE resource_id = $1 GROUP BY emoji_id", [ resourceID ])
      db.query("SELECT COUNT(*) AS numLikes FROM likes WHERE resource_id = $1", [ resourceID ])
        .then((queryRes) => {
          res.status(200).json(queryRes.rows[0]);
        }).catch((err) => {
          util.httpError("GET /like SELECT failed:", err, res, 500);
        });
    }
  });

  // POST /like
  //    Add a like to a resource.

  router.post("/", (req, res) => {
    const userId     = req.session.userId;
    const resourceID = req.body.resourceID;
    if (!userId) {
      util.httpError("GET /like failed:", "No session", res, 403);
    } else if (!resourceID) {
      util.httpError("GET /like failed:", "Resource ID not specified", res, 400);
    } else {
      db.query("INSERT INTO likes (user_id, resource_id) VALUES ($1, $2)", [ userId, resourceID ])
        .then((_queryRes) => {
          res.status(200).end();
        }).catch((err) => {
          util.httpError("POST /like INSERT failed:", err, res, 500);
        });
    }
  });

  // DELETE /like
  //    Remove a like from a resource.

  router.delete("/", (req, res) => {
    const userId     = req.session.userId;
    const resourceID = req.body.resourceID;
    if (!userId) {
      util.httpError("GET /like failed:", "No session", res, 403);
    } else if (!resourceID) {
      util.httpError("GET /like failed:", "Resource ID not specified", res, 400);
    } else {
      db.query("DELETE FROM likes WHERE user_id = $1 AND resource_id = $2", [ userId, resourceID ])
        .then((_queryRes) => {
          res.status(200).end();
        }).catch((err) => {
          util.httpError("DELETE /like DELETE failed:", err, res, 500);
        });
    }
  });

  return router;

};



