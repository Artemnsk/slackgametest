import { spells } from "../../../../storage/spells/spells";
import { GetUIMessageFunction, ProcessActionsFunction, UIRoute, ValidateRouteFunction } from "../../../uiroute";
import { spellInfoMessageFactory } from "./spellinfomessagefactory";

const processActions: ProcessActionsFunction = (uiRouter, parsedPayload, args: {}) => {
  // Parse submitted actions to know which window to render.
  const action = parsedPayload.actions[0];
  switch (action.name) {
    case "back":
      return uiRouter.spellbookUIRoute.getUIMessage(uiRouter, {});
  }
  const text = "Channel is invalid.";
  return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
};

const getUIMessage: GetUIMessageFunction = (uiRouter, args: {spellId: string}) => {
  if (uiRouter.player === null) {
    const text = "Route validation for /breakmenu/spellbook/:spellName fails.";
    return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
  }
  const spell = spells.find((item) => item.id === args.spellId);
  if (spell) {
    const path = uiRouter.spellinfoUIRoute.route.reverse({ spellName: spell.id });
    if (path !== false) {
      const uiMessage = spellInfoMessageFactory(path, uiRouter.channel, uiRouter.player, spell);
      return Promise.resolve(uiMessage);
    } else {
      const text = "Unknown error.";
      return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
    }
  }
  const text = "Spell not found.";
  return uiRouter.informationMessageUIRoute.getUIMessage(uiRouter, { text });
};

const validateRoute: ValidateRouteFunction = (uiRouter, path, parsedPayload) => {
  return Promise.resolve(null);
};

export const uiRoute = new UIRoute("/breakmenu/spellbook/:spellName", processActions, getUIMessage, validateRoute);
