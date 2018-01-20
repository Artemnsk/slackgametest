import * as admin from "firebase-admin";
import { firebaseApp } from "../../helpers/firebaseapp";
import { GameActionRequestCastSpellFirebaseValue, GameActionRequestCastSpellFirebaseValueRaw } from "./gameactionrequests/gameactionrequestcastspell/dbfirebase";
import { GameActionRequestUseItemFirebaseValue, GameActionRequestUseItemFirebaseValueRaw } from "./gameactionrequests/gameactionrequestuseitem/dbfirebase";

export type GameActionRequestFirebaseValueRaw = GameActionRequestCastSpellFirebaseValueRaw | GameActionRequestUseItemFirebaseValueRaw;

export type GameActionRequestFirebaseValue = GameActionRequestCastSpellFirebaseValue | GameActionRequestUseItemFirebaseValue;

export function getRecentAction(teamKey: string, channelKey: string, gameKey: string): Promise<{ value: GameActionRequestFirebaseValueRaw, $key: string } | null> {
  return firebaseApp.database().ref(`/actionRequests/${teamKey}/${channelKey}/${gameKey}`).orderByChild("created").limitToFirst(1).once("value")
    .then((snapshot: admin.database.DataSnapshot): Promise<{ value: GameActionRequestFirebaseValueRaw, $key: string } | null> => {
      if (!snapshot.val()) {
        // No action found.
        return Promise.resolve(null);
      } else {
        const gameActionFirebaseValueRawObject: { [key: string]: GameActionRequestFirebaseValueRaw } = snapshot.val();
        let key;
        for (key in gameActionFirebaseValueRawObject) {
          if (gameActionFirebaseValueRawObject.hasOwnProperty(key)) {
            const gameActionFirebaseValueRaw = gameActionFirebaseValueRawObject[ key ];
            return Promise.resolve({
              $key: key,
              value: gameActionFirebaseValueRaw,
            });
          }
        }
        // Actually must not be reachable.
        return Promise.resolve(null);
      }
    });
}

/**
 * Removes action request by key from DB.
 */
export function removeDBGameActionRequest(teamKey: string, channelKey: string, gameKey: string, gameActionRequestKey: string): Promise<void> {
  return firebaseApp.database().ref(`/actionRequests/${teamKey}/${channelKey}/${gameKey}/${gameActionRequestKey}`).remove();
}

/**
 * Adds new action request into DB.
 */
export function addDBGameActionRequest(rawGameActionRequestFirebaseValue: GameActionRequestFirebaseValue, teamKey: string, channelKey: string, gameKey: string): Promise<void> {
  return firebaseApp.database().ref(`/actionRequests/${teamKey}/${channelKey}/${gameKey}`).push().set(rawGameActionRequestFirebaseValue);
}
