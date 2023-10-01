class ControlType1 {
	body = null;

	constructor ( body ) {
		this.body = body;
	}

	act () {
		if ( window.keys[ 'KeyW' ] ) {
			this.body.moveForward();
		}

		if ( window.keys[ 'KeyS' ] ) {
			this.body.moveBackward();
		}

		if ( window.keys[ 'KeyQ' ] ) {
			this.body.moveLeft();
		}

		if ( window.keys[ 'KeyE' ] ) {
			this.body.moveRight();
		}

		if ( window.keys[ 'KeyA' ] ) {
			this.body.rotateLeft();
		}

		if ( window.keys[ 'KeyD' ] ) {
			this.body.rotateRight();
		}

		if ( window.keys[ 'Space' ] ) {
			this.body.shot();
		}

		if ( window.directionControllerOffset.x < -.5 ) {
			this.body.rotateLeft();
		}

		if ( window.directionControllerOffset.x > .5 ) {
			this.body.rotateRight();
		}

		if ( window.directionControllerOffset.y < -.5 ) {
			this.body.moveForward();
		}

		if ( window.directionControllerOffset.y > .5 ) {
			this.body.moveBackward();
		}

		if ( window.touchButtons[ 'shotButton' ] ) {
			this.body.shot();
		}
	}

	info () {
		return null;
	}
}

export default ControlType1;
