// Unit prototype
function Unit ( opts ) {
	Object.assign( this, Unit.defaults, opts ); // https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	if ( !this.canvas ) throw new Error( 'ctx is a required parameter!' );
}

Unit.defaults = {
	canvas: null,
	id: null,
	x: 0,
	y: 0,
	ax: 0,
	ay: 0,
	hp: 100,
	speed: 10,
	color: 'hsl( 50, 100%, 50% )',

	points: [
		{ x: 0, y: 6 },
		{ x: 2, y: 2 },
		{ x: 2, y: -4 },
		{ x: -2, y: -4 },
		{ x: -2, y: 2 },
	],

	fPoint: { x: 0, y: -5 },

	destX: 0,
	destY: 0
};

Unit.rotate = function ( point, angle ) {
	return {
		x: point.x * Math.cos( angle ) - point.y * Math.sin( angle ),
		y: point.y * Math.cos( angle ) + point.x * Math.sin( angle )
	};
};

Unit.prototype.live = function () {
	this.color = `hsl( ${ 100 / 400 * this.hp }, 100%, 50% )`;

	this.ax = ( this.destX - this.x ) / this.canvas.rect.width * this.speed;
	this.ay = ( this.destY - this.y ) / this.canvas.rect.height * this.speed;

	this.angle = Math.atan2( -this.ax, this.ay );

	this.x += this.ax;
	this.y += this.ay;

	this.hp -= 1;

	if ( this.hp <= 0 ) this.die();
};

Unit.prototype.die = function () {
	let explosion = ~~( Math.random() * 360 );

	for ( let i = 0; i < 30; i++ ) {
		this.canvas.add( new Particle({
			x: this.x,
			y: this.y,
			width: 4,
			height: 4,
			ax: Math.random() * 20 - 10,
			ay: Math.random() * 20 - 10,
			canvas: this.canvas,
			hue: explosion
		}));
	}

	delete this.canvas.objects[ this.id ];
};

Unit.prototype.render = function () {
	this.canvas.ctx.fillStyle = this.color;
	this.canvas.ctx.beginPath();

	this.points.forEach( ( point, index ) => {
		let final = Unit.rotate( point, this.angle );
		if ( index ) this.canvas.ctx.lineTo( this.x + final.x, this.y + final.y );
		else this.canvas.ctx.moveTo( this.x + final.x, this.y + final.y );
	});

	let fFinal = Unit.rotate( this.fPoint, this.angle );
	this.canvas.add( new Particle({
		x: this.x + fFinal.x,
		y: this.y + fFinal.y,
		width: 4,
		height: 4,
		ax: Math.random() * 2 - 1,
		ay: Math.random() * 2 - 1,
		canvas: this.canvas
	}));

	this.canvas.ctx.fill();
};