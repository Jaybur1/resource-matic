// categories.js
//
// Routes related to categories.

const router = require("express").Router();

const database = require("../database");



module.exports = (db) => {

  // GET /categories

  router.get("/", (_req, res) => {
    database.getCategories(db).then((data) => res.send(data));
  });

  // POST /categories

  router.post("/", (req, res) => {
    const categoryName = req.body.name.toLowerCase();
    database.getCategoriesWithName(db, categoryName).then(data => {
      if (!data) {
        database.addCategory(db, categoryName).then(data => res.send(data));
      } else {
        res.send(data);
      }
    });
  });

  return router;

};
