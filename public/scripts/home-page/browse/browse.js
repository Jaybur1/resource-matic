import {createCards, handleClickedResource} from "../myresources/myResources.js";
import { showMoreComments, newComment, updateCommentsWithOwned, editComment, deleteComment } from "../feed/comments.js";
import { likeInteractions } from "../feed/like.js";
import { ratingInteractions } from "../feed/rating.js";
import { groupComments } from "../feed/feed.js";

const retrieveBrowseResources = () => {
  $("#home-page").empty();

  const browsePageHtml = `
  <div class="ui segment custom-browse-top">
    <h4>
      Categories:
    </h4>
  <div class="ui clearable multiple selection dropdown custom-category-dropdown">
    <input type="hidden" name="language" value="dutch,english,french">
    <i class="dropdown icon"></i>
    <div class="default text">Select Languages</div>
        <div class="menu">
          <div class="item">Arabic</div>
          <div class="item">Chinese</div>
          <div class="item">Danish</div>
          <div class="item">Dutch</div>
          <div class="item">English</div>
          <div class="item">French</div>
          <div class="item">German</div>
          <div class="item">Greek</div>
          <div class="item">Hungarian</div>
          <div class="item">Italian</div>
          <div class="item">Japanese</div>
          <div class="item">Korean</div>
          <div class="item">Lithuanian</div>
          <div class="item">Persian</div>
          <div class="item">Polish</div>
          <div class="item">Portuguese</div>
          <div class="item">Russian</div>
          <div class="item">Spanish</div>
          <div class="item">Swedish</div>
          <div class="item">Turkish</div>
          <div class="item">Vietnamese</div>
        </div>
    </div>
  </div>
  </div>
  <div class="ui bottom attached tab segment active">
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
};

// Function that retrieves feed resources and calls create feed function and listeners
const retrieveBrowseCards = () => {
  // AJAX GET request
  $.ajax({method: "GET",
    url: "/resources",
    data: {likes: true, comments: true, avgRatings: true, users: true, sorts: {byLatest: true}}
  })
    .then((resp) => {
    // On request success call render function
      cardsRenderer(resp);
    });
};

// Function that renders cards to home page
const cardsRenderer = async(resources) => {
  // Clear main area of home page
  $("#home-page").empty();
  // Render feed
  $("#home-page").append(await cardsCreator(resources));
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
};

// Function that creates cards html
const cardsCreator = async(resources) => {
  // Group comments
  const groupedResources = groupComments(resources);
  
  for (let i in groupedResources) {
    groupedResources[i].comments = await updateCommentsWithOwned(groupedResources[i].comments, groupedResources[i].id);
  }
    
  const cards = createCards(groupedResources);
  // const array = [];

  // // Create array of cards html
  // for (let i in groupedResources) {
  //   array.push(await feedCardCreator(groupedResources[i]));
  // }

  // // HTML for feed
  // const feedHTML = `
  // <div class="custom-feed">
  //   ${array.join(" ")}
  // </div>`;

  return feedHTML;
};

export default retrieveBrowseResources;