import { Game } from "../../../game/game";
import { GameActionRequestCastSpell } from "../../../gameactionrequest/gameactionrequests/gameactionrequestcastspell/gameactionrequestcastspell";
import { Gamer } from "../../../gamer/gamer";
import { UsableSpell } from "../../../spell/usablespell";
import { GAME_ACTION_TYPES, GameAction } from "../../gameaction";

export class GameActionCastSpell extends GameAction {
  public initiator: Gamer;
  public target: Gamer;
  public type: GAME_ACTION_TYPES.CAST_SPELL;
  protected spell: UsableSpell;

  constructor(game: Game, gameActionRequest: GameActionRequestCastSpell, initiator: Gamer | string, target: Gamer | string) {
    super(game, gameActionRequest, initiator, target);
    this.spell = this.initiator.getSpell(gameActionRequest.spellId) as UsableSpell;
  }
}
