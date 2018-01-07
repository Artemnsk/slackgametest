import { GAME_ACTION_REQUEST_TYPES, GameActionRequest } from "../gameactionrequest/gameactionrequest";
import { GameActionRequestCastSpell } from "../gameactionrequest/gameactionrequests/gameactionrequestcastspell/gameactionrequestcastspell";
import { GameActionRequestUseItem } from "../gameactionrequest/gameactionrequests/gameactionrequestuseitem/gameactionrequestuseitem";
import { GameAction } from "./gameaction";
import { GameActionCastSpell } from "./gameactions/gameactioncastspell/gameactioncastspell";
import { GameActionUseItem } from "./gameactions/gameactionuseitem/gameactionuseitem";

export function buildGameAction(gameActionRequest: GameActionRequest): GameAction {
  // TSC cannot understand that these Action Types already mean that we have certain object type inside. That's why we use assertion.
  switch (gameActionRequest.type) {
    case GAME_ACTION_REQUEST_TYPES.CAST_SPELL:
      const assertionCS = gameActionRequest as GameActionRequestCastSpell;
      return new GameActionCastSpell(assertionCS);
    case GAME_ACTION_REQUEST_TYPES.USE_ITEM:
      const assertionUI = gameActionRequest as GameActionRequestUseItem;
      return new GameActionUseItem(assertionUI);
  }
}
