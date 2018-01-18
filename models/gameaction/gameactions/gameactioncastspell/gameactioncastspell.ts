import { Game } from "../../../game/game";
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
}
