class TouchController {
	id = null;
	debug = false;
	areaEl = null;
	pointerEl = null;
	infoEl = null;
	pointerSelector = '.direction-control-pointer';
	infoSelector = '.direction-control-info';
	rect = {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	};
	point = {
		x: 0,
		y: 0
	};
	offset = {
		x: 0,
		y: 0
	}

	constructor( id, el ) {
		this.id = id;
		this.areaEl = el;
		this.pointerEl = el.querySelector( this.pointerSelector );
		this.infoEl = el.querySelector( this.infoSelector );
		this.rect = this.areaEl.getBoundingClientRect();

		this.resetTouch();
		this.areaEl.addEventListener( 'touchstart', this.setTouch.bind( this ) );
		this.areaEl.addEventListener( 'touchmove', this.setTouch.bind( this ));
		this.areaEl.addEventListener( 'touchend', this.resetTouch.bind( this ));
	}

	event () {
		let event = new Event( `${this.id}:offset` );
		event.x = this.offset.x;
		event.y = this.offset.y;
		document.dispatchEvent( event );
	}

	setTouch ( event ) {
		this.rect = this.areaEl.getBoundingClientRect();
		this.point.x = event.changedTouches[0].clientX - this.rect.x;
		this.point.y = event.changedTouches[0].clientY - this.rect.y;

		if ( this.point.x > this.rect.width ) this.point.x = this.rect.width;
		if ( this.point.x < 0 ) this.point.x = 0;
		if ( this.point.y > this.rect.height ) this.point.y = this.rect.height;
		if ( this.point.y < 0 ) this.point.y = 0;

		this.updatePointer();
		this.updateOffset();
		this.info();
		this.event();
	}

	resetTouch () {
		this.rect = this.areaEl.getBoundingClientRect();
		this.point.x = this.rect.width / 2;
		this.point.y = this.rect.height / 2;
		this.updatePointer();
		this.updateOffset();
		this.info();
		this.event();
	}

	updatePointer () {
		this.pointerEl.style.left = this.point.x + 'px';
		this.pointerEl.style.top = this.point.y + 'px';
	}

	updateOffset () {
		this.offset.x = ( -2 / this.rect.width ) * ( this.rect.width / 2 - this.point.x );
		this.offset.y = ( -2 / this.rect.height ) * ( this.rect.height / 2 - this.point.y );
	}

	info () {
		if ( this.debug ) {
			this.infoEl.innerText = JSON.stringify({
				point: this.point,
				offset: this.offset
			}, null, 2);
		}
	}
}

export default TouchController;
