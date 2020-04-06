// home.js
//
// Routes related to the home page.

const router = require("express").Router();

const util     = require("../util");
const database = require("../database");



module.exports = (db) => {

  router.get("/", (req, res) => {
    const userId = req.session.userId;
    if (userId) {
      database.getUserWithId(db, userId).then((user) => {
        util.renderView(res, "home", { user });
      });
    } else {
      res.redirect("/");
    }
  });

  return router;

};
