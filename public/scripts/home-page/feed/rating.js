// Function that sends an AJAX request to find if user has rated resource and returns rate if rated
export const checkIfRated = (id) => {
  // AJAX request
  return $.ajax({method: "GET",
    url: "/rating",
    data: {resourceId: id}
  })
    .then(resp => {
      console.log(resp);
      return resp.currentUserRating
      ;
    });
};