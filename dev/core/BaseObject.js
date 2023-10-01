import Engine from "./Engine.js";

class BaseObject {
  /**
   * Object ID in parent scene objects list.
   * @type {number}
   */
  id;

  /**
   * Object name.
   * @type {string}
   */
  name;

  /**
   * Object components list.
   * @type {Object.<string, Component>}
   */
  components = {};

  /**
   * ID counter for adding components.
   * @type {number}
   */
  cmpIdCounter = 0;

  /**
   * @param {string} name - Object name.
   */
  constructor(name) {
    this.name = name;
    Engine.Instance.scene.addObject(this);
  }

  /**
   * Add component to object.
   * @param {BaseComponent} component - Component to add.
   */
  addComponent(component) {
    if(!component.allowMultiple && this.hasComponent(component.name)) {
      throw new Error(`Object "${this.name}" already has the component "${component.name}", which is not allowed.`);
    }

    if(component.requiredComponents.length !== 0) {
      for(const requiredComponent of component.requiredComponents) {
        if(!this.hasComponent(requiredComponent)) {
          throw new Error(`Object "${this.name}" don't have required component "${requiredComponent}" for ` +
            `"${component.name}".`);
        }
      }
    }

    component.id = this.cmpIdCounter;
    component.object = this;
    this.components[this.cmpIdCounter] = component;
    this.cmpIdCounter += 1;
  }

  /**
   * Check if an object has a specific component.
   * @param {string} componentName - Desired component name.
   * @return {boolean}
   */
  hasComponent(componentName) {
    let result = false;

    for(const [_, value] of Object.entries(this.components)) {
      if(value.name === componentName) {
        result = true;
        break;
      }
    }

    return result;
  }

  /**
   * Get the component that is attached to the object by its name.
   * @param {string} componentName - Desired component name.
   * @return {Component} - Returns component or null if nothing found.
   */
  getComponent(componentName) {
    let result = null;

    for(const [_, value] of Object.entries(this.components)) {
      if(value && value.name === componentName) {
        result = value;
        break;
      }
    }

    return result;
  }

  /**
   * Get multiple components with the same names that are attached to the object.
   * @param {string} componentName - Desired components name.
   * @return {Component[]} - Array of components.
   */
  getComponents(componentName) {
    let result = [];

    for(const [_, value] of Object.entries(this.components)) {
      if(value && value.name === componentName) {
        result.push(value);
      }
    }

    return result;
  }

  /**
   * Remove the component from an object.
   * @param {Component} component - Component to remove.
   */
  removeComponent(component) {
    component.object = null;
    this.components[component.id] = null;
  }

  /**
   * Remove the component from an object by its name.
   * @param {string} componentName - Component to remove.
   */
  removeComponentByName(componentName) {
    let component = this.getComponent(componentName);
    if(component) this.removeComponent(component);
    else console.warn(`Tried to remove component with name "${componentName}" that did not exist.`);
  }

  /**
   * Delete IDs with null values from components list. This method is used by core, don't use it directly.
   */
  cleanComponents() {
    for(const [key, value] of Object.entries(this.components)) {
      if(!value) delete this.components[key];
    }
  }

  /**
   * Remove object from scene.
   */
  destroy() {
    Engine.Instance.scene.removeObject(this);
  }
}

export default BaseObject;
