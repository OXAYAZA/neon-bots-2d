// Canvas prototype
function Canvas () {
	this.node = document.getElementById( 'root' );
	this.ctx = this.node.getContext( '2d' );
	this.rect = null;
	this.objects = {};
	this.units = {};
	this.bullets = {};
	this.state = 'play';
	this.node.canvas = this;

	this.resize();
	window.addEventListener( 'resize', this.resize.bind( this ) );
	this.render();
}

Canvas.segmentsIntersect = function ( x1, y1, x2, y2, x3, y3, x4, y4 ) {
	let a_dx = x2 - x1;
	let a_dy = y2 - y1;
	let b_dx = x4 - x3;
	let b_dy = y4 - y3;
	let s = (-a_dy * (x1 - x3) + a_dx * (y1 - y3)) / (-b_dx * a_dy + a_dx * b_dy);
	let t = (+b_dx * (y1 - y3) - b_dy * (x1 - x3)) / (-b_dx * a_dy + a_dx * b_dy);
	return (s >= 0 && s <= 1 && t >= 0 && t <= 1) ? [x1 + t * a_dx, y1 + t * a_dy] : false;
}

Canvas.prototype.render = function () {
	if ( this.state === 'play' ) {
		requestAnimationFrame( this.render.bind( this ) );
	}

	this.ctx.clearRect( 0, 0, this.rect.width, this.rect.height );

	for ( let bID in this.bullets ) {
		let bullet = this.bullets[ bID ];

		if ( !bullet.fPoints ) continue;
		let bSegments = bullet.fPoints.map( function ( point, index, points ) {
			return [ point, points[ ( points.length > index + 1 ) ? index + 1 : 0 ] ];
		});

		for ( let uID in this.units ) {
			let unit = this.units[ uID ];

			if ( !unit.fPoints ) continue;
			let uSegments = unit.fPoints.map( function ( point, index, points ) {
				return [ point, points[ ( points.length > index + 1 ) ? index + 1 : 0 ] ];
			});

			bSegments.forEach( function ( bSegment ) {
				uSegments.forEach( function ( uSegment ) {
					let intersection = Canvas.segmentsIntersect(
						bSegment[0].x,
						bSegment[0].y,
						bSegment[1].x,
						bSegment[1].y,
						uSegment[0].x,
						uSegment[0].y,
						uSegment[1].x,
						uSegment[1].y,
					);

					if ( intersection ) {
						bullet.die();
						unit.die();
					}
				});
			});
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
	if ( obj.type === 'Unit' ) this.units[ obj.id ] = obj;
	if ( obj.type === 'Bullet' ) this.bullets[ obj.id ] = obj;
};

Canvas.prototype.remove = function ( obj ) {
	delete this.objects[ obj.id ];
	if ( obj.type === 'Unit' ) delete this.units[ obj.id ];
	if ( obj.type === 'Bullet' ) delete this.bullets[ obj.id ];
};

export default Canvas;
