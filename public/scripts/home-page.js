// home-page.js
//
// home page support.

import retrieveFeedResources from "./home-page/feed/feed.js";
import toggleResourceMenu from "./home-page/home-page-helpers/toggleRescourseMenu.js";
import { search } from "./search.js";
import retrieveMyResources from "./home-page/myresources/myResources.js";
import retrievePopularResources from "./home-page/popular/popular.js";
import retrieveBrowseResources from "./home-page/browse/browse.js";

$(document).ready(() => {
  // Handle width
  widthHandle();
  // Scroll to top of page
  window.scroll(0, 0);

  const searchFor = new URL(window.location).searchParams.get("search");
  const page = new URL(window.location).searchParams.get("page");

  if (searchFor) {
    search(searchFor[0]);
  } else {
    switch (page) {
    case "feed":
      $(".feed-link").addClass("active");
      // Render feed
      retrieveFeedResources();
      break;
    case "browse":
      $(".browse-link").addClass("active");
      // Render feed
      retrieveBrowseResources();
      break;
    case "popular":
      $(".popular-link").addClass("active");
      // Render feed
      retrievePopularResources();
      break;
    case "my-resources":
      $(".my-resources-link").addClass("active");
      // Render feed
      retrieveMyResources();
      break;
    default:
      // Render feed
      retrieveFeedResources();
      break;
    }
  }

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