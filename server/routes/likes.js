// likes.js
//
// Routes related to resource likes.

const router = require("express").Router();

const util     = require("../util");
// const database = require("../database");



module.exports = (db) => {

  // GET /like
  //    Get likes for a resource.

  router.get("/", (req, res) => {
    if (req.session.userId) {
      const resourceID = req.query.resourceID;
      if (resourceID) {
        //db.query("SELECT COUNT(likes), emoji_id FROM likes WHERE resource_id = $1 GROUP BY emoji_id", [ req.body.resourceID ])
        db.query("SELECT COUNT(*) FROM likes WHERE resource_id = $1", [ resourceID ])
          .then((queryRes) => {
            console.log(queryRes);
            res.status(200).json(queryRes.rows[0]);
          }).catch((err) => {
            util.httpError("GET /like failed:", err, res, 500);
          });
      } else {
        util.httpError("GET /like failed:", "Resource ID not specified", res, 400);
      }
    } else {
      util.httpError("GET /like failed:", "No session", res, 403);
    }
  });

  // POST /like
  //    Add a like to a resource.

  router.post("/", (req, res) => {
    if (req.session.userId) {

    } else {
      util.httpError("POST /like failed:", "No session", res, 403);
    }
  });

  // DELETE /like
  //    Remove a like from a resource.

  router.delete("/", (req, res) => {
    if (req.session.userId) {

    } else {
      util.httpError("DELETE /like failed:", "No session", res, 403);
    }
  });

  return router;

};



