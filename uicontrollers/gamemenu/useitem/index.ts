import * as Route from "route-parser";
import { items } from "../../../storage/items/items";
import { GetUIMessageFunction, ProcessActionsFunction, UIRoute, ValidateRouteFunction } from "../../uiroute";
import { useItemMessageFactory } from "./useitemmessagefactory";

const processActions: ProcessActionsFunction = (uiRouter, parsedPayload, args: {itemId: string}) => {
  const action = parsedPayload.actions[0];
  switch (action.name) {
    case "back":
      return uiRouter.gamemenuUIRoute.getUIMessage(uiRouter, {});
  }
  // Delegate that to spell now.
  const item = items.find(currentItem => currentItem.id === args.itemId);
  const itemBeingProcessedPromise = item.processUsageForm(uiRouter.game, uiRouter.gamer, parsedPayload);
  return itemBeingProcessedPromise
    .then((processed) => {
      if (processed) {
        return uiRouter.gamemenuUIRoute.getUIMessage(uiRouter, {});
      } else {
        // ..proceed with other checks. Currently no other checks.
        // TODO: error?
        return null;
      }
    }, (err) => {
      return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text: `Error: Something went wrong. ${err.message}` });
    });
};

const getUIMessage: GetUIMessageFunction = (uiRouter, args: {itemId: string}) => {
  const path = uiRouter.useItemUIRoute.route.reverse(args);
  if (path !== false) {
    const item = items.find((currentItem) => currentItem.id === args.itemId);
    return Promise.resolve(useItemMessageFactory(path, uiRouter.channel, uiRouter.game, uiRouter.gamer, item));
  } else {
    const text = "Route not found.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
  }
};

const validateRoute: ValidateRouteFunction = (uiRouter, path, parsedPayload) => {
  const validateRoute = new Route("/gamemenu/useitem/:itemId/*");
  const args = validateRoute.match(path);
  if (args !== false) {
    if (!uiRouter.gamer) {
      return Promise.reject({ message: "Error: You are not participate in this game." });
    } else if (!items.find((item) => item.id === args.itemId)) {
      return Promise.reject({ message: "Error: item with this item ID doesn't exist." });
    } else if (!uiRouter.gamer.items || uiRouter.gamer.items[args.itemId] !== true) {
      return Promise.reject({ message: "Error: You have no this item." });
    }
  }
  return Promise.resolve(null);
};

export const uiRoute = new UIRoute("/gamemenu/useitem/:itemId", processActions, getUIMessage, validateRoute);
