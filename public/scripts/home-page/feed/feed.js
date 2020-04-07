import feedCardCreator from "./feed-card.js";

// Function that retrieves most feed resources and calls create feed function
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
const feedRenderer = (resources) => {
  // Clear main area of home page
  $("#home-page").empty();
  // Render feed
  $("#home-page").append(feedCreator(resources));
};

// Function that creates feed html
const feedCreator = (resources) => {

  const feedHTML = `
  <div class="custom-feed">
    ${groupComments(resources).map(resource => feedCardCreator(resource)).join(" ")}
  </div>`;

  return feedHTML;
};

// Function the groups comments by resource
const groupComments = (unGroupedResources) => {
  let groupedResources = [];

  unGroupedResources.forEach(resource => {
    let detected = false;

    groupedResources.forEach(currentResource => {
      if (currentResource.id === resource.id) {
        currentResource.comments.push({
          message: resource.comment,
          timestamp: resource.comment_created_at,
          name: resource.commenter,
          avatar: resource.commenter_avatar
        });
        detected = true;
      }
    });

    if (!detected) {
      let commentsArray = [];
      

      if (resource.comment) {
        commentsArray = [ {
          message: resource.comment,
          timestamp: resource.comment_created_at,
          name: resource.commenter,
          avatar: resource.commenter_avatar
        }];
      }

      groupedResources.push({
        ...resource,
        comments: commentsArray
      });
    }
  });

  return groupedResources;
};

export default retrieveFeedResources;