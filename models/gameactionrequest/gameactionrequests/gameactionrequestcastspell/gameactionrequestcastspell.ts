import { GAME_ACTION_REQUEST_TYPES, GameActionRequest } from "../../gameactionrequest";
import { GameActionRequestCastSpellFirebaseValue } from "./dbfirebase";

export class GameActionRequestCastSpell extends GameActionRequest {
  public type: GAME_ACTION_REQUEST_TYPES.CAST_SPELL;
  public spellId: string;

  constructor(values: GameActionRequestCastSpellFirebaseValue) {
    super(values);
    this.spellId = values.spellId;
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
