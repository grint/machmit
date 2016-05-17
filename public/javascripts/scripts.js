function getCurrentDate() {
	return moment(Date.now()).format('YYYY-MM-DD');
}

function isPastOrFuture(firstDate, secondDate) {
	if(moment(secondDate).isBefore(firstDate)) {
		return 'past';
	}
	if(moment(secondDate).isAfter(firstDate)) {
		return 'future';
	}
	if(moment(secondDate).isSame(firstDate)) {
		return 'same';
	}
}

function timeToFrom(firstDate, secondDate) {
	var firstDateParts = firstDate.split('-');
	var secondDateParts = secondDate.split('-');

	var a = moment([firstDateParts[0], firstDateParts[1], firstDateParts[2]]);
	var b = moment([secondDateParts[0], secondDateParts[1], secondDateParts[2]]);

	return a.to(b)
}

function fancyboxInline(el) {
	$(el).fancybox({
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
}

function initWysiwyg() {
	$('.wysiwyg').wysihtml5({
		locale: "de-DE",
		toolbar: {
			"image": false,
			"blockquote": false,
			"color": false
		}
	});
}

$(document).ready(function(){
	moment.locale("de");

	$(function() {
		$('ul.da-thumbs > li').hoverdir();
	});

	$(".scroll").click(function(event){		
		event.preventDefault();
		$('html,body').animate({scrollTop:$(this.hash).offset().top},1200);
	});

	fancyboxInline(".fancybox-inline");

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

	// Add inputmask to date and time fields
	$(".date").inputmask("d.m.y", { "placeholder": "dd.mm.yyyy" });
	$(".time").inputmask("hh:mm", { "placeholder": "HH:MM" });

	// Dropdown datepicker
	$('.datepicker').datetimepicker({
        locale: 'de',
        format: 'DD.MM.YYYY'
    });

	// Dropdown timepicker
    $('.timepicker').datetimepicker({
        locale: 'de',
        format: 'LT',
        stepping: "5"
    });

	// user image upload with ajax
    var uploadBtn = $('#uploadImageBtn'); 
    uploadBtn.click(function (event) {
		var formData = new FormData();
		formData.append('avatar', $('#avatar').get(0).files[0]);
		var request = $.ajax({
			url: "/uploadAvatar",
			method: "POST",
			data: formData,
			contentType: false,
			processData: false,
			cache: false
		}).done(function(data){
			var newImageSrc = $(data).find('#userImage')[0].src;
			$('#userImage').attr('src', newImageSrc);
			uploadBtn.text("Hochgeladen");
		});
	});
    
    var uploadBtn = $('#uploadBildBtn'); 
    uploadBtn.click(function (event) {
		var formData = new FormData();
		formData.append('bild', $('#bild').get(0).files[0]);
        formData.append('oldname', $('#oldname').get(0).value);
        formData.append('oldbild', $('#oldbild').get(0).value);
        formData.append('aktid', $('#aktid').get(0).value);
        formData.append('name', $('#inputName').get(0).value);
		var request = $.ajax({
			url: "/uploadBild",
			method: "POST",
			data: formData,
			contentType: false,
			processData: false,
			cache: false
		}).done(function(data){
			var newImageSrc = $(data).find('#aktImage')[0].src;
			$('#aktImage').attr('src', newImageSrc);
			uploadBtn.text("Hochgeladen");
		});
	});

}); 
