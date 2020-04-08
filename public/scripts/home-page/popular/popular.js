import {
  createCards,
  handleClickedResource,
} from "../myresources/myResources.js";
import { groupComments } from "../feed/feed.js";
import { showMoreComments, newComment } from "../feed/comments.js";
import { likeInteractions } from "../feed/like.js";
import { ratingInteractions } from "../feed/rating.js";

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
  getPopularResources()
    .then((data) => {
      console.log(groupComments(data));
      return createCards(groupComments(data));
    })
    .then((data) => {
      $("#home-page").html(
        `<div class="custom-popular-padding container-effect segment user-resources ui special cards custom-resources custom-padding custom-grid-resources">${data.join(
          ""
        )}</div>`
      );
      $(".special.cards .image").dimmer({
        on: "hover",
      });
      handleClickedResource();
      // Event listener for view more comments
      showMoreComments(3);
      // Event listener for new comment
      newComment();
      // Event listener for like click
      likeInteractions();
      // Event listener for like rating
      ratingInteractions();
    });
};

export default retrievePopularResources;
