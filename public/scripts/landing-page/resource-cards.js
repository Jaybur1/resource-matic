const renderCards = () => {
  const popularResources = [
    {
      name: "CSS Tricks",
      thumbnail_photo: "https://i0.wp.com/css-tricks.com/wp-content/uploads/2019/06/akqRGyta_400x400.jpg?ssl=1",
      content: "https://css-tricks.com/"
    },
  ];

  const popularResourcesHTML = popularResources.map(resource => `
    <div class="ui card">
      <div class="blurring dimmable image custom-bk-white">
        <div class="ui dimmer">
          <div class="content">
            <div class="center">
              <div class="ui large inverted button">Check Resource</div>
            </div>
          </div>
        </div>
        <img
          class="custom-padding"
          src="https://i0.wp.com/css-tricks.com/wp-content/uploads/2019/06/akqRGyta_400x400.jpg?ssl=1"
        />
      </div>
      <div class="content custom-bk-grey">
        <a class="ui header small center aligned custom-hover-text-blue"
          >CSS Tricks</a
        >
      </div>
    </div>
  `).join();

  $("#popular-resources").append(popularResourcesHTML);
};