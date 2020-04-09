import {
  handleClickedResource,
} from "../myresources/myResources.js";
import {
  showMoreComments,
  newComment,
  editComment,
  deleteComment,
} from "../feed/comments.js";
import { likeInteractions } from "../feed/like.js";
import { ratingInteractions } from "../feed/rating.js";
import { cardsCreator } from "../browse/browse.js";
import { createPlaceholderCards } from "../../landing-page/placeholder-cards.js";

const getPopularResources = () => {
  // AJAX GET request
  return $.ajax({
    method: "GET",
    url: "/resources",
    data: {
      users: true,
      comments: true,
      likes: true,
      avgRatings: true,
      sorts: { byMostPopular: true },
    },
  }).then((resp) => {
    // On request success call render function
    return resp;
  });
};


const retrievePopularResources = () => {
  $("#home-page").html(`<div class="ui segment container-effect">
      <div class="user-resources ui special cards custom-resources custom-grid-resources">
        ${createPlaceholderCards()}
      </div>
    </div>`);
  getPopularResources()
    .then((data) => {
      return cardsCreator(data);
    })
    .then((data) => {
      $("#home-page").html(`<div class="ui segment container-effect">
      <div class="user-resources ui special cards custom-resources custom-grid-resources">
        ${data.join(" ")}
      </div>
    </div>`);
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
    });
};

export default retrievePopularResources;
