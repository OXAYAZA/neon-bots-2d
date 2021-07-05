class TouchController {
	areaEl = null;
	pointerEl = null;
	infoEl = null;
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

	constructor( el ) {
		this.areaEl = el;
		this.pointerEl = el.querySelector( '#direction-control-pointer' );
		this.infoEl = el.querySelector( '#direction-control-info' );
		this.rect = this.areaEl.getBoundingClientRect();

		console.log( this );

		this.areaEl.addEventListener( 'touchstart', ( event ) => {
			this.rect = this.areaEl.getBoundingClientRect();
			this.point.x = event.changedTouches[0].clientX - this.rect.x;
			this.point.y = event.changedTouches[0].clientY - this.rect.y;
			this.updatePointer();
			this.updateOffset();
			this.info();
		});

		this.areaEl.addEventListener( 'touchmove', ( event ) => {
			this.rect = this.areaEl.getBoundingClientRect();
			this.point.x = event.changedTouches[0].clientX - this.rect.x;
			this.point.y = event.changedTouches[0].clientY - this.rect.y;
			this.updatePointer();
			this.updateOffset();
			this.info();
		});

		this.areaEl.addEventListener( 'touchend', ( event ) => {
			this.rect = this.areaEl.getBoundingClientRect();
			this.point.x = this.rect.width / 2;
			this.point.y = this.rect.height / 2;
			this.updatePointer();
			this.updateOffset();
			this.info();
		});
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
		this.infoEl.innerText = JSON.stringify({
			point: this.point,
			offset: this.offset
		}, null, 2);
	}
}

export default TouchController;