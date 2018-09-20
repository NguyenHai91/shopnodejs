
$(document).ready(function () {

	$('.carousel').carousel();
	$("[rel=tooltip]").tooltip();

	var $container = $('.product-container');
	$container.imagesLoaded( function(){
		$container.masonry();
	});

	menu();
	updateQuantity();
	var user = $('.user').text();
	console.log(user);
	if (user !== 'Login' && user !== '') {
		$('.cover-chatbox').css('display', 'none');
	}
});


function updateQuantity() {
	$('input[name="txtQuant"]').change(function () {
		var id = $(this).attr('idsp');
		var quantity = $(this).val();
		console.log(id +':'+ quantity);
		$.ajax({
			url: '/update/' + id + '/'+ quantity,
			type: 'GET',
			dataType: 'html',
			success: function (data) {
				if (data == "OK") {
					location.reload();
				}
			}
		});
	});
}

function menu() {
	$.ajax({
		url: '/menu',
		type: 'GET',
		dataType: 'json',
		success: function (data) {
			var activeHome = '';
			var urlCurrent = window.location.pathname.split('/');
			if (window.location.pathname == "/") {
				activeHome = 'class="active"';
			}
			var xhtml = '<li '+ activeHome +'><a href="/">Home</a></li>';
			$.each(data, function (key, value) {
				var activeCategory = '';
				if (window.location.pathname == "/category/" + data[key].id || data[key].id == urlCurrent[2]) {
					activeCategory = 'class="active"';
				}
				xhtml += '<li '+ activeCategory +'><a href="/category/'+ data[key].id +'">'+ data[key].name +'</a></li>';

			});
			$(".nav-pills").html(xhtml);
		}
	});
}