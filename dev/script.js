// Debug
function debug ( data ) {
	document.getElementById( 'debug' ).innerText = JSON.stringify( data, null, 2 );
}

// Main
window.addEventListener( 'load', function () {
	let canvas = new Canvas();

	setInterval( () => {
		canvas.add( new Unit({
			x: canvas.rect.width / 2,
			y: canvas.rect.height + 10,
			destX: Math.random() * canvas.rect.width,
			destY: Math.random() * canvas.rect.height / 2,
			canvas: canvas,
		}));
	}, 500 );

	setInterval( () => {
		debug( Object.keys( canvas.objects ).length );
	}, 40 );
});
