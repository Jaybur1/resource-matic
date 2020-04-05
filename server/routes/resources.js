// resources.js
//
// Resource-related routes.

const express = require("express");
const router  = express.Router();

const resourcesRoutes = (db) => {
  // Handle request resources
  router.get("/", (req, res) => {
    console.log(req.query);
  });

  return router;
};

module.exports = resourcesRoutes;
