import * as Route from "route-parser";
import { UsableItem } from "../../../models/Item/usableitem";
import { GetUIMessageFunction, ProcessActionsFunction, UIRoute, ValidateRouteFunction } from "../../uiroute";
import { useItemMessageFactory } from "./useitemmessagefactory";

const processActions: ProcessActionsFunction = (uiRouter, parsedPayload, args: {itemKey: string}) => {
  if (uiRouter.game === null || uiRouter.gamer === null) {
    const text = "Route validation for /gamemenu/useitem/:itemKey/* fails.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
  }
  const action = parsedPayload.actions[0];
  switch (action.name) {
    case "back":
      return uiRouter.gamemenuUIRoute.getUIMessage(uiRouter, {});
  }
  // Delegate that to spell now.
  const item = uiRouter.gamer.getItem(args.itemKey);
  if (item !== null && item instanceof UsableItem) {
    const itemBeingProcessedPromise = item.processUsageForm(uiRouter.game, uiRouter.gamer, parsedPayload);
    return itemBeingProcessedPromise
      .then((processed) => {
        if (processed) {
          return uiRouter.gamemenuUIRoute.getUIMessage(uiRouter, {});
        } else {
          // ..proceed with other checks. Currently no other checks.
          const text = "Unknown error.";
          return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
        }
      }, (err) => {
        return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text: `Error: Something went wrong. ${err.message}` });
      });
  }
  const text = "Unknown error.";
  return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
};

const getUIMessage: GetUIMessageFunction = (uiRouter, args: {itemKey: string}) => {
  if (uiRouter.game === null || uiRouter.gamer === null) {
    const text = "Route validation for /gamemenu/useitem/:itemKey/* fails.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
  }
  const path = uiRouter.useItemUIRoute.route.reverse(args);
  const item = uiRouter.gamer.getItem(args.itemKey);
  if (path !== false && item !== null && item instanceof UsableItem) {
    return Promise.resolve(useItemMessageFactory(path, uiRouter.channel, uiRouter.game, uiRouter.gamer, item));
  } else {
    const text = "Route not found.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
  }
};

const validateRoute: ValidateRouteFunction = (uiRouter, path, parsedPayload) => {
  const validateRoute = new Route("/gamemenu/useitem/:itemKey/*");
  const args = validateRoute.match(path);
  if (args !== false) {
    const validArgs = args as { itemKey: string };
    if (!uiRouter.gamer) {
      return Promise.reject({ message: "Error: You are not participate in this game." });
    } else if (!uiRouter.gamer.getItem(validArgs.itemKey)) {
      return Promise.reject({ message: "Error: You have no this item." });
    }
  }
  return Promise.resolve(null);
};

export const uiRoute = new UIRoute("/gamemenu/useitem/:itemKey", processActions, getUIMessage, validateRoute);
