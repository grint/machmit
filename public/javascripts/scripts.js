$(document).ready(function(){
	$(function() {
		$('ul.da-thumbs > li').hoverdir();
	});

	$(".scroll").click(function(event){		
		event.preventDefault();
		$('html,body').animate({scrollTop:$(this.hash).offset().top},1200);
	});

	$(".fancybox-inline").fancybox({
		maxWidth	: 800,
		maxHeight	: 600,
		fitToView	: false,
		width		: '70%',
		height		: '70%',
		autoSize	: false,
		closeClick	: false,
		openEffect	: 'none',
		closeEffect	: 'none'
	});

	$('.show-signup-form').click(function() {
		$('.signup-form').removeClass('hide');
		$('.login-form').addClass('hide');
		return false;
	});

	$('.show-login-form').click(function() {
		$('.login-form').removeClass('hide');
		$('.signup-form').addClass('hide');
		return false;
	});
}); 
