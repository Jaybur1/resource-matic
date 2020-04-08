// Function that sends an AJAX request to find if user has rated resource and returns rate if rated
export const checkIfRated = (id) => {
  // AJAX request
  return $.ajax({method: "GET",
    url: "/rating",
    data: {resourceId: id}
  })
    .then(resp => resp.currentUserRating
    );
};

// Function the handles changing rating of a resource by user
export const ratingInteractions = () => {
  // Initiate rating functionality - must be added for rating to work
  $(".rating").rating();

  // Rating click event listener
  $('.ui.rating').on("click", function() {

    const currentRating = Number($(this).attr("data-rating"));
    const selectedRating = Number($(this).closest(".ui.rating").rating('get rating'));
    const resourceId = Number($(this).parent().prev().html());

    // If not set rating
    if (currentRating === 0 && selectedRating > 0) {
    // AJAX POST request
      $.ajax({method: "POST",
        url: "/rating",
        data: {
          resourceId,
          rating: selectedRating
        }
      })
        .then(() => {
          console.log("post");

          // Set rating attribute
          $(this).attr("data-rating", selectedRating);

          // Update average rating
          updateAvgRating(resourceId);
        });
    // If rating selected is equal to current rating delete it
    } else if (currentRating === selectedRating) {
      // AJAX DELETE request
      $.ajax({method: "DELETE",
        url: "/rating",
        data: {
          resourceId,
          rating: selectedRating
        }
      })
        .then(() => {
          console.log("delete");

          // Set rating attribute to zero
          $(this).closest(".ui.rating").rating('set rating', 0);
          $(this).attr("data-rating", 0);

          // Update average rating
          updateAvgRating(resourceId);
        });
    // If rating is already set
    } else if (currentRating > 0) {
      // AJAX PUT request
      $.ajax({method: "PUT",
        url: "/rating",
        data: {
          resourceId,
          rating: selectedRating
        }
      })
        .then(() => {
          console.log("put");

          // Update rating attribute
          $(this).attr("data-rating", selectedRating);

          // Update average rating
          updateAvgRating(resourceId);
        });
    }
  });
};

// Function that updates average rating
const updateAvgRating = (id) => {
// AJAX request
  $.ajax({method: "GET",
    url: "/rating",
    data: {resourceId: id}
  })
    .then(resp => {
      console.log(resp.averageRating);
    });
};