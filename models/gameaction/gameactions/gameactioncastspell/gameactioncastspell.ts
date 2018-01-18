import { Game, GAME_STEP_RESULTS } from "../../../game/game";
import { GameActionRequestCastSpell } from "../../../gameactionrequest/gameactionrequests/gameactionrequestcastspell/gameactionrequestcastspell";
import { Gamer } from "../../../gamer/gamer";
import { UsableSpell } from "../../../spell/usablespell";
import { GAME_ACTION_TYPES, GameAction } from "../../gameaction";
import { MixedValueNumber } from "../../../mixed/mixedvalue/mixedvalues/mixedvaluenumber";
import { MixedValuePercent } from "../../../mixed/mixedvalue/mixedvalues/mixedvaluepercent";
import { IGameStepAlterable } from "../../../interfaces/igamestepalterable/igamestepalterable";

// TODO: define in some interface file?
type AlterableGAData = {
  owner: IGameStepAlterable,
  data: any,
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
  protected mixedSpellPower: MixedValueNumber;
  protected mixedSpellMiss: MixedValuePercent;
  protected mixedSpellEvade: MixedValuePercent;
  protected mixedSpellResistance: MixedValueNumber;
  // TODO:
  protected alterableGADataStorage: AlterableGAData[];
  // TODO: protected furtherActions: GameAction[] - used to store other actions which we need to make later. We can fill it during alteration process.

  constructor(game: Game, gameActionRequest: GameActionRequestCastSpell, initiator: Gamer, target: Gamer, spell: UsableSpell) {
    super(game, gameActionRequest, initiator, target);
    this.spell = spell;
    // TODO: alter initial values. E.g. initial value equals some spell attr + Gamer stat + (e.g.) Gamer passive skill.
    // Initialize all these mixed values.
    this.mixedSpellPower = new MixedValueNumber(0);
    this.mixedSpellMiss = new MixedValuePercent(0);
    this.mixedSpellEvade = new MixedValuePercent(0);
    this.mixedSpellResistance = new MixedValueNumber(0);
    this.alterableGADataStorage = [];
  }
  // TODO: to interface?
  /**
   * that is a storage for each alterable item which can be used for sharing info between different phases.
   */
  public getAlterableGAData(alterable: IGameStepAlterable): AlterableGAData | null {
    const data = this.alterableGADataStorage.find((item) => item.owner === alterable);
    return data !== undefined ? data : null;
  }

  // TODO:
  public processGameStep(): Promise<GAME_STEP_RESULTS> {
    // Now we are going to fill it with all related values. The Game decides which entities have influence on that. Also Game can involve it's own items.
    let alterables: IGameStepAlterable[] = [];
    // Get all items.
    if (this.initiator !== null) {
      alterables = alterables.concat(this.initiator.items);
    }
    if (this.target !== null) {
      alterables = alterables.concat(this.target.items);
    }
    // TODO: pass game anyway? Maybe less data?
    // Ability to make action? Not a simple validation.
    for (const alterable of alterables) {
      alterable.alterAbleToAct(this);
    }
    // Collect power.
    for (const alterable of alterables) {
      alterable.alterPower(this);
    }
    // Miss.
    for (const alterable of alterables) {
      alterable.alterMiss(this);
    }
    // Evade.
    for (const alterable of alterables) {
      alterable.alterEvade(this);
    }
    // Pre-Hit (TODO: defense).
    for (const alterable of alterables) {
      alterable.alterBeforeUse(this);
    }
    // TODO: make action.
    // After use.
    for (const alterable of alterables) {
      alterable.alterAfterUse(this);
    }
    // TODO:
    return Promise.resolve(GAME_STEP_RESULTS.ERROR);
  }
}
