define([
	'toxi/physics2d/VerletPhysics2D',
	'toxi/physics2d/VerletParticle2D',
	'toxi/physics2d/behaviors/GravityBehavior',
	'toxi/geom/Vec2D',
	'toxi/color/TColor'
], function(VerletPhysics2D, VerletParticle2D, GravityBehavior, Vec2D,TColor){
	


	return {

		create: function(canvas){

			var ctx = canvas.getContext('2d');
			ctx.strokeStyle = ctx.fillStyle = "black";
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

			var physics = new VerletPhysics2D(new GravityBehavior(new Vec2D(0,-0.02)));
			//physics.setWorldBounds({x: 0, y: 0, width: canvas.width, height: canvas.height});

			var drawTouches = function(touches){
				
				for(var i=0; i<touches.length;i++){
					var particle = new VerletParticle2D(new Vec2D(touches[i].x,touches[i].y), Math.random()* 25 + 3);
					particle.color = TColor.newRandom().setSaturation(0.5).setAlpha(0.5);
					physics.addParticle(particle);
				}

				/*
				ctx.beginPath();
				ctx.moveTo(touches[0].x,touches[0].y);
				for(var i=1;i < touches.length; i++){
					ctx.lineTo(touches[i].x,touches[i].y);
				}*/
				ctx.closePath();
				ctx.stroke();

			};

			var loop = function(){
					ctx.clearRect(0,0,canvas.width,canvas.height);
					physics.update();
					
					for(var i=0; i< physics.particles.length; i++){
						var p = physics.particles[i];
						if(p.y < -5){
							var index = physics.particles.indexOf(p);
							physics.particles.splice(index,1);
							i--;
						} else {
							ctx.fillStyle = p.color.toRGBACSS();
							ctx.beginPath();
							ctx.arc(p.x,p.y,p.weight,0,Math.PI*2);
							ctx.closePath();
							ctx.fill();
						}
					}
					setTimeout(loop, 1000 /30);
				};
				
				loop();

			return {
				add: function(obj){
					//console.log("drawing touches: ",obj);
					drawTouches(obj.touches || [obj.mouse]);
				},
				clear: function(){
					ctx.clearRect(0,0,canvas.width,canvas.height);
				}

			}

		}
	}
});