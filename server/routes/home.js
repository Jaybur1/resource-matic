// home.js
//
// Routes related to the home page.

const router = require("express").Router();

const util     = require("../util");
const database = require("../database");



module.exports = (db) => {

  router.get("/", (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      res.redirect("/");
    } else {
      database.getUserWithId(db, userId)
        .then((user) => {
          if (!user) {
            req.session = null;
            res.redirect("/");
          } else {
            util.renderView(res, "home", { user });
          }
        });
    }
  });

  return router;

};
