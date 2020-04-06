// categories.js
//
// Routes related to categories.

const router = require("express").Router();
const bcrypt = require("bcrypt");

const util = require("../util");
const database = require("../database");

module.exports = (db) => {
  // GET /categories

  router.get("/", (_req, res) => {
    database.getCategories(db).then((data) => {
      res.send(data);
    });
  });

  router.post("/"), (_req, res) => {
    const categoryName = _req.body.name
    database.getCategoriesWithName(categoryName,db).then(data => {
      console.log(data);
    })
  }

  return router;
};
