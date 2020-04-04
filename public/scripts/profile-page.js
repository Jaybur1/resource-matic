


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
      data:   user,
    }).then(function(_status, _xhr) {
      //console.log(status, xhr);
      $("main form").append("<br>success");
    }).catch(function(err) {
      console.error(err);
      $("main form").append("<br>error");
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

});



