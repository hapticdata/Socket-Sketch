define([], function(){
	


	return {

		create: function(canvas){

			var ctx = canvas.getContext('2d');
			ctx.strokeStyle = "black";
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

			var drawTouches = function(touches){
				ctx.beginPath();
				ctx.moveTo(touches[0].x,touches[0].y);
				for(var i=1;i < touches.length; i++){
					ctx.lineTo(touches[i].x,touches[i].y);
					/*ctx.beginPath();
					ctx.arc(touches[i].x,touches[i].y,15,0,Math.PI*2);
					ctx.closePath();
					ctx.stroke();*/
				}
				ctx.closePath();
				ctx.stroke();
			};

			return {
				add: function(obj){
					console.log("drawing touches: ",obj);
					drawTouches(obj.touches || [obj.mouse]);
				},
				clear: function(){
					ctx.clearRect(0,0,canvas.width,canvas.height);
				}

			}

		}
	}
});