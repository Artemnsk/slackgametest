import { GAME_ACTION_REQUEST_TYPES, GameActionRequest } from "../../gameactionrequest";
import { GameActionRequestUseItemFirebaseValue } from "./dbfirebase";

export class GameActionRequestUseItem extends GameActionRequest {
  public type: GAME_ACTION_REQUEST_TYPES.USE_ITEM;
  public itemId: string;

  constructor(values: GameActionRequestUseItemFirebaseValue) {
    super(values);
    this.itemId = values.itemId;
  }

  public getFirebaseValue(): GameActionRequestUseItemFirebaseValue {
    return {
      created: this.created,
      initiator: this.initiator,
      itemId: this.itemId,
      target: this.target,
      type: this.type,
    };
  }
}
