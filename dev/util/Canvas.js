import merge from './merge.js';
import Map from './Map.js';

class Canvas {
	node;
	ctx;
	rect;
	state = 'play';
	deltaTime = 0;
	lastTime = 0;
	map = null;

	constructor ( props ) {
		merge( this, props );
	}

	init ( map ) {
		if ( !( map instanceof Map ) ) {
			throw new Error( 'Сanvas.map must be instance of Map class' );
		}

		this.map = map;
		this.map.canvas = this;
		this.ctx = this.node.getContext( '2d' );
		this.map.ctx = this.ctx;
		this.resize();
		window.addEventListener( 'resize', this.resize.bind( this ) );

		this.render( performance.now() );
	}

	render ( currentTime = 0 ) {
		if ( this.state === 'play' ) {
			requestAnimationFrame( this.render.bind( this ) );
		}

		this.deltaTime = currentTime - this.lastTime;
		this.ctx.clearRect( 0, 0, this.rect.width, this.rect.height );
		this.map.calc( this.deltaTime );
		this.map.render();
		this.lastTime = currentTime;

		// this.onMiddle.forEach( ( cb ) => {
		// 	if ( cb instanceof Function ) cb.call( this );
		// });

		// this.onEnd.forEach( ( cb ) => {
		// 	if ( cb instanceof Function ) cb.call( this );
		// });
	}

	resize () {
		this.rect = this.node.getBoundingClientRect();
		this.node.width = this.rect.width;
		this.node.height = this.rect.height;
	}
}

export default Canvas;
