var socket = io.connect('http://localhost:3000');

socket.on('connect',function(data){
	var uid = new Date().getTime();
	socket.emit('user.id',uid);

});

socket.on('user/new', function (user) {
	$('body').append('<div id="'+user.id+'"></div>').css({
		position: 'absolute',
		width: 20,
		height: 20,
		'background-color': 'black'
	});
	//socket.emit('my other event', { my: 'data' });
});

socket.on('user/moved',function(user){
	$("#"+user.id).css({
		left: user.mouse.x,
		top: user.mouse.y
	});
});

window.onmousemove = function(e){
	socket.emit('user.moved', {mouse: {x: e.pageX, y: e.pageY}});
};



document.onready = function(){


};



