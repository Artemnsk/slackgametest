import { GameActionCastSpell } from "../gameactioncastspell/gameactioncastspell";
import { GameActionRequest } from "../gameactionrequest/gameactionrequest";
import { GameActionRequestCastSpell } from "../gameactionrequestcastspell/gameactionrequestcastspell";
import { GameActionRequestUseItem } from "../gameactionrequestuseitem/gameactionrequestuseitem";
import { GameActionUseItem } from "../gameactionuseitem/gameactionuseitem";
import { ACTION_TYPES, GameAction } from "./gameaction";

export function buildGameAction(gameActionRequest: GameActionRequest): GameAction {
  // TSC cannot understand that these Action Types already mean that we have certain object type inside. That's why we use assertion.
  switch (gameActionRequest.type) {
    case ACTION_TYPES.CAST_SPELL:
      const assertionCS = gameActionRequest as GameActionRequestCastSpell;
      return new GameActionCastSpell(assertionCS);
    case ACTION_TYPES.USE_ITEM:
      const assertionUI = gameActionRequest as GameActionRequestUseItem;
      return new GameActionUseItem(assertionUI);
  }
}
