import * as admin from "firebase-admin";
import { firebaseApp } from "../../helpers/firebaseapp";

export type PlayerFirebaseValueRaw = {
  active: boolean,
  name: string,
  gold: number,
  items?: {[key: string]: boolean},
};

export type PlayerFirebaseValue = {
  active: boolean,
  name: string,
  gold: number,
  items: {[key: string]: boolean},
};

function processFirebaseRawValues(value: PlayerFirebaseValueRaw): PlayerFirebaseValue {
  return Object.assign(value, {
    items: value.items === undefined ? {} : value.items,
  });
}

/**
 * Load player from DB by teamKey and channelKey and playerKey.
 */
export function getDBPlayer(teamKey: string, channelKey: string, playerKey: string): Promise<PlayerFirebaseValue|null> {
  return firebaseApp.database().ref(`/players/${teamKey}/${channelKey}/${playerKey}`).once("value")
    .then((snapshot: admin.database.DataSnapshot): Promise<PlayerFirebaseValue|null> => {
      if (!snapshot.val()) {
        // No channel found.
        return Promise.resolve(null);
      } else {
        const playerFirebaseValuesRaw: PlayerFirebaseValueRaw = snapshot.val();
        return Promise.resolve(processFirebaseRawValues(playerFirebaseValuesRaw));
      }
    });
}

/**
 * Respond with channels array from DB.
 */
export function getDBPlayers(teamKey: string, channelKey: string, active?: boolean): Promise<{[key: string]: PlayerFirebaseValue}> {
  let reference: admin.database.Reference|admin.database.Query = firebaseApp.database().ref("/players/" + teamKey + "/" + channelKey);
  if (active !== undefined) {
    reference = reference.orderByChild("active").equalTo(active);
  }
  return reference.once("value")
    .then((snapshot: admin.database.DataSnapshot): Promise<{[key: string]: PlayerFirebaseValue}> => {
      if (!snapshot.val()) {
        // No channels found.
        return Promise.resolve({});
      } else {
        const playersFirebaseObjectRaw: {[key: string]: PlayerFirebaseValueRaw} = snapshot.val();
        const playersFirebaseObject: {[key: string]: PlayerFirebaseValue} = {};
        for (const key in playersFirebaseObjectRaw) {
          if (playersFirebaseObjectRaw.hasOwnProperty(key)) {
            playersFirebaseObject[key] = processFirebaseRawValues(playersFirebaseObjectRaw[key]);
          }
        }
        return Promise.resolve(playersFirebaseObject);
      }
    });
}

/**
 * Sets player in DB.
 * @param {PlayerFirebaseValue} playerValues
 * @param {string} teamKey
 * @param {string} channelKey
 * @param {string} playerKey
 * @return Promise.<any,Error>
 */
export function setDBPlayer(playerValues: PlayerFirebaseValue, teamKey: string, channelKey: string, playerKey: string): Promise<void> {
  return firebaseApp.database().ref(`/players/${teamKey}/${channelKey}/${playerKey}`).set(playerValues);
}
