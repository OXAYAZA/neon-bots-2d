// Canvas prototype
function Canvas () {
	this.node = document.getElementById( 'root' );
	this.ctx = this.node.getContext( '2d' );
	this.rect = null;
	this.objects = {};
	this.node.canvas = this;

	this.resize();
	window.addEventListener( 'resize', this.resize.bind( this ) );
	this.render();
}

Canvas.prototype.render = function () {
	requestAnimationFrame( this.render.bind( this ) );

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
