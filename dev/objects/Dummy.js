import merge from "../util/merge.js";
import Unit from './Unit.js';

class Dummy extends Unit {
	mass = 200;
	reloadTime = .4;
	figureInitial = [
		{ x: 20, y: -3 },
		{ x: 10,   y: -10 },
		{ x: -10,  y: -10 },
		{ x: 0,  y: 0 },
		{ x: -10,  y: 10 },
		{ x: 10,  y: 10 },
		{ x: 20, y: 3 }
	];
	bulletSlots = [
		{ x: 30, y: 0, a: 0 }
	];

	constructor ( props ) {
		super( props );
		merge( this, props );
	}
}

export default Dummy;
