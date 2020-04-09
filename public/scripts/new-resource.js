// new-resource.js
//
// new-resource support.

export const capitalize = (str) => {
  return str[0].toUpperCase() + str.substr(1).toLowerCase();
};

export const getCategories = (name = undefined) => {
  return $.ajax({
    method: "GET",
    url: "/categories",
    data: { name },
    success: (data, _status, _xhr) => {
      return data;
    },
  });
};

const newCategoryCall = (data) => {
  return $.ajax({
    method: "POST",
    url: "/categories",
    data,
    success: (data, _status, _xhr) => {
      return data;
    },
  });
};

const updateCategoryList = () => {
  getCategories()
    .then((data) => {
      let categoryList = "";
      data.forEach((obj) => {
        categoryList += `<option class='item' value=${obj.id}>${capitalize(obj.name)}</option>`;
      });
      return categoryList;
    })
    .then((list) => {
      $(".category-menu").html(list);
    });
};

const handleNewCategory = () => {
  $("#check-box").on("change", (e) => {
    if (e.target.checked) {
      $(".category-menu").attr("disabled", "true");
      $(".other-category").removeAttr("disabled");
      $(".category-btn").removeAttr("disabled");
    } else {
      $(".category-menu").removeAttr("disabled");
      $(".other-category").attr("disabled", "true");
      $(".category-btn").attr("disabled", "true");
    }
  });
};

const newResourceCall = (data) => {
  return $.ajax({
    method: "POST",
    url: "/resources",
    data,
    success: (_data, _status, _xhr) => {
      $(".new-resource-form")[0].reset();
      window.location = "/home";
    },
  });
};

const handleThumbnail_photo = () => {
  $(".resource-url").on("keyup", function(_e) {
    const value = $(this).val();
    $(".thumbnail-photo").html(
      `<img class="thumbnail-photo" src="https://api.faviconkit.com/${value}/500">`
    );
  });
};

// Function that loads new resource interactions
const newResourceHandler = () => {
  handleThumbnail_photo();
  $(".create-new-resource").on("click", function(_e) {
    //update category list acording to db
    updateCategoryList();
    //toggle create new resource
    $(".newResource").modal("show");
    $(".cancel-form").on("click", () => {
      $(".newResource").modal("hide");
    });

    handleNewCategory();
    //handle submit new resource
    $(".new-resource-form").on("submit", function(e) {
      e.preventDefault();
      const newResourceInput = $(this).serializeArray();
      const objdata = {};
      newResourceInput.forEach((obj) => {
        objdata[obj.name] = obj.value;
      });
      objdata.thumbnail_photo = `https://api.faviconkit.com/${objdata.content}/144`;
      if (!objdata.categoryName) {
        newResourceCall(objdata);
        //hide on submition
        $(".newResource").modal("hide");
      } else {
        newCategoryCall({ name: objdata.categoryName }).then(data=> {
          objdata.categoryName = data.id;
          newResourceCall(objdata);
          $(".newResource").modal("hide");
        });
      }
    });
  });
};

// Run when page is ready
$(document).ready(() => {
  newResourceHandler();
});
