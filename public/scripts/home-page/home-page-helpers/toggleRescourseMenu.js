const toggler = (current) => {
  const list = document.querySelectorAll(".resource-links");
  list.forEach((elem) => {
    $(elem).removeClass("active");
    $(current).addClass("active");
  });
};

const toggleResourceMenu = () => {
  $(".my-resources-link").on("click", function() {
    toggler(this);
    window.location = `/home?page=${encodeURIComponent("my-resources")}`;
  });
  $(".feed-link").on("click", function() {
    toggler(this);
    window.location = `/home?page=${encodeURIComponent("feed")}`;
  });
  $(".browse-link").on("click", function() {
    toggler(this);
    window.location = `/home?page=${encodeURIComponent("browse")}`;
  });
  $(".popular-link").on("click", function() {
    toggler(this);
    window.location = `/home?page=${encodeURIComponent("popular")}`;
  });
};

export default toggleResourceMenu;

// function processAjaxData(response, urlPath){
//   document.getElementById("content").innerHTML = response.html;
//   document.title = response.pageTitle;
//   window.history.pushState({"html":response.html,"pageTitle":response.pageTitle},"", urlPath);
// }
