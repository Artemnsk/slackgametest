"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const private_1 = require("../credentials/private");
exports.firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(private_1.credentials.firebase.serviceAccount),
    databaseAuthVariableOverride: {
        uid: "game-webserver",
    },
    databaseURL: private_1.credentials.firebase.databaseURL,
});
//# sourceMappingURL=firebaseapp.js.map