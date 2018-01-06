import { ACTION_TYPES } from "../gameaction/gameaction";
import { GameActionRequestCastSpellFirebaseValueRaw, processFirebaseRawValues as processCastSpellFBRaw } from "../gameactionrequestcastspell/dbfirebase";
import { GameActionRequestCastSpell } from "../gameactionrequestcastspell/gameactionrequestcastspell";
import { GameActionRequestUseItemFirebaseValueRaw, processFirebaseRawValues as processUseItemFBRaw } from "../gameactionrequestuseitem/dbfirebase";
import { GameActionRequestUseItem } from "../gameactionrequestuseitem/gameactionrequestuseitem";
import { getRecentAction as getRecentActionDB } from "./dbfirebase";
import { GameActionRequest} from "./gameactionrequest";

export function getRecentAction(): Promise<GameActionRequest|null> {
  return getRecentActionDB()
    .then((value): Promise<GameActionRequest|null> => {
      if (value === null) {
        return Promise.resolve(null);
      } else {
        // TSC cannot understand that these Action Types already mean that we have certain object type inside. That's why we use assertion.
        switch (value.type) {
          case ACTION_TYPES.CAST_SPELL:
            const assertFirebaseValueRawCS = value as GameActionRequestCastSpellFirebaseValueRaw;
            const gameActionRequestCastSpell = new GameActionRequestCastSpell(processCastSpellFBRaw(assertFirebaseValueRawCS));
            return Promise.resolve(gameActionRequestCastSpell);
          case ACTION_TYPES.USE_ITEM:
            const assertFirebaseValueRawUI = value as GameActionRequestUseItemFirebaseValueRaw;
            const gameActionRequestUseItem = new GameActionRequestUseItem(processUseItemFBRaw(assertFirebaseValueRawUI));
            return Promise.resolve(gameActionRequestUseItem);
          default:
            return Promise.resolve(null);
        }
      }
    });
}
