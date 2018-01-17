import { Game } from "../../../game/game";
import { GameActionRequestUseItem } from "../../../gameactionrequest/gameactionrequests/gameactionrequestuseitem/gameactionrequestuseitem";
import { Gamer } from "../../../gamer/gamer";
import { UsableGamerItem } from "../../../Item/gameritem/usablegameritem";
import { GAME_ACTION_TYPES, GameAction } from "../../gameaction";

export class GameActionUseItem extends GameAction {
  public initiator: Gamer;
  public target: Gamer;
  public type: GAME_ACTION_TYPES.USE_ITEM;
  protected item: UsableGamerItem;

  constructor(game: Game, gameActionRequest: GameActionRequestUseItem, initiator: Gamer, target: Gamer, item: UsableGamerItem) {
    super(game, gameActionRequest, initiator, target);
    this.item = item;
  }
}
