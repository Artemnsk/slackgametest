import * as Route from "route-parser";
import * as Slack from "slack-node";
import { PlayerFirebaseValue } from "../../models/player/dbfirebase";
import { Player } from "../../models/player/player";
import { GetUIMessageFunction, ProcessActionsFunction, UIRoute, ValidateRouteFunction } from "../uiroute";
import { newPlayerMessageFactory } from "./newplayermessagefactory";

const CREATE_NEW_PLAYER_YES = "yes";

const processActions: ProcessActionsFunction = (uiRouter, parsedPayload, args: {}) => {
  // Parse submitted actions to know which window to render.
  // TODO: that is actually bad.
  const action = parsedPayload.actions[0];
  switch (action.name) {
    case "option":
      switch (action.value) {
        case CREATE_NEW_PLAYER_YES:
          // Get user info from Slack.
          // https://api.slack.com/methods/users.info
          const apiCallArgs = {
            // TODO:
            include_locale: false,
            user: parsedPayload.user.id,
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
                const text = "Error: Cannot retrieve your user info from Slack: " + response.error;
                const uiMessage = uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
                resolve(uiMessage);
              } else if (response.ok === true) {
                // Ensure player doesn"t exist. Maybe that was click on outdated screen.
                if (!uiRouter.player) {
                  // Now we can safely create new player.
                  const playerFirebaseValue: PlayerFirebaseValue = {
                    active: true,
                    gold: 0,
                    items: {},
                    name: response.user.profile.real_name,
                  };
                  Player.setPlayer(playerFirebaseValue, uiRouter.team.$key, uiRouter.channel.$key, parsedPayload.user.id)
                    .then(() => {
                      const text = "Player being created.";
                      const uiMessage = uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
                      resolve(uiMessage);
                    }, (error) => {
                      const text = "Error: Player cannot be created into DB in some reason: " + error.message;
                      const uiMessage = uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
                      resolve(uiMessage);
                    });
                } else {
                  const text = "Error: Player already exists.";
                  const uiMessage = uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
                  resolve(uiMessage);
                }
              } else {
                const text = "Some unexpected error occurred during retrieval info about your Slack user.";
                const uiMessage = uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
                resolve(uiMessage);
              }
            });
          });
      }
      break;
  }
  const text = "Error: Cannot parse request.";
  return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
};

const getUIMessage: GetUIMessageFunction = (uiRouter, args: {}) => {
  const path = uiRouter.newplayerUIRoute.route.reverse({});
  if (path) {
    const uiMessage = newPlayerMessageFactory(path);
    return Promise.resolve(uiMessage);
  } else {
    const error = "Error: cannot parse path.";
    return Promise.reject({ message: error });
  }
};

const validateRoute: ValidateRouteFunction = (uiRouter, path, parsedPayload) => {
  const validateRoute = new Route("/newplayer/*");
  if (validateRoute.match(path)) {
    if (uiRouter.player) {
      return Promise.reject({ message: "Error: Player already exists." });
    }
  }
  return Promise.resolve(null);
};

export const uiRoute = new UIRoute("/newplayer", processActions, getUIMessage, validateRoute);
