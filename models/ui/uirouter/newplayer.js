"use strict";

const Route = require('route-parser');
const newPlayerFactory = require('../uimessage/factory/newplayerfactory');
const informationMessageFactory = require('../uimessage/factory/informationmessagefactory');
const setPlayer = require('../../player/players').setPlayer;
const Slack = require('slack-node');

const CREATE_NEW_PLAYER_YES = 'yes';
const INFORMATION_MESSAGE_OK = 'ok';

function processActions(uiRouter, parsedPayload, args) {
  // Parse submitted actions to know which window to render.
  // TODO: that is actually bad.
  let action = parsedPayload.actions[0];
  switch (action.name) {
    case 'option':
      switch (action.value) {
        case CREATE_NEW_PLAYER_YES:
          // Get user info from Slack.
          // https://api.slack.com/methods/users.info
          let apiCallArgs = {
            user: parsedPayload.user.id,
            // TODO:
            include_locale: false
          };
          const slack = new Slack(uiRouter.team.token);
          /**
           * @typedef {Object} SlackUserInfoResponseSuccess
           * @property {boolean} ok
           * @property {Object} user
           * @property {string} user.id
           * @property {Object} user.profile
           * @property {string} user.profile.real_name
           * // TODO: other fields if needed.
           */
          /**
           * @typedef {Object} SlackUserInfoResponseError
           * @property {boolean} ok
           * @property {string} error
           */
          /**
           * @typedef {SlackUserInfoResponseSuccess|SlackUserInfoResponseError} SlackUserInfoResponse
           */
          return new Promise((resolve, reject) => {
            slack.api("users.info", apiCallArgs, (err, /** SlackUserInfoResponse */ response) => {
              if (err) {
                let errorText = 'Error: Cannot retrieve your user info from Slack: ' + response.error;
                resolve(informationMessageFactory(errorText, '/', INFORMATION_MESSAGE_OK, INFORMATION_MESSAGE_OK));
              } else if (response.ok === true) {
                // Ensure player doesn't exist. Maybe that was click on outdated screen.
                if (!uiRouter.player) {
                  // Now we can safely create new player.
                  let playerFirebaseValue = {
                    active: true,
                    name: response.user.profile.real_name
                  };
                  setPlayer(playerFirebaseValue, uiRouter.team.$key, uiRouter.channel.$key, parsedPayload.user.id)
                    .then(() => {
                      resolve(informationMessageFactory('Player being created.', '/', INFORMATION_MESSAGE_OK, INFORMATION_MESSAGE_OK));
                    }, (error) => {
                      let errorText = 'Error: Player cannot be created into DB in some reason: ' + error.message;
                      resolve(informationMessageFactory(errorText, '/', INFORMATION_MESSAGE_OK, INFORMATION_MESSAGE_OK));
                    });
                } else {
                  resolve(informationMessageFactory('Error: Player already exists.', '/', INFORMATION_MESSAGE_OK, INFORMATION_MESSAGE_OK));
                }
              } else {
                resolve(informationMessageFactory('Some unexpected error occurred during retrieval info about your Slack user.', '/', INFORMATION_MESSAGE_OK, INFORMATION_MESSAGE_OK));
              }
            });
          });
          break;
      }
      break;
  }
  return null;
}

function getUIMessage(uiRouter, args) {
  if (uiRouter.player) {
    return informationMessageFactory('Error: Player already exists.', '/', INFORMATION_MESSAGE_OK, INFORMATION_MESSAGE_OK);
  }
  return newPlayerFactory();
}

const /** @type UIRoute */ uiRoute = {
  route: new Route('/newplayer'),
  processActions,
  getUIMessage
};

module.exports = {
  uiRoute
};