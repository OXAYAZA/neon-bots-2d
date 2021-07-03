import Unit from './Unit.js';

class Dummy extends Unit {
	mass = 200;
	reloadTime = 20;
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
		{ x: 21, y: 0, a: 0 }
	];
}

export default Dummy;
