import { SPELLS } from "../../spell";
import { PHASES_FOR_ALTERATION, UsableSpell } from "../../usablespell";
import { SpellFireballFirebaseValue } from "./dbfirebase";
import { Gamer } from "../../../gamer/gamer";
import { GameActionCastSpellFireball } from "./gameactioncastspellfireball";
import { GameAction } from "../../../gameaction/gameaction";
import { GameActionRequestCastSpell } from "../../../gameactionrequest/gameactionrequests/gameactionrequestcastspell/gameactionrequestcastspell";
import { Game } from "../../../game/game";

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
      power: this.power,
      description: this.description,
      emoji: this.emoji,
      id: SPELLS.FIREBALL,
      label: this.label,
    };
  }

  public getInitialGameAction(game: Game, gameActionRequest: GameActionRequestCastSpell /*TODO: FIREBALL?*/, initiator: Gamer, target: Gamer): GameActionCastSpellFireball {
    return new GameActionCastSpellFireball(game, gameActionRequest, initiator, target, this);
  }

  // TODO: abstract.
  public alterGameActionPhase(phase: PHASES_FOR_ALTERATION, gameAction: GameAction): GameAction[] {
    return [];
  }
}
