
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  ,	io = require('socket.io');



var app = module.exports = express.createServer();
io = io.listen(app);
// Configuration
var numPeople = 0;
var users = {};
io.sockets.on('connection',function(socket){
	numPeople++;
	
	socket.emit('user/index', users);

	socket.on('user.id',function(id){
		socket.set('user.id',id);
		users[id] = {id: id, mouse: { x: 0, y: 0}};
		io.sockets.emit('user/new', users[id]);
	});

	
	//socket.emit('news',{numPeople: numPeople});
	socket.on('user.moved', function(data){
		socket.get('user.id',function(err,uid){
			if(users[uid] !== undefined){
				users[uid].mouse = data.mouse;
				console.log("data.touches: "+data.touches);
				users[uid].touches = data.touches; //might be undefined, no promises
				socket.broadcast.emit('user/moved',users[uid]);
			}
		});
	});

	socket.on('disconnect',function(){
		numPeople--;
		socket.get('user.id',function(err,uid){
			io.sockets.emit('user/destroy', uid);
			if(typeof users[uid] != 'undefined'){
				delete users[uid];
			}
		});
	});
});


app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);

app.listen(15096);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
