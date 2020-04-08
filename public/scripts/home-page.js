// home-page.js
//
// home page support.

import retrieveFeedResources from "./home-page/feed/feed.js";
import toggleResourceMenu from "./home-page/home-page-helpers/toggleRescourseMenu.js";

$(document).ready(() => {
  retrieveFeedResources();
  toggleResourceMenu();
});
