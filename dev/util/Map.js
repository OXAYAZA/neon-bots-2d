import merge from "./merge.js";
import objectsIntersect from "./objectsIntersect.js";
import Grid from "../pathfinding/Grid.js";

class Map {
	canvas = null;
	ctx = null;
	width;
	height;
	grid;
	cellSize = 10;
	offset = { x: 100, y: 100 };

	objects = {};
	collisionLayer = {};
	unitLayer = {};

	constructor ( props ) {
		if ( !props.width || props.width % this.cellSize ) {
			throw new Error( 'Map.width must be nonzero and multiple of Map.cell size' );
		}

		if ( !props.height || props.height % this.cellSize ) {
			throw new Error( 'Map.height must be nonzero and multiple of Map.cell size' );
		}

		merge( this, props );
	}

	resetGrid () {
		this.grid = new Grid(
			Math.round( this.width / this.cellSize ),
			Math.round( this.height / this.cellSize ),
		);
	}

	add ( obj ) {
		obj.id = obj.id || Math.random().toString( 36 ).substr( 2, 9 );
		obj.map = this;
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

	calc ( delta ) {
		this.resetGrid();

		for ( let id in this.objects ) {
			let obj = this.objects[ id ];
			obj.live( delta / 1000 );
		}

		this.checkIntersections();
	}

	checkIntersections () {
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
	}

	render () {
		for ( let id in this.objects ) {
			this.objects[ id ].render( this.offset );
		}

		this.renderGrid();
		// this.renderCells();
		// this.renderBorder();
	}

	renderBorder () {
		this.ctx.strokeStyle = 'rgb( 255, 255 ,255 )';
		this.ctx.beginPath();
		this.ctx.rect( this.offset.x, this.offset.y, this.width, this.height );
		this.ctx.closePath();
		this.ctx.stroke();
	}

	renderGrid () {
		for ( let y = 1; y < this.grid.height; y++ ) {
			this.ctx.globalAlpha = .1;
			this.ctx.strokeStyle = 'rgb( 0, 0 ,0 )';
			this.ctx.beginPath();
			this.ctx.moveTo( this.offset.x, this.offset.y + y * this.cellSize );
			this.ctx.lineTo( this.offset.x + this.width, this.offset.y + y * this.cellSize );
			this.ctx.closePath();
			this.ctx.stroke();
			this.ctx.globalAlpha = 1;
		}

		for ( let x = 1; x < this.grid.width; x++ ) {
			this.ctx.globalAlpha = .1;
			this.ctx.strokeStyle = 'rgb( 0, 0 ,0 )';
			this.ctx.beginPath();
			this.ctx.moveTo( this.offset.x + x * this.cellSize, this.offset.y );
			this.ctx.lineTo( this.offset.x + x * this.cellSize, this.offset.y + this.height );
			this.ctx.closePath();
			this.ctx.stroke();
			this.ctx.globalAlpha = 1;
		}
	}

	renderCells () {
		for ( let y = 0; y < this.grid.height; y++ ) {
			for ( let x = 0; x < this.grid.width; x++ ) {
				let cell = this.grid.nodes[y][x];
				if ( cell.obj ) {
					this.ctx.globalAlpha = .3;
					this.ctx.strokeStyle = cell.obj.color;
					this.ctx.beginPath();
					this.ctx.rect(
						this.offset.x + x * this.cellSize,
						this.offset.y + y * this.cellSize,
						this.cellSize,
						this.cellSize
					);
					this.ctx.closePath();
					this.ctx.stroke();
					this.ctx.globalAlpha = 1;
				} else if ( !cell.walkable ) {
					this.ctx.globalAlpha = .3;
					this.ctx.strokeStyle = 'rgb( 255, 255, 255 )';
					this.ctx.beginPath();
					this.ctx.rect(
						this.offset.x + x * this.cellSize,
						this.offset.y + y * this.cellSize,
						this.cellSize,
						this.cellSize
					);
					this.ctx.closePath();
					this.ctx.stroke();
					this.ctx.globalAlpha = 1;
				}
			}
		}
	}

	cellFigure ( cx, cy ) {
		let
			cs = this.cellSize,
			points = [
				{ x: cx * cs , y: cy * cs },
				{ x: cx * cs + cs , y: cy * cs },
				{ x: cx * cs + cs , y: cy * cs + cs },
				{ x: cx * cs , y: cy * cs + cs }
			],
			segments = [
				[ points[0], points[1] ],
				[ points[1], points[2] ],
				[ points[2], points[3] ],
				[ points[3], points[0] ]
			];

		return {
			figureFinal: points,
			figureSegments: segments
		}
	}
}

export default Map;
