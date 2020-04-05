// landing-page.js
//
// Landing page support.

import retrieveMostPopularResources from "./landing-page/resource-cards.js";

// Function to run when page is ready
const onReady = () => {
  // Render popular resource cards to page
  retrieveMostPopularResources();
};

// Run when page is ready
$(document).ready(onReady);
