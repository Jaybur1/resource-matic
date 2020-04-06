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

  // App info:
  APP_NAME:        "Resource-O-Matic",
  APP_DESCRIPTION: "Fabulously gorgeous InterWeb application.",
  APP_VERSION:     "4.2.0",

  // Salt rounds for bcrypt:
  SALT_ROUNDS:  10,

});



