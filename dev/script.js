// Unit prototype
function Unit ( opts ) {
	Object.assign( this, Unit.defaults, opts ); // https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	if ( !this.canvas ) throw new Error( 'ctx is a required parameter!' );
}

Unit.defaults = {
	id: null,
	x: 0,
	y: 0,
	ax: 0,
	ay: 1,
	width: 10,
	height: 10,
	hp: 10,
	color: 'rgb(200, 0, 0)',
	canvas: null
};

Unit.prototype.live = function () {
	this.x += this.ax;
	this.y += this.ay;
	this.hp -= 1;

	if ( this.hp <= 0 ) this.die();
};

Unit.prototype.die = function () {
	delete this.canvas.objects[ this.id ];
};

Unit.prototype.render = function () {
	this.canvas.ctx.fillStyle = this.color;
	this.canvas.ctx.fillRect( this.x, this.y, this.width, this.height );
};


// Canvas prototype
function Canvas () {
	this.node = document.getElementById( 'root' );
	this.ctx = this.node.getContext( '2d' );
	this.rect = null;
	this.objects = {};
	this.node.canvas = this;

	this.resize();
	window.addEventListener( 'resize', this.resize.bind( this ) );
	setInterval( this.render.bind( this ), 40 );
}

Canvas.prototype.render = function () {
	this.ctx.clearRect( 0, 0, this.rect.width, this.rect.height );

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
};


// Main
window.addEventListener( 'load', function () {
	let
		canvas = new Canvas(),
		hue = 0;

	canvas.node.addEventListener( 'mousemove', function ( event )  {
		hue = hue >= 360 ? 0 : hue + 1;

		canvas.add( new Unit({
			color: `hsl(${hue}deg, 100%, 50%)`,
			x: event.clientX,
			y: event.clientY,
			ax: Math.random() * 2 - 1,
			ay: Math.random() * 2 - 1,
			canvas: canvas
		}));
	});
});
