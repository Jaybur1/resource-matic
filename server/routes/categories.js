// categories.js
//
// Routes related to categories.

const router = require("express").Router();
const bcrypt = require("bcrypt");

const util = require("../util");
const database = require("../database");

module.exports = (db) => {
  // GET /user/login

  router.get("/", (_req, res) => {
    database.getAllCategories(db).then((data) => {
      res.send(data);
    });
  });

  return router;
};
