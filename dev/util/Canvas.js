import merge from './merge.js';
import figuresIntersect from './figuresIntersect.js';

// Canvas prototype
function Canvas ( props ) {
	this.node = document.getElementById( 'root' );
	this.ctx = this.node.getContext( '2d' );
	this.middle = null;
	this.rect = null;
	this.objects = {};
	this.collisionLayer = {};
	this.unitLayer = {};
	this.state = 'play';
	this.node.canvas = this;
	this.deltaTime = 0;
	this.lastTime = 0;
	this.grid = [];

	merge( this, props );

	this.resize();
	window.addEventListener( 'resize', this.resize.bind( this ) );
	this.render();
}

Canvas.prototype.render = function ( currentTime = 0 ) {
	if ( this.state === 'play' ) {
		requestAnimationFrame( this.render.bind( this ) );
	}

	this.deltaTime = currentTime - this.lastTime;
	this.ctx.clearRect( 0, 0, this.rect.width, this.rect.height );

	for ( let u1ID in this.collisionLayer ) {
		let u1 = this.collisionLayer[ u1ID ];
		if ( !u1.figureSegments ) continue;

		for ( let u2ID in this.collisionLayer ) {
			let u2 = this.collisionLayer[ u2ID ];
			if ( u1 === u2 || !u2.figureSegments ) continue;

			if ( figuresIntersect( u1.figureSegments, u2.figureSegments ) ) {
				if ( u1.collide ) u1.collision( u2 );
				if ( u2.collide ) u2.collision( u1 );
			}
		}
	}

	if ( this.middle instanceof Function ) this.middle.call( this );

	this.resetGrid();

	for ( let id in this.objects ) {
		let obj = this.objects[ id ];
		obj.live( this.deltaTime / 1000 );
		obj.render();
	}

	this.renderGrid();
	this.lastTime = currentTime;
};

Canvas.prototype.resize = function () {
	this.rect = this.node.getBoundingClientRect();
	this.node.width = this.rect.width;
	this.node.height = this.rect.height;
};

Canvas.prototype.resetGrid = function () {
	this.grid = new Array( Math.round( this.rect.width / 10 ) );

	for ( let x = 0; x < this.grid.length; x++ ) {
		this.grid[x] = new Array( Math.round( this.rect.height / 10 ) );
	}
}

Canvas.prototype.renderGrid = function () {
	for ( let x = 0; x < this.grid.length; x++ ) {
		for ( let y = 0; y < this.grid[x].length; y++ ) {
			if ( this.grid[x][y] ) {
				let obj = this.grid[x][y];
				this.ctx.globalAlpha = .3;
				this.ctx.strokeStyle = obj.color;
				this.ctx.beginPath();
				this.ctx.rect( x*10-4, y*10-4, 9, 9 );
				this.ctx.closePath();
				this.ctx.stroke();
				this.ctx.globalAlpha = 1;
			}
		}
	}
}

Canvas.prototype.add = function ( obj ) {
	obj.id = Math.random().toString( 36 ).substr( 2, 9 );
	this.objects[ obj.id ] = obj;
	if ( obj.collide ) this.collisionLayer[ obj.id ] = obj;
	if ( obj.type === 'Unit' ) this.unitLayer[ obj.id ] = obj;
	obj.live();
};

Canvas.prototype.remove = function ( obj ) {
	delete this.objects[ obj.id ];
	if ( obj.collide ) delete this.collisionLayer[ obj.id ];
	if ( obj.type === 'Unit' ) delete this.unitLayer[ obj.id ];
};

export default Canvas;