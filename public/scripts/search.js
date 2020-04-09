// search.js
//
// Client-side search support.

import * as feed        from "./home-page/feed/feed.js";
import * as comments    from "./home-page/feed/comments.js";
import * as myResources from "./home-page/myresources/myResources.js";
import { showMoreComments, newComment, editComment, deleteComment } from "./home-page/feed/comments.js";
import { likeInteractions } from "./home-page/feed/like.js";
import { ratingInteractions } from "./home-page/feed/rating.js";

// search.results performs an AJAX request for search data.

export const resources = (searchText) => {

  searchText = searchText.trim();
  if (new URL(window.location).pathname !== "/home") {
    window.location = `/home?search=${encodeURIComponent(searchText)}`;
  } else {

    // TODO: Cancel loading feed

    $.ajax({
      method: "GET",
      //url:    "/resources/search",
      url:    "/resources/searchwtf",
      data:   {
        searchText
      }
    }).then(async(data, _status, _xhr) => {
      console.log("GET /resources/searchwtf");
      //renderSearchResults($("main section#home-page"), data);
      const groupedResources = feed.groupComments(data);
      for (const resource of groupedResources) {
        resource.comments = await comments.updateCommentsWithOwned(resource.comments, resource.id);
      }
      myResources.createCards(groupedResources)
        .then((cardsHtml) => {
          $("main section#home-page").html(
            `<div class="ui large purple header">` +
              `Search results for "${searchText}"` +
            `</div>` +
            `<div class="ui segment container-effect">` +
              `<div class="user-resources ui special cards custom-resources custom-grid-resources">` +
              cardsHtml.join("") +
              `</div>` +
            `</div>`)
            .find(".special.cards .image").dimmer({
              on: "hover",
            });
          myResources.handleClickedResource();
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
    }).catch((xhr, _status, _message) => console.log(xhr)); // handleXhrError(xhr));
  }
};



const renderSearchResults = ($container, resources) => {
  renderCards($container, resources, ($newCard, resource) => {
    $newCard.find("a.open-resource-btn").attr("id", resource.id);
    $newCard.find("img").attr("src",                resource.thumbnail_photo);
    $newCard.find("a.header").attr("href",          resource.content).html(resource.title);
    $newCard.find(".image a.button").attr("href",   resource.content);
    return $newCard;
  });
};



const renderCards = ($container, cardGrid, callback) => {
  // Add the EJS render to the container:
  //    The card data are stored as JSON in the "card-data" attribute of the top-level element
  //    (see views/partials/_card-grid.ejs).
  $container.html(cardGrid);
  // Get the card template and inner card container that comes with it:
  const $cardTemplate  = $container.find("div.card");
  $cardTemplate.find("div.dimmable image").dimmer({ on: "hover" });
  const $cardContainer = $container.find("div.custom-resources");
  // Clear the template from the card container:
  $cardContainer.empty();
  // Add cards for each resource:
  JSON.parse($container.find("[card-data]").attr("card-data")).forEach((card) => {
    const $newCard = $cardTemplate.clone(true);
    $newCard.find(".image").dimmer({ on: "hover" });
    $cardContainer.append(callback($newCard, card));
  });
};



