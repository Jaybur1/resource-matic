// ratings.js
//
// Routes related to resource ratings.

const router = require("express").Router();

const util = require("../util");



module.exports = (db) => {

  // GET /rating
  //    Gets ratings for a resource.
  // Arguments:
  //    resourceId   Integer: Resource ID of the average rating to retrieve.
  // Returns: {
  //   averageRating: <average_rating>
  // }

  router.get("/", (req, res) => {
    const userId     = req.session.userId;
    const resourceId = req.query.resourceId;
    if (!userId) {
      util.httpError("GET /rating failed:", "No session", res, 403);
    } else if (!resourceId) {
      util.httpError("GET /rating failed:", "Resource ID not specified", res, 400);
    } else {
      db.query("SELECT rating FROM ratings WHERE user_id = $1 AND resource_id = $2", [ userId, resourceId ])
        .then((ratingQueryRes) => {
          db.query("SELECT AVG(rating) FROM ratings WHERE resource_id = $1", [ resourceId ])
            .then((avgQueryRes) => {
              res.status(200).json({
                currentUserRating: (ratingQueryRes.rows.length === 1 ? ratingQueryRes.rows[0].rating : null),
                averageRating:     avgQueryRes.rows[0].avg
              });
            }).catch((err) => {
              util.httpError("GET /rating SELECT failed:", err, res, 500);
            });
        }).catch((err) => {
          util.httpError("GET /rating SELECT rating failed:", err, res, 500);
        });
    }
  });

  // POST /rating
  //    Add a rating to a resource.
  // Arguments:
  //    resourceId   Integer: Resource ID to add a rating for.
  //    rating       Integer: Rating value.
  // Returns: {
  //    Nothing.

  router.post("/", (req, res) => {
    const userId     = req.session.userId;
    const resourceId = req.body.resourceId;
    const rating     = req.body.rating;
    if (!userId) {
      util.httpError("POST /rating failed:", "No session", res, 403);
    } else if (!resourceId) {
      util.httpError("POST /rating failed:", "Resource ID not specified", res, 400);
    } else if (!rating) {
      util.httpError("POST /rating failed:", "Rating not specified", res, 400);
    } else {
      db.query("INSERT INTO ratings (user_id, resource_id, rating) VALUES ($1, $2, $3)", [ userId, resourceId, rating ])
        .then((_queryRes) => {
          res.status(200).end();
        }).catch((err) => {
          util.httpError("POST /rating INSERT failed:", err, res, 500);
        });
    }
  });

  // DELETE /rating
  //    Remove a rating from a resource.
  // Arguments:
  //    resourceId   Integer: Resource ID to delete a rating for.
  // Returns: {
  //    Nothing.

  router.delete("/", (req, res) => {
    const userId     = req.session.userId;
    const resourceId = req.body.resourceId;
    if (!userId) {
      util.httpError("DELETE /rating failed:", "No session", res, 403);
    } else if (!resourceId) {
      util.httpError("DELETE /rating failed:", "Resource ID not specified", res, 400);
    } else {
      db.query("DELETE FROM ratings WHERE user_id = $1 AND resource_id = $2", [ userId, resourceId ])
        .then((_queryRes) => {
          res.status(200).end();
        }).catch((err) => {
          util.httpError("DELETE /rating DELETE failed:", err, res, 500);
        });
    }
  });

  return router;

};



