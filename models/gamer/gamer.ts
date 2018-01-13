import { Game } from "../game/game";
import { ItemFirebaseValue } from "../Item/dbfirebase";
import { Item } from "../Item/item";
import { buildItem } from "../Item/itemfactory";
import { SpellFirebaseValue } from "../spell/dbfirebase";
import { Spell } from "../spell/spell";
import { buildSpell } from "../spell/spellfactory";
import { GamerFirebaseValue } from "./dbfirebase";

export class Gamer {
  public name: string;
  public dead: boolean;
  public health: number;
  public mana: number;
  public spells: Spell[];
  public items: Item[];
  public $key: string;
  public game: Game;

  constructor(game: Game, values: GamerFirebaseValue, $key: string) {
    this.game = game;
    this.name = values.name;
    this.dead = values.dead;
    this.health = values.health;
    this.mana = values.mana;
    // Construct spells.
    const spells: Spell[] = [];
    for (const spellKey in values.spells) {
      if (values.spells.hasOwnProperty(spellKey)) {
        const spell = buildSpell(values.spells[ spellKey ], spellKey);
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
        const item = buildItem(values.items[ itemKey ], itemKey);
        if (item !== null) {
          items.push(item);
        }
      }
    }
    this.items = items;
    this.$key = $key;
  }

  public getItem(itemKey: string): Item | null {
    const gamerItem = this.items.find((item) => item.$key === itemKey);
    return gamerItem ? gamerItem : null;
  }

  public getSpell(spellKey: string): Spell | null {
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
    const items: { [key: string]: ItemFirebaseValue } = {};
    for (const item of this.items) {
      items[ item.$key ] = item.getFirebaseValues();
    }
    const spells: { [key: string]: SpellFirebaseValue } = {};
    for (const spell of this.spells) {
      spells[ spell.$key ] = spell.getFirebaseValues();
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