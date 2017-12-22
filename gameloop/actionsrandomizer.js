const addAction = require('../models/action/actions').addAction;
const ACTION_TYPES = require('../models/action/action').ACTION_TYPES;

/**
 * Generates random actions with specified frequency.
 * @param {number} frequency - ms.
 */
module.exports = (frequency) => {
  setInterval(() => {
    let /** ActionFirebaseValue */ actionValue = {
      type: ACTION_TYPES.ACTION_TYPE_ADD,
      number: Math.round(Math.random() * 100),
      startAt: Date.now()/* + 10000*/
    };
    addAction(actionValue);
  }, frequency);
};