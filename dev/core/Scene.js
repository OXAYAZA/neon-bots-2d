class Scene {
  /**
   * Scene objects list.
   * @type {Object.<number, BaseObject>}
   */
  objects = {};

  /**
   * ID counter for adding objects.
   * @type {number}
   */
  objIdCounter = 0;

  /**
   * Add object to scene.
   * @param {BaseObject} obj - Object to add.
   */
  addObject(obj) {
    obj.id = this.objIdCounter;
    this.objects[this.objIdCounter] = obj;
    this.objIdCounter += 1;
  }

  /**
   * Remove object from scene.
   * @param {BaseObject} obj - Object to remove.
   */
  removeObject(obj) {
    this.objects[obj.id] = null;
  }

  /**
   * Delete IDs with null values from objects list. This method is used by core, don't use it directly.
   */
  cleanObjects() {
    for(const [key, value] of Object.entries(this.objects)) {
      if(value === null) delete this.objects[key];
    }
  }
}

export default Scene;
