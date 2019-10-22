// Unit prototype
function Unit ( opts ) {
	Object.assign( this, Unit.defaults, opts ); // https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	if ( !this.ctx ) throw new Error( 'ctx is a required parameter!' );
}

Unit.defaults = {
	x: 0,
	y: 0,
	width: 10,
	height: 10,
	color: 'rgb(200, 0, 0)',
	ctx: null
};

Unit.prototype.render = function () {
	this.ctx.fillStyle = this.color;
	this.ctx.fillRect( this.x, this.y, this.width, this.height );
};


// Canvas prototype
function Canvas () {
	this.node = document.getElementById( 'root' );
	this.ctx = this.node.getContext( '2d' );
	this.rect = null;
	this.objects = [];

	this.resize();
	window.addEventListener( 'resize', this.resize.bind( this ) );
	setInterval( this.render.bind( this ), 40 );
}

Canvas.prototype.render = function () {
	this.objects.forEach( function ( obj ) {
		obj.render();
	});
};

Canvas.prototype.resize = function () {
	this.rect = this.node.getBoundingClientRect();
	this.node.width = this.rect.width;
	this.node.height = this.rect.height;
};


// Main
window.addEventListener( 'load', function () {
	let canvas = new Canvas();

	canvas.node.addEventListener( 'click', function ( event )  {
		canvas.objects.push( new Unit({
			color: `rgb(${~~(Math.random() * 255)}, ${~~(Math.random() * 255)}, ${~~(Math.random() * 255)})`,
			x: event.clientX,
			y: event.clientY,
			ctx: canvas.ctx
		}));
	});
});
