import { GetUIMessageFunction, ProcessActionsFunction, UIRoute, ValidateRouteFunction } from "../uiroute";
import { INFORMATION_MESSAGE_OK, informationMessageFactory } from "./informationmessagefactory";

const processActions: ProcessActionsFunction = (uiRouter, parsedPayload, args: {}) => {
  // TODO: that is actually bad.
  const action = parsedPayload.actions[0];
  switch (action.name) {
    case INFORMATION_MESSAGE_OK:
      switch (action.value) {
        case INFORMATION_MESSAGE_OK:
          return uiRouter.rootUIRoute.getUIMessage(uiRouter, {});
      }
      break;
  }
  // Anyway return root if no match.
  return uiRouter.rootUIRoute.getUIMessage(uiRouter, {});
};

const getUIMessage: GetUIMessageFunction = (uiRouter, args: {text: string, buttonText?: string}) => {
  const buttonText = args.buttonText ? args.buttonText : "Ok";
  const path = uiRouter.informationMessageUIRoute.route.reverse({});
  if (path !== false) {
    const uiMessage = informationMessageFactory(path, args.text, buttonText);
    return Promise.resolve(uiMessage);
  } else {
    const text = "Error: unknown error.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
  }
};

const validateRoute: ValidateRouteFunction = (uiRouter, path, parsedPayload) => {
  return Promise.resolve(null);
};

export const uiRoute = new UIRoute("/informationmessage", processActions, getUIMessage, validateRoute);
