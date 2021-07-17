import segmentsIntersect from "./segmentsIntersect.js";

export default function figuresIntersect ( fs1, fs2 ) {
	let intersect = false;

	outer: for ( let i1 = 0; i1 < fs1.length; i1++ ) {
		for ( let i2 = 0; i2 < fs2.length; i2++ ) {
			let
				segment1 = fs1[ i1 ],
				segment2 = fs2[ i2 ],
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
				intersect = true;
				break outer;
			}
		}
	}

	return intersect;
};
