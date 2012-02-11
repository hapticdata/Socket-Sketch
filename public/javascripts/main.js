require([
	'jquery',
	'domReady'
],function($, domReady){
	domReady(function(){
		
		var user = {};
		var socket = io.connect('http://192.168.1.105:3000');
		var	addBox = function(user){
			$('body').append(getNewBox(user));
			moveBox(user);
		}
		,	destroyBox = function(uid){
			$('#'+uid).remove();	
		}
		,	getNewBox = function(user){
			return $('<div id="'+user.id+'">'+user.id+'</div>').css({
				position: 'absolute',
				width: 20,
				height: 20,
				left: user.mouse.x,
				top: user.mouse.y,
			});
		}
		,	moveBox = function(user){
			$("#"+user.id).css({
				left: user.mouse.x,
				top: user.mouse.y
			});
		};

		socket.on('connect',function(data){
			var uid = new Date().getTime();
			user.id = uid;
			user.mouse = {x: 0, y: 0};
			socket.emit('user.id',uid);
			console.log(uid);
		});


		socket.on('user/index', function(users){
			for(var prop in users){
				var user = users[prop];
				console.log(user);
				addBox(user);
			}
		});

		socket.on('user/new', function (user) {
			$('body').append(getNewBox(user));
			//socket.emit('my other event', { my: 'data' });
		});

		socket.on('user/moved',function(user){
			moveBox(user);
		});

		socket.on('user/destroy',function(uid){
			destroyBox(uid);
		});

		$(window).mousemove(function(e){
			user.mouse = {x: e.pageX, y: e.pageY};
			socket.emit('user.moved', user);
			moveBox(user);
		});

		if(window.ontouchmove){
			window.ontouchmove = function(e){
				e.preventDefault();
				user.mouse = {x: e.touches[0].pageX, y: e.touches[0].pageY};
				socket.emit('user.moved',user);
				moveBox(user);
			}
		}
	});
});