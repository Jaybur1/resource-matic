// resources.js
//
// Resource-related routes.

const router = require("express").Router();

const database = require("../database");



const resourcesRoutes = (db) => {

  // Handle request resources
  router.get("/", (req, res) => {

    if (req.query.currentUser) {
      const user_id = req.session.userId;
      console.log(user_id);
      database.getResources(db, {...req.query, currentUser: Number(user_id)})
        .then((queryRes) => {
          console.log(queryRes)
          res.json(queryRes)});
    } else {
      database.getResources(db, req.query)
        .then((queryRes) => res.json(queryRes));
    }
  });

  // Handle create new resource
  router.post("/", (req, res) => {
    database.addResource({ userId: req.session.userId, ...req.body }, db)
      .then(resource => res.send(resource));
  });

  return router;

};



module.exports = resourcesRoutes;
