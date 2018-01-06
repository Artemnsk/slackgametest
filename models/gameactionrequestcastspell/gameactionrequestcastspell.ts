import { ACTION_TYPES, GameActionRequest } from "../gameactionrequest/gameactionrequest";
import { GameActionRequestCastSpellFirebaseValue } from "./dbfirebase";

export class GameActionRequestCastSpell extends GameActionRequest {
  public type: ACTION_TYPES.CAST_SPELL;
  public spellId: string;

  constructor(values: GameActionRequestCastSpellFirebaseValue) {
    super(values);
    this.spellId = values.spellId;
  }
}
