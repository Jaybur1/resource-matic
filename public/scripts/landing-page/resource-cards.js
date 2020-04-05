// resource-cards.js
//
// Resource cards support.

// Function that retrieves most popular resources and calls create cards function
const retrieveMostPopularResources = () => {
  // AJAX GET request
  $.ajax({
    method: "GET",
    url: "/resources",
    data: {likes: true, sorts: {byMostPopular: true}, limit: 8}
  })
    .then((resp) => {
      // On request success call render function
      renderCards(resp);
    });
};

// Function that renders popular cards to page
const renderCards = (popularResources) => {
  // Add elements to page
  $("#popular-resources").append(createCards(popularResources));
  // Add hover effect on cards
  $('.special.cards .image').dimmer({
    on: 'hover'
  });
};

// Function that creates popular cards html elements
const createCards = (popularResources) => {

  // Create html content for each resource
  const popularResourcesHTML = popularResources.map(resource => `
    <div class="ui card">
      <div class="blurring dimmable image custom-bk-white">
        <div class="ui dimmer">
          <div class="content">
            <div class="center">
            <a
            href="${resource.content}"
            target="_blank"
            class="ui large inverted button">
            Check Resource
            </a>
            </div>
          </div>
        </div>
        <img
          class="custom-padding"
          src="${resource.thumbnail_photo}"
        />
      </div>
      <div class="content custom-bk-grey">
        <a href="${resource.content}" target="_blank" class="ui header small center aligned custom-hover-text-blue"
          >${resource.title}</a
        >
      </div>
    </div>
  `).join(" ");

  return popularResourcesHTML;
};

export default retrieveMostPopularResources;
