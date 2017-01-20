import { Harvests } from '/imports/api/harvests/harvests.js';
import { _ } from 'meteor/underscore';

/**
 * HarvestObserver is a utility class that manages multiple observers for
 * harvest objects. The class has two primary methods, addListener and
  * removeListener. Each listener listens for changes in a harvest's state and
  * executes a callback.
 */

export class HarvestObserver {

  constructor() {
    this.observers = {};
  }

  /**
   * Add a listener that lsitens for any changes in harvest and executes
   * callback when a change occurs.
   */
  addListener(harvest, callback) {
    let query = Harvests.find({_id: harvest._id});

    // First, check to see if there is already a listener defiend. If there is,
    // remove it.
    if(_.has(this.observers, harvest._id)) {
      this.removeListener(harvest);
    }

    // Create a new observer and store it in this.observers
    this.observers[harvest._id] = query.observe({
      changed: callback
    });
  }

  /**
   * Stops and removes a listener for harvest
   */
  removeListener(harvest) {
    let observer = this.observers[harvest._id];
    if(!_.isUndefined(observer) && !_.isNull(observer)) {
      observer.stop();
      delete this.observers[harvest._id];
    }
  }

}
