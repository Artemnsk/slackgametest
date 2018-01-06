import { GameActionRequestFirebaseValue } from "./dbfirebase";

export const enum ACTION_TYPES {
  CAST_SPELL = "CAST_SPELL",
  USE_ITEM = "USE_ITEM",
}

export class GameActionRequest {
  public type: ACTION_TYPES;
  public created: number;
  public initiator: string|null;
  public target: string|null;

  constructor(values: GameActionRequestFirebaseValue) {
    this.type = values.type;
    this.created = values.created;
    this.initiator = values.initiator;
    this.target = values.target;
  }
}
