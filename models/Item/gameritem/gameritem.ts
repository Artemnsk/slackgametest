import { Game } from "../../game/game";
import { GameAction } from "../../gameaction/gameaction";
import { Gamer } from "../../gamer/gamer";
import { IGameStepAlterable } from "../../icalculable/icalculable";
import { ItemFirebaseValue } from "../dbfirebase";
import { Item } from "../item";

export abstract class GamerItem extends Item implements IGameStepAlterable {
  private gamer: Gamer;

  constructor(gamer: Gamer, values: ItemFirebaseValue, itemKey: string) {
    super(values, itemKey);
    this.gamer = gamer;
  }

  public getTeamKey(): string {
    return this.gamer.getTeamKey();
  }

  public getChannelKey(): string {
    return this.gamer.getChannelKey();
  }

  public getGameKey(): string {
    return this.gamer.getGameKey();
  }

  public getGamerKey(): string {
    return this.gamer.getKey();
  }

  // TODO: gamer item fb value.
  public abstract getFirebaseValues(): ItemFirebaseValue;

  public alterAbleToAct(gameAction: GameAction, game: Game): void {
    //
  }

  public alterPower(gameAction: GameAction, game: Game): void {
    //
  }

  public alterMiss(gameAction: GameAction, game: Game): void {
    //
  }

  public alterEvade(gameAction: GameAction, game: Game): void {
    //
  }

  public alterBeforeUse(gameAction: GameAction, game: Game): void {
    //
  }

  public alterAfterUse(gameAction: GameAction, game: Game): void {
    //
  }
}
