var socket = io('https://shoppingnodejs.herokuapp.com' || 'http://localhot:3000');

socket.on('admin-send-msg', function (data) {
	var $msg_cover = `<div class="incoming_msg">
	<div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil">
	</div>
	<div class="received_msg">
	<div class="received_withd_msg">
	<p>${data}</p>
	<span class="time_date"> 11:01 AM    |    Today</span>
	</div>
	</div>
	</div>`;

	var $html = $msg_cover;
	$('.msg_history').append($html);
	$('.msg_history').scrollTop($('.msg_history')[0].scrollHeight);
});

socket.on('history-msg', function (data) {
	$('.msg_history').html('');
	data.forEach(function (item) {
		let msg = item.msg;
		let $msg_cover;
		if (item.from === 'admin') {
			$msg_cover = `<div class="incoming_msg">
			<div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil">
			</div>
			<div class="received_msg">
			<div class="received_withd_msg">
			<p>${msg}</p>
			<span class="time_date"> 11:01 AM    |    Today</span>
			</div>
			</div>
			</div>`;
		} else {
			$msg_cover = `<div class="outgoing_msg">
			<div class="sent_msg">
			<p>${msg}</p>
			<span class="time_date"> 11:01 AM    |    Today</span>
			</div>
			</div>`;
		}

		$('.msg_history').append($msg_cover);
		$('.msg_history').scrollTop($('.msg_history')[0].scrollHeight);
	});
	
});

$(document).ready(function () {

	$('.btn-start').click(function () {
		$(this).css('display', 'none');
		$('.container-chatbox').css('display', 'block');
		var $user = $('.user').text();
		if ($user !== 'Login') {
			socket.emit('create-room', $user);
		}
	});
	$('.btn-close').click(function () {
		$('.container-chatbox').css('display', 'none');
		$('.btn-start').css('display', 'block');
	});

	$('.logout').click(function () {
		socket.emit('user-logout');
	});

	$('#write_msg').keyup(function (e) {
		if (e.keyCode === 13) {
			var $user = $('.user').text();
			var $msg_content = $('#write_msg').val();
			socket.emit("user-send-msg", {'from': $user, 'to_room': $user, 'msg': $msg_content});
			var $msg_cover = `<div class="outgoing_msg">
			<div class="sent_msg">
			<p>${$msg_content}</p>
			<span class="time_date"> 11:01 AM    |    Today</span>
			</div>
			</div>`;
			$('.msg_history').append($msg_cover);
			$('#write_msg').val('');
			$('.msg_history').scrollTop($('.msg_history')[0].scrollHeight);
		}
	});

	$('#btn-send').click(function () {
		var $user = $('.user').text();
		var $msg_content = $('#write_msg').val();
		socket.emit("user-send-msg", {'from': $user, 'to_room': $user, 'msg': $msg_content});
		var $msg_cover = `<div class="outgoing_msg">
		<div class="sent_msg">
		<p>${$msg_content}</p>
		<span class="time_date"> 11:01 AM    |    Today</span>
		</div>
		</div>`;
		$('.msg_history').append($msg_cover);
		$('#write_msg').val('');
		$('.msg_history').scrollTop($('.msg_history')[0].scrollHeight);
	});
});