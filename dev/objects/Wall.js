import merge from "../util/merge.js";
import Obj from "./Obj.js";

class Wall extends Obj {
	collide = true;
	figureInitial = [
		{ x: -108,  y: -7 },
		{ x: -108,  y: 7 },
		{ x: 108,  y: 7 },
		{ x: 108, y: -7 }
	];

	constructor ( props ) {
		super( props );
		merge( this, props );
	}

	collision ( obj ) {
		if ( obj.type === 'Unit' ) {
			obj.die();
		}
	}
}

export default Wall;
