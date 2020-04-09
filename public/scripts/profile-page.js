// profile-page.js
//
// Profile page support.

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
  $element.toggleClass("custom-error-border", showErrorBorder);
};

const scrollToBottom = function() {
  const $body = $("html, body");
  $body.stop().animate({ scrollTop: $body.height() }, ANIMATION_DURATION, "swing");
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
    setBackgroundImage($avatar, $inputAvatar.val());
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
    testNewPassword();
  });

  $(".custom-password .eye").on("click", function(_event) {
    $inputPassword.attr("type", ($inputPassword.attr("type") === "password" ? "text" : "password"));
  });

  $inputEmail.on("input propertychange", function(_event) {
    testEmail();
  });

  // testNewPassword checks to see if the new password fields match.
  //    Shows an error border on the verify field if they don't.
  const testNewPassword = function() {
    toggleErrorBorder($inputVerifyPassword, ($inputPassword.val() !== "") && $inputNewPassword.val() !== $inputVerifyPassword.val());
  };

  $inputNewPassword.on("input propertychange", function(_event) {
    testNewPassword();
  });

  $(".custom-new-password .eye").on("click", function(_event) {
    $inputNewPassword.attr("type", ($inputNewPassword.attr("type") === "password" ? "text" : "password"));
  });

  $inputVerifyPassword.on("input propertychange", function(_event) {
    testNewPassword();
  });

  $(".custom-verify-password .eye").on("click", function(_event) {
    $inputVerifyPassword.attr("type", ($inputVerifyPassword.attr("type") === "password" ? "text" : "password"));
  });

  const validateForm = function() {
    return (($inputPassword.val() === "") || validateEmailFormat($inputEmail.val()) && $inputNewPassword.val() === $inputVerifyPassword.val());
  };

  // showError shows an error in the error box.
  const handleXhrError = function(xhr) {
    switch (xhr.status) {
    case 403:
      showError("Nice try.", "Stop h4xx0ring.");
      break;
    default:
      showError("Smooth move ex-lax.", `You broke the server.<br><br>Here's some gnarly response info for your debugging pleasure:<pre>${JSON.stringifyPretty(xhr)}</pre>`);
      break;
    }
  };

  // showError shows an error in the error box.
  const showError = function(message, description) {
    $errorMessage.find("span.custom-err-message").html(message);
    $errorMessage.find("span.custom-err-description").html(description);
    $errorMessage.slideDown(ANIMATION_DURATION);
    scrollToBottom();
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
      })
        .then((_data, _status, _xhr) => window.location = "/home")
        .catch((xhr, _status, _message) => handleXhrError(xhr));
    } else {
      showError(`Fix your shit.`, `PROTIP: ` +
                `<span class="custom-text-error-border">Look for stuff like this</span> ` +
                `and make it go away.`);
    }
    return false;
  });

  $("main button.negative").on("click", function(_event) {
    if ($inputPassword.val()) {
      const user = $("main form").serializeArray();
      $.ajax({
        url:    "/profile",
        method: "DELETE",
        data:   user
      })
        .then((_data, _status, _xhr) => window.location = "/")
        .catch((xhr, _status, _message) => handleXhrError(xhr));
    } else {
      showError(`Enter your password.`, `Not gonna nuke it without it.`);
    }
    return false;
  });

});



