/*
https://ru.wikibooks.org/wiki/Реализации_алгоритмов/Задача_о_принадлежности_точки_многоугольнику
 */

export default function pointInPoly ( x, y, poly ) {
	let
		n = poly.length,
		j = n - 1,
		c = 0;

	for ( let i = 0; i < n; i++ ) {
		if (
			( ( ( poly[i].y <= y ) && ( y < poly[j].y ) ) || ( ( poly[j].y <= y ) && ( y < poly[i].y ) ) ) &&
			( x > ( poly[j].x - poly[i].x ) * ( y - poly[i].y ) / ( poly[j].y - poly[i].y ) + poly[i].x )
		) {
			c = !c;
		}
		j = i;
	}

	return !!c;
}
