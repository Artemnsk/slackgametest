import { Game } from "../../../game/game";
import { GameActionRequestCastSpell } from "../../../gameactionrequest/gameactionrequests/gameactionrequestcastspell/gameactionrequestcastspell";
import { GAME_ACTION_TYPES, GameAction } from "../../gameaction";

export class GameActionCastSpell extends GameAction {
  public type: GAME_ACTION_TYPES.CAST_SPELL;

  constructor(game: Game, gameActionRequestCastSpell: GameActionRequestCastSpell) {
    super(game, gameActionRequestCastSpell);
  }
}
