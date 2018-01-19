import { SPELLS } from "../../spell";
import { PHASES_FOR_ALTERATION, UsableSpell } from "../../usablespell";
import { SpellIceLanceFirebaseValue } from "./dbfirebase";
import { Gamer } from "../../../gamer/gamer";
import { GameAction } from "../../../gameaction/gameaction";
import { GameActionRequestCastSpell } from "../../../gameactionrequest/gameactionrequests/gameactionrequestcastspell/gameactionrequestcastspell";
import { Game } from "../../../game/game";
import { GameActionCastSpellIceLance } from "./gameactioncastspellicelance";

export class SpellIceLance extends UsableSpell {
  public id: SPELLS = SPELLS.ICE_LANCE;
  public emoji: string = ":comet:";
  public label: string = "Ice Lance";
  public description: string = "Send ice lance to enemy.";
  protected $key: SPELLS = SPELLS.ICE_LANCE;

  constructor(gamer: Gamer, values: SpellIceLanceFirebaseValue, itemKey: SPELLS) {
    super(gamer, values, itemKey);
    this.power = values.power;
  }

  public getFirebaseValues(): SpellIceLanceFirebaseValue {
    return {
      // todo:
      power: this.power,
      description: this.description,
      emoji: this.emoji,
      id: SPELLS.ICE_LANCE,
      label: this.label,
    };
  }

  public getInitialGameAction(game: Game, gameActionRequest: GameActionRequestCastSpell /*TODO: FIREBALL? MAYBE SOME STORAGE INSIDE THIS ENTRY IN DB?*/, initiator: Gamer, target: Gamer): GameActionCastSpellIceLance {
    return new GameActionCastSpellIceLance(game, gameActionRequest, initiator, target, this);
  }

  // TODO: abstract.
  public alterGameActionPhase(phase: PHASES_FOR_ALTERATION, gameAction: GameAction): GameAction[] {
    return [];
  }
}
