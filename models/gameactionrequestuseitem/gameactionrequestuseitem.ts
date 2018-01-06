import { ACTION_TYPES } from "../gameaction/gameaction";
import { GameActionRequest } from "../gameactionrequest/gameactionrequest";
import { GameActionRequestUseItemFirebaseValue } from "./dbfirebase";

export class GameActionRequestUseItem extends GameActionRequest {
  public type: ACTION_TYPES.USE_ITEM;
  public itemId: string;

  constructor(values: GameActionRequestUseItemFirebaseValue) {
    super(values);
    this.itemId = values.itemId;
  }
}
