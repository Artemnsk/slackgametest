import { Game } from "../../../game/game";
import { GameActionRequestUseItem } from "../../../gameactionrequest/gameactionrequests/gameactionrequestuseitem/gameactionrequestuseitem";
import { Gamer } from "../../../gamer/gamer";
import { UsableGamerItem, USE_ITEM_PHASES_FOR_ALTERATION } from "../../../Item/gameritem/usablegameritem";
import { MixedValueBoolean } from "../../../mixed/mixedvalue/mixedvalues/mixedvalueboolean";
import { MixedValueNumber } from "../../../mixed/mixedvalue/mixedvalues/mixedvaluenumber";
import { MixedValuePercent } from "../../../mixed/mixedvalue/mixedvalues/mixedvaluepercent";
import { AlterableWithType, GAME_ACTION_TYPES, GameAction } from "../../gameaction";

// Notice that CAN_ACT (DEFAULT_VALUES_FOR_ALTERATION.CAN_ACT) is MUST HAVE!
export const enum VALUES_FOR_ALTERATION {
  CAN_ACT = "CAN_ACT",
  ITEM_POWER = "ITEM_POWER",
  ITEM_MISS = "ITEM_MISS",
  ITEM_EVASION = "ITEM_EVASION",
  ITEM_DEFENSE = "ITEM_DEFENSE",
}

export abstract class GameActionUseItem extends GameAction {
  public initiator: Gamer;
  public target: Gamer;
  public type: GAME_ACTION_TYPES.USE_ITEM;
  protected item: UsableGamerItem;
  protected mixedItemPower: MixedValueNumber;
  protected mixedItemMiss: MixedValuePercent;
  protected mixedItemEvasion: MixedValuePercent;
  protected mixedItemDefense: MixedValueNumber;

  constructor(game: Game, gameActionRequest: GameActionRequestUseItem, initiator: Gamer, target: Gamer, item: UsableGamerItem) {
    super(game, gameActionRequest, initiator, target);
    this.item = item;
    // We are sure all Gamer mixed values being finalized here. That actually must happen on Gamer initialization in it's constructor().
    const itemPowerInitialValue = this.initiator.stats.itemPower.getFinalValue() as number;
    this.mixedItemPower = new MixedValueNumber(itemPowerInitialValue + item.power);
    const itemMissInitialValue = this.initiator.stats.itemMiss.getFinalValue() as number;
    this.mixedItemMiss = new MixedValuePercent(itemMissInitialValue);
    const itemEvasionInitialValue = this.target.stats.itemEvasion.getFinalValue() as number;
    this.mixedItemEvasion = new MixedValuePercent(itemEvasionInitialValue);
    const itemDefenseInitialValue = this.target.stats.itemDefense.getFinalValue() as number;
    this.mixedItemDefense = new MixedValueNumber(itemDefenseInitialValue);
  }

  protected calculateAndExecute(alterables: AlterableWithType[]): GameAction[] {
    const gameActions: GameAction[] = [];
    // 1. Can Act.
    const alterCanActGameActions = this.callAlterationForUsedAlterables(alterables, this.mixedCanAct, VALUES_FOR_ALTERATION.CAN_ACT);
    gameActions.push(...alterCanActGameActions);
    const initiatorCanAct: boolean = this.mixedCanAct.getFinalValue() as boolean;
    if (initiatorCanAct === true) {
      gameActions.push(...this.item.alterGameActionPhase(USE_ITEM_PHASES_FOR_ALTERATION.ACT, this));
      // 2. Miss.
      const alterItemMissGameActions = this.callAlterationForUsedAlterables(alterables, this.mixedItemMiss, VALUES_FOR_ALTERATION.ITEM_MISS);
      gameActions.push(...alterItemMissGameActions);
      const initiatorMissed: boolean = Math.random() < (this.mixedItemMiss.getFinalValue() as number / 100);
      if (initiatorMissed === false) {
        gameActions.push(...this.item.alterGameActionPhase(USE_ITEM_PHASES_FOR_ALTERATION.MISS_FAILED, this));
        // 3. Evasion.
        const alterItemEvasionGameActions = this.callAlterationForUsedAlterables(alterables, this.mixedItemEvasion, VALUES_FOR_ALTERATION.ITEM_EVASION);
        gameActions.push(...alterItemEvasionGameActions);
        const targetEvaded: boolean = Math.random() < (this.mixedItemEvasion.getFinalValue() as number / 100);
        if (targetEvaded === false) {
          gameActions.push(...this.item.alterGameActionPhase(USE_ITEM_PHASES_FOR_ALTERATION.EVASION_FAILED, this));
          // 4. Resistance.
          const alterItemDefenseGameActions = this.callAlterationForUsedAlterables(alterables, this.mixedItemDefense, VALUES_FOR_ALTERATION.ITEM_DEFENSE);
          gameActions.push(...alterItemDefenseGameActions);
          // Finally execute action.
          this.execute();
        } else {
          gameActions.push(...this.item.alterGameActionPhase(USE_ITEM_PHASES_FOR_ALTERATION.EVASION, this));
        }
      } else {
        gameActions.push(...this.item.alterGameActionPhase(USE_ITEM_PHASES_FOR_ALTERATION.MISS, this));
      }
    } else {
      gameActions.push(...this.item.alterGameActionPhase(USE_ITEM_PHASES_FOR_ALTERATION.ACT_FAILED, this));
    }
    return gameActions;
  }

  protected finalizeMixedValues(alterablesWithType: AlterableWithType[]): void {
    // Ability to make action? Not a simple validation.
    for (const alterableWithType of alterablesWithType) {
      if (this.mixedCanAct.isFinal() === false) {
        alterableWithType.alterable.alterGameActionMixedValue(VALUES_FOR_ALTERATION.CAN_ACT, this.mixedCanAct, this, alterableWithType.type, this.getAlterableGAData(alterableWithType.alterable));
      }
    }
    // Finalize if not finalized yet.
    if (this.mixedCanAct.isFinal() === false) {
      this.mixedCanAct.finalize();
    }
    // Collect power.
    for (const alterableWithType of alterablesWithType) {
      if (this.mixedItemPower.isFinal() === false) {
        alterableWithType.alterable.alterGameActionMixedValue(VALUES_FOR_ALTERATION.ITEM_POWER, this.mixedItemPower, this, alterableWithType.type, this.getAlterableGAData(alterableWithType.alterable));
      }
    }
    // Finalize if not finalized yet.
    if (this.mixedItemPower.isFinal() === false) {
      this.mixedItemPower.finalize();
    }
    // Miss.
    for (const alterableWithType of alterablesWithType) {
      if (this.mixedItemMiss.isFinal() === false) {
        alterableWithType.alterable.alterGameActionMixedValue(VALUES_FOR_ALTERATION.ITEM_MISS, this.mixedItemMiss, this, alterableWithType.type, this.getAlterableGAData(alterableWithType.alterable));
      }
    }
    // Finalize if not finalized yet.
    if (this.mixedItemMiss.isFinal() === false) {
      this.mixedItemMiss.finalize();
    }
    // Evasion.
    for (const alterableWithType of alterablesWithType) {
      if (this.mixedItemEvasion.isFinal() === false) {
        alterableWithType.alterable.alterGameActionMixedValue(VALUES_FOR_ALTERATION.ITEM_EVASION, this.mixedItemEvasion, this, alterableWithType.type, this.getAlterableGAData(alterableWithType.alterable));
      }
    }
    // Finalize if not finalized yet.
    if (this.mixedItemEvasion.isFinal() === false) {
      this.mixedItemEvasion.finalize();
    }
    // Defense.
    for (const alterableWithType of alterablesWithType) {
      if (this.mixedItemDefense.isFinal() === false) {
        alterableWithType.alterable.alterGameActionMixedValue(VALUES_FOR_ALTERATION.ITEM_DEFENSE, this.mixedItemDefense, this, alterableWithType.type, this.getAlterableGAData(alterableWithType.alterable));
      }
    }
    // Finalize if not finalized yet.
    if (this.mixedItemDefense.isFinal() === false) {
      this.mixedItemDefense.finalize();
    }
  }
}
