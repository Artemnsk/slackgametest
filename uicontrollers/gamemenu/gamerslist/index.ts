import { GetUIMessageFunction, ProcessActionsFunction, UIRoute, ValidateRouteFunction } from "../../uiroute";
import { gamersListMessageFactory } from "./gamerslistmessagefactory";

const processActions: ProcessActionsFunction = (uiRouter, parsedPayload, args: {}) => {
  const action = parsedPayload.actions[0];
  switch (action.name) {
    case "navigation":
      switch (action.value) {
        case "back":
          return uiRouter.gamemenuUIRoute.getUIMessage(uiRouter, {});
      }
      break;
  }
  const text = "Unknown error.";
  return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
};

const getUIMessage: GetUIMessageFunction = (uiRouter, args: {}) => {
  const path = uiRouter.gamersListUIRoute.route.reverse(args);
  if (path !== false) {
    return Promise.resolve(gamersListMessageFactory(path, uiRouter.game, uiRouter.gamer));
  } else {
    const text = "Unknown error.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
  }
};

const validateRoute: ValidateRouteFunction = (uiRouter, path, parsedPayload) => {
  return Promise.resolve(null);
};

export const uiRoute = new UIRoute("/gamemenu/gamerslist", processActions, getUIMessage, validateRoute);
