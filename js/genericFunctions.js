$(function pressHeart() {
  $(".icon.heart").on("click", function () {
    var ih = $(this).closest(".modal-wrapper").next(".icon.heart");
    $(this, ih).toggleClass("heart");
    $(this, ih).toggleClass("heart-highlighted anim-pump");
    $(this)
      .next("span.hearts-number")
      .toggleClass("hide")
      .empty()
      .append(Math.floor(Math.random() * 122 + 1));
  });
});

$(function followBtn() {
  $("button.follow").on("click", function () {
    $(this).toggleClass("following");
  });
});

$(function showHideArticles() {
  $("input.articles-checkbox:checkbox").on("change", function () {
    if ($(this).is(":checked")) {
      $("article").removeClass("hide");
    } else {
      $("article").addClass("hide");
    }
  });
});

$(function filtering() {
  $(".js-dropdown .dropdown-item").on("click", function () {
    $("#fltr-type").html("Type");
    $("#fltr-style").html("Style");
    $("#fltr-size").html("Dimensions");
    var filt = $(this).attr("data-dropdown-value");
    $(".art-grid").find("figure").removeClass("hide");
    $(".art-grid")
      .find("figure:not(." + filt + ")")
      .addClass("hide");
  });
});
