import { Game } from "../../../game/game";
import { GameActionRequestUseItem } from "../../../gameactionrequest/gameactionrequests/gameactionrequestuseitem/gameactionrequestuseitem";
import { GAME_ACTION_TYPES, GameAction } from "../../gameaction";

export class GameActionUseItem extends GameAction {
  public type: GAME_ACTION_TYPES.USE_ITEM;

  constructor(game: Game, gameActionRequestUseItem: GameActionRequestUseItem) {
    super(game, gameActionRequestUseItem);
  }
}
