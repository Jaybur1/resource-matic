export const getResourcesUserRated = () => {
  return $.ajax({
    method: "get",
    url: "/resources",
    data: {
      currentUser: true,
      filterByRated: true,
      comments: true,
      likes: true,
      avgRatings: true,
      limit: 50,
    },
    success: (data, _status, _xhr) => {
      return data;
    },
  });
};

export const getResourcesUserCommented = () => {
  return $.ajax({
    method: "get",
    url: "/resources",
    data: {
      currentUser: true,
      filterByCommented: true,
      likes: true,
      avgRatings: true,
      limit: 50,
    },
    success: (data, _status, _xhr) => {
      return data;
    },
  });
};

export const getResourcesUserLiked = () => {
  return $.ajax({
    method: "get",
    url: "/resources",
    data: {
      currentUser: true,
      filterByLiked: true,
      comments: true,
      likes: true,
      avgRatings: true,
      limit: 50,
    },
    success: (data, _status, _xhr) => {
      return data;
    },
  });
};

export const getUserResources = () => {
  return $.ajax({
    method: "get",
    url: "/resources",
    data: {
      currentUser: true,
      comments: true,
      likes: true,
      ratings: true,
      sort: { byLatest: true },
      limit: 50,
    },
    success: (data, _status, _xhr) => {
      return data;
    },
  });
};

export const getCurrentUser = () => {
  return $.ajax({
    method: "get",
    url: "/users/curr",
    success: (data, _status, _xhr) => {
      return data;
    },
  });
}