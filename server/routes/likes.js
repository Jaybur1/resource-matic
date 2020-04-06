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



