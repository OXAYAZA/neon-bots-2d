// Canvas prototype
function Canvas () {
	this.node = document.getElementById( 'root' );
	this.ctx = this.node.getContext( '2d' );
	this.rect = null;
	this.objects = {};
	this.collisionLayer = {};
	this.state = 'play';
	this.node.canvas = this;

	this.resize();
	window.addEventListener( 'resize', this.resize.bind( this ) );
	this.render();
}

Canvas.checkSegmentsIntersection = function ( x1, y1, x2, y2, x3, y3, x4, y4 ) {
	let a_dx = x2 - x1;
	let a_dy = y2 - y1;
	let b_dx = x4 - x3;
	let b_dy = y4 - y3;
	let s = (-a_dy * (x1 - x3) + a_dx * (y1 - y3)) / (-b_dx * a_dy + a_dx * b_dy);
	let t = (+b_dx * (y1 - y3) - b_dy * (x1 - x3)) / (-b_dx * a_dy + a_dx * b_dy);
	return (s >= 0 && s <= 1 && t >= 0 && t <= 1) ? [x1 + t * a_dx, y1 + t * a_dy] : false;
};

Canvas.checkIntersection = function ( obj1, obj2 ) {
	let intersect = false;

	outer: for ( let i1 = 0; i1 < obj1.figureSegments.length; i1++ ) {
		for ( let i2 = 0; i2 < obj2.figureSegments.length; i2++ ) {
			let
				segment1 = obj1.figureSegments[ i1 ],
				segment2 = obj2.figureSegments[ i2 ],
				tmp = Canvas.checkSegmentsIntersection(
					segment1[0].x,
					segment1[0].y,
					segment1[1].x,
					segment1[1].y,
					segment2[0].x,
					segment2[0].y,
					segment2[1].x,
					segment2[1].y
				);

			if ( tmp ) {
				intersect = true;
				break outer;
			}
		}
	}

	return intersect;
};

Canvas.prototype.render = function () {
	if ( this.state === 'play' ) {
		requestAnimationFrame( this.render.bind( this ) );
	}

	this.ctx.clearRect( 0, 0, this.rect.width, this.rect.height );

	for ( let u1ID in this.collisionLayer ) {
		let u1 = this.collisionLayer[ u1ID ];
		if ( !u1.figureSegments ) continue;

		for ( let u2ID in this.collisionLayer ) {
			let u2 = this.collisionLayer[ u2ID ];
			if ( u1 === u2 || !u2.figureSegments ) continue;

			if ( Canvas.checkIntersection( u1, u2 ) ) {
				if ( u1.collide ) u1.collision( u2 );
				if ( u2.collide ) u2.collision( u1 );
			}
		}
	}

	for ( let id in this.objects ) {
		let obj = this.objects[ id ];
		obj.live();
		obj.render();
	}
};

Canvas.prototype.resize = function () {
	this.rect = this.node.getBoundingClientRect();
	this.node.width = this.rect.width;
	this.node.height = this.rect.height;
};

Canvas.prototype.add = function ( obj ) {
	obj.id = Math.random().toString( 36 ).substr( 2, 9 );
	this.objects[ obj.id ] = obj;
	if ( obj.collide ) this.collisionLayer[ obj.id ] = obj;
	obj.live();
};

Canvas.prototype.remove = function ( obj ) {
	delete this.objects[ obj.id ];
	if ( obj.collide ) delete this.collisionLayer[ obj.id ];
};

export default Canvas;
