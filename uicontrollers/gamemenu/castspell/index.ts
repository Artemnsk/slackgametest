import * as Route from "route-parser";
import { castSpellMessageFactory } from "./castspellmessagefactory";

import { GetUIMessageFunction, ProcessActionsFunction, UIRoute, ValidateRouteFunction } from "../../uiroute";
import {UsableSpell} from "../../../models/spell/usablespell";

const processActions: ProcessActionsFunction = (uiRouter, parsedPayload, args: {spellKey: string}) => {
  if (uiRouter.game === null || uiRouter.gamer === null) {
    const text = "Route validation for /gamemenu/castspell/:spellKey/* fails.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
  }
  const action = parsedPayload.actions[0];
  switch (action.name) {
    case "back":
      return uiRouter.gamemenuUIRoute.getUIMessage(uiRouter, {});
  }
  // Delegate that to spell now.
  const spell = uiRouter.gamer.getSpell(args.spellKey);
  if (spell !== null && spell instanceof UsableSpell) {
    const spellBeingProcessedPromise = spell.processUsageForm(uiRouter.game, uiRouter.gamer, parsedPayload);
    return spellBeingProcessedPromise
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

const getUIMessage: GetUIMessageFunction = (uiRouter, args: {spellKey: string}) => {
  if (uiRouter.game === null || uiRouter.gamer === null) {
    const text = "Route validation for /gamemenu/castspell/:spellKey/* fails.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
  }
  const spell = uiRouter.gamer.getSpell(args.spellKey);
  const path = uiRouter.castspellUIRoute.route.reverse(args);
  if (path !== false && spell !== null && spell instanceof UsableSpell) {
    return Promise.resolve(castSpellMessageFactory(path, uiRouter.channel, uiRouter.game, uiRouter.gamer, spell));
  } else {
    const text = "Unknown error.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
  }
};

const validateRoute: ValidateRouteFunction = (uiRouter, path, parsedPayload) => {
  const validateRoute = new Route("/gamemenu/castspell/:spellKey/*");
  const args = validateRoute.match(path);
  if (args !== false) {
    const validArgs = args as { spellKey: string };
    if (!uiRouter.gamer) {
      return Promise.reject({ message: "Error: You are not participate in this game." });
    } else if (!uiRouter.gamer.getSpell(validArgs.spellKey) === null) {
      return Promise.reject({ message: "Error: You have no this spell." });
    }
  }
  return Promise.resolve(null);
};

export const uiRoute = new UIRoute("/gamemenu/castspell/:spellKey", processActions, getUIMessage, validateRoute);
