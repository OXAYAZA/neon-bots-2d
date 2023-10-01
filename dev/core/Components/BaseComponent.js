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
   * Event function that is called at fixed intervals.
   * @param {number} fixedDeltaTime
   */
  fixedUpdate(fixedDeltaTime) {}
}

export default BaseComponent;
