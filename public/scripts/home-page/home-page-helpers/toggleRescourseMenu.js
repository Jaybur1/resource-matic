import retrieveMyResources from "../myresources/myResources.js";
import retrieveFeedResources from "../feed/feed.js";

const toggler = (current) => {
  const list = document.querySelectorAll(".resource-links");
  list.forEach((elem) => {
    $(elem).removeClass("active");
    $(current).addClass("active");
  });
};

const toggleResourceMenu = () => {
  $(".my-resources-link").on("click", function () {
    toggler(this);
    retrieveMyResources();
  });
  $(".feed-link").on("click", function () {
    toggler(this);
    retrieveFeedResources();
  });
  $(".browse-link").on("click", function () {
    toggler(this);
  });
  $(".popular-link").on("click", function () {
    toggler(this);
  });
  $(".favorites-link").on("click", function () {
    toggler(this);
  });
};

export default toggleResourceMenu;
