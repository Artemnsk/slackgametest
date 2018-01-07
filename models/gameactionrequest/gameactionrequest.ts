import { addDBGameActionRequest, GameActionRequestFirebaseValue, removeDBGameActionRequest } from "./dbfirebase";

export const enum GAME_ACTION_REQUEST_TYPES {
  CAST_SPELL = "CAST_SPELL",
  USE_ITEM = "USE_ITEM",
}

export abstract class GameActionRequest {
  public static removeAction(teamKey: string, channelKey: string, gameKey: string, gameActionRequestKey: string): Promise<void> {
    return removeDBGameActionRequest(teamKey, channelKey, gameKey, gameActionRequestKey);
  }

  /**
   * Adds new action into DB.
   */
  public static addRawAction(gameActionRequestFirebaseValue: GameActionRequestFirebaseValue, teamKey: string, channelKey: string, gameKey: string): Promise<void> {
    return addDBGameActionRequest(gameActionRequestFirebaseValue, teamKey, channelKey, gameKey);
  }

  public type: GAME_ACTION_REQUEST_TYPES;
  public created: number;
  public initiator: string | null;
  public target: string | null;

  constructor(values: GameActionRequestFirebaseValue) {
    this.type = values.type;
    this.created = values.created;
    this.initiator = values.initiator;
    this.target = values.target;
  }

  public abstract getFirebaseValue(): GameActionRequestFirebaseValue;
}
