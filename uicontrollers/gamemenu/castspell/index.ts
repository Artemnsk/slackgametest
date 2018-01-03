import * as Route from "route-parser";
import { spells } from "../../../storage/spells/spells";
import { castSpellMessageFactory } from "./castspellmessagefactory";

import { GetUIMessageFunction, ProcessActionsFunction, UIRoute, ValidateRouteFunction } from "../../uiroute";

const processActions: ProcessActionsFunction = (uiRouter, parsedPayload, args: {spellId: string}) => {
  const action = parsedPayload.actions[0];
  switch (action.name) {
    case "back":
      return uiRouter.gamemenuUIRoute.getUIMessage(uiRouter, {});
  }
  // Delegate that to spell now.
  const spell = spells.find((item) => item.id === args.spellId);
  const spellBeingProcessedPromise = spell.processCastForm(uiRouter.game, uiRouter.gamer, parsedPayload);
  return spellBeingProcessedPromise
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

const getUIMessage: GetUIMessageFunction = (uiRouter, args: {spellId: string}) => {
  const spell = spells.find((item) => item.id === args.spellId);
  const path = uiRouter.castspellUIRoute.route.reverse(args);
  if (path !== false) {
    return Promise.resolve(castSpellMessageFactory(path, uiRouter.channel, uiRouter.game, uiRouter.gamer, spell));
  } else {
    const text = "Unknown error.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
  }
};

const validateRoute: ValidateRouteFunction = (uiRouter, path, parsedPayload) => {
  const validateRoute = new Route("/gamemenu/castspell/:spellId/*");
  const args = validateRoute.match(path);
  if (args !== false) {
    if (!uiRouter.gamer) {
      return Promise.reject({ message: "Error: You are not participate in this game." });
    } else if (!spells.find((item) => item.id === args.spellId)) {
      return Promise.reject({ message: "Error: spell with this spell ID doesn't exist." });
    } else if (!uiRouter.gamer.spells || uiRouter.gamer.spells[args.spellId] !== true) {
      return Promise.reject({ message: "Error: You have no this spell." });
    }
  }
  return Promise.resolve(null);
};

export const uiRoute = new UIRoute("/gamemenu/castspell/:spellId", processActions, getUIMessage, validateRoute);
