import { Game, GAME_STEP_RESULTS } from "../../../game/game";
import { GameActionRequestCastSpell } from "../../../gameactionrequest/gameactionrequests/gameactionrequestcastspell/gameactionrequestcastspell";
import { Gamer } from "../../../gamer/gamer";
import { MixedValueBoolean } from "../../../mixed/mixedvalue/mixedvalues/mixedvalueboolean";
import { PHASES_FOR_ALTERATION, UsableSpell } from "../../../spell/usablespell";
import { ALTERATION_TYPES, GAME_ACTION_TYPES, GameAction } from "../../gameaction";
import { MixedValueNumber } from "../../../mixed/mixedvalue/mixedvalues/mixedvaluenumber";
import { MixedValuePercent } from "../../../mixed/mixedvalue/mixedvalues/mixedvaluepercent";
import { IAlterableGameActionMixedValues } from "../../../iusable/ialterable";
import { MixedValuePartial } from "../../../mixed/mixedvaluepartial/mixedvaluepartial";

export const enum VALUES_FOR_ALTERATION {
  CAN_ACT = "CAN_ACT",
  SPELL_POWER = "SPELL_POWER",
  SPELL_MISS = "SPELL_MISS",
  SPELL_EVASION = "SPELL_EVASION",
  SPELL_RESISTANCE = "SPELL_RESISTANCE",
}

// TODO: define in some interface file?
type AlterableGAData = {
  owner: IAlterableGameActionMixedValues,
  data: object,
};

type AlterableWithType = {
  alterable: IAlterableGameActionMixedValues,
  type: ALTERATION_TYPES,
};

export const enum GAME_ACTION_CAST_SPELL_MIXED_TYPES {
  SPELL_POWER = "SPELL_POWER",
  SPELL_MISS = "SPELL_MISS",
  SPELL_EVADE = "SPELL_EVADE",
  SPELL_RESISTANCE = "SPELL_RESISTANCE",
}

export abstract class GameActionCastSpell extends GameAction {
  public initiator: Gamer;
  public target: Gamer;
  public type: GAME_ACTION_TYPES.CAST_SPELL;
  protected spell: UsableSpell;
  protected mixedCanAct: MixedValueBoolean;
  protected mixedSpellPower: MixedValueNumber;
  protected mixedSpellMiss: MixedValuePercent;
  protected mixedSpellEvasion: MixedValuePercent;
  protected mixedSpellResistance: MixedValueNumber;
  protected alterableGADataStorage: AlterableGAData[];

  constructor(game: Game, gameActionRequest: GameActionRequestCastSpell, initiator: Gamer, target: Gamer, spell: UsableSpell) {
    super(game, gameActionRequest, initiator, target);
    this.spell = spell;
    // Initialize all these mixed values.
    this.mixedCanAct = new MixedValueBoolean(true);
    // We are sure all Gamer mixed values being finalized here. That actually must happen on Gamer initialization in it's constructor().
    const spellPowerInitialValue = this.initiator.stats.spellPower.getFinalValue() as number;
    this.mixedSpellPower = new MixedValueNumber(spellPowerInitialValue + spell.power);
    const spellMissInitialValue = this.initiator.stats.spellMiss.getFinalValue() as number;
    this.mixedSpellMiss = new MixedValuePercent(spellMissInitialValue);
    const spellEvasionInitialValue = this.target.stats.spellEvasion.getFinalValue() as number;
    this.mixedSpellEvasion = new MixedValuePercent(spellEvasionInitialValue);
    const spellResistanceInitialValue = this.target.stats.spellResistance.getFinalValue() as number;
    this.mixedSpellResistance = new MixedValueNumber(spellResistanceInitialValue);
    this.alterableGADataStorage = [];
  }

  /**
   * That is a storage for each alterable item which can be used for sharing info between different phases.
   */
  public getAlterableGAData(alterable: IAlterableGameActionMixedValues): AlterableGAData | null {
    let data = this.alterableGADataStorage.find((item) => item.owner === alterable);
    if (data === undefined) {
      data = {
        data: {},
        owner: alterable,
      };
      this.alterableGADataStorage.push(data);
    }
    return data;
  }

  public processGameStep(): Promise<GAME_STEP_RESULTS> {
    const alterables = this.getAlterablesWithType();
    this.finalizeMixedValues(alterables);
    // Actually perform action using all these finalized values.
    // TODO: that is just a sample. Complete all these phases stuff.
    // TODO: protected furtherActions: GameAction[] - used to store other actions which we need to make later. We can fill it during alteration process.
    const gameActions: GameAction[] = [];
    // 1. Can Act.
    const alterCanActGameActions = this.callAlterationForUsedAlterables(alterables, this.mixedCanAct.partials, VALUES_FOR_ALTERATION.CAN_ACT);
    gameActions.push(...alterCanActGameActions);
    const initiatorCanAct: boolean = this.mixedCanAct.getFinalValue() as boolean;
    if (initiatorCanAct === true) {
      gameActions.push(...this.spell.alterGameActionPhase(PHASES_FOR_ALTERATION.ACT, this));
      // 2. Miss.
      const alterSpellMissGameActions = this.callAlterationForUsedAlterables(alterables, this.mixedSpellMiss.partials, VALUES_FOR_ALTERATION.SPELL_MISS);
      gameActions.push(...alterSpellMissGameActions);
      const initiatorMissed: boolean = Math.random() < (this.mixedSpellMiss.getFinalValue() as number / 100);
      if (initiatorMissed === false) {
        gameActions.push(...this.spell.alterGameActionPhase(PHASES_FOR_ALTERATION.MISS_FAILED, this));
        // 3. Evasion.
        const alterSpellEvasionGameActions = this.callAlterationForUsedAlterables(alterables, this.mixedSpellEvasion.partials, VALUES_FOR_ALTERATION.SPELL_EVASION);
        gameActions.push(...alterSpellEvasionGameActions);
        const targetEvaded: boolean = Math.random() < (this.mixedSpellEvasion.getFinalValue() as number / 100);
        if (targetEvaded === false) {
          gameActions.push(...this.spell.alterGameActionPhase(PHASES_FOR_ALTERATION.EVASION_FAILED, this));
          // 4. Resistance.
          const alterSpellResistanceGameActions = this.callAlterationForUsedAlterables(alterables, this.mixedSpellResistance.partials, VALUES_FOR_ALTERATION.SPELL_RESISTANCE);
          gameActions.push(...alterSpellResistanceGameActions);
          // Finally execute action.
          this.execute();
        }
      } else {
        gameActions.push(...this.spell.alterGameActionPhase(PHASES_FOR_ALTERATION.MISS, this));
      }
    } else {
      gameActions.push(...this.spell.alterGameActionPhase(PHASES_FOR_ALTERATION.ACT_FAILED, this));
    }
    // TODO: execute collected gameActions. Maybe some additional class for non-alterable game actions which contains of exact values?
    return Promise.resolve(GAME_STEP_RESULTS.ERROR);
  }

  private callAlterationForUsedAlterables(alterablesWithType: AlterableWithType[], partials: Array<MixedValuePartial<any>>, alteredValue: VALUES_FOR_ALTERATION): GameAction[] {
    const gameActions = [];
    for (const partial of partials) {
      const alterableWithType = alterablesWithType.find((item) => item.alterable === partial.getOwner());
      if (alterableWithType !== undefined) {
        gameActions.push(...alterableWithType.alterable.alterBeingUsedInGameActionMixedValue(alteredValue, this, alterableWithType.type));
      }
    }
    return gameActions;
  }

  private getAlterablesWithType(): AlterableWithType[] {
    const initiatorAlterableItems: AlterableWithType[] = this.initiator.items.map((item) => {
      return {
        alterable: item,
        type: ALTERATION_TYPES.INITIATOR,
      };
    });
    const targetAlterableItems: AlterableWithType[] = this.target.items.map((item) => {
      return {
        alterable: item,
        type: ALTERATION_TYPES.TARGET,
      };
    });
    return [...initiatorAlterableItems, ...targetAlterableItems];
  }

  private finalizeMixedValues(alterablesWithType: AlterableWithType[]): void {
    // Ability to make action? Not a simple validation.
    for (const alterableWithType of alterablesWithType) {
      if (this.mixedCanAct.isFinal() === false) {
        alterableWithType.alterable.alterBeingUsedInGameActionMixedValue(VALUES_FOR_ALTERATION.CAN_ACT, this, alterableWithType.type);
      }
    }
    // Finalize if not finalized yet.
    if (this.mixedCanAct.isFinal() === false) {
      this.mixedCanAct.finalize();
    }
    // Collect power.
    for (const alterableWithType of alterablesWithType) {
      if (this.mixedSpellPower.isFinal() === false) {
        alterableWithType.alterable.alterBeingUsedInGameActionMixedValue(VALUES_FOR_ALTERATION.SPELL_POWER, this, alterableWithType.type);
      }
    }
    // Finalize if not finalized yet.
    if (this.mixedSpellPower.isFinal() === false) {
      this.mixedSpellPower.finalize();
    }
    // Miss.
    for (const alterableWithType of alterablesWithType) {
      if (this.mixedSpellMiss.isFinal() === false) {
        alterableWithType.alterable.alterBeingUsedInGameActionMixedValue(VALUES_FOR_ALTERATION.SPELL_MISS, this, alterableWithType.type);
      }
    }
    // Finalize if not finalized yet.
    if (this.mixedSpellMiss.isFinal() === false) {
      this.mixedSpellMiss.finalize();
    }
    // Evasion.
    for (const alterableWithType of alterablesWithType) {
      if (this.mixedSpellEvasion.isFinal() === false) {
        alterableWithType.alterable.alterBeingUsedInGameActionMixedValue(VALUES_FOR_ALTERATION.SPELL_EVASION, this, alterableWithType.type);
      }
    }
    // Finalize if not finalized yet.
    if (this.mixedSpellEvasion.isFinal() === false) {
      this.mixedSpellEvasion.finalize();
    }
    // Resistance.
    for (const alterableWithType of alterablesWithType) {
      if (this.mixedSpellResistance.isFinal() === false) {
        alterableWithType.alterable.alterBeingUsedInGameActionMixedValue(VALUES_FOR_ALTERATION.SPELL_RESISTANCE, this, alterableWithType.type);
      }
    }
    // Finalize if not finalized yet.
    if (this.mixedSpellResistance.isFinal() === false) {
      this.mixedSpellResistance.finalize();
    }
  }
}
