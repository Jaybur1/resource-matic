// home.js
//
// Routes related to the home page.

const express = require("express");
const router = express.Router();

const { getUserWithId } = require("../database");



module.exports = (db) => {
  router.get("/", (req, res) => {
    const userId = req.session.userId;
    if (userId) {
      getUserWithId(userId, db).then(user => {
        res.render("home", {
          user: user,
          err:  null
        });
      });
    } else {
      res.redirect("/");
    }
  });

  return router;
};
