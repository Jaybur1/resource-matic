import feedCardCreator from "./feed-card.js";
import { showMoreComments } from "./comments.js";
import { likeOnClick } from "./like.js";

// Function that retrieves feed resources and calls create feed function and listeners
const retrieveFeedResources = () => {
  // AJAX GET request
  $.ajax({method: "GET",
    url: "/resources",
    data: {likes: true, comments: true, avgRatings: true, users: true, sorts: {byLatest: true}}
  })
    .then((resp) => {
    // On request success call render function
      feedRenderer(resp);
    });
};

// Function that renders feed to home page
const feedRenderer = async(resources) => {
  // Clear main area of home page
  $("#home-page").empty();
  // Render feed
  $("#home-page").append(await feedCreator(resources));
  // Event listener for view more comments
  showMoreComments(3);
  // Event listener for like click
  likeOnClick();
};

// Function that creates feed html
const feedCreator = async(resources) => {
  // Group comments
  const groupedResources = groupComments(resources);
  const array = [];

  // Create array of cards html
  for (let i in groupedResources) {
    array.push(await feedCardCreator(groupedResources[i]));
  }

  // HTML for feed
  const feedHTML = `
  <div class="custom-feed">
    ${array.join(" ")}
  </div>`;

  return feedHTML;
};

// Function the groups comments by resource
export const groupComments = (unGroupedResources) => {
  let groupedResources = [];

  // Loops through comments and checks if present in grouped comments, then combines comments for same resource
  unGroupedResources.forEach(resource => {
    let detected = false;

    groupedResources.forEach(currentResource => {
      // Was found in grouped resources
      if (currentResource.id === resource.id) {
        // Adds new comment to same resource
        currentResource.comments.push({
          message: resource.comment,
          timestamp: resource.comment_created_at,
          name: resource.commenter,
          avatar: resource.commenter_avatar
        });
        detected = true;
      }
    });

    // Was not found in grouped resources
    if (!detected) {
      let commentsArray = [];
      
      // If there is a comment
      if (resource.comment) {
        // Adds comment to array
        commentsArray = [ {
          message: resource.comment,
          timestamp: resource.comment_created_at,
          name: resource.commenter,
          avatar: resource.commenter_avatar
        }];
      }

      // Push to grouped resources
      groupedResources.push({
        ...resource,
        comments: commentsArray
      });
    }
  });

  return groupedResources;
};

export default retrieveFeedResources;
