// util.js
//
// General utility helper functions.

const bcrypt = require("bcrypt");

const c = require("./constants");



process.env.development = (process.env.ENV.substring(0, 3) === "dev");
process.env.testing     = (process.env.ENV.substring(0, 4) === "test");
process.env.production  = (process.env.ENV.substring(0, 4) === "prod");



// renderView renders an EJS view with default template arguments added.

const renderView = function(res, view, args) {
  if (!args) {
    args = {};
  }
  if (!args.app) {
    args.app = {};
  }
  args.app.name        = c.APP_NAME;
  args.app.description = c.APP_DESCRIPTION;
  args.app.version     = c.APP_VERSION;
  // Just in case someone tries to sneak some sensitive data to the client:
  if (args.user) {
    delete args.user.id;
    delete args.user.password;
  }
  res.render(view, args);
};

// httpError logs an error and returns an HTTP status.

const httpError = function(logMessage, err, res, httpStatus) {
  console.log(logMessage, err);
  res.status(httpStatus).end();
};

// hashPassword hashes a password with bcrypt.

const hashPassword = function(password) {
  return bcrypt.hash(password, c.SALT_ROUNDS);
};



module.exports = { renderView, httpError, hashPassword };



