// home-page.js
//
// home page support.

import retrieveFeedResources from "./home-page/feed/feed.js";
import retrieveMyResources from "./home-page/myresources/myResources.js";

$(document).ready(() => {
  retrieveFeedResources();
  retrieveMyResources();
});
