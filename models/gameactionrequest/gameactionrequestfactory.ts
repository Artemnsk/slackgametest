import { Game } from "../game/game";
import { GameActionRequestFirebaseValueRaw } from "./dbfirebase";
import { GAME_ACTION_REQUEST_TYPES, GameActionRequest } from "./gameactionrequest";
import { GameActionRequestCastSpellFirebaseValueRaw, processFirebaseRawValues as processCastSpellFBRaw } from "./gameactionrequests/gameactionrequestcastspell/dbfirebase";
import { GameActionRequestCastSpell } from "./gameactionrequests/gameactionrequestcastspell/gameactionrequestcastspell";
import { GameActionRequestUseItemFirebaseValueRaw, processFirebaseRawValues as processUseItemFBRaw } from "./gameactionrequests/gameactionrequestuseitem/dbfirebase";
import { GameActionRequestUseItem } from "./gameactionrequests/gameactionrequestuseitem/gameactionrequestuseitem";

export function buildGameActionRequest(game: Game, actionRequestRaw: GameActionRequestFirebaseValueRaw, key: string): GameActionRequest | null {
  // TSC cannot understand that these Action Types already mean that we have certain object type inside. That's why we use assertion.
  switch (actionRequestRaw.type) {
    case GAME_ACTION_REQUEST_TYPES.CAST_SPELL:
      const assertFirebaseValueRawCS = actionRequestRaw as GameActionRequestCastSpellFirebaseValueRaw;
      const gameActionRequestCastSpell = new GameActionRequestCastSpell(game, processCastSpellFBRaw(assertFirebaseValueRawCS), key);
      return gameActionRequestCastSpell;
    case GAME_ACTION_REQUEST_TYPES.USE_ITEM:
      const assertFirebaseValueRawUI = actionRequestRaw as GameActionRequestUseItemFirebaseValueRaw;
      const gameActionRequestUseItem = new GameActionRequestUseItem(game, processUseItemFBRaw(assertFirebaseValueRawUI), key);
      return gameActionRequestUseItem;
    default:
      return null;
  }
}
