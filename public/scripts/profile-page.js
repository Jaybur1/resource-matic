// profile-page.js
//
// Profile page support.

const ERROR_BORDER = ".1em dashed red";
const ANIMATION_DURATION = 150;



const setBackgroundImage = ($element, url) => {
  $element.css("background-image", `url('${url}')`);
};

const validateEmailFormat = function(email) {
  // Not sure if necessary:
  // eslint-disable-next-line no-useless-escape
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const toggleErrorBorder = ($element, showErrorBorder) => {
  $element.css("border", (showErrorBorder ? ERROR_BORDER : ""));
};



$(document).ready(function(_event) {

  const $avatar              = $("#avatar");
  const $inputAvatar         = $("main form input[name='avatar']");
  const $inputEmail          = $("main form input[name='email']");
  const $inputPassword       = $("main form input[name='password']");
  const $inputNewPassword    = $("main form input[name='newPassword']");
  const $inputVerifyPassword = $("main form input[name='verifyPassword']");
  const $errorMessage        = $("main form div.error");

  // Set the avatar image on page load:
  const avatarUrl = $avatar.attr("src");
  setBackgroundImage($avatar, avatarUrl);
  $inputAvatar.val(avatarUrl);

  // Set the avatar image on URL change:
  $inputAvatar.on("input propertychange", function(_event) {
    setBackgroundImage($inputAvatar.val());
  });

  // testEmail checks to see if an email address is valid.
  //    Returns true if it is, or false if not.
  const testEmail = function() {
    toggleErrorBorder($inputEmail, ($inputPassword.val() !== "") && !validateEmailFormat($inputEmail.val()));
  };
  // Update the email input border on page load:
  testEmail();

  // Update the email input border password or email change:
  $inputPassword.on("input propertychange", function(_event) {
    testEmail();
  });

  $inputEmail.on("input propertychange", function(_event) {
    testEmail();
  });

  $inputNewPassword.on("input propertychange", function(_event) {
    toggleErrorBorder($inputVerifyPassword, $inputNewPassword.val() !== $inputVerifyPassword.val());
  });

  const validateForm = function() {
    return (validateEmailFormat($inputEmail.val()) && $inputNewPassword.val() === $inputVerifyPassword.val());
  };

  const showError = function(message, description) {
    $errorMessage.find("span.custom-err-message").html(message);
    $errorMessage.find("span.custom-err-description").html(description);
    $errorMessage.slideDown(ANIMATION_DURATION);
  };
  $errorMessage.on("click", function(_event) {
    $(this).slideUp(ANIMATION_DURATION);
  });

  $("main form").on("submit", function(event) {
    if (validateForm()) {
      const user = $(this).serializeArray();
      event.preventDefault();
      $.ajax({
        url:    "/profile",
        method: "PUT",
        data:   user
      }).then(function(_data, _status, _xhr) {
        window.location = "/home";
      }).catch(function(xhr, _status, _message) {
        switch (xhr.status) {
        case 403:
          showError("Nice try.", "Stop h4xx0ring.");
          break;
        default:
          showError("Smooth move ex-lax.", `You broke the server.<br><br>Here's some gnarly response info for your debugging pleasure:<pre>${JSON.stringifyPretty(xhr)}</pre>`);
          break;
        }
      });
    } else {
      showError("Nope nope nope.", "Fix your shit.");
    }
    return false;
  });

  $("main button.negative").on("click", function(_event) {
    const user = $("main form").serializeArray();
    $.ajax({
      url:    "/profile",
      method: "DELETE",
      data:   user
    }).then(function(_data, _status, _xhr) {
      window.location = "/";
    }).catch(function(xhr, _status, _message) {
      $("main form").append(`<br>error: ${JSON.stringify(xhr, null, 2)}`);
    });
  });

});



