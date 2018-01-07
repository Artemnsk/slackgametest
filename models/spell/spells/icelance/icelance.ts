import {UsableSpell} from "../../usablespell";
import {SPELLS} from "../../spell";
import {SpellIceLanceFirebaseValue} from "./dbfirebase";

export class SpellIceLance extends UsableSpell {
  public id: SPELLS = SPELLS.ICE_LANCE;
  public $key: string;
  public emoji: string = ":shield:";
  public label: string = "Steel shield";
  public description: string = "This is simple steel shield. Nothing special.";
  public damage: number;

  constructor(values: SpellIceLanceFirebaseValue, itemKey: string) {
    super(values, itemKey);
    this.damage = values.damage;
  }

  public getFirebaseValues(): SpellIceLanceFirebaseValue {
    return {
      // todo:
      damage: this.damage,
      description: this.description,
      emoji: this.emoji,
      id: SPELLS.ICE_LANCE,
      label: this.label,
    };
  }
}
