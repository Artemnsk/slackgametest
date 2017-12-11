const admin = require("firebase-admin");
const config = require("../credentials/private");

const /** @type admin.app.App */ firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(config.firebase.serviceAccount),
    databaseURL: config.firebase.databaseURL
});

module.exports = firebaseApp;