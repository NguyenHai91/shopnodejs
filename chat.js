var Message = require('./models/message');

module.exports = function (io) {

//socket.io
var listUsers = [];
var idAdmin;
io.on("connect", function (socket) {
	idAdmin = socket.id;
	socket.on('user-logout', function () {
		listUsers.splice(listUsers.indexOf(socket.username), 1);
		io.sockets.emit('admin-connect', listUsers);
	});
	socket.on('admin-connect', function (data) {
		io.sockets.emit('admin-connect', listUsers);
	});
	socket.on('create-room', function (user) {
		if (listUsers.indexOf(user) >= 0) {
			io.sockets.emit('admin-connect', listUsers);
			Message.findOne({name_room: user}).exec(function (err, result) {
				if (err) { throw err; }
				if (result !== null) {
					socket.emit('history-msg', result.arr_message);
				}
			});
		} else {
			Message.findOne({name_room: user}).exec(function (err, result) {
				if (err) { throw err; }
				if (result !== null) {
					let msgRoom = {'name_room': result.name_room, 'arr_msg': []};
					listUsers.push(user);
					socket.join(user);
					socket.username = user;
					io.sockets.emit('admin-connect', listUsers);
					socket.emit('history-msg', result.arr_message);
				} else {
					let msgDoc = new Message();
					msgDoc.name_room = user;
					msgDoc.arr_message = [];
					msgDoc.save(function (err, msg) {
						let msgRoom = {'name_room': msg.name_room, 'arr_msg': []};
						listUsers.push(user);
						socket.join(user);
						socket.username = user;
					});
					io.sockets.emit('admin-connect', listUsers);
				}
			});
		}
	});
	socket.on('join-room', function (data) {
		if (listUsers.indexOf(data.to_room) >= 0) {
			socket.join(data.to_room);
			Message.findOne({name_room: data.to_room}).exec(function (err, result) {
				if (err) {
					throw err;
				}
				if (result !== null) {
					let arr_msg = result.arr_message;
					socket.emit('history-msg', arr_msg);
				}
			});
		}
	});
	socket.on('user-send-msg', function (data) {
		Message.findOne({name_room: data.to_room}).exec(function (err, result) {
			if (err) { throw err; }
			if (result !== null) {
				result.arr_message.push(data);
				result.save(function (err, msg) {
				});
			} else {
				let msgDoc = new Message();
				msgDoc.name_room = data.to_room;
				msgDoc.arr_message = [data];
				msgDoc.save(function (err, msg) {
				});
			}
		});
		socket.to(data.to_room).emit('user-send-msg', data);
	});
	socket.on('admin-send-msg', function (data) {
		Message.findOne({name_room: data.to_room}).exec(function (err, result) {
			if (err) { throw err; }
			if (result !== null) {
				result.arr_message.push(data);
				result.save(function (err, msg) {
					console.log('save msgDoc into db');
				});
			} else {
				let msgDoc = new Message();
				msgDoc.name_room = data.to_room;
				msgDoc.arr_message = [data.msg];
				msgDoc.save(function (err, msg) {
				});
			}
		});
		socket.to(data.to_room).emit('admin-send-msg', data.msg);
	});
});
return io;
}