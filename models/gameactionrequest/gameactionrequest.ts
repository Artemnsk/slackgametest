import { Game } from "../game/game";
import { addDBGameActionRequest, GameActionRequestFirebaseValue, removeDBGameActionRequest } from "./dbfirebase";
import { GameAction } from "../gameaction/gameaction";

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
    return addDBGameActionRequest(gameActionRequestFirebaseValue, game.getTeamKey(), game.getChannelKey(), game.getKey());
  }

  public type: GAME_ACTION_REQUEST_TYPES;
  public created: number;
  public initiator: string | null;
  public target: string | null;
  protected game: Game;
  private $key: string;

  constructor(game: Game, values: GameActionRequestFirebaseValue, $key: string) {
    this.game = game;
    this.$key = $key;
    this.type = values.type;
    this.created = values.created;
    this.initiator = values.initiator;
    this.target = values.target;
  }

  public getTeamKey(): string {
    return this.game.getTeamKey();
  }

  public getChannelKey(): string {
    return this.game.getChannelKey();
  }

  public getGameKey(): string {
    return this.game.getKey();
  }

  public getKey(): string {
    return this.$key;
  }

  public abstract toGameAction(): GameAction;

  public abstract getFirebaseValue(): GameActionRequestFirebaseValue;
}