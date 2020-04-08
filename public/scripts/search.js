// search.js
//
// Client-side search support.

export const resources = (searchText) => {
  $.ajax({
    method: "GET",
    url:    "/resources/search",
    data:   {
      searchText
    }
  }).then((data, _status, _xhr) => {
    //$("main section#home-page").html(`<pre>${JSON.stringifyPretty(data)}</pre>`);
    createCards($("main section#home-page"), data);
  }).catch((xhr, _status, _message) => console.log(xhr)); // handleXhrError(xhr));
};



const $resourceCardSmall = $(`
  <div class="ui card four wide column">
    <div class="blurring dimmable image custom-bk-white">
      <div class="ui dimmer">
        <div class="content">
          <div class="center">
            <a target="_blank" id="" class="ui small inverted button open-resource-btn">
              Go
            </a>
          </div>
        </div>
      </div>
      <img class="custom-image-padding" src="" />
    </div>
    <div class="content custom-bk-grey">
      <a href="" target="_blank" class="ui sub header medium center aligned custom-hover-text-blue"></a>
    </div>
  </div>`);

const createCards = ($container, resources) => {
  $container.html(
    `<div class="ui container">` +
      `<div class="ui special four doubling cards custom-resources custom-padding"></div>` +
    `</div>`
  );
  const $cardContainer = $container.find("div.custom-resources");
  resources.forEach(resource => {
    const $newCard = $resourceCardSmall.clone();
    $newCard.find("a.open-resource-btn").attr("id", resource.id);
    $newCard.find("img").attr("src", resource.thumbnail_photo);
    $newCard.find("a.header").attr("href", resource.content).html(resource.title);
    $cardContainer.append($newCard);
  });
};



