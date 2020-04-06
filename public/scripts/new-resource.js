// new-reasource.js
//
// new-resource support.

const getCategories = () => {
  return $.ajax({
    method: "GET",
    url: "/categories",
    success: (data, _status, _xhr) => {
      return data;
    },
  });
};
const categorySelect = () => {
  $(".category-select").on("click", () => {
    getCategories().then((data) => {
      data.forEach(obj => {
        $('.category-menu').html(`<div class="item" data-value="${obj.id}">${obj.name}</div>`)
      })
    });
    $(".selection.dropdown").dropdown();
  });
};

const newResourceCall = (data) => {
  return $.ajax({
    method: "POST",
    url: "/resources",
    data,
    success: (data, _status, _xhr) => {
      $(".new-resource-form")[0].reset();
      window.location = "/home";
    },
  });
};

const handleThumbnail_photo = () => {
  $(".resource-url").on("keyup", function () {
    const value = $(this).val();
    $(".thumbnail-photo").html(
      `<img class="thumbnail-photo" src="https://api.faviconkit.com/${value}/500">`
    );
  });
};

// Function that loads new resource interactions
const newResourceHendler = () => {
  //toggle create new resource on click
  categorySelect();
  handleThumbnail_photo();
  $(".create-new-resource").on("click", function () {
    $(".ui.modal").modal("show");
    $(".cancel-form").on("click", () => {
      $(".ui.modal").modal("hide");
    });
    $(".new-resource-form").on("submit", function (e) {
      e.preventDefault();
      const newResourceInput = $(this).serializeArray();
      const objdata = {};
      newResourceInput.forEach((obj) => {
        objdata[obj.name] = obj.value;
      });
      objdata.thumbnail_photo = `https://api.faviconkit.com/${objdata.content}/144`;

      newResourceCall(objdata);
      $(".ui.modal").modal("hide");
    });
  });
};

// Run when page is ready
$(document).ready(() => {
  newResourceHendler();
});
