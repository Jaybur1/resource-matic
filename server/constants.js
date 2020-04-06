// constants.js
//
// Constants!
//
// e.g. const c = require(./"constants");
//
//  If the constant is environment-related, put it in .env.



module.exports = Object.freeze({

  // Default port to listen on:
  //  Overridden by APP_PORT in .env.
  DEFAULT_PORT: 3000,
  // Name of the app:
  APP_NAME:     "Resource-O-Matic",
  // Salt rounds for bcrypt:
  SALT_ROUNDS:  10,

});



