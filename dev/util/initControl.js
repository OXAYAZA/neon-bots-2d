import TouchController from './TouchController.js';
import TouchButton from './TouchButton.js';

export default function initControl () {
	let
		elBtnPlay = document.querySelector( '#play' ),
		elBtnPause = document.querySelector( '#pause' ),
		elBtnTouch = document.querySelector( '#touch' ),
		elBtnTick = document.querySelector( '#tick' ),
		elBtnFs = document.querySelector( '#fullscreen' ),
		elTouchDir = document.querySelector( '#direction-control' ),
		elTouchShot = document.querySelector( '#shot-button' ),
		elTouchSpawn = document.querySelector( '#respawn-button' );

	window.keys = {};
	window.mousepos = {};
	window.touchButtons = {};
	window.directionControllerOffset = {};
	window.gamepad = null;

	document.addEventListener( 'keydown', function ( event ) {
		window.keys[ event.code ] = true;
	});

	document.addEventListener( 'keyup', function ( event ) {
		window.keys[ event.code ] = false;
	});

	document.addEventListener( 'directionController:offset', function ( event ) {
		window.directionControllerOffset = {
			x: event.x,
			y: event.y
		};
	});

	document.addEventListener( 'shotButton:state', function ( event ) {
		window.touchButtons[ 'shotButton' ] = event.state;
	});

	document.addEventListener( 'respawnButton:state', function ( event ) {
		window.touchButtons[ 'respawnButton' ] = event.state;
	});

	document.addEventListener( 'mousemove', function ( event ) {
		window.mousepos = {
			x: event.clientX,
			y: event.clientY
		};
	});

	window.addEventListener( 'gamepadconnected', function ( event ) {
		window.gamepad = event.gamepad;
	});

	if ( elBtnPlay ) {
		elBtnPlay.addEventListener( 'click', function () {
			if ( canvas.state !== 'play' ) {
				canvas.lastTime = performance.now();
				canvas.state = 'play';
				canvas.render( performance.now() );
			}
		});
	}

	if ( elBtnPause ) {
		elBtnPause.addEventListener( 'click', function () {
			canvas.state = 'pause';
		});
	}

	if ( elBtnTick ) {
		elBtnTick.addEventListener( 'click', function () {
			canvas.lastTime = performance.now();
			canvas.render( performance.now() + 20 );
		});
	}

	if ( elBtnTouch ) {
		elBtnTouch.addEventListener( 'click', function () {
			document.querySelector( '.touch-layer' ).classList.toggle( 'active' );
		});
	}

	if ( elBtnFs ) {
		elBtnFs.addEventListener( 'click', function () {
			if ( document.fullscreenElement ) {
				document.exitFullscreen();
			} else {
				document.querySelector( '.page' ).requestFullscreen();
			}
		});
	}

	if ( elTouchDir ) {
		new TouchController( 'directionController', elTouchDir );
	}

	if ( elTouchShot ) {
		new TouchButton( 'shotButton', elTouchShot );
	}

	if ( elTouchSpawn ) {
		new TouchButton( 'respawnButton', elTouchSpawn );
	}
}