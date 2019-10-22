// Particle prototype
function Particle ( opts ) {
	Object.assign( this, Particle.defaults, opts ); // https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	if ( !this.canvas ) throw new Error( 'ctx is a required parameter!' );
}

Particle.defaults = {
	canvas: null,
	id: null,
	x: 0,
	y: 0,
	ax: 0,
	ay: 1,
	width: 10,
	height: 10,
	hp: 50,

	hue: 24,
	saturation: 100,
	lightness: 80
};

Particle.prototype.live = function () {
	this.x += this.ax;
	this.y += this.ay;
	this.width *= .95;
	this.height *= .95;
	this.hp -= 1;
	this.lightness = this.lightness <= 50 ? this.lightness : this.lightness - 1;

	if ( this.hp <= 0 ) this.die();
};

Particle.prototype.die = function () {
	delete this.canvas.objects[ this.id ];
};

Particle.prototype.render = function () {
	this.canvas.ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
	this.canvas.ctx.fillRect(
		this.x - this.width/2,
		this.y - this.height/2,
		this.width,
		this.height );
};
