import renderCards from "./landing-page/resource-cards.js";

// Function to run when page is ready
const onReady = () => {
  // Render popular resource cards to page
  renderCards();
};

// Run when page is ready
$(document).ready(onReady);