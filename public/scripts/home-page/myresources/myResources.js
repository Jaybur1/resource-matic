import { groupComments } from "../feed/feed.js";
import {
  getUserResources,
  getResourcesUserLiked,
  getResourcesUserCommented,
  getResourcesUserRated,
  getCurrentUser,
  deleteResource,
} from "./myResourcesCalls.js";
import feedCardCreator from "../feed/feed-card.js";
import { showMoreComments, newComment, editComment, deleteComment } from "../feed/comments.js";
import { likeInteractions } from "../feed/like.js";
import { ratingInteractions } from "../feed/rating.js";

const deleteModal = `
<div class="ui basic modal deleteModal">
<div class="ui icon header">
<i class="trash alternate icon"></i>
  Delete This Resource
</div>
<div class="content custom-delete-message">
  <p>Are you sure you want to do that?</p>
</div>
<div class="actions">
  <div class="ui red basic cancel inverted button">
    <i class="remove icon"></i>
    No
  </div>
  <div class="ui green ok inverted button yes-delete" onClick ="">
    <i class="checkmark icon"></i>
    Yes
  </div>
</div>
</div>
`

export const handleClickedResource = () => {
  $(".custom-delete").on("click", function () {
    const resourceId = $(this).attr('resource');
    console.log(resourceId)
    $(deleteModal).modal("show");
    $('.yes-delete').on('click',()=>{
      deleteResource(resourceId).then(data=> console.log(data))
    })
  });


  $(".open-resource-btn").on("click", function () {
    const id = $(this).attr("id");
    // ! Order here is very important for functionality
    // Show all small cards
    $(`.custom-small-card-hidden`).removeClass("custom-small-card-hidden");
    // Hide all big cards
    $(`.custom-card-show`).addClass("custom-card-hidden");
    $(`.custom-card-show`).removeClass("custom-card-show");
    // Show selected big card
    $(`.resourceId-${id}`).removeClass("custom-card-hidden");
    $(`.resourceId-${id}`).addClass("custom-card-show");
    // Hide selected small card
    $(`.small-card${id}`).addClass("custom-small-card-hidden");

    // Change appearance of tab
    $(".container-effect").addClass("custom-modal-grey");
    //  !
  });

  $(".container-effect").on("click", function (e) {
    if (
      e.target.classList.contains("user-resources") ||
      e.target === e.currentTarget
    ) {
      // Show all small cards
      $(`.custom-small-card-hidden`).removeClass("custom-small-card-hidden");
      // Hide all big cards
      $(`.custom-card-show`).addClass("custom-card-hidden");
      $(".container-effect").removeClass("custom-modal-grey");
    }
  });
};

export const createCards = async (createdResources, ownerId = null) => {
  // Create html content for each resource
  const createdResourcesHTML = [];
  
  for (let resource of createdResources) {
    
    const bigCard = await feedCardCreator(resource);
    createdResourcesHTML.push(`
      <div class="ui card custom-width-fit small-card${resource.id}">
      <div class="blurring dimmable image custom-bk-white">
        <div class="ui dimmer">
          <div class="content">
          ${
            ownerId === resource.user_id
            ? `<i resource="${resource.id}" class="trash alternate outline icon custom-delete"></i>`
            : ''
          }
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
          <a href="${
            resource.content
          }" target="_blank" class="ui sub header medium center aligned custom-hover-text-blue"
            >${resource.title}</a>
        </div>
      </div>
      <div class="ui custom-card-hidden resourceId-${resource.id}">
      ${bigCard}
      </div>
    `);
  }

  return createdResourcesHTML;
};
const handleData = async (data, container) => {
  const current = await getCurrentUser();

  const resourceArr = groupComments(data);
  if (resourceArr.length === 0) {
    $(`.${container}`).html(
      'No Resources yet ... <a class="ui create-new-resource">add</a>/comment/like/rate some to fill the sections</div>'
    );
  } else {
    $(`.${container}`).html(await createCards(resourceArr, current.current));
    $(".special.cards .image").dimmer({
      on: "hover",
    });
    handleClickedResource();
    // Event listener for view more comments
    showMoreComments(3);
    // Event listener for new comment
    newComment();
    // Event listener for edit comment
    editComment();
    // Event listener for edit comment
    deleteComment();
    // Event listener for like click
    likeInteractions();
    // Event listener for like rating
    ratingInteractions();
  }
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
<div class="container-effect ui bottom attached tab segment active" data-tab="one">
  <div class="user-resources ui special cards custom-resources custom-grid-resources">
  <i class="asterisk loading icon"></i>Loading resources...
  </div>
</div>
<div class="container-effect ui bottom attached tab segment" data-tab="two">
  <div class="liked-resources ui special four doubling cards custom-resources custom-padding"> 
   <i class="asterisk loading icon"></i>Loading resources...
   
   </div>
</div>
<div class="container-effect ui bottom attached tab segment" data-tab="three">
  <div class="commented-resources ui special four doubling cards custom-resources custom-padding">
  <i class="asterisk loading icon"></i>Loading resources...
  </div> 
</div>
<div class="container-effect ui bottom attached tab segment" data-tab="four">
  <div class="rated-resources ui special four doubling cards custom-resources custom-padding">
  <i class="asterisk loading icon"></i>Loading resources...
  </div>
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

  // getResourcesUserLiked().then((data) => {
  //   handleData(data, "liked-resources");
  // });

  // getResourcesUserCommented().then((data) => {
  //   handleData(data, "commented-resources");
  // });

  // getResourcesUserRated().then((data) => {
  //   handleData(data, "rated-resources");
  // });
};

export default retrieveMyResources;
