import { GAME_ACTION_TYPES, GameAction } from "../../gameaction";

export class GameActionUseItem extends GameAction {
  public type: GAME_ACTION_TYPES.USE_ITEM;
}
