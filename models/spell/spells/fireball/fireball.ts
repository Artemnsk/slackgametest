import { SPELLS } from "../../spell";
import { UsableSpell } from "../../usablespell";
import { SpellFireballFirebaseValue } from "./dbfirebase";
import { Gamer } from "../../../gamer/gamer";

export class SpellFireball extends UsableSpell {
  public id: SPELLS = SPELLS.FIREBALL;
  public emoji: string = ":fire:";
  public label: string = "Fireball";
  public description: string = "Send fireball to enemy.";
  public damage: number;
  protected $key: SPELLS = SPELLS.FIREBALL;

  constructor(gamer: Gamer, values: SpellFireballFirebaseValue, itemKey: SPELLS) {
    super(gamer, values, itemKey);
    this.damage = values.damage;
  }

  public getFirebaseValues(): SpellFireballFirebaseValue {
    return {
      // todo:
      damage: this.damage,
      description: this.description,
      emoji: this.emoji,
      id: SPELLS.FIREBALL,
      label: this.label,
    };
  }
}
