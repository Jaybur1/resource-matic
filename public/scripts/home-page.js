// home-page.js
//
// home page support.

import retrieveFeedResources from "./home-page/feed/feed.js";
import toggleResourceMenu from "./home-page/home-page-helpers/toggleRescourseMenu.js";
import { search } from "./search.js";


$(document).ready(() => {
  // Handle width
  widthHandle();

  // Scroll to top of page
  window.scroll(0, 0);

  // Search param
  const searchFor = new URL(window.location).searchParams.get("search");
  
  // If there is a search param
  if (searchFor) {
    // Render search results
    search(searchFor);
  } else {
    // Render feed
    retrieveFeedResources();
  }
  
  // Event listener for menu
  toggleResourceMenu();

  // Window resize event listener
  $(window).on("resize", function() {
    widthHandle();
  });
});

// Function the handles responsiveness of home menu
const widthHandle = () => {
  if ($(window).width() >= 992) {
    $(".custom-right-menu").addClass("vertical").removeClass("fluid five item");
  } else {
    $(".custom-right-menu").removeClass("vertical").addClass("fluid five item");
  }
};