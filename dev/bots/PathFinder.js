import Vector from '../util/Vector.js';
import Finder from '../pathfinding/AStarFinder.js';
import Heuristic from '../pathfinding/Heuristic.js';
import Util from '../pathfinding/Util.js';

class PathFinder {
	body = null;
	target = null;
	distance = Infinity;
	// direction = null;
	// angle = null;
	finder = null;
	grid = null;
	path = null;

	constructor ( body ) {
		this.body = body;
		this.body.onRender = this.render.bind( this );
		this.finder = new Finder({
			allowDiagonal: true,
			dontCrossCorners: true,
			heuristic: Heuristic.chebyshev
		});
	}

	scan () {
		this.target = null;
		this.distance = Infinity;

		// TODO глобальная переменная window.map это плохо
		Object.keys( window.map.unitLayer ).map( ( item ) => {
			let target = window.map.unitLayer[ item ];
			let distance = Math.sqrt( Math.pow( target.x - this.body.x, 2 ) + Math.pow( target.y - this.body.y, 2 ) );

			if ( this.body !== target && target.fraction && this.body.fraction !== target.fraction && target.alive && distance < this.distance ) {
				this.distance = distance;
				this.target = target;
			}
		});
	}

	calculate () {
		this.grid = this.body.map.grid.clone();

		this.body.gridArr.forEach( ( cell ) => {
			this.grid.nodes[cell.y][cell.x].walkable = true;
		});

		this.target.gridArr.forEach( ( cell ) => {
			this.grid.nodes[cell.y][cell.x].walkable = true;
		});

		this.path = this.finder.findPath(
			this.body.gridPos.x,
			this.body.gridPos.y,
			this.target.gridPos.x,
			this.target.gridPos.y,
			this.grid
		);

		if ( this.path && this.path.length ) {
			this.path = Util.smoothenPath( this.grid, this.path );
			this.direction = new Vector({ x: this.path[1][0] * 10 - this.body.x, y: this.path[1][1] * 10 - this.body.y });
			// TODO переделать определение угла
			this.angle =
				Math.atan2( this.body.d.x, this.body.d.y ) -
				Math.atan2( this.direction.x, this.direction.y );
		}
	}

	rotate () {
		if ( this.angle < 0 && this.angle > - Math.PI ) {
			this.body.rotateLeft();
		} else if ( this.angle < 0 && this.angle < - Math.PI ) {
			this.body.rotateRight();
		} else if ( this.angle > 0 && this.angle < Math.PI ) {
			this.body.rotateRight();
		} else if ( this.angle > 0 && this.angle > Math.PI ) {
			this.body.rotateLeft();
		}
	}

	move () {
		if ( this.distance > 200 ) {
			this.body.moveForward();
		} else if ( this.distance < 100 ) {
			this.body.moveBackward();
		}
	}

	attack () {
		if ( this.distance < 300 ) {
			this.body.shot();
		}
	}

	act () {
		this.scan();

		if ( this.target && this.target.alive ) {
			this.calculate();
			this.rotate();
			this.move();
			this.attack();
		}
	}

	render () {
		let
			ctx = this.body.map.ctx,
			offset = this.body.map.offset,
			csz = this.body.map.cellSize;

		ctx.globalAlpha = .3;
		ctx.strokeStyle = this.body.color;
		ctx.beginPath();

		if ( this.path ) {
			this.path.forEach( ( cell ) => {
				ctx.lineTo( offset.x + cell[0] * csz, offset.y + cell[1] * csz );
				ctx.moveTo( offset.x + cell[0] * csz, offset.y + cell[1] * csz );
			});
		}

		ctx.closePath();
		ctx.stroke();
		ctx.globalAlpha = 1;
	}

	info () {
		return {
			target: this.target && this.target.type,
			direction: this.direction,
			distance: this.distance,
			angle: this.angle
		};
	}
}

export default PathFinder;
