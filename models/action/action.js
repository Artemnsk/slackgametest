const ACTION_TYPE_ADD = 'ACTION_TYPE_ADD';

/**
 * @readonly
 * @enum {string}
 */
const ACTION_TYPES = {
  ACTION_TYPE_ADD
};

class Action {
  /**
   *
   * @param {ActionFirebaseValue & {$key: (undefined|string)}} values
   * @constructor
   * @property {string} type - enum value from ACTION_TYPES.
   * @property {number} startAt - minimum time action could be dispatched.
   * @property {number} number - FIXME: simply test number to add.
   * @property {string} $key - Database key of this action.
   */
  constructor(values) {
    this.type = values.type;
    // TODO: is number?
    if (values.startAt) {
      this.startAt = values.startAt;
    } else {
      this.startAt = Date.now();
    }
    if (values.number) {
      this.number = values.number;
    }
    if (values.$key) {
      this.$key = values.$key;
    }
  }

  /**
   *
   * @return {ActionFirebaseValue}
   */
  getFirebaseValue() {
    return Object.assign({}, {
      type: this.type,
      startAt: this.startAt,
      number: this.number,
    });
  }
}

module.exports = {
  ACTION_TYPES,
  Action
};