import * as admin from "firebase-admin";
import { credentials as privateConfig } from "../credentials/private";

export const firebaseApp: admin.app.App = admin.initializeApp({
  credential: admin.credential.cert(privateConfig.firebase.serviceAccount),
  databaseAuthVariableOverride: {
    uid: "game-webserver",
  },
  databaseURL: privateConfig.firebase.databaseURL,
});
