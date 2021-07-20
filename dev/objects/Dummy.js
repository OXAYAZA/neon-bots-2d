import merge from "../util/merge.js";
import Unit from './Unit.js';

class Dummy extends Unit {
	mass = 200;
	hpInitial = 10;
	reloadTime = .4;
	figureInitial = [
		{ x: 0, y: 0 },
		{ x: -10, y: -10 },
		{ x: 10, y: -10 },
		{ x: 20, y: -3 },
		{ x: 20, y: 3 },
		{ x: 10, y: 10 },
		{ x: -10, y: 10 },
	];
	bulletSlots = [
		{ x: 30, y: 0, a: 0 }
	];

	constructor ( props ) {
		super( props );
		merge( this, props );
		this.hp = this.hpInitial;
	}
}

export default Dummy;
