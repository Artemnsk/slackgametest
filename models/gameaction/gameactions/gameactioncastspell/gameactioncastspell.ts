import { Game, GAME_STEP_RESULTS } from "../../../game/game";
import { GameActionRequestCastSpell } from "../../../gameactionrequest/gameactionrequests/gameactionrequestcastspell/gameactionrequestcastspell";
import { Gamer } from "../../../gamer/gamer";
import { MixedValueBoolean } from "../../../mixed/mixedvalue/mixedvalues/mixedvalueboolean";
import { UsableSpell } from "../../../spell/usablespell";
import { ALTERATION_TYPES, GAME_ACTION_TYPES, GameAction } from "../../gameaction";
import { MixedValueNumber } from "../../../mixed/mixedvalue/mixedvalues/mixedvaluenumber";
import { MixedValuePercent } from "../../../mixed/mixedvalue/mixedvalues/mixedvaluepercent";
import { IGameActionCastSpellPhaseAlterable, IGameActionCastSpellValueAlterable } from "./interfaces";

// TODO: define in some interface file?
type AlterableGAData = {
  owner: IGameActionCastSpellValueAlterable,
  data: object,
};

type AlterableWithType = {
  alterable: IGameActionCastSpellValueAlterable & IGameActionCastSpellPhaseAlterable,
  type: string,
};

export const enum GAME_ACTION_CAST_SPELL_MIXED_TYPES {
  SPELL_POWER = "SPELL_POWER",
  SPELL_MISS = "SPELL_MISS",
  SPELL_EVADE = "SPELL_EVADE",
  SPELL_RESISTANCE = "SPELL_RESISTANCE",
}

export class GameActionCastSpell extends GameAction {
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
  // TODO: to interface?
  /**
   * That is a storage for each alterable item which can be used for sharing info between different phases.
   */
  public getAlterableGAData(alterable: IGameActionCastSpellValueAlterable & IGameActionCastSpellPhaseAlterable): AlterableGAData | null {
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

  // TODO:
  public processGameStep(): Promise<GAME_STEP_RESULTS> {
    const alterables = this.getAlterablesWithType();
    this.finalizeMixedValues(alterables);
    // Actually perform action using all these finalized values.
    // TODO: that is just a sample. Complete all these phases stuff.
    // TODO: protected furtherActions: GameAction[] - used to store other actions which we need to make later. We can fill it during alteration process.
    for (const alterable of alterables) {
      alterable.alterable.alterAfterUsePhase(this);
    }
    // TODO:
    return Promise.resolve(GAME_STEP_RESULTS.ERROR);
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

  private finalizeMixedValues(alterables: AlterableWithType[]): void {
    // Ability to make action? Not a simple validation.
    for (const alterable of alterables) {
      if (this.mixedCanAct.isFinal() === false) {
        alterable.alterable.alterCanActValue(this);
      }
    }
    // Finalize if not finalized yet.
    if (this.mixedCanAct.isFinal() === false) {
      this.mixedCanAct.finalize();
    }
    // Collect power.
    for (const alterable of alterables) {
      if (this.mixedSpellPower.isFinal() === false) {
        alterable.alterable.alterSpellPowerValue(this);
      }
    }
    // Finalize if not finalized yet.
    if (this.mixedSpellPower.isFinal() === false) {
      this.mixedSpellPower.finalize();
    }
    // Miss.
    for (const alterable of alterables) {
      if (this.mixedSpellMiss.isFinal() === false) {
        alterable.alterable.alterSpellMissValue(this);
      }
    }
    // Finalize if not finalized yet.
    if (this.mixedSpellMiss.isFinal() === false) {
      this.mixedSpellMiss.finalize();
    }
    // Evasion.
    for (const alterable of alterables) {
      if (this.mixedSpellEvasion.isFinal() === false) {
        alterable.alterable.alterSpellEvadeValue(this);
      }
    }
    // Finalize if not finalized yet.
    if (this.mixedSpellEvasion.isFinal() === false) {
      this.mixedSpellEvasion.finalize();
    }
  }
}
