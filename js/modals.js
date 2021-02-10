$(function genericModals() {
  $("body")
    .on("click", ".open-modal", function (e) {
      var artContainer = $(this).closest(".modal-wrapper").find(".overlay");
      e.preventDefault();
      $("body").addClass("modal-opened");
      artContainer.removeClass("hide");
      return false;
    })
    .on("click", ".close", function () {
      $(".overlay").addClass("hide");
      $("body").removeClass("modal-opened");
      return false;
    });
});

$(function signupModal() {
  $("#signup-btn, .signup-trigger").on("click", function () {
    $(".overlay").addClass("hide");
    $("#signup").toggleClass("hide");
    $("body").addClass("modal-opened");
  });
});

$(function loginModal() {
  $("#login-btn, .login-trigger").on("click", function () {
    $(".overlay").addClass("hide");
    $("#login").toggleClass("hide");
    $("body").addClass("modal-opened");
  });
});
