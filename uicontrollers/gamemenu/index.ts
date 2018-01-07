import * as Route from "route-parser";
import { CHANNEL_PHASES } from "../../models/channel/dbfirebase";
import { GetUIMessageFunction, ProcessActionsFunction, UIRoute, ValidateRouteFunction } from "../uiroute";
import { gameMenuMessageFactory } from "./gamemenumessagefactory";

const processActions: ProcessActionsFunction = (uiRouter, parsedPayload, args: {}) => {
  const action = parsedPayload.actions[0];
  switch (action.name) {
    case "spell":
      return uiRouter.castspellUIRoute.getUIMessage(uiRouter, { spellKey: action.value });
    case "item":
      return uiRouter.useItemUIRoute.getUIMessage(uiRouter, { itemKey: action.value });
    case "navigation":
      switch (action.value) {
        case "stats":
          return uiRouter.gamersListUIRoute.getUIMessage(uiRouter, {});
      }
      break;
  }
  const text = "Unknown error.";
  return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
};

const getUIMessage: GetUIMessageFunction = (uiRouter, args: {}) => {
  // Normal game menu.
  const path = uiRouter.gamemenuUIRoute.route.reverse({});
  if (path !== false) {
    const uiMessage = gameMenuMessageFactory(path, uiRouter.gamer);
    return Promise.resolve(uiMessage);
  }
  const text = "Route not found.";
  return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
};

const validateRoute: ValidateRouteFunction = (uiRouter, path, parsedPayload) => {
  const validateRoute = new Route("/gamemenu/*");
  if (validateRoute.match(path)) {
    if (!uiRouter.player) {
      return Promise.reject({ message: "Error: Cannot find your player." });
    } else if (uiRouter.channel.phase !== CHANNEL_PHASES.IN_GAME) {
      return Promise.reject({ message: "Error: Wrong game phase." });
    }
  }
  return Promise.resolve(null);
};

export const uiRoute = new UIRoute("/gamemenu", processActions, getUIMessage, validateRoute);
