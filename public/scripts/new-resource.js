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
  // $(".category-select").on("click", () => {
    

  // });
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

    getCategories().then((data) => {
      let categoryList = "";
      data.forEach((obj) => {
        categoryList += `<option class='item' value=${obj.id}>${obj.name}</option>`;
      });
      return categoryList
    }).then(list => {
      $(".category-menu").html(list);
    })


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
      console.log(objdata)
      newResourceCall(objdata);
      $(".ui.modal").modal("hide");
    });
  });
};

// Run when page is ready
$(document).ready(() => {
  newResourceHendler();
});
