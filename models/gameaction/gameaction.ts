import { GameActionRequest } from "../gameactionrequest/gameactionrequest";

// We use these action types enum across all possible action of any types: GameActionRequest, GameAction and so on..
// FIXME: maybe that is much better to keep own type instance for better architecture.
export const enum ACTION_TYPES {
  CAST_SPELL = "CAST_SPELL",
  USE_ITEM = "USE_ITEM",
}

export abstract class GameAction {
  public type: ACTION_TYPES;
  public created: number;

  constructor(gameActionRequest: GameActionRequest) {
    this.type = gameActionRequest.type;
    this.created = gameActionRequest.created;
  }
}
