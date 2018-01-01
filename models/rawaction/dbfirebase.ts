import * as admin from "firebase-admin";
import { firebaseApp } from "../../helpers/firebaseapp";

export const enum RAW_ACTION_TYPES {
  CAST_SPELL = "CAST_SPELL",
  USE_ITEM = "USE_ITEM",
}

export type RawActionFirebaseValueRaw = {
  type: RAW_ACTION_TYPES,
  target?: string,
  initiator?: string,
  // TODO: define params.
  params?: object,
};

export type RawActionFirebaseValue = {
  type: RAW_ACTION_TYPES,
  target: string|null,
  initiator: string|null,
  // TODO: define params.
  params: object,
};

function processFirebaseRawValues(value: RawActionFirebaseValueRaw): RawActionFirebaseValue {
  return Object.assign(value, {
    initiator: value.initiator === undefined ? null : value.initiator,
    params: value.params === undefined ? {} : value.params,
    target: value.target === undefined ? null : value.target,
  });
}

/**
 * Load most recent action from Firebase database or null if there are no actions.
 */
export function getRecentDBRawAction(teamKey: string, channelKey: string, gameKey: string): Promise<(RawActionFirebaseValue & {$key: string})|null> {
  return firebaseApp.database().ref(`/rawActions/${teamKey}/${channelKey}/${gameKey}`).limitToFirst(1).once("value")
    .then((snapshot: admin.database.DataSnapshot): Promise<(RawActionFirebaseValue & {$key: string})|null> => {
      if (!snapshot.val()) {
        // No action found.
        return Promise.resolve(null);
      } else {
        const values: {[key: string]: RawActionFirebaseValueRaw} = snapshot.val();
        // Get first property in object.
        let rawActionKey: string|undefined;
        for (rawActionKey in values) {
          // We do it to put first property into rawActionKey variable.
        }
        if (rawActionKey !== undefined) {
          const rawActionResponse = Object.assign(processFirebaseRawValues(values[rawActionKey]), { $key: rawActionKey });
          return Promise.resolve(rawActionResponse);
        } else {
          return Promise.resolve(null);
        }
      }
    });
}

/**
 * Removes action by key from DB.
 */
export function removeDBRawAction(teamKey: string, channelKey: string, gameKey: string, rawActionKey: string): Promise<void> {
  return firebaseApp.database().ref(`/rawActions/${teamKey}/${channelKey}/${gameKey}/${rawActionKey}`).remove();
}

/**
 * Adds new action into DB.
 */
export function addDBRawAction(rawActionFirebaseValue: RawActionFirebaseValue, teamKey: string, channelKey: string, gameKey: string): Promise<void> {
  return firebaseApp.database().ref(`/rawActions/${teamKey}/${channelKey}/${gameKey}`).push().set(rawActionFirebaseValue);
}
