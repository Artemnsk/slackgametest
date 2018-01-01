import * as admin from "firebase-admin";
import { firebaseApp } from "../../helpers/firebaseapp";

export const enum CHANNEL_PHASES {
  BREAK = "BREAK",
  IN_GAME = "IN_GAME",
}

export type ChannelFirebaseValueRaw = {
  active: boolean,
  name: string,
  timeStep: number,
  breakTime: number,
  phase: CHANNEL_PHASES,
  nextGame?: number,
  currentGame?: string,
};

export type ChannelFirebaseValue = {
  active: boolean,
  name: string,
  timeStep: number,
  breakTime: number,
  phase: CHANNEL_PHASES,
  nextGame: number|null,
  currentGame: string|null,
};

function processFirebaseRawValues(value: ChannelFirebaseValueRaw): ChannelFirebaseValue {
  return Object.assign(value, {
    currentGame: value.currentGame === undefined ? null : value.currentGame,
    nextGame: value.nextGame === undefined ? null : value.nextGame,
  });
}

/**
 * Load channel from DB by channelId.
 */
export function getDBChannel(teamId: string, channelId: string): Promise<ChannelFirebaseValue|null> {
  return firebaseApp.database().ref(`/channels/${teamId}/${channelId}`).once("value")
    .then((snapshot: admin.database.DataSnapshot): Promise<ChannelFirebaseValue|null> => {
      if (!snapshot.val()) {
        // No channel found.
        return Promise.resolve(null);
      } else {
        const channelFirebaseValueRaw: ChannelFirebaseValueRaw = snapshot.val();
        return Promise.resolve(processFirebaseRawValues(channelFirebaseValueRaw));
      }
    });
}

/**
 * Respond with channels array from DB.
 */
export function getDBChannels(teamId: string, active?: boolean): Promise<{[key: string]: ChannelFirebaseValue}> {
  let reference: admin.database.Reference | admin.database.Query = firebaseApp.database().ref(`/channels/${teamId}`);
  if (active !== undefined) {
    reference = reference.orderByChild("active").equalTo(active);
  }
  return reference.once("value")
    .then((/** admin.database.DataSnapshot */ snapshot): Promise<{[key: string]: ChannelFirebaseValue}> => {
      if (!snapshot.val()) {
        // No channels found.
        return Promise.resolve({});
      } else {
        const channelsFirebaseObjectRaw: {[key: string]: ChannelFirebaseValueRaw} = snapshot.val();
        const channelsFirebaseObject: {[key: string]: ChannelFirebaseValue} = {};
        for (const key in channelsFirebaseObjectRaw) {
          if (channelsFirebaseObjectRaw.hasOwnProperty(key)) {
            channelsFirebaseObject[key] = processFirebaseRawValues(channelsFirebaseObjectRaw[key]);
          }
        }
        return Promise.resolve(channelsFirebaseObject);
      }
    });
}

/**
 * Sets channel in DB.
 */
export function setDBChannel(channelValues: ChannelFirebaseValue, teamKey: string, channelKey: string): Promise<void> {
  return firebaseApp.database().ref(`/channels/${teamKey}/${channelKey}`).set(channelValues);
}
