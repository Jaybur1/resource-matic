// landing-page.js
//
// Landing page support.

import retrieveMostPopularResources from "./landing-page/resource-cards.js";
import renderPlaceholderCards from "./landing-page/placeholder-cards.js";

// Function to run when page is ready
const onReady = () => {
  // Render placeholder cards
  renderPlaceholderCards();

  // Clear placeholder and render popular resource cards to page
  retrieveMostPopularResources();
};

// Run when page is ready
$(document).ready(onReady);