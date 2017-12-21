"use strict";

const Route = require('route-parser');
const newPlayerFactory = require('../uimessage/factory/newplayerfactory');
const setPlayer = require('../../player/players').setPlayer;
const Slack = require('slack-node');

const CREATE_NEW_PLAYER_YES = 'yes';

/**
 *
 * @param {UIRouter} uiRouter
 * @param {ParsedSlackActionPayload} parsedPayload
 * @param {{}} args
 * @return {Promise.<UIMessage,Error>}
 */
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
                let text = 'Error: Cannot retrieve your user info from Slack: ' + response.error;
                let uiMessage = uiRouter.informationMessageUIRoute().getUIMessage(uiRouter, { text });
                resolve(uiMessage);
              } else if (response.ok === true) {
                // Ensure player doesn't exist. Maybe that was click on outdated screen.
                if (!uiRouter.player) {
                  // Now we can safely create new player.
                  let playerFirebaseValue = {
                    active: true,
                    name: response.user.profile.real_name,
                    gold: 0
                  };
                  setPlayer(playerFirebaseValue, uiRouter.team.$key, uiRouter.channel.$key, parsedPayload.user.id)
                    .then(() => {
                      let text = 'Player being created.';
                      let uiMessage = uiRouter.informationMessageUIRoute().getUIMessage(uiRouter, { text });
                      resolve(uiMessage);
                    }, (error) => {
                      let text = 'Error: Player cannot be created into DB in some reason: ' + error.message;
                      let uiMessage = uiRouter.informationMessageUIRoute().getUIMessage(uiRouter, { text });
                      resolve(uiMessage);
                    });
                } else {
                  let text = 'Error: Player already exists.';
                  let uiMessage = uiRouter.informationMessageUIRoute().getUIMessage(uiRouter, { text });
                  resolve(uiMessage);
                }
              } else {
                let text = 'Some unexpected error occurred during retrieval info about your Slack user.';
                let uiMessage = uiRouter.informationMessageUIRoute().getUIMessage(uiRouter, { text });
                resolve(uiMessage);
              }
            });
          });
          break;
      }
      break;
  }
  return null;
}

/**
 *
 * @param {UIRouter} uiRouter
 * @param {{}} args
 * @return {UIMessage}
 */
function getUIMessage(uiRouter, args) {
  if (uiRouter.player) {
    let text = 'Error: Player already exists.';
    let uiMessage = uiRouter.informationMessageUIRoute().getUIMessage(uiRouter, { text });
    return uiMessage;
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