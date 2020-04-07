import toggleResourceMenu from "../home-page-helpers/toggleRescourseMenu.js";
import { groupComments } from "../feed/feed.js";


const createCards = (createdResources,insertInto) => {
  // Create html content for each resource
  const createdResourcesHTML = createdResources.map(resource => ` 
    <div class="ui card four wide column">
    <div class="blurring dimmable image custom-bk-white">
      <div class="ui dimmer">
        <div class="content">
          <div class="center">
          <a
          href="http://${resource.content}"
            target="_blank"
            class="ui small inverted button">
            Check Resource
            </a>
            </div>
          </div>
          </div>
        <img
          class=""
          src="${resource.thumbnail_photo}"
        />
        </div>
      <div class="content custom-bk-grey">
        <a href="http://${resource.content}" target="_blank" class="ui sub header tiny center aligned custom-hover-text-blue"
          >${resource.title}</a>
      </div>
    </div>
  `).join(" ");


  return createdResourcesHTML;
};

const getUserResources = () => {
  return $.ajax({
    method: "get",
    url: "/resources",
    data: {
      currentUser: true,
      comments: true,
      likes: true,
      ratings: true,
      sort: { byLatest: true },
      limit:50,
    },
    success: (data, _status, _xhr) => {
      return data;
    },
  });
};

const toggleTabs = () => {
  $(".tabular.menu .item").tab();
};

const renderTabs = () => {
  const html = `
<div class="ui conteine">
<div class="ui top attached tabular menu">
  <div class="item tab active" data-tab="one"></a><i class="user tie icon"></i>Created</div>
  <div class="item tab" data-tab="two"><i class="heart icon"></i>Liked</div>
  <div class="item tab" data-tab="three"><i class="comment icon"></i>Commented</div>
  <div class="item tab" data-tab="four"><i class="star icon"></i>Rated</div>
</div>
<div class="ui bottom attached tab segment active" data-tab="one">
  <div class="user-resources ui special four doubling cards custom-resources">No Resources yet ... <a class="ui create-new-resource">add</a> some to fill this section</div>
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


getUserResources().then(data => {
  const resourceArr = groupComments(data);
  if(resourceArr.length === 0){
    $('.user-resources').html('No Resources yet ... <a class="ui create-new-resource">add</a> some to fill this section</div>')
  }
  $('.user-resources').html(`${createCards(resourceArr)}`)
  $('.special.cards .image').dimmer({
    on: 'hover'
  });
});
  return html;
};

const retrieveMyResources = () => {
  $(".my-resources-link").on("click", function () {
    $("#home-page").html(renderTabs);

    $(".tabular.menu .item").tab();
    toggleResourceMenu(this);
  });
};

export default retrieveMyResources;
