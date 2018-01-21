import { Game } from "../../../game/game";
import { GameAction } from "../../../gameaction/gameaction";
import { GameActionRequestCastSpell } from "../../../gameactionrequest/gameactionrequests/gameactionrequestcastspell/gameactionrequestcastspell";
import { Gamer } from "../../../gamer/gamer";
import { SPELLS } from "../../spell";
import { CAST_SPELL_PHASES_FOR_ALTERATION, UsableSpell } from "../../usablespell";
import { SpellFireballFirebaseValue } from "./dbfirebase";
import { GameActionCastSpellFireball } from "./gameactioncastspellfireball";

export class SpellFireball extends UsableSpell {
  public id: SPELLS = SPELLS.FIREBALL;
  public emoji: string = ":fire:";
  public label: string = "Fireball";
  public description: string = "Send fireball to enemy.";
  protected $key: SPELLS = SPELLS.FIREBALL;

  constructor(gamer: Gamer, values: SpellFireballFirebaseValue, itemKey: SPELLS) {
    super(gamer, values, itemKey);
    this.power = values.power;
  }

  public getFirebaseValues(): SpellFireballFirebaseValue {
    return {
      // todo:
      description: this.description,
      emoji: this.emoji,
      id: SPELLS.FIREBALL,
      label: this.label,
      power: this.power,
    };
  }

  public getInitialGameAction(game: Game, gameActionRequest: GameActionRequestCastSpell /*TODO: FIREBALL?*/, initiator: Gamer, target: Gamer): GameActionCastSpellFireball {
    return new GameActionCastSpellFireball(game, gameActionRequest, initiator, target, this);
  }

  // TODO: abstract.
  public alterGameActionPhase(phase: CAST_SPELL_PHASES_FOR_ALTERATION, gameAction: GameAction): GameAction[] {
    return [];
  }
}
