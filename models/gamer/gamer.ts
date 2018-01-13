import { Game } from "../game/game";
import { ItemFirebaseValue } from "../Item/dbfirebase";
import { buildItem } from "../Item/gameritem/gameritemfactory";
import { Item } from "../Item/item";
import { SpellFirebaseValue } from "../spell/dbfirebase";
import { Spell, SPELLS } from "../spell/spell";
import { buildSpell } from "../spell/spellfactory";
import { GamerFirebaseValue } from "./dbfirebase";

export class Gamer {
  public name: string;
  public dead: boolean;
  public health: number;
  public mana: number;
  public spells: Spell[];
  public items: Item[];
  private $key: string;
  private game: Game;

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
        const enumSpellKey = spellKey as SPELLS;
        const spell = buildSpell(this, values.spells[ spellKey ], enumSpellKey);
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
        const item = buildItem(this, values.items[ itemKey ], itemKey);
        if (item !== null) {
          items.push(item);
        }
      }
    }
    this.items = items;
    this.$key = $key;
  }

  public getTeamKey(): string {
    return this.game.getTeamKey();
  }

  public getChannelKey() {
    return this.game.getChannelKey();
  }

  public getGameKey() {
    return this.game.getKey();
  }

  public getKey(): string {
    return this.$key;
  }

  public getItem(itemKey: string): Item | null {
    const gamerItem = this.items.find((item) => item.getKey() === itemKey);
    return gamerItem ? gamerItem : null;
  }

  public getSpell(spellKey: string): Spell | null {
    const gamerSpell = this.spells.find((spell) => spell.getKey() === spellKey);
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
      items[ item.getKey() ] = item.getFirebaseValues();
    }
    const spells: { [key: string]: SpellFirebaseValue } = {};
    for (const spell of this.spells) {
      spells[ spell.getKey() ] = spell.getFirebaseValues();
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