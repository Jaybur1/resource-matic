// resource-cards.js
//
// Resource cards support.

// Function that renders popular cards to page
const renderCards = () => {
  // Add elements to page
  $("#popular-resources").append(createCards());
  // Add hover effect on cards
  $('.special.cards .image').dimmer({
    on: 'hover'
  });
};

// Function that creates popular cards html elements
const createCards = () => {
  // TODO Get 8 most popular resources from database
  const popularResources = [
    {
      name: "CSS Tricks",
      thumbnail_photo: "https://i0.wp.com/css-tricks.com/wp-content/uploads/2019/06/akqRGyta_400x400.jpg?ssl=1",
      content: "https://css-tricks.com/"
    },
    {
      name: "Netlify",
      thumbnail_photo: "https://www.netlify.com/img/press/logos/logomark.png",
      content: "https://www.netlify.com/"
    },
    {
      name: "Google Fonts",
      thumbnail_photo: "https://befonts.com/wp-content/uploads/2016/12/photo.jpg",
      content: "https://fonts.google.com/"
    },
    {
      name: "Coolors",
      thumbnail_photo: "https://pbs.twimg.com/profile_images/1149362281911869442/KnZENMUg.png",
      content: "https://coolors.co/"
    },
    {
      name: "CSS Tricks",
      thumbnail_photo: "https://i0.wp.com/css-tricks.com/wp-content/uploads/2019/06/akqRGyta_400x400.jpg?ssl=1",
      content: "https://css-tricks.com/"
    },
    {
      name: "Netlify",
      thumbnail_photo: "https://www.netlify.com/img/press/logos/logomark.png",
      content: "https://www.netlify.com/"
    },
    {
      name: "Google Fonts",
      thumbnail_photo: "https://befonts.com/wp-content/uploads/2016/12/photo.jpg",
      content: "https://fonts.google.com/"
    },
    {
      name: "Coolors",
      thumbnail_photo: "https://pbs.twimg.com/profile_images/1149362281911869442/KnZENMUg.png",
      content: "https://coolors.co/"
    },
  ];

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
          >${resource.name}</a
        >
      </div>
    </div>
  `).join(" ");

  return popularResourcesHTML;
};

export default renderCards;
