import {SPELLS} from "../../spell";
import {SpellFireballFirebaseValue} from "./dbfirebase";
import {UsableSpell} from "../../usablespell";

export class SpellFireball extends UsableSpell {
  public id: SPELLS = SPELLS.FIREBALL;
  public emoji: string = ":dagger_knife:";
  public label: string = "Steel Dagger";
  public description: string = "This is simple steel dagger. Nothing special.";
  public damage: number;

  constructor(values: SpellFireballFirebaseValue, itemKey: string) {
    super(values, itemKey);
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
