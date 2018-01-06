import { ACTION_TYPES, GameAction } from "../gameaction/gameaction";
import { GameActionRequestUseItem } from "../gameactionrequestuseitem/gameactionrequestuseitem";

export class GameActionUseItem extends GameAction {
  public type: ACTION_TYPES.USE_ITEM;

  constructor(gameActionRequestUseItem: GameActionRequestUseItem) {
    super(gameActionRequestUseItem);
  }
}
