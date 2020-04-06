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
  APP_DESCRIPTION: "Fabulously gorgeous InterWeb application that holds all your favorite resources in one place!",
  APP_VERSION:     "4.2.0",
  APP_COPYRIGHT:   "2020 Ali Sayed, Doug Ross, Jay Burbyga - All Rights Reserved",
  APP_SITEICON:    "assets/images/kitty-typing.gif",

  // Salt rounds for bcrypt:
  SALT_ROUNDS:  10,

});



