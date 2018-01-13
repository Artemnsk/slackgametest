import { Game } from "../game/game";
import { getRecentAction as getRecentActionDB } from "./dbfirebase";
import { GAME_ACTION_REQUEST_TYPES, GameActionRequest } from "./gameactionrequest";
import { GameActionRequestCastSpellFirebaseValueRaw, processFirebaseRawValues as processCastSpellFBRaw } from "./gameactionrequests/gameactionrequestcastspell/dbfirebase";
import { GameActionRequestCastSpell } from "./gameactionrequests/gameactionrequestcastspell/gameactionrequestcastspell";
import { GameActionRequestUseItemFirebaseValueRaw, processFirebaseRawValues as processUseItemFBRaw } from "./gameactionrequests/gameactionrequestuseitem/dbfirebase";
import { GameActionRequestUseItem } from "./gameactionrequests/gameactionrequestuseitem/gameactionrequestuseitem";

export function getRecentAction(game: Game): Promise<GameActionRequest|null> {
  return getRecentActionDB()
    .then((recentAction): Promise<GameActionRequest|null> => {
      if (recentAction === null) {
        return Promise.resolve(null);
      } else {
        // TSC cannot understand that these Action Types already mean that we have certain object type inside. That's why we use assertion.
        switch (recentAction.value.type) {
          case GAME_ACTION_REQUEST_TYPES.CAST_SPELL:
            const assertFirebaseValueRawCS = recentAction.value as GameActionRequestCastSpellFirebaseValueRaw;
            const gameActionRequestCastSpell = new GameActionRequestCastSpell(game, processCastSpellFBRaw(assertFirebaseValueRawCS), recentAction.$key);
            return Promise.resolve(gameActionRequestCastSpell);
          case GAME_ACTION_REQUEST_TYPES.USE_ITEM:
            const assertFirebaseValueRawUI = recentAction.value as GameActionRequestUseItemFirebaseValueRaw;
            const gameActionRequestUseItem = new GameActionRequestUseItem(game, processUseItemFBRaw(assertFirebaseValueRawUI), recentAction.$key);
            return Promise.resolve(gameActionRequestUseItem);
          default:
            return Promise.resolve(null);
        }
      }
    });
}
