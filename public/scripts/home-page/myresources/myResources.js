import toggleResourceMenu from "../home-page-helpers/toggleRescourseMenu.js";


const getUserResources = () => {
  return $.ajax({
    method: "get",
    url: "/resources",

    success: (data, _status, _xhr) => {
      return data;
    },
  });
}

const renderTabs = () => {
  const html = `
<div class="ui top attached tabular menu">
  <div class="item active" data-tab="one"><i class="user tie icon"></i>Created</div>
  <div class="item" data-tab="two"><i class="heart icon"></i>Liked</div>
  <div class="item" data-tab="three"><i class="comment icon"></i>Commented</div>
  <div class="item" data-tab="four"><i class="star icon"></i>Rated</div>
</div>
<div class="ui bottom attached tab segment active" data-tab="one">
  <div class="user-resurces">No Resources yet ... <a>add</a> some to fill this section</div>
</div>
<div class="ui bottom attached tab segment" data-tab="two">
  <div class="liked-resurces">No Resources yet ... like some to fill this section</div>
</div>
<div class="ui bottom attached tab segment" data-tab="three">
  <div class="commented-resurces">No Resources yet ... comment some to fill this section</div>
</div>
<div class="ui bottom attached tab segment" data-tab="four">
  <div class="rated-resurces">No Resources yet ... rate some to fill this section</div>
</div>
`;



  return html;
};

const retrieveMyResources = () => {
  $(".my-resources-link").on("click", function() {
    toggleResourceMenu(this);
    $('#home-page').html(renderTabs)
  });
};

export default retrieveMyResources;
