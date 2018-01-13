import { GAME_ACTION_TYPES, GameAction } from "../../gameaction";

export class GameActionCastSpell extends GameAction {
  public type: GAME_ACTION_TYPES.CAST_SPELL;
}
