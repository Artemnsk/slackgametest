import { Game } from "../game/game";
import { addDBGameActionRequest, GameActionRequestFirebaseValue, removeDBGameActionRequest } from "./dbfirebase";

export const enum GAME_ACTION_REQUEST_TYPES {
  CAST_SPELL = "CAST_SPELL",
  USE_ITEM = "USE_ITEM",
}

export abstract class GameActionRequest {
  public static removeGameActionRequest(teamKey: string, channelKey: string, gameKey: string, gameActionRequestKey: string): Promise<void> {
    return removeDBGameActionRequest(teamKey, channelKey, gameKey, gameActionRequestKey);
  }

  /**
   * Adds new action into DB.
   */
  public static addGameActionRequest(game: Game, gameActionRequestFirebaseValue: GameActionRequestFirebaseValue): Promise<void> {
    return addDBGameActionRequest(gameActionRequestFirebaseValue, game.channel.team.$key, game.channel.$key, game.$key);
  }

  public type: GAME_ACTION_REQUEST_TYPES;
  public created: number;
  public initiator: string | null;
  public target: string | null;
  public game: Game;
  public $key: string;

  constructor(game: Game, values: GameActionRequestFirebaseValue, $key: string) {
    this.game = game;
    this.$key = $key;
    this.type = values.type;
    this.created = values.created;
    this.initiator = values.initiator;
    this.target = values.target;
  }

  public abstract getFirebaseValue(): GameActionRequestFirebaseValue;
}
