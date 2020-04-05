// resources.js
//
// Resource-related routes.

const express = require("express");
const router  = express.Router();

const { getResources } = require("../database");

const resourcesRoutes = (db) => {
  // Handle request resources
  router.get("/", (req, res) => {
    getResources(db, req.query)
      .then((resp) => {
        res.json(resp);
      });
  });

  return router;
};

module.exports = resourcesRoutes;
