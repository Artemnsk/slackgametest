import { ACTION_TYPES, GameAction } from "../gameaction/gameaction";
import { GameActionRequestCastSpell } from "../gameactionrequestcastspell/gameactionrequestcastspell";

export class GameActionCastSpell extends GameAction {
  public type: ACTION_TYPES.CAST_SPELL;

  constructor(gameActionRequestCastSpell: GameActionRequestCastSpell) {
    super(gameActionRequestCastSpell);
  }
}
