//insert the error message on the #message element
function showErrorMessage(msg) {
  $("#message-signIn").removeClass("success-message");  
  $("#message-signIn").text(msg).addClass("error-message");  
  $("#message-signUp").removeClass("success-message");  
  $("#message-signUp").text(msg).addClass("error-message");  
}

//insert the success message on the #message element
function showSuccessMessage(msg) {
  $("#message-signIn").removeClass("error-message");  
  $("#message-signIn").text(msg).addClass("success-message");  
  $("#message-signUp").removeClass("error-message");  
  $("#message-signUp").text(msg).addClass("success-message");  
}

//hide an element of the dom. Sample: hideElement("myelementid")
function hideElement(elementId) {
  elementId = elementId.replace("#", "");
  $(`#${elementId}`).css("display", "none");
}

//show an element of the dom. Sample: showElement("myelementid") or showElement("myelementid","block")
function showElement(elementId, display) {
  elementId = elementId.replace("#", "");
  if (typeof display === "undefined") {
    display = "block";
  }
  
  $(`#${elementId}`).css("display", "block");
}

function closeModal() {
  $("#overlay").attr("class", "overlay hidden");
  $("#sign-in-modal").attr("class", "modal hidden");
  $("#sign-up-modal").attr("class", "modal hidden");
}

function clearFields() {
  $("#signUpFirstName").val("");
  $("#signUpLastName").val("");
  $("#signUpEmail").val("");
  $("#signUpPassword").val("");
  $("#reenterSignUpPassword").val("");

  $("#signInEmail").val("");
  $("#signInPassword").val("");
  showSuccessMessage("");
}

function openSignInModal() {
  event.preventDefault();

  if ($(this).attr("id") === "sign-in") {
    clearFields();
  }
  $("#overlay").attr("class", "overlay");
  $("#sign-in-modal").attr("class", "modal");
}

function openSignUpModal() {
  event.preventDefault();

  if ($(this).attr("id") === "signUp") {
    clearFields();
  }

  $("#sign-in-modal").attr("class", "modal hidden");
  $("#sign-up-modal").attr("class", "modal");
}

$(document).on("click", "#sign-in", openSignInModal);

$(document).on("click", "#close-modal", closeModal);

$(document).on("click", "#menu", function() {
  let nav = $("#nav");
  if (nav.attr("class") === "desktop-only") {
    nav.attr("class", "");
  } else {
    nav.attr("class", "desktop-only");
  }
});

$(document).on("click", "#signUp", openSignUpModal);

$(document).on("click", "#submitUserInformation", postUserInfo);

if ($(".slide").length) {
  $(".slide").slick({
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    responsive: [{
      breakpoint: 850,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
      }
    }],
    variableWidth: true,
    nextArrow: "<button type='button' data-role='none' class='slick-next slick-arrow' aria-label='Next' role='button' style='display: block;'>Next</button>",
    prevArrow: "<button type='button' data-role='none' class='slick-prev slick-arrow' aria-label='Next' role='button' style='display: block;'>Next</button>"
  });
}

function postUserInfo(event) {
  event.preventDefault();

  let newUserInfo={
    firstname: $("#signUpFirstName").val().trim(),
    lastname: $("#signUpLastName").val().trim(),
    email: $("#signUpEmail").val().trim(),
    password: $("#signUpPassword").val().trim()
  };

  if (!newUserInfo.firstname || !newUserInfo.lastname || !newUserInfo.email || !newUserInfo.password) {
    showErrorMessage("* All fields must be entered");
  }
  else {
    if (newUserInfo.password === $("#reenterSignUpPassword").val()) {
      $.ajax({
        url: "/api/users",
        type: "POST",
        data: newUserInfo,
    
        error: err => {
          showErrorMessage(err.responseText);
        },
    
        success: () => {
          
          clearFields();
          closeModal();
          openSignInModal();
          showSuccessMessage("You were registered successfully!");
        }
      });
          
    }
    else {
      showErrorMessage("* Passwords must match");
    }
  }
}

//hide the send and cancel button to request a new password
$("#resetPwd").css("display", "none");
$("#cancelResetPwd").css("display", "none");

//send a request to new password
$("#resetPwd").click(function () {
  let email = $("#signInEmail").val().trim();

  $.ajax({
    url: "/api/users/resetpwd",
    type: "POST",
    data: { email: email },

    error: err => {
      showErrorMessage(err.responseText);
    },

    success: () => {
      showSuccessMessage("Your new password was sent. Check your inbox in a few minutes!");
      clearFields();
    }
  });
  
});

//when clicks on forgot password
$("#forgot-pwd").click(function () {
  event.preventDefault();
  clearFields();

  $("#title-signIn").text("Request a new password");

  //hide the unecessary fields to request a new password
  hideElement("signInPassword");
  
  //hide sign in and sign up buttons and forgot passoword link
  hideElement("submitSignIn");
  hideElement("signUp");
  hideElement("forgot-pwd");
  
  //show reset and cancel buttons
  showElement("resetPwd");
  showElement("cancelResetPwd");
  
});

//when clicks on cancel button to request a password to show default modal sign in fields
$("#cancelResetPwd").click(function () {
  event.preventDefault();
  
  $("#title-signIn").text("Welcome Back!");

  //show the unecessary fields to request a new password
  showElement("signInPassword");
  
  //show sign in and sign up buttons and forgot passoword link
  showElement("submitSignIn");
  showElement("signUp");
  showElement("forgot-pwd");
  
  //hide reset and cancel buttons
  hideElement("resetPwd");
  hideElement("cancelResetPwd");
});


$("#submitSignIn").on("click", function () {
  
  let user = {
    email: $("#signInEmail").val().trim(),
    password: $("#signInPassword").val().trim()
  };
  
  $.ajax({
    url: "/api/auth",
    type: "POST",
    data: user,

    error: err => {
      showErrorMessage(err.responseText);
    },

    success: () => {
      clearFields();
      closeModal();
      $("#wrap-btn-logout").css("display", "none");
      $("#wrap-btn-login").css("display", "block");
    }

  });

  $("#log-out").click(function () {
    event.preventDefault();
    
    $.ajax({
      url: "/api/logout",
      type: "POST",
  
      error: err => {
        console.log(err.responseText);
        
      },
  
      success: () => {
        $("#wrap-btn-logout").css("display", "block");
        $("#wrap-btn-login").css("display", "none");
      }
    });
    
  });
  
});
