// Main
window.addEventListener( 'load', function () {
	let
		canvas = new Canvas(),
		addUnit = function ( event )  {
			canvas.add( new Unit({
				x: event.clientX,
				y: event.clientY,
				destX: event.clientX,
				destY: event.clientY,
				canvas: canvas,
				speed: ~~(Math.random() * 50) + 1
			}));
		};

	canvas.node.addEventListener( 'mousedown', function ()  {
		canvas.node.addEventListener( 'mousemove', addUnit );
	});

	canvas.node.addEventListener( 'mouseup', function ()  {
		canvas.node.removeEventListener( 'mousemove', addUnit );
	});

	canvas.node.addEventListener( 'mousemove', function ( event )  {
		for ( let id in canvas.objects ) {
			let unit = canvas.objects[ id ];
			unit.destX = event.clientX;
			unit.destY = event.clientY;
		}
	});
});
