(function ($, window, document, undefined) {
  "use strict";

  $("body").on("click.ui.dropdown-element", ".js-dropdown", function (e) {
    e.preventDefault();
    $(this).toggleClass("is-open");
  });

  $("body").on(
    "click.ui.dropdown-element",
    ".js-dropdown [data-dropdown-value]",
    function (e) {
      e.preventDefault();
      var $item = $(this).find("> p");
      var $dropdown = $item.parents(".js-dropdown");
      $dropdown.find(".js-dropdown-current").html($item.html());
    }
  );

  // $('body').on('click.ui.dropdown-element', function(e) {
  //   var $target = $(e.target);
  //   if (!$target.parents().hasClass('js-dropdown')) {
  //     $('.js-dropdown').removeClass('is-open');
  //   }
  // });

  $("#filter_type").on("click", function (e) {
    console.log("Hello");
  });

  $("#msgBox").keypress(function (event) {
    if (event.keyCode === 13) {
      $("#sendBtn").click();
    }
  });
})(jQuery, window, document);
