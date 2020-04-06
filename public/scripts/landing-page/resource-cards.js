// resource-cards.js
//
// Resource cards support.

// renderPopular fills the parent element with popular resource cards.

export const renderPopular = ($parentElement) => {
  return retrieveMostPopularResources()
    .then((res) => renderCards($parentElement, res))
    .catch((err) => err);
};

// Function that retrieves most popular resources and calls create cards function
const retrieveMostPopularResources = () => {
  return $.ajax({
    method: "GET",
    url:    "/resources",
    data: {
      likes: true,
      sorts: {
        byMostPopular: true
      },
      limit: 8
    }
  }).then((res) => res)
    .catch((err) => err);
};

// Function that renders popular cards to page
const renderCards = ($parentElement, resources) => {
  console.log(resources);
  // Clear placeholder cards and add the actual resource cards
  $parentElement.empty().append(createCards(resources));
  // Add hover effect on cards
  $(".special.cards .image").dimmer({
    on: "hover"
  });
};

// Function that creates popular cards html elements
const createCards = (resources) => {

  // Create html content for each resource
  return resources.map(resource => `
    <div class="ui card">
      <div class="blurring dimmable image custom-bk-white">
        <div class="ui dimmer content center">
          <a
            class="ui large inverted button"
            href="${resource.content}"
            target="_blank"
          >
            Check Resource
          </a>
        </div>
        <img class="custom-padding" src="${resource.thumbnail_photo}" />
      </div>
      <div class="content custom-bk-grey">
        <a
          class="ui header small center aligned custom-hover-text-blue"
          href="${resource.content}"
          target="_blank"
        >
          ${resource.title}
        </a>
      </div>
    </div>
  `).join("");
};
