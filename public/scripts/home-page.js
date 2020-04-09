// home-page.js
//
// home page support.

import retrieveFeedResources from "./home-page/feed/feed.js";
import toggleResourceMenu from "./home-page/home-page-helpers/toggleRescourseMenu.js";

$(document).ready(() => {
  // Handle width
  widthHandle();
  // Scroll to top of page
  window.scroll(0, 0);
  // Render feed
  retrieveFeedResources();
  // Event listener for menu
  toggleResourceMenu();

  $(window).on("resize", function() {
    widthHandle();
  });
});

const widthHandle = () => {
  if ($(window).width() >= 992) {
    $(".custom-right-menu").addClass("vertical").removeClass("fluid five item");
  } else {
    $(".custom-right-menu").removeClass("vertical").addClass("fluid five item");
  }
};