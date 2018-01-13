import { Game } from "../game/game";
import { GAME_ACTION_REQUEST_TYPES, GameActionRequest } from "../gameactionrequest/gameactionrequest";

export const enum GAME_ACTION_TYPES {
  CAST_SPELL = "CAST_SPELL",
  USE_ITEM = "USE_ITEM",
}

export abstract class GameAction {
  public type: GAME_ACTION_TYPES;
  public created: number;
  private game: Game;

  constructor(game: Game, gameActionRequest: GameActionRequest) {
    this.game = game;
    switch (gameActionRequest.type) {
      case GAME_ACTION_REQUEST_TYPES.CAST_SPELL:
        this.type = GAME_ACTION_TYPES.CAST_SPELL;
        break;
      case GAME_ACTION_REQUEST_TYPES.USE_ITEM:
        this.type = GAME_ACTION_TYPES.USE_ITEM;
        break;
    }
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
