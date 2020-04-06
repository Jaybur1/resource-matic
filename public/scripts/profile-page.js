// profile-page.js
//
// Profile page support.

$(document).ready(function(_event) {

  $("#avatar").css("background-image", `url('${$("#avatar").attr("src")}')`);

  $("main form").on("submit", function(event) {

    const user = $(this).serializeArray();
    user.push({
      name:  "avatar",
      value: $("#avatar").attr("src")
    });
    //console.log(user);
    event.preventDefault();
    $.ajax({
      url:    "/profile",
      method: "PUT",
      data:   user
    }).then(function(_data, _status, _xhr) {
      window.location = "/home";
    }).catch(function(xhr, _status, _message) {
      $("main form").append(`<br>error: ${JSON.stringify(xhr, null, 2)}`);
    });

  });

  // Validation stuff from Semantic example, not complete:
  $("main form").form({
    fields: {
      name: {
        identifier: "name",
        rules: [
          {
            type   : "empty",
            prompt : "Please enter your display name"
          }
        ]
      },
      // email: {
      //   identifier: "email",
      //   rules: [
      //     {
      //       type   : "empty",
      //       prompt : "Please enter an email address"
      //     }
      //   ]
      // },
      // password: {
      //   identifier: "password",
      //   rules: [
      //     {
      //       type   : "minLength[6]",
      //       prompt : "Your password must be at least {ruleValue} characters"
      //     }
      //   ]
      // },
      // "password-new": {
      //   identifier: "newPassword",
      //   rules: [
      //     {
      //       type   : "empty",
      //       prompt : "Please enter a new password"
      //     },
      //     {
      //       type   : "minLength[6]",
      //       prompt : "Your password must be at least {ruleValue} characters"
      //     }
      //   ]
      // },
      // "password-verify": {
      //   identifier: "verifyPassword",
      //   rules: [
      //     {
      //       type   : "empty",
      //       prompt : "Please verify the password"
      //     },
      //     {
      //       type   : "minLength[6]",
      //       prompt : "Your password must be at least {ruleValue} characters"
      //     }
      //   ]
      // }
    }
  });

  $("main button.negative").on("click", function(event) {

    event.preventDefault();
    const user = $("main form").serializeArray();
    $.ajax({
      url:    "/profile",
      method: "DELETE",
      data:   user
    }).then(function(_data, _status, _xhr) {
      console.log("SUCCESS");
      window.location = "/";
    }).catch(function(xhr, _status, _message) {
      $("main form").append(`<br>error: ${JSON.stringify(xhr, null, 2)}`);
    });

  });

});



