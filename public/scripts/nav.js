// nav.js
//
// Navigation bar support.

import * as search from "./search.js";


const KEY_RETURN = 13;



// TODO: Move to app.js which imports everything else:
JSON.stringifyPretty = (object) => JSON.stringify(object, null, 2);

// Function that loads nav bar interactions
const initNavBar = () => {

  const $inputSearch = $("nav .custom-search-bar input");

  // Perform search on pressing Enter or clicking search icon
  $inputSearch.on("keypress", function(event) {
    if (event.keyCode === KEY_RETURN) {
      search.resources($inputSearch.val());
    }
  });

  $("nav .custom-search-bar i.search").on("click", function(_event) {
    search.resources($inputSearch.val());
  });

  // toggle modal on click
  $(".browse").on("click", function() {
    if ($(".custom-popup").hasClass("visible")) {
      $(".custom-popup").removeClass("visible").addClass("hidden");
      $(".browse").removeClass("active");
    } else {
      $(".custom-popup").removeClass("hidden").addClass("visible");
      $(".browse").addClass("active");
    }
  });

  // close modal when user clicks anywhere outside modal
  $("body").on("click", function(e) {
    if (!e.target.classList.contains("custom-no-close")) {
      $(".custom-popup").removeClass("visible").addClass("hidden");
      $(".browse").removeClass("active");
    }
  });

  search.searchOnMobile();
};

// Run when page is ready
$(document).ready(initNavBar);
