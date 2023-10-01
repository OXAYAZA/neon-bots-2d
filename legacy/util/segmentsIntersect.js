export default function segmentsIntersect ( x1, y1, x2, y2, x3, y3, x4, y4 ) {
	let a_dx = x2 - x1;
	let a_dy = y2 - y1;
	let b_dx = x4 - x3;
	let b_dy = y4 - y3;
	let s = (-a_dy * (x1 - x3) + a_dx * (y1 - y3)) / (-b_dx * a_dy + a_dx * b_dy);
	let t = (+b_dx * (y1 - y3) - b_dy * (x1 - x3)) / (-b_dx * a_dy + a_dx * b_dy);
	return (s >= 0 && s <= 1 && t >= 0 && t <= 1) ? [x1 + t * a_dx, y1 + t * a_dy] : false;
};
