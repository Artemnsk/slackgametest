import * as Route from "route-parser";
import { CHANNEL_PHASES } from "../../models/channel/dbfirebase";
import { GetUIMessageFunction, ProcessActionsFunction, UIRoute, ValidateRouteFunction } from "../uiroute";
import { breakMenuMessageFactory } from "./breakmenumessagefactory";

const processActions: ProcessActionsFunction = (uiRouter, parsedPayload, args: {}) => {
  // Parse submitted actions to know which window to render.
  // TODO:
  const action = parsedPayload.actions[0];
  switch (action.name) {
    case "spellbook":
      return uiRouter.spellbookUIRoute.getUIMessage(uiRouter, {});
    case "shop":
      return uiRouter.shopUIRoute.getUIMessage(uiRouter, {});
  }
  const text = "Unknown error.";
  return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
};

const getUIMessage: GetUIMessageFunction = (uiRouter, args: {}) => {
  if (uiRouter.player === null) {
    const text = "Route validation for /breakmenu fails.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
  }
  const path = uiRouter.breakmenuUIRoute.route.reverse({});
  if (path !== false) {
    const uiMessage = breakMenuMessageFactory(path, uiRouter.channel, uiRouter.player);
    return Promise.resolve(uiMessage);
  } else {
    const text = "Channel is invalid.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
  }
};

const validateRoute: ValidateRouteFunction = (uiRouter, path, parsedPayload) => {
  const validateRoute = new Route("/breakmenu/*");
  if (validateRoute.match(path)) {
    if (!uiRouter.player) {
      return Promise.reject({ message: "Error: Cannot find your player." });
    } else if (uiRouter.channel.phase !== CHANNEL_PHASES.BREAK) {
      return Promise.reject({ message: "Error: Invalid channel phase to use this menu." });
    }
  }
  return Promise.resolve(null);
};

export const uiRoute = new UIRoute("/breakmenu", processActions, getUIMessage, validateRoute);
