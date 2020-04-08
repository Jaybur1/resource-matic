// Function that sends an AJAX request to find if user has like current resource
export const checkIfLiked = (id) => {
  // AJAX request
  return $.ajax({method: "GET",
    url: "/like",
    data: {resourceId: id}
  })
    .then(resp => resp.likedByCurrentUser);
};

// Function that adds event listener for like button and send AJAX request to create or delete like
export const likeInteractions = () => {
  // On click event listener
  $(".custom-like").on("click", function(e) {
    const parentEl = e.target.parentElement.parentElement;
    const resourceId = parentEl.querySelector(".custom-resource-id").innerHTML;

    // If is not liked
    if ($(this).hasClass("outline")) {
      // POST AJAX request to create like
      $.ajax({method: "POST",
        url: "/like",
        data: { resourceId }
      })
        .then(() => {
          // Update icon to be filled
          $(this).removeClass("outline");
          // Update likes count
          e.target.parentElement.previousElementSibling.innerText = Number(e.target.parentElement.previousElementSibling.innerHTML) + 1;
        })
        .catch(error => console.log(error));
    } else {
      // DELETE AJAX request to remove like
      $.ajax({method: "DELETE",
        url: "/like",
        data: { resourceId }
      })
        .then(() => {
          // Update icon to remove fill
          $(this).addClass("outline");
          // Update like count
          e.target.parentElement.previousElementSibling.innerText = Number(e.target.parentElement.previousElementSibling.innerHTML) - 1;
        })
        .catch(error => console.log(error));
    }
  });
};