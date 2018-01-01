import * as admin from "firebase-admin";
import { firebaseApp } from "../../helpers/firebaseapp";
import { GamerFirebaseValue, GamerFirebaseValueRaw, processFirebaseRawValues as processGamerFirebaseRawValues } from "../gamer/dbfirebase";

export type GameFirebaseValueRaw = {
  timeStep: number,
  phase: string, // TODO: enum.
  gamers?: {[key: string]: GamerFirebaseValueRaw},
};

export type GameFirebaseValue = {
  timeStep: number,
  phase: string, // TODO: enum.
  gamers: {[key: string]: GamerFirebaseValue},
};

function processFirebaseRawValues(value: GameFirebaseValueRaw): GameFirebaseValue {
  const gamers: {[key: string]: GamerFirebaseValue} = {};
  if (value.gamers !== undefined) {
    for (const key in value.gamers) {
      if (value.gamers.hasOwnProperty(key)) {
        gamers[key] = processGamerFirebaseRawValues(value.gamers[key]);
      }
    }
  }
  return Object.assign(value, {
    gamers,
  });
}

/**
 * Load game from DB by teamKey, channelKey and gameKey.
 */
export function getDBGame(teamKey: string, channelKey: string, gameKey: string): Promise<GameFirebaseValue|null> {
  return firebaseApp.database().ref(`/games/${teamKey}/${channelKey}/${gameKey}`).once("value")
    .then((snapshot: admin.database.DataSnapshot): Promise<GameFirebaseValue|null> => {
      if (!snapshot.val()) {
        // No game found.
        return Promise.resolve(null);
      } else {
        const gameFirebaseValueRaw: GameFirebaseValueRaw = snapshot.val();
        return Promise.resolve(processFirebaseRawValues(gameFirebaseValueRaw));
      }
    });
}

/**
 * Load game from DB by teamKey, channelKey and gameKey.
 * @return {Promise.<Object.<string,GameFirebaseValue>,Error>}
 */
export function getDBGames(teamKey: string, channelKey: string, phase?: string): Promise<{[key: string]: GameFirebaseValue}> {
  let reference: admin.database.Reference | admin.database.Query = firebaseApp.database().ref(`/games/${teamKey}/${channelKey}`);
  if (phase !== undefined) {
    reference = reference.orderByChild("phase").equalTo(phase);
  }
  return reference.once("value")
    .then((/** admin.database.DataSnapshot */ snapshot) => {
      if (!snapshot.val()) {
        // No games found.
        return Promise.resolve({});
      } else {
        const gamesFirebaseObjectRaw: {[key: string]: GameFirebaseValueRaw} = snapshot.val();
        const gamesFirebaseObject: {[key: string]: GameFirebaseValue} = {};
        for (const key in gamesFirebaseObjectRaw) {
          if (gamesFirebaseObjectRaw.hasOwnProperty(key)) {
            gamesFirebaseObject[key] = processFirebaseRawValues(gamesFirebaseObjectRaw[key]);
          }
        }
        return Promise.resolve(gamesFirebaseObject);
      }
    });
}

/**
 * Returns new game Firebase reference.
 */
export function getNewGameDBRef(teamKey: string, channelKey: string): admin.database.ThenableReference {
  return firebaseApp.database().ref(`/games/${teamKey}/${channelKey}`).push();
}

/**
 * Sets game in DB.
 */
export function setDBGame(gameValues: GameFirebaseValue, teamKey: string, channelKey: string, gameKey: string): Promise<void> {
  return firebaseApp.database().ref(`/games/${teamKey}/${channelKey}/${gameKey}`).set(gameValues);
}

/**
 * Remove game from DB.
 */
export function removeDBGame(teamKey: string, channelKey: string, gameKey: string): Promise<void> {
  return firebaseApp.database().ref(`/games/${teamKey}/${channelKey}/${gameKey}`).remove();
}
