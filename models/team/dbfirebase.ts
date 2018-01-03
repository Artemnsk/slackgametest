import * as admin from "firebase-admin";
import { firebaseApp } from "../../helpers/firebaseapp";

/**
 * Data format received from Firebase.
 */
export type TeamFirebaseValue = {
  active: boolean,
  name: string,
  admin?: string,
  token?: string,
  userId?: string,
  botId?: string,
  botToken?: string,
};

/**
 * Load team from DB by teamId.
 */
export function getDBTeam(teamId: string): Promise<TeamFirebaseValue|null> {
  return firebaseApp.database().ref("/teams/" + teamId).once("value")
    .then((snapshot: admin.database.DataSnapshot): Promise<TeamFirebaseValue|null> => {
      if (!snapshot.val()) {
        // No team found.
        return Promise.resolve(null);
      } else {
        const teamFirebaseValue: TeamFirebaseValue = snapshot.val();
        return Promise.resolve(teamFirebaseValue);
      }
    });
}

/**
 * Respond with teams array from DB.
 */
export function getDBTeams(active?: boolean): Promise<{[key: string]: TeamFirebaseValue}> {
  let reference: admin.database.Query|admin.database.Reference = firebaseApp.database().ref("/teams");
  if (active !== undefined) {
    reference = reference.orderByChild("active").equalTo(active);
  }
  return reference.once("value")
    .then((snapshot: admin.database.DataSnapshot): Promise<{[key: string]: TeamFirebaseValue}> => {
      if (!snapshot.val()) {
        // No teams found.
        return Promise.resolve({});
      } else {
        const teamsFirebaseObject = snapshot.val();
        return Promise.resolve(teamsFirebaseObject);
      }
    });
}

/**
 * Sets team data into DB.
 */
export function setDBTeam(teamValues: TeamFirebaseValue, teamId: string): Promise<void> {
  return firebaseApp.database().ref("/teams/" + teamId).set(teamValues);
}
