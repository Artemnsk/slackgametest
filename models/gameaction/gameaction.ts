import { Game } from "../game/game";
import { GAME_ACTION_REQUEST_TYPES, GameActionRequest } from "../gameactionrequest/gameactionrequest";
import { Gamer } from "../gamer/gamer";

export const enum GAME_ACTION_TYPES {
  CAST_SPELL = "CAST_SPELL",
  USE_ITEM = "USE_ITEM",
}

export abstract class GameAction {
  public type: GAME_ACTION_TYPES;
  public initiator: Gamer;
  public target: Gamer;
  public created: number;
  private game: Game;

  constructor(game: Game, gameActionRequest: GameActionRequest, initiator: Gamer, target: Gamer) {
    this.game = game;
    switch (gameActionRequest.type) {
      case GAME_ACTION_REQUEST_TYPES.CAST_SPELL:
        this.type = GAME_ACTION_TYPES.CAST_SPELL;
        break;
      case GAME_ACTION_REQUEST_TYPES.USE_ITEM:
        this.type = GAME_ACTION_TYPES.USE_ITEM;
        break;
    }
    this.initiator = initiator;
    this.target = target;
    this.created = gameActionRequest.created;
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
}
