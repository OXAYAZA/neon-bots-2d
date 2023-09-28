import segmentsIntersect from "./segmentsIntersect.js";
import pointInPoly from "./pointInPoly.js";

export default function objectsIntersect ( obj1, obj2 ) {
	let intersect = false;

	outer: for ( let i1 = 0; i1 < obj1.figureSegments.length; i1++ ) {
		for ( let i2 = 0; i2 < obj2.figureSegments.length; i2++ ) {
			let
				segment1 = obj1.figureSegments[ i1 ],
				segment2 = obj2.figureSegments[ i2 ],
				tmp = segmentsIntersect(
					segment1[0].x,
					segment1[0].y,
					segment1[1].x,
					segment1[1].y,
					segment2[0].x,
					segment2[0].y,
					segment2[1].x,
					segment2[1].y
				);

			if ( tmp ) {
				intersect = {
					type: 'segment',
					segment1: segment1,
					segment2: segment2
				};
				break outer;
			}
		}
	}

	if ( !intersect ) {
		for ( let i = 0; i < obj1.figureFinal.length; i++ ) {
			let
				point = obj1.figureFinal[ i ],
				tmp = pointInPoly( point.x, point.y, obj2.figureFinal );

			if ( tmp ) {
				intersect = {
					type: 'entry',
					point: point
				};
				break;
			}
		}
	}

	if ( !intersect ) {
		for ( let i = 0; i < obj2.figureFinal.length; i++ ) {
			let
				point = obj2.figureFinal[ i ],
				tmp = pointInPoly( point.x, point.y, obj1.figureFinal );

			if ( tmp ) {
				intersect = {
					type: 'entry',
					point: point
				};
				break;
			}
		}
	}

	return intersect;
};
