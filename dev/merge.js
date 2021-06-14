/**
 * Merging of two objects
 * @param {Object} source
 * @param {Object} merged
 * @return {Object}
 */
function merge( source, merged ) {
	for ( let key in merged ) {
		if ( merged[ key ] instanceof Object && merged[ key ].constructor.name === 'Object' ) {
			if ( typeof( source[ key ] ) !== 'object' ) source[ key ] = {};
			source[ key ] = merge( source[ key ], merged[ key ] );
		} else if ( merged[ key ] !== null ) {
			source[ key ] = merged[ key ];
		}
	}

	return source;
}

export default merge;