// nav.js
//
// Navigation bar support.

// TODO: Move to app.js which imports everything else:
JSON.stringifyPretty = (object) => JSON.stringify(object, null, 2);

// Function that loads nav bar interactions
const navBarInteractions = () => {
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
};

// Function to run when page is ready
const onReady = () => {
  navBarInteractions();
};

// Run when page is ready
$(document).ready(onReady);
