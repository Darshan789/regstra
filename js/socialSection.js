$(function () {
	$('body').on('click', '.social.pos-bottom-bar', function () {
		$('.social.pos-bottom-bar').removeClass('pos-bottom-bar');
		$('body').addClass('modal-opened');
		$('.article-min-cont').addClass('hide');
		$('aside.panel').removeClass('article-min');
		$('.events').removeClass('hide');
	});
});

$(function () {
	$('body').on('click', '.social-handle', function () {
		$('.social').addClass('pos-bottom-bar');
		$('body').removeClass('modal-opened');
		$('.article-min-cont').removeClass('hide');
		$('aside.panel').addClass('article-min');
		$('.events').addClass('hide');
	});
});