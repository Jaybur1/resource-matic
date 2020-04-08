// categories.js
//
// Routes related to categories.

const router = require("express").Router();

const database = require("../database");

module.exports = (db) => {

  // GET /categories

  router.get("/", (_req, res) => {
    database.getCategories(db).then((data) => {
      res.send(data);
    });
  });

  // POST /categories

  router.post("/", (_req, res) => {
    const categoryName = _req.body.name.toLowerCase();
    database.getCategoriesWithName(categoryName,db).then(data => {
      if (!data) {
        database.addCategory(categoryName,db).then(data => res.send(data));
      } else {
        res.send(data);
      }
    });
  });

  return router;
};
