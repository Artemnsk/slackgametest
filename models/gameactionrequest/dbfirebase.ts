import { firebaseApp } from "../../helpers/firebaseapp";
import { GameActionRequestCastSpellFirebaseValue, GameActionRequestCastSpellFirebaseValueRaw } from "./gameactionrequests/gameactionrequestcastspell/dbfirebase";
import { GameActionRequestUseItemFirebaseValue, GameActionRequestUseItemFirebaseValueRaw } from "./gameactionrequests/gameactionrequestuseitem/dbfirebase";

export type GameActionRequestFirebaseValueRaw = GameActionRequestCastSpellFirebaseValueRaw | GameActionRequestUseItemFirebaseValueRaw;

export type GameActionRequestFirebaseValue = GameActionRequestCastSpellFirebaseValue | GameActionRequestUseItemFirebaseValue;

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
