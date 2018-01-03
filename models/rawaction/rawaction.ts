import { addDBRawAction, getRecentDBRawAction, RAW_ACTION_TYPES, RawActionFirebaseValue, removeDBRawAction } from "./dbfirebase";

export class RawAction {
  /**
   * Respond with most recent rawAction from DB.
   */
  public static getRecentRawAction(teamKey: string, channelKey: string, gameKey: string): Promise<RawAction|null> {
    return getRecentDBRawAction(teamKey, channelKey, gameKey)
      .then((recentRawActionData): Promise<RawAction|null> => {
        if (recentRawActionData === null) {
          return Promise.resolve(null);
        } else {
          const recentRawAction = new RawAction(recentRawActionData);
          return Promise.resolve(recentRawAction);
        }
      });
  }

  public static removeRawAction(teamKey: string, channelKey: string, gameKey: string, rawActionKey: string): Promise<void> {
    return removeDBRawAction(teamKey, channelKey, gameKey, rawActionKey);
  }

  /**
   * Adds new action into DB.
   */
  public static addRawAction(rawActionFirebaseValue: RawActionFirebaseValue, teamKey: string, channelKey: string, gameKey: string): Promise<void> {
    return addDBRawAction(rawActionFirebaseValue, teamKey, channelKey, gameKey);
  }

  public type: RAW_ACTION_TYPES;
  public $key: string;
  public target: string|null;
  public initiator: string|null;
  public params: object;

  constructor(values: RawActionFirebaseValue & {$key: string}) {
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

  public getFirebaseValue(): RawActionFirebaseValue {
    return Object.assign({}, {
      initiator: this.initiator,
      params: this.params,
      target: this.target,
      type: this.type,
    });
  }
}
