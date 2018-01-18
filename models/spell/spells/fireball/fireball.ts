import { SPELLS } from "../../spell";
import { UsableSpell } from "../../usablespell";
import { SpellFireballFirebaseValue } from "./dbfirebase";
import { Gamer } from "../../../gamer/gamer";

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
}
