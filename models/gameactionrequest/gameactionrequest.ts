import { ACTION_TYPES } from "../gameaction/gameaction";
import { GameActionRequestFirebaseValue } from "./dbfirebase";

export abstract class GameActionRequest {
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
