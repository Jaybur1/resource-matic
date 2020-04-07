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

const toggleTabs = () => {
  $('.tabular.menu .item').tab();
}
const renderTabs = () => {
  const html = `
<div class="ui conteiner">
<div class="ui top attached tabular menu">
  <div class="item tab active" data-tab="one"></a><i class="user tie icon"></i>Created</div>
  <div class="item tab" data-tab="two"><i class="heart icon"></i>Liked</div>
  <div class="item tab" data-tab="three"><i class="comment icon"></i>Commented</div>
  <div class="item tab" data-tab="four"><i class="star icon"></i>Rated</div>
</div>
<div class="ui bottom attached tab segment active" data-tab="one">
  <div class="user-resurces">No Resources yet ... <button class="ui button pink create-new-resource">add</button> some to fill this section</div>
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
</div>
`;



  return html;
};

const retrieveMyResources = () => {
  $(".my-resources-link").on("click", function() {
    $('#home-page').html(renderTabs);
    $('.tabular.menu .item').tab();
    toggleResourceMenu(this);
  });
};

export default retrieveMyResources;
