class BaseComponent {
  /**
   * Component ID in parent components list.
   * @type {number}
   */
  id;

  /**
   * Component name.
   * @type {string}
   */
  name;

  /**
   * Link to parent object.
   * @type {BaseObject}
   */
  object;

  /**
   * Allows multiple similar components in one parent object.
   * @type {boolean}
   */
  allowMultiple = false;

  /**
   * List of components present in the parent object that the current component requires.
   * @type {string[]}
   */
  requiredComponents = [];

  /**
   * Event function that is called at fixed intervals. This method is used by core, don't use it directly.
   * @param {number} fixedDeltaTime
   */
  fixedUpdate(fixedDeltaTime) {}

  /**
   * Event function for drawing Gizmos. This method is used by canvas, don't use it directly.
   */
  onDrawGizmos() {}
}

export default BaseComponent;
