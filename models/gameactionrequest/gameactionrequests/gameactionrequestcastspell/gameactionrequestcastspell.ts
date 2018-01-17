import { Game } from "../../../game/game";
import { UsableSpell } from "../../../spell/usablespell";
import { GAME_ACTION_REQUEST_TYPES, GameActionRequest } from "../../gameactionrequest";
import { GameActionRequestCastSpellFirebaseValue } from "./dbfirebase";
import { GameActionCastSpell } from "../../../gameaction/gameactions/gameactioncastspell/gameactioncastspell";

export class GameActionRequestCastSpell extends GameActionRequest {
  public type: GAME_ACTION_REQUEST_TYPES.CAST_SPELL;
  public spellId: string;
  public initiator: string;
  public target: string;

  constructor(game: Game, values: GameActionRequestCastSpellFirebaseValue, $key: string) {
    super(game, values, $key);
    this.spellId = values.spellId;
  }

  public toGameAction(): GameActionCastSpell | null {
    const initiator = this.game.getGamer(this.initiator);
    const target = this.game.getGamer(this.target);
    if (initiator !== null && target !== null) {
      const spell = initiator.getSpell(this.spellId);
      if (spell !== null) {
        const usableSpell = spell as UsableSpell;
        return usableSpell.getInitialGameAction(this.game, this, initiator, target);
      }
      return null;
    } else {
      return null;
    }
  }

  public getFirebaseValue(): GameActionRequestCastSpellFirebaseValue {
    return {
      created: this.created,
      initiator: this.initiator,
      spellId: this.spellId,
      target: this.target,
      type: this.type,
    };
  }
}
