class Vector2 {
  x = 0;
  y = 0;

  constructor({x, y}) {
    this.x = x;
    this.y = y;
  }

  /**
   * Clone current vector.
   * @returns {Vector2} - Vector clone.
   */
  clone() {
    return new Vector2(this);
  }

  /**
   * Check if a vector has zero length.
   * @returns {boolean}
   */
  isZero() {
    return (this.x === 0 && this.y === 0);
  }

  /**
   * Determining the vector length.
   * @returns {number} - Vector length.
   */
  length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  /**
   * Determining the vector angle in radians.
   * @returns {number} - Vector angle in radians.
   * TODO: Angle to what?
   */
  angle() {
    return Math.atan2(this.y, this.x);
  }

  /**
   * Determining the vector angle in degrees.
   * @returns {number} - Vector angle in degrees.
   */
  angleD() {
    return this.angle() * 180 / Math.PI;
  }

  /**
   * Add another vector to current.
   * @param {Vector2} vec - Another vector.
   * @return {this} - Current vector.
   */
  add(vec) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }

  /**
   * Subtract another vector from the current.
   * @param {Vector2} vec - Another vector.
   * @return {this} - Current vector.
   */
  subtract(vec) {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  }

  /**
   * Multiply the current vector by a scalar.
   * @param {number} scalar - Scalar.
   * @return {this} - Current vector.
   */
  scale(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  /**
   * Determining the dot product of the current vector and another vector.
   * @param {Vector2} vec - Another vector.
   * @returns {number} - Scalar.
   */
  dot(vec) {
    return this.x * vec.x + this.y * vec.y;
  }

  /**
   * Determining the cosine of the angle between vectors.
   * @param {Vector2} vec - another vector.
   * @returns {number} - Cosine of the angle between vectors.
   */
  angleCos(vec ) {
    return this.dot(vec) / (this.length() * vec.length());
  }

  /**
   * Rotate a vector by an angle specified in radians.
   * @param {number} angle - Rotation angle in radians.
   * @return {this} - Current vector.
   */
  rotate(angle) {
    let
      x = this.x * Math.cos(angle) - this.y * Math.sin(angle),
      y = this.y * Math.cos(angle) + this.x * Math.sin(angle);

    this.x = x;
    this.y = y;

    return this;
  }

  /**
   * Rotate a vector by an angle specified in degrees.
   * @param {number} angle - Rotation angle in degrees.
   * @return {this} - Current vector.
   */
  rotateD(angle) {
    return this.rotate(angle * Math.PI / 180);
  }

  /**
   * Change vector length.
   * @param {number} length - New vector length.
   * @return {this} - Current vector.
   */
  setLength(length) {
    let c = length / Math.sqrt(this.x * this.x + this.y * this.y);
    if(c === Infinity || isNaN(c)) c = 0;
    this.x *= c;
    this.y *= c;
    return this;
  }

  /**
   * Normalize vector.
   * @return {this} - Current vector.
   */
  normalize() {
    return this.setLength(1);
  }

  /**
   * Reflect vector. {@link https://habr.com/ru/post/105882/}
   * @param {Vector2} vec - Normalized vector for reflection.
   * @return {this} - Current vector.
   */
  reflect(vec) {
    return this.subtract(vec.clone().scale(2).scale(this.dot(vec) / vec.dot(vec)));
  }

  static zero() {
    return new Vector2({x: 0, y: 0});
  };

  static up() {
    return new Vector2({x: 0, y: -1});
  }

  static down() {
    return new Vector2({x: 0, y: 1});
  }

  static right() {
    return new Vector2({x: 1, y: 0});
  }

  static left() {
    return new Vector2({x: -1, y: 0});
  }
}

export default Vector2;
