import { Item } from "../Item/item";
import { Spell } from "../spell/spell";
import { GamerFirebaseValue } from "./dbfirebase";
import {ItemFirebaseValueRaw} from "../Item/dbfirebase";
import {buildItem} from "../Item/itemfactory";
import {buildSpell} from "../spell/spellfactory";
import {SpellFirebaseValueRaw} from "../spell/dbfirebase";

export class Gamer {
  public name: string;
  public dead: boolean;
  public health: number;
  public mana: number;
  public spells: Spell[];
  public items: Item[];
  public $key: string;
  public $gameKey: string;
  public $channelKey: string;
  public $teamKey: string;

  constructor(values: GamerFirebaseValue & {$key: string, $gameKey: string, $channelKey: string, $teamKey: string}) {
    this.name = values.name;
    this.dead = values.dead;
    this.health = values.health;
    this.mana = values.mana;
    // Construct spells.
    const spells: Spell[] = [];
    for (const spellKey in values.spells) {
      if (values.spells.hasOwnProperty(spellKey)) {
        const spell = buildSpell(values.spells[spellKey], spellKey);
        if (spell !== null) {
          spells.push(spell);
        }
      }
    }
    this.spells = spells;
    // Construct items.
    const items: Item[] = [];
    for (const itemKey in values.items) {
      if (values.items.hasOwnProperty(itemKey)) {
        const item = buildItem(values.items[itemKey], itemKey);
        if (item !== null) {
          items.push(item);
        }
      }
    }
    this.items = items;
    this.$key = values.$key;
    this.$gameKey = values.$gameKey;
    this.$channelKey = values.$channelKey;
    this.$teamKey = values.$teamKey;
  }

  public getItem(itemKey: string): Item|null {
    const gamerItem = this.items.find((item) => item.$key === itemKey);
    return gamerItem ? gamerItem : null;
  }

  public getSpell(spellKey: string): Spell|null {
    const gamerSpell = this.spells.find((spell) => spell.$key === spellKey);
    return gamerSpell ? gamerSpell : null;
  }

  public getGameStats(): string {
    if (this.dead) {
      return `${this.name} DEAD`;
    } else {
      return `\`${this.name}\` :heart:${this.health} :large_blue_diamond:${this.mana}`;
    }
  }

  public getFirebaseValue(): GamerFirebaseValue {
    const items: { [key: string]: ItemFirebaseValueRaw } = {};
    for (const item of this.items) {
      items[item.$key] = item.getFirebaseValues();
    }
    const spells: { [key: string]: SpellFirebaseValueRaw } = {};
    for (const spell of this.spells) {
      spells[spell.$key] = spell.getFirebaseValues();
    }
    return Object.assign({}, {
      dead: this.dead,
      health: this.health,
      items,
      mana: this.mana,
      name: this.name,
      spells,
    });
  }
}