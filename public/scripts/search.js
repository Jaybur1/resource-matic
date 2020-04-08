// search.js
//
// Client-side search support.

// search.results performs an AJAX request for search data.

export const resources = (searchText) => {
  $.ajax({
    method: "GET",
    url:    "/resources/search",
    data:   {
      searchText
    }
  }).then((data, _status, _xhr) => {
    renderSearchResults($("main section#home-page"), data);
  }).catch((xhr, _status, _message) => console.log(xhr)); // handleXhrError(xhr));
};



const renderCards = ($container, cardGrid, callback) => {
  // Add the EJS render to the container:
  //    The card data are stored as JSON in the "card-data" attribute of the top-level element
  //    (see views/partials/_card-grid.ejs).
  $container.html(cardGrid);
  // Get the card template and inner card container that comes with it:
  const $cardTemplate  = $container.find("div.card");
  const $cardContainer = $container.find("div.custom-resources");
  // Clear the template from the card container:
  $cardContainer.empty();
  // Add cards for each resource:
  JSON.parse($container.find("[card-data]").attr("card-data")).forEach((card) => {
    $cardContainer.append(callback($cardTemplate.clone(), card));
  });
};



const renderSearchResults = ($container, resources) => {
  renderCards($container, resources, ($newCard, resource) => {
    $newCard.find("a.open-resource-btn").attr("id", resource.id);
    $newCard.find("img").attr("src",                resource.thumbnail_photo);
    $newCard.find("a.header").attr("href",          resource.content).html(resource.title);
    return $newCard;
  });
};



