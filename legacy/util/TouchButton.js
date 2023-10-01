class TouckButton {
	id = null;
	el = null;
	debug = true;
	state = false;

	constructor ( id, el ) {
		this.id = id;
		this.el = el;

		this.el.addEventListener( 'touchstart', () => {
			this.state = true;
			this.event();
		});

		this.el.addEventListener( 'touchend', () => {
			this.state = false;
			this.event();
		});
	}

	event () {
		let event = new Event( `${this.id}:state` );
		event.state = this.state;
		document.dispatchEvent( event );
	}
}

export default TouckButton;
