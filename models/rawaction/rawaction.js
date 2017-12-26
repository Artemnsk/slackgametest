const CAST_SPELL = 'CAST_SPELL';
const getRecentDBRawAction = require('./dbfirebase').getRecentDBRawAction;
const removeDBRawAction = require('./dbfirebase').removeDBRawAction;
const addDBRawAction = require('./dbfirebase').addDBRawAction;

/**
 * @readonly
 * @enum {string}
 */
const RAW_ACTION_TYPES = {
  CAST_SPELL
};

class RawAction {
  /**
   *
   * @param {RawActionFirebaseValue & {$key: string}} values
   * @constructor
   * @extends {RawActionFirebaseValue}
   * @property {string} $key - Database key of this raw action.
   */
  constructor(values) {
    this.type = values.type;
    this.$key = values.$key;
    if (values.target) {
      this.target = values.target;
    }
    if (values.initiator) {
      this.initiator = values.initiator;
    }
    if (values.params) {
      this.params = values.params;
    }
  }

  /**
   *
   * @return {RawActionFirebaseValue}
   */
  getFirebaseValue() {
    return Object.assign({}, {
      type: this.type,
      target: this.target ? this.target : null,
      initiator: this.initiator ? this.initiator : null,
      params: this.params ? this.params : null
    });
  }

  /**
   *
   * @param {string} teamKey
   * @param {string} channelKey
   * @param {string} gameKey
   * @return {Promise.<?RawAction, Error>}
   */
  static getRecentRawAction(teamKey, channelKey, gameKey) {
    return getRecentDBRawAction(teamKey, channelKey, gameKey)
      .then((recentRawActionData) => {
        if (recentRawActionData === null) {
          return Promise.resolve(null);
        } else {
          let recentRawAction = new RawAction(recentRawActionData);
          return Promise.resolve(recentRawAction);
        }
      });
  }

  /**
   *
   * @param {string} teamKey
   * @param {string} channelKey
   * @param {string} gameKey
   * @param {string} rawActionKey
   * @return Promise<void>
   */
  static removeRawAction(teamKey, channelKey, gameKey, rawActionKey) {
    return removeDBRawAction(teamKey, channelKey, gameKey, rawActionKey);
  }

  /**
   * Adds new action into DB.
   * @param {RawActionFirebaseValue} rawActionFirebaseValue
   * @param {string} teamKey
   * @param {string} channelKey
   * @param {string} gameKey
   * @return Promise.<any,Error>
   */
  static addRawAction(rawActionFirebaseValue, teamKey, channelKey, gameKey) {
    return addDBRawAction(rawActionFirebaseValue, teamKey, channelKey, gameKey);
  }
}

module.exports = {
  RAW_ACTION_TYPES,
  RawAction
};