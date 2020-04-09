// home-page.js
//
// home page support.

import retrieveFeedResources from "./home-page/feed/feed.js";
import toggleResourceMenu from "./home-page/home-page-helpers/toggleRescourseMenu.js";

$(document).ready(() => {
  // Scroll to top of page
  retrieveFeedResources();
  toggleResourceMenu();
  window.scroll(0, 0);
});
