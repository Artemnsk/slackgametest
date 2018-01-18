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
  // TODO: seems game must process this gameAction separately from UseItem.. OR share some interface which involves lots of restrictions...
  // TODO: partials go here.
  // TODO: partial for bool: e.g. able to cast spell.
  protected mixedCanAct: MixedValueBoolean;
  protected mixedSpellPower: MixedValueNumber;
  protected mixedSpellMiss: MixedValuePercent;
  protected mixedSpellEvasion: MixedValuePercent;
  protected mixedSpellResistance: MixedValueNumber;
  // TODO:
  protected alterableGADataStorage: AlterableGAData[];
  // TODO: protected furtherActions: GameAction[] - used to store other actions which we need to make later. We can fill it during alteration process.

  constructor(game: Game, gameActionRequest: GameActionRequestCastSpell, initiator: Gamer, target: Gamer, spell: UsableSpell) {
    super(game, gameActionRequest, initiator, target);
    this.spell = spell;
    // TODO: alter initial values. E.g. initial value equals some spell attr + Gamer stat + (e.g.) Gamer passive skill.
    // Initialize all these mixed values.
    this.mixedCanAct = new MixedValueBoolean(true);
    // We are sure all Gamer mixed values being finalized here.
    const spellPowerInitialValue = this.initiator.stats.spellPower.getFinalValue() as number;
    this.mixedSpellPower = new MixedValueNumber(spellPowerInitialValue);
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
    type AlterableWithType = {
      alterable: IGameActionCastSpellValueAlterable & IGameActionCastSpellPhaseAlterable,
      type: string,
    };
    // Now we are going to fill it with all related values. The Game decides which entities have influence on that. Also Game can involve it's own items.
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
    const alterables: AlterableWithType[] = [...initiatorAlterableItems, ...targetAlterableItems];
    // TODO: pass game anyway? Maybe less data?
    // Ability to make action? Not a simple validation.
    for (const alterable of alterables) {
      alterable.alterable.alterCanActValue(this);
    }
    // Collect power.
    for (const alterable of alterables) {
      alterable.alterable.alterSpellPowerValue(this);
    }
    // Miss.
    for (const alterable of alterables) {
      alterable.alterable.alterSpellMissValue(this);
    }
    // Evade.
    for (const alterable of alterables) {
      alterable.alterable.alterSpellEvadeValue(this);
    }
    // Pre-Hit (TODO: defense).
    for (const alterable of alterables) {
      // alterable.alterable.alterBeforeUse(this);
    }
    // TODO: make action.
    // After use.
    for (const alterable of alterables) {
      alterable.alterable.alterAfterUsePhase(this);
    }
    // TODO:
    return Promise.resolve(GAME_STEP_RESULTS.ERROR);
  }
}
