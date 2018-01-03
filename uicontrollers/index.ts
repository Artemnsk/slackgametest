import { CHANNEL_PHASES } from "../models/channel/dbfirebase";
import { GetUIMessageFunction, ProcessActionsFunction, UIRoute, ValidateRouteFunction } from "./uiroute";

const processActions: ProcessActionsFunction = (uiRouter, parsedPayload, args: {}) => {
  const uiMessage = getUIMessage(uiRouter, {});
  return Promise.resolve(uiMessage);
};

const getUIMessage: GetUIMessageFunction = (uiRouter, args: {}) => {
  if (!uiRouter.player) {
    return uiRouter.newplayerUIRoute.getUIMessage(uiRouter, {});
  }
  switch (uiRouter.channel.phase) {
    case CHANNEL_PHASES.BREAK:
      return uiRouter.breakmenuUIRoute.getUIMessage(uiRouter, {});
    case CHANNEL_PHASES.IN_GAME:
      // TODO: game menu.
      return uiRouter.gamemenuUIRoute.getUIMessage(uiRouter, {});
    default:
      const text = "Channel is invalid.";
      return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
  }
};

const validateRoute: ValidateRouteFunction = (uiRouter, path, parsedPayload) => {
  return Promise.resolve(null);
};

export const uiRoute = new UIRoute("/", processActions, getUIMessage, validateRoute);
