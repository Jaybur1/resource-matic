import {createCards, handleClickedResource} from "../myresources/myResources.js";
import { showMoreComments, newComment, updateCommentsWithOwned, editComment, deleteComment } from "../feed/comments.js";
import { likeInteractions } from "../feed/like.js";
import { ratingInteractions } from "../feed/rating.js";
import { groupComments } from "../feed/feed.js";
import { getCategories, capitalize } from "../../new-resource.js";

const retrieveBrowseResources = async() => {
  $("#home-page").empty();

  const categories = await getCategories();
  console.log("retrieveBrowseResources -> categories", categories);

  let categoryOptionsHtml = "";
  
  for (let category of categories) {
    categoryOptionsHtml += `
    <div class="item">${capitalize(category.name)}</div>
    `;
  }


  const browsePageHtml = `
  <div class="ui segment custom-browse-top">
    <h4>
      Categories:
    </h4>
  <div class="ui clearable multiple selection dropdown custom-category-dropdown">
    <input type="hidden" name="language" value="">
    <i class="dropdown icon"></i>
    <div class="default text">Select Categories</div>
        <div class="menu">
          ${categoryOptionsHtml}
        </div>
    </div>
  </div>
  </div>
  <div class="ui segment container-effect">
    <div
      class="user-resources ui special cards custom-resources custom-grid-resources"
    ></div>
  </div>
  `;

  $("#home-page").append(browsePageHtml);

  $('.custom-category-dropdown.ui.dropdown')
    .dropdown({
      allowAdditions: true
    })
  ;

  retrieveBrowseCards(["tech", "global"]);
};

// Function that retrieves feed resources and calls create feed function and listeners
const retrieveBrowseCards = (categories) => {
  // AJAX GET request
  $.ajax({method: "GET",
    url: "/resources",
    data: {
      comments: true,
      likes: true,
      avgRatings: true,
      categories,
      users: true
    }
  })
    .then((resp) => {
    // On request success call render function
      cardsRenderer(resp);
    });
};

// Function that renders cards to home page
const cardsRenderer = async(resources) => {
  // Clear main area of home page
  $(".user-resources").empty();
  // Render feed
  $(".user-resources").append(await cardsCreator(resources));
  // Handles clicking resources
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

  $(".special.cards .image").dimmer({
    on: "hover",
  });
};

// Function that creates cards html
const cardsCreator = async(resources) => {
  // Group comments
  const groupedResources = groupComments(resources);
  
  for (let i in groupedResources) {
    groupedResources[i].comments = await updateCommentsWithOwned(groupedResources[i].comments, groupedResources[i].id);
  }
    
  const cards = createCards(groupedResources);

  return cards;
};

export default retrieveBrowseResources;