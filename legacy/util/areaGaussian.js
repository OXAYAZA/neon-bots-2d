export default function areaGaussian ( points ) {
	let
		tmp1 = 0,
		tmp2 = 0;

	for ( let i = 0; i < points.length; i++ ) {
		if ( i !== points.length -1 ) {
			tmp1 += ( points[i].x * points[i+1].y );
			tmp2 += ( points[i].y * points[i+1].x );
		} else {
			tmp1 += ( points[i].x * points[0].y );
			tmp2 += ( points[i].y * points[0].x );
		}
	}

	return Math.abs( tmp1 - tmp2 ) / 2;
}
