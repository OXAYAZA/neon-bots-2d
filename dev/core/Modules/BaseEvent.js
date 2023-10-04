class BaseEvent {
  /**
   * Event handlers list;
   * @type {function[]}
   */
  handlersList= [];

  /**
   * Add handler function to event handlers list.
   * @param {function} handler
   */
  addListener(handler) {
    if(typeof(handler) !== "function") throw new Error("The listener must be function.")
    this.handlersList.push(handler);
  }

  /**
   * Remove handler function from event handlers list.
   * @param {function} handler
   */
  removeListener(handler) {
    if(typeof(handler) !== "function") throw new Error("The listener must be function.")
    this.handlersList = this.handlersList.filter(item => item !== handler);
  }

  /**
   * Call event handlers.
   * @param {*} context
   * @param {*} data
   */
  trigger(context = null, ...data) {
    this.handlersList.forEach(handler => {
      handler.call(context, ...data);
    });
  }
}

export default BaseEvent;
