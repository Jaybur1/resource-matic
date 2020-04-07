// resources.js
//
// Resource-related routes.

const router = require("express").Router();

const database = require("../database");



const resourcesRoutes = (db) => {

  // Handle request resources
  router.get("/", (req, res) => {
    database.getResources(db, req.query)
      .then((queryRes) => res.json(queryRes));
  });

  // Handle create new resource
  router.post("/", (req, res) => {
    database.addResource(db, { userId: req.session.userId, ...req.body })
      .then(resource => res.send(resource));
  });

  return router;

};



module.exports = resourcesRoutes;
