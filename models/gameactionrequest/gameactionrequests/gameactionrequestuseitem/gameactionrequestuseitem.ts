import { Game } from "../../../game/game";
import { UsableGamerItem } from "../../../Item/gameritem/usablegameritem";
import { GAME_ACTION_REQUEST_TYPES, GameActionRequest } from "../../gameactionrequest";
import { GameActionRequestUseItemFirebaseValue } from "./dbfirebase";
import { GameActionUseItem } from "../../../gameaction/gameactions/gameactionuseitem/gameactionuseitem";

export class GameActionRequestUseItem extends GameActionRequest {
  public type: GAME_ACTION_REQUEST_TYPES.USE_ITEM;
  public itemId: string;
  public initiator: string;
  public target: string;

  constructor(game: Game, values: GameActionRequestUseItemFirebaseValue, $key: string) {
    super(game, values, $key);
    this.itemId = values.itemId;
  }

  public toGameAction(): GameActionUseItem | null {
    const initiator = this.game.getGamer(this.initiator);
    const target = this.game.getGamer(this.target);
    if (initiator !== null && target !== null) {
      const item = initiator.getItem(this.itemId);
      if (item !== null) {
        const usableItem = item as UsableGamerItem;
        return usableItem.getInitialGameAction(this.game, this, initiator, target);
      }
      return null;
    } else {
      return null;
    }
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
