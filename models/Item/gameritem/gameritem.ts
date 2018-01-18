import { GameAction } from "../../gameaction/gameaction";
import { Gamer } from "../../gamer/gamer";
import { IGameActionCastSpellPhaseAlterable, IGameActionCastSpellValueAlterable } from "../../gameaction/gameactions/gameactioncastspell/interfaces";
import { ItemFirebaseValue } from "../dbfirebase";
import { Item } from "../item";

export abstract class GamerItem extends Item implements IGameActionCastSpellValueAlterable, IGameActionCastSpellPhaseAlterable {
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

  /**
   *  IGameActionCastSpellValueAlterable.
   */

  public alterCanActValue(gameAction: GameAction): void {
    //
  }

  public alterSpellPowerValue(gameAction: GameAction): void {
    //
  }

  public alterSpellMissValue(gameAction: GameAction): void {
    //
  }

  public alterSpellEvadeValue(gameAction: GameAction): void {
    //
  }

  /**
   *  IGameActionCastSpellPhaseAlterable.
   */

  public alterAfterUsePhase(gameAction: GameAction): void {
    //
  }
}
