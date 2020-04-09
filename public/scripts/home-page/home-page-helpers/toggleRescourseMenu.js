import retrieveMyResources from "../myresources/myResources.js";
import retrieveFeedResources from "../feed/feed.js";
import retrievePopularResources from "../popular/popular.js";
import retrieveBrowseResources from "../browse/browse.js";

const toggler = (current) => {
  const list = document.querySelectorAll(".resource-links");
  list.forEach((elem) => {
    $(elem).removeClass("active");
    $(current).addClass("active");
  });
  
  // Clear params if any
  window.history.pushState({}, document.title, "/home");

  // scroll to top of page
  window.scroll(0, 0);
};

const toggleResourceMenu = () => {
  $(".my-resources-link").on("click", function() {
    toggler(this);
    retrieveMyResources();
  });
  $(".feed-link").on("click", function() {
    toggler(this);
    retrieveFeedResources();
  });
  $(".browse-link").on("click", function() {
    toggler(this);
    retrieveBrowseResources();
  });
  $(".popular-link").on("click", function() {
    toggler(this);
    retrievePopularResources();
  });
  $(".favorites-link").on("click", function() {
    toggler(this);
  });
};

export default toggleResourceMenu;
