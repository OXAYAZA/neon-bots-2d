import merge from './merge.js';
import objectsIntersect from './objectsIntersect.js';
import Grid from '../pathfinding/Grid.js';

class Canvas {
	node;
	ctx;
	rect;
	state = 'play';
	deltaTime = 0;
	lastTime = 0;
	grid = null;

	objects = {};
	collisionLayer = {};
	unitLayer = {};

	onMiddle = [];
	onEnd = [];

	constructor ( props ) {
		// TODO Проверки свойств
		merge( this, props );
		console.log( this );

		this.ctx = this.node.getContext( '2d' );
		this.resize();
		window.addEventListener( 'resize', this.resize.bind( this ) );
		this.render( performance.now() );
	}

	render ( currentTime = 0 ) {
		if ( this.state === 'play' ) {
			requestAnimationFrame( this.render.bind( this ) );
		}

		this.resetGrid();

		this.deltaTime = currentTime - this.lastTime;
		this.ctx.clearRect( 0, 0, this.rect.width, this.rect.height );

		for ( let u1ID in this.collisionLayer ) {
			let u1 = this.collisionLayer[ u1ID ];
			if ( !u1.figureSegments ) continue;

			for ( let u2ID in this.collisionLayer ) {
				let u2 = this.collisionLayer[ u2ID ];
				if ( u1 === u2 || !u2.figureSegments ) continue;

				if ( objectsIntersect( u1, u2 ) ) {
					if ( u1.collide ) u1.collision( u2 );
					if ( u2.collide ) u2.collision( u1 );
				}
			}
		}

		this.onMiddle.forEach( ( cb ) => {
			if ( cb instanceof Function ) cb.call( this );
		});

		for ( let id in this.objects ) {
			let obj = this.objects[ id ];
			obj.live( this.deltaTime / 1000 );
			obj.render();
		}

		this.onEnd.forEach( ( cb ) => {
			if ( cb instanceof Function ) cb.call( this );
		});

		this.renderGrid();
		this.lastTime = currentTime;
	}

	resize () {
		this.rect = this.node.getBoundingClientRect();
		this.node.width = this.rect.width;
		this.node.height = this.rect.height;
	}

	resetGrid () {
		this.grid = new Grid(
			Math.round( this.rect.width / 10 ),
			Math.round( this.rect.height / 10 ),
		);
	}

	renderGrid () {
		for ( let x = 0; x < this.grid.width; x++ ) {
			for ( let y = 0; y < this.grid.height; y++ ) {
				if ( !this.grid.nodes[y][x].walkable ) {
					let obj = this.grid.nodes[y][x].obj;
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

	add ( obj ) {
		obj.id = Math.random().toString( 36 ).substr( 2, 9 );
		this.objects[ obj.id ] = obj;
		if ( obj.collide ) this.collisionLayer[ obj.id ] = obj;
		if ( obj.type === 'Unit' ) this.unitLayer[ obj.id ] = obj;
		obj.live();
	};

	remove ( obj ) {
		delete this.objects[ obj.id ];
		if ( obj.collide ) delete this.collisionLayer[ obj.id ];
		if ( obj.type === 'Unit' ) delete this.unitLayer[ obj.id ];
	};
}

export default Canvas;
