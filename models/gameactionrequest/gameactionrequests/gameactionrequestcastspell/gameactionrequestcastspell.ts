import { Game } from "../../../game/game";
import { GAME_ACTION_REQUEST_TYPES, GameActionRequest } from "../../gameactionrequest";
import { GameActionRequestCastSpellFirebaseValue } from "./dbfirebase";
import { GameActionCastSpell } from "../../../gameaction/gameactions/gameactioncastspell/gameactioncastspell";

export class GameActionRequestCastSpell extends GameActionRequest {
  public type: GAME_ACTION_REQUEST_TYPES.CAST_SPELL;
  public spellId: string;

  constructor(game: Game, values: GameActionRequestCastSpellFirebaseValue, $key: string) {
    super(game, values, $key);
    this.spellId = values.spellId;
  }

  public toGameAction(): GameActionCastSpell {
    return new GameActionCastSpell(this.game, this, this.initiator, this.target);
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
