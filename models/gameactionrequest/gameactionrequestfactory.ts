import { GameActionRequestCastSpellFirebaseValue, processFirebaseRawValues as processCastSpellFBRaw } from "../gameactionrequestcastspell/dbfirebase";
import { GameActionRequestCastSpell } from "../gameactionrequestcastspell/gameactionrequestcastspell";
import { GameActionRequestUseItemFirebaseValue, processFirebaseRawValues as processUseItemFBRaw } from "../gameactionrequestuseitem/dbfirebase";
import { GameActionRequestUseItem } from "../gameactionrequestuseitem/gameactionrequestuseitem";
import { getRecentAction as getRecentActionDB } from "./dbfirebase";
import { ACTION_TYPES, GameActionRequest} from "./gameactionrequest";

export function getRecentAction(): Promise<GameActionRequest|null> {
  return getRecentActionDB()
    .then((value): Promise<GameActionRequest|null> => {
      if (value === null) {
        return Promise.resolve(null);
      } else {
        switch (value.type) {
          case ACTION_TYPES.CAST_SPELL:
            const firebaseValueCS: GameActionRequestCastSpellFirebaseValue = processCastSpellFBRaw(value);
            const gameActionRequestCastSpell = new GameActionRequestCastSpell(firebaseValueCS);
            return Promise.resolve(gameActionRequestCastSpell);
          case ACTION_TYPES.USE_ITEM:
            const firebaseValueUI: GameActionRequestUseItemFirebaseValue = processUseItemFBRaw(value);
            const gameActionRequestUseItem = new GameActionRequestUseItem(firebaseValueUI);
            return Promise.resolve(gameActionRequestUseItem);
          default:
            return Promise.resolve(null);
        }
      }
    });
}
