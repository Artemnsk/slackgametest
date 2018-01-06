import * as admin from "firebase-admin";
import { firebaseApp } from "../../helpers/firebaseapp";
import { GameActionRequestCastSpellFirebaseValue, GameActionRequestCastSpellFirebaseValueRaw } from "../gameactionrequestcastspell/dbfirebase";
import { GameActionRequestUseItemFirebaseValue, GameActionRequestUseItemFirebaseValueRaw } from "../gameactionrequestuseitem/dbfirebase";

export type GameActionRequestFirebaseValueRaw = GameActionRequestCastSpellFirebaseValueRaw | GameActionRequestUseItemFirebaseValueRaw;

export type GameActionRequestFirebaseValue = GameActionRequestCastSpellFirebaseValue | GameActionRequestUseItemFirebaseValue;

export function getRecentAction(): Promise<GameActionRequestFirebaseValueRaw|null> {
  return firebaseApp.database().ref("/actionRequests").orderByChild("created").limitToFirst(1).once("value")
    .then((snapshot: admin.database.DataSnapshot): Promise<GameActionRequestFirebaseValueRaw|null> => {
      if (!snapshot.val()) {
        // No action found.
        return Promise.resolve(null);
      } else {
        const gameActionFirebaseValueRawObject: {[key: string]: GameActionRequestFirebaseValueRaw} = snapshot.val();
        let key;
        for (key in gameActionFirebaseValueRawObject) {
          if (gameActionFirebaseValueRawObject.hasOwnProperty(key)) {
            const gameActionFirebaseValueRaw = gameActionFirebaseValueRawObject[key];
            return Promise.resolve(gameActionFirebaseValueRaw);
          }
        }
        // Actually must not be reachable.
        return Promise.resolve(null);
      }
    });
}
