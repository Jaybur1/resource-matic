// userHelpers.js
//
// user authentication support.


const handleError = (data) => {
  console.log(data);
  $("body").toast({
    class: "error",
    title: "Error",
    message: data.err,
    showProgress: "bottom",
    showIcon: "fire",
  });
};

const logOut = () => {
  return $.ajax({
    method: "PUT",
    url: "/users/logout",
    success: (data, textStatus) => {
      window.location.href = data.redirect;
    },
  });
};

const logIn = (data) => {
  return $.ajax({
    method: "PUT",
    url: "/users/login",
    data,
    success: (data, textStatus) => {
      if (data.redirect) {
        window.location.href = data.redirect;
      } else {
        handleError(data);
      }
    },
  });
};

const signUp = (data) => {
  return $.ajax({
    method: "POST",
    url: "/users",
    data,
    success: (data, textStatus) => {
      if (data.redirect) {
        window.location.href = data.redirect;
      } else {
        handleError(data);
      }
    },
  });
};

//handle user auth

const userAuth = () => {
  $(".login-form").on("submit", (e) => {
    e.preventDefault();
    const user_input = {
      email: $(".login-email").val(),
      password: $(".login-password").val(),
    };
    logIn(user_input);
  });

  $(".logout-btn").on("submit", (e) => {
    e.preventDefault();
    logOut();
  });

  $(".signup-form").on("submit", (e) => {
    e.preventDefault();
    const user_input = {
      name: $(".signup-name").val(),
      email: $(".signup-email").val(),
      password: $(".signup-password").val(),
    };
    signUp(user_input);
  });
};

$(document).ready(() => {
  userAuth();
});
