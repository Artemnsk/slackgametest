"use strict";

module.exports = {
  // This data is used during OAuth authentication to Slack. Must be securely stored. Obtained on Slack app dashboard in OAuth tab.
  client_secret: '<>',
  firebase: {
    serviceAccount: require('./slackgametest-firebase-adminsdk-ksdm4-fc488f576c'),
    databaseURL: ''
  }
};