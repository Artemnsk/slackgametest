import { GetUIMessageFunction, ProcessActionsFunction, UIRoute, ValidateRouteFunction } from "../../uiroute";
import { spellBookMessageFactory } from "./spellbookmessagefactory";

const processActions: ProcessActionsFunction = (uiRouter, parsedPayload, args: {}) => {
  // Parse submitted actions to know which window to render.
  // TODO:
  const action = parsedPayload.actions[0];
  switch (action.name) {
    case "spell":
      return uiRouter.spellinfoUIRoute.getUIMessage(uiRouter, { spellId: action.value });
    case "back":
      return uiRouter.breakmenuUIRoute.getUIMessage(uiRouter, {});
  }
  const text = "Unknown error.";
  return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
};

const getUIMessage: GetUIMessageFunction = (uiRouter, args: {}) => {
  const path = uiRouter.spellbookUIRoute.route.reverse({});
  if (path !== false) {
    const uiMessage = spellBookMessageFactory(path, uiRouter.channel, uiRouter.player);
    return Promise.resolve(uiMessage);
  } else {
    const text = "Unknown error.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
  }
};

const validateRoute: ValidateRouteFunction = (uiRouter, path, parsedPayload) => {
  return Promise.resolve(null);
};

export const uiRoute = new UIRoute("/breakmenu/spellbook", processActions, getUIMessage, validateRoute);
