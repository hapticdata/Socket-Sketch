require([
	'jquery',
	'domReady',
	'sketch',
],function($, domReady, sketch){
	domReady(function(){
		
		var sketchInstance = sketch.create(document.getElementById('sketch'));
		var user = {};
		var socket = io.connect(window.location);
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
			sketchInstance.add(user);
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
			//socket.emit('user.moved', user);
			moveBox(user);
		});

		
		document.addEventListener('touchmove',function(e){
			e.preventDefault();
			user.touches = [];
			for(var i=0; i< e.touches.length; i++){
				user.touches.push({x: e.touches[i].pageX, y: e.touches[i].pageY});
			}
			user.mouse = user.touches[0];
			socket.emit('user.moved',user);
			moveBox(user);
		}, false);

		document.addEventListener('touchstart',function(e){
			e.preventDefault();
		}, false);

		document.addEventListener('touchend', function(e){

		}, false);
	});
});