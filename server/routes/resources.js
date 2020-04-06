// resources.js
//
// Resource-related routes.

const express = require("express");
const router  = express.Router();

const database = require("../database");



const resourcesRoutes = (db) => {
  // Handle request resources
  router.get("/", (req, res) => {
    database.getResources(db, req.query)
      .then((resp) => {
        res.json(resp);
      });
  });

  return router;
};

module.exports = resourcesRoutes;
