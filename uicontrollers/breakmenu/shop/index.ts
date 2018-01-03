import { CHANNEL_PHASES } from "../../../models/channel/dbfirebase";
import { GetUIMessageFunction, ProcessActionsFunction, UIRoute, ValidateRouteFunction } from "../../uiroute";
import { shopMessageFactory } from "./shopMessagefactory";

const processActions: ProcessActionsFunction = (uiRouter, parsedPayload, args: {}) => {
  if (!uiRouter.player) {
    const text = "Player doesn't exist.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
  } else if (uiRouter.channel.phase !== CHANNEL_PHASES.BREAK) {
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text: "Error: Invalid channel phase to use this menu." });
  }
  // Parse submitted actions to know which window to render.
  // TODO:
  const action = parsedPayload.actions[0];
  switch (action.name) {
    case "back":
      return uiRouter.breakmenuUIRoute.getUIMessage(uiRouter, {});
  }
  const text = "Error: unknown.";
  return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
};

const getUIMessage: GetUIMessageFunction = (uiRouter, args: {}) => {
  if (!uiRouter.player) {
    const text = "Player doesn't exist.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
  } else if (uiRouter.channel.phase !== CHANNEL_PHASES.BREAK) {
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text: "Error: Invalid channel phase to use this menu." });
  }
  const path = uiRouter.shopUIRoute.route.reverse({});
  if (path !== false) {
    const uiMessage = shopMessageFactory(path, uiRouter.channel, uiRouter.player);
    return Promise.resolve(uiMessage);
  } else {
    const text = "Unknown error.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
  }
};

const validateRoute: ValidateRouteFunction = (uiRouter, path, parsedPayload) => {
  return Promise.resolve(null);
};

export const uiRoute = new UIRoute("/breakmenu/shop", processActions, getUIMessage, validateRoute);
