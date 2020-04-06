// nav.js
//
// Navigation bar support.

// Function that loads nav bar interactions
const navBarInteractions = () => {
  $(".browse").on("mouseover", function() {
    $(".custom-popup").removeClass("hidden").addClass("visible");
  });
};

// Function to run when page is ready
const onReady = () => {
  console.log("reahced");
  navBarInteractions();
};

// Run when page is ready
$(document).ready(onReady);