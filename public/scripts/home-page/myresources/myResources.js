import { groupComments } from "../feed/feed.js";
import {
  getUserResources,
  getResourcesUserLiked,
  getResourcesUserCommented,
  getResourcesUserRated,
} from "./myResourcesCalls.js";

const handleClickedResource = () => {
  $(".open-resource-btn").on("click", function() {
    console.log(`<= resurce id#${$(this).attr("id")} has been clicked => `);
  });
};

const createCards = (createdResources) => {
  // Create html content for each resource
  const createdResourcesHTML = createdResources
    .map(
      (resource) => ` 
    <div class="ui card four wide column">
    <div class="blurring dimmable image custom-bk-white">
      <div class="ui dimmer">
        <div class="content">
          <div class="center">
          <a
            target="_blank"
            id =${resource.id}
            class="ui small inverted button open-resource-btn">
            Check Resource
            </a>
            </div>
          </div>
          </div>
        <img
          class="custom-image-padding"
          src="${resource.thumbnail_photo}"
        />
        </div>
      <div class="content custom-bk-grey">
        <a href="${resource.content}" target="_blank" class="ui sub header medium center aligned custom-hover-text-blue"
          >${resource.title}</a>
      </div>
    </div>
  `
    )
    .join(" ");

  return createdResourcesHTML;
};

const handleData = (data, container) => {
  const resourceArr = groupComments(data);
  if (resourceArr.length === 0) {
    $(`.${container}`).html(
      'No Resources yet ... <a class="ui create-new-resource">add</a>/comment/like/rate some to fill the sections</div>'
    );
  } else {
    $(`.${container}`).html(`${createCards(resourceArr)}`);
    $(".special.cards .image").dimmer({
      on: "hover",
    });
  }
  handleClickedResource();
};

const renderTabs = () => {
  const html = `
<div class="ui conteine">
<div class="ui top attached tabular menu">
  <div class="item tab active user-tab" data-tab="one"></a><i class="user tie icon"></i>Created</div>
  <div class="item tab like-tab" data-tab="two"><i class="heart icon"></i>Liked</div>
  <div class="item tab comment-tab" data-tab="three"><i class="comment icon"></i>Commented</div>
  <div class="item tab rate-tab" data-tab="four"><i class="star icon"></i>Rated</div>
</div>
<div class="ui bottom attached tab segment active" data-tab="one">
  <div class="user-resources ui special four doubling cards custom-resources custom-padding">No Resources yet ... <a class="ui create-new-resource">add</a> some to fill this section</div>
</div>
<div class="ui bottom attached tab segment" data-tab="two">
  <div class="liked-resources ui special four doubling cards custom-resources custom-padding">No Resources yet ... like some to fill this section</div>
</div>
<div class="ui bottom attached tab segment" data-tab="three">
  <div class="commented-resources ui special four doubling cards custom-resources custom-padding">No Resources yet ... comment some to fill this section</div>
</div>
<div class="ui bottom attached tab segment" data-tab="four">
  <div class="rated-resources ui special four doubling cards custom-resources custom-padding">No Resources yet ... rate some to fill this section</div>
</div>
</div>
`;
  return html;
};

const retrieveMyResources = () => {
  $("#home-page").html(renderTabs);
  $(".tabular.menu .item").tab();
  getUserResources().then((data) => {
    handleData(data, "user-resources");
  });

  getResourcesUserLiked().then((data) => {
    handleData(data, "liked-resources");
  });

  getResourcesUserCommented().then((data) => {
    handleData(data, "commented-resources");
  });

  getResourcesUserRated().then((data) => {
    handleData(data, "rated-resources");
  });
};

export default retrieveMyResources;
