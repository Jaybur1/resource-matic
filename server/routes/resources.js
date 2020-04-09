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
        .then((queryRes) => {
          queryRes.forEach((resource) => {
            resource.currentUser = (resource.user_id === req.session.userId);
            // delete resource.user_id;
          });
          console.log(queryRes);
          res.json(queryRes);
        });
    } else {
      database.getResources(db, req.query)
        .then((queryRes) => res.json(queryRes));
    }
  });

  // Create a new resource
  router.post("/", (req, res) =>
    database.addResource({ userId: req.session.userId, ...req.body }, db)
      .then((resource) => res.send(resource)));


  // Delete a resource
  router.delete('/', (req,res) => {
    const resourceId = req.body.resourceId;
    database.deleteResource(resourceId, db).then(data => {
      res.json(data);
    });
  });

  // Search resources
  router.get("/search", (req, res) =>
    database.searchResources(db, req.query.searchText)
      .then((results) => res.json(results)));
  // .then((results) => res.render("partials/_search-results", {
  //   searchText: req.query.searchText,
  //   cardData:   results
  // })));

  // Search resources with craziness
  router.get("/searchwtf", (req, res) =>
    database.searchResourcesWtf(db, req.query.searchText)
      .then((results) => res.json(results)));


  return router;

};



module.exports = resourcesRoutes;
