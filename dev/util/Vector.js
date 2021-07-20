import merge from '../util/merge.js';

// class Vector {
// 	constructor ( object ) {
// 		this.vector = Object.assign( {}, object )
// 	}
//
// 	clone () {
// 		return new Vector( this.toObject() );
// 	}
//
// 	toObject () {
// 		return Object.assign( {}, this.vector );
// 	}
//
// 	getComponents () {
// 		return Object.keys( this.vector );
// 	}
//
// 	get ( component ) {
// 		return this.vector[ component ];
// 	}
//
// 	set ( component, value ) {
// 		this.vector[ component ] = value;
// 	}
//
// 	isEqual ( vector ) {
// 		const keys = this.getComponents();
// 		const vectorKeys = vector.getComponents();
//
// 		if ( keys.length !== vectorKeys.length ) {
// 			return false;
// 		}
//
// 		for ( let i = 0; i < keys.length; i += 1 ) {
// 			const k = keys[ i ];
//
// 			if ( this.vector[ k ] !== vector.vector[ k ] ) {
// 				return false;
// 			}
// 		}
//
// 		return true;
// 	}
//
// 	getDistance ( vector ) {
// 		const tmpVector = this.clone().subtract( vector );
// 		let d = 0;
//
// 		tmpVector.getComponents().forEach( ( k ) => {
// 			d += tmpVector.vector[ k ] * tmpVector.vector[ k ];
// 		} );
//
// 		return Math.sqrt( d );
// 	}
//
// 	getLength () {
// 		let l = 0;
//
// 		this.getComponents().forEach( ( k ) => {
// 			l += this.vector[ k ] * this.vector[ k ];
// 		} );
//
// 		return Math.sqrt( l );
// 	}
//
// 	getDotProduct ( vector ) {
// 		let dotProduct = 0;
//
// 		this.getComponents().forEach( ( k ) => {
// 			if ( vector.vector[ k ] !== undefined ) {
// 				dotProduct += this.vector[ k ] * vector.vector[ k ];
// 			}
// 		} );
//
// 		return dotProduct;
// 	}
//
// 	getCosineSimilarity ( vector ) {
// 		return this.getDotProduct( vector ) / (this.getLength() * vector.getLength());
// 	}
//
// 	normalize () {
// 		const l = this.getLength();
//
// 		return this.divide( l );
// 	}
//
// 	add ( vector ) {
// 		vector.getComponents().forEach( ( k ) => {
// 			if ( this.vector[ k ] !== undefined ) {
// 				this.vector[ k ] += vector.vector[ k ];
// 			} else {
// 				this.vector[ k ] = vector.vector[ k ];
// 			}
// 		} );
//
// 		return this;
// 	}
//
// 	subtract ( vector ) {
// 		vector.getComponents().forEach( ( k ) => {
// 			if ( this.vector[ k ] !== undefined ) {
// 				this.vector[ k ] -= vector.vector[ k ];
// 			} else {
// 				this.vector[ k ] = -vector.vector[ k ];
// 			}
// 		} );
//
// 		return this;
// 	}
//
// 	multiply ( scalar ) {
// 		this.getComponents().forEach( ( k ) => {
// 			this.vector[ k ] *= scalar;
// 		} );
//
// 		return this;
// 	}
//
// 	divide ( scalar ) {
// 		this.getComponents().forEach( ( k ) => {
// 			this.vector[ k ] /= scalar;
// 		} );
//
// 		return this;
// 	}
// }

function Vector ( obj ) {
	merge( this, Vector.defaults );
	merge( this, obj );
}

Vector.defaults = {
	x: 0,
	y: 0
};

Vector.prototype.set = function ( vec ) {
	this.x = vec.x;
	this.y = vec.y;
	return this;
};

Vector.prototype.isZero = function () {
	return ( this.x === 0 && this.y === 0 );
};

Vector.prototype.length = function () {
	return Math.sqrt( Math.pow( this.x, 2 ) + Math.pow( this.y, 2 ) );
};

Vector.prototype.angle = function () {
	return Math.atan2( this.y, this.x );
};

Vector.prototype.angleD = function () {
	return this.angle() * 180 / Math.PI;
};

Vector.prototype.add = function ( vec ) {
	this.x += vec.x;
	this.y += vec.y;
	return this;
};

Vector.prototype.subtract = function ( vec ) {
	this.x -= vec.x;
	this.y -= vec.y;
	return this;
}

Vector.prototype.multiply = function ( scalar ) {
	this.x *= scalar;
	this.y *= scalar;

	return this;
}

Vector.prototype.rotate = function ( rad ) {
	let
		x = this.x * Math.cos( rad ) - this.y * Math.sin( rad ),
		y = this.y * Math.cos( rad ) + this.x * Math.sin( rad );

	this.x = x;
	this.y = y;

	return this;
};

Vector.prototype.rotateD = function ( deg ) {
	this.rotate( deg * Math.PI / 180 );
	return this;
};

Vector.prototype.setLength = function ( length ) {
	let c = length / Math.sqrt( this.x * this.x + this.y * this.y  );
	this.x *= c;
	this.y *= c;
	return this;
};

export default Vector;
