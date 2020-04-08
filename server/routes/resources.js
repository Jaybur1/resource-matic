// resources.js
//
// Resource-related routes.

const router = require("express").Router();

const database = require("../database");



const resourcesRoutes = (db) => {

  // TODO: Add error handling

  // Request resources
  router.get("/", (req, res) => {

    if (req.query.currentUser) {
      const userId = req.session.userId;
      database.getResources(db, {...req.query, currentUser: Number(userId)})
        .then((queryRes) => res.json(queryRes));
    } else {
      database.getResources(db, req.query)
        .then((queryRes) => res.json(queryRes));
    }
  });

  // Create a new resource
  router.post("/", (req, res) =>
    database.addResource({ userId: req.session.userId, ...req.body }, db)
      .then((resource) => res.send(resource)));

  // Search resources
  router.get("/search", (req, res) =>
    database.searchResources(db, req.query.searchText)
      .then((results) => res.render("partials/_card-grid", {
        header: `Search results for ${req.query.searchText}`,
        cardData: results
      })));

  router.delete('/', (req,res) => {
    res.send("good")
  })

  return router;

};



module.exports = resourcesRoutes;
