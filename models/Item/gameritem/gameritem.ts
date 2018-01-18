import { Game } from "../../game/game";
import { GameAction } from "../../gameaction/gameaction";
import { Gamer } from "../../gamer/gamer";
import { IGameStepAlterable } from "../../interfaces/igamestepalterable/igamestepalterable";
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

  public alterAbleToAct(gameAction: GameAction): void {
    //
  }

  public alterPower(gameAction: GameAction): void {
    //
  }

  public alterMiss(gameAction: GameAction): void {
    //
  }

  public alterEvade(gameAction: GameAction): void {
    //
  }

  public alterBeforeUse(gameAction: GameAction): void {
    //
  }

  public alterAfterUse(gameAction: GameAction): void {
    //
  }
}
