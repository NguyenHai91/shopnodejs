var socket = io('https://shoppingnodejs.herokuapp.com' || 'http://localhot:3000');

socket.emit('admin-connect', 'admin');

socket.on('history-msg', function (arr_msg) {
	$('.msg_history').html('');
	for (let item of arr_msg) {
		var msg = item.msg;
		if (item.from === 'admin') {
			let $msg_cover = `<div class="outgoing_msg">
			<div class="sent_msg">
			<p>${msg}</p>
			<span class="time_date"> 11:01 AM    |    Today</span>
			</div>
			</div>`;
			$('.msg_history').append($msg_cover);
		} else {
			let $msg_cover = `<div class="incoming_msg">
			<div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil">
			</div>
			<div class="received_msg">
			<div class="received_withd_msg">
			<p>${msg}</p>
			<span class="time_date"> 11:01 AM    |    Today</span>
			</div>
			</div>
			</div>`;
			$('.msg_history').append($msg_cover);
		}
	}
	$('.msg_history').scrollTop($('.msg_history')[0].scrollHeight);
});
socket.on('admin-connect', function (users) {
	var $inboxChat = $('.inbox_chat');
	$inboxChat.html('');
	for (let user of users) {
		var $chatList = `<div class="chat_list" data="${user}">
		<div class="chat_people">
		<div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
		<div class="chat_ib">
		<h5 class="user">${user} <span class="chat_date">Dec 25</span></h5>
		</div>
		</div>
		</div>`;
		$inboxChat.append($chatList);
	}
	$('div.chat_list').click(function () {
		var $user = $(this).attr('data');
		$('.user-chatting').html();
		$('.user-chatting').html($user);
		socket.emit('join-room', {'from': 'admin', 'to_room': $user});
	});
});
socket.on('user-send-msg', function (data) {
	var $user = $('.user-chatting').text();
	if (data.to_room === $user) {
		var msg = data.msg;
		var $msg_cover = `<div class="incoming_msg">
		<div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil">
		</div>
		<div class="received_msg">
		<div class="received_withd_msg">
		<p>${msg}</p>
		<span class="time_date"> 11:01 AM    |    Today</span>
		</div>
		</div>
		</div>`;
		$('.msg_history').append($msg_cover);
		$('.msg_history').scrollTop($('.msg_history')[0].scrollHeight);
	}
});

$(document).ready(function () {

	$('#write_msg').keyup(function (e) {
		if (e.keyCode === 13) {
			var $user = $('.user-chatting').text();
			var $msg_content = $('#write_msg').val();
			socket.emit("admin-send-msg", {'from': 'admin', 'to_room': $user, 'msg': $msg_content});
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
		var $user = $('.user-chatting').text();
		var $msg_content = $('#write_msg').val();
		socket.emit("admin-send-msg", {'from': 'admin', 'to_room': $user, 'msg': $msg_content});
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