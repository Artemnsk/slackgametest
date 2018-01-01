import { items } from "../../storage/items/items";
import { spells } from "../../storage/spells/spells";
import { Item } from "../Item/item";
import { Spell } from "../spell/spell";
import { GamerFirebaseValue } from "./dbfirebase";

export class Gamer {
  public name: string;
  public dead: boolean;
  public health: number;
  public mana: number;
  public spells: {[key: string]: boolean};
  public items: {[key: string]: boolean};
  public $key: string;
  public $gameKey: string;
  public $channelKey: string;
  public $teamKey: string;

  constructor(values: GamerFirebaseValue & {$key: string, $gameKey: string, $channelKey: string, $teamKey: string}) {
    this.name = values.name;
    this.dead = values.dead;
    this.health = values.health;
    this.mana = values.mana;
    this.spells = values.spells ? values.spells : {};
    this.items = values.items ? values.items : {};
    this.$key = values.$key;
    this.$gameKey = values.$gameKey;
    this.$channelKey = values.$channelKey;
    this.$teamKey = values.$teamKey;
  }

  public getGameStats(): string {
    if (this.dead) {
      return `${this.name} DEAD`;
    } else {
      return `\`${this.name}\` :heart:${this.health} :large_blue_diamond:${this.mana}`;
    }
  }

  // TODO: maybe Game stores all spells and gamer uses Game?
  public getSpells(): Spell[] {
    return spells.filter((spell) => this.spells && this.spells[spell.id] === true);
  }

  // TODO: maybe Game stores all items and gamer uses Game?
  public getItems(): Item[] {
    return items.filter((item) => this.items && this.items[item.id] === true);
  }

  public getFirebaseValue(): GamerFirebaseValue {
    return Object.assign({}, {
      dead: this.dead,
      health: this.health,
      items: this.items,
      mana: this.mana,
      name: this.name,
      spells: this.spells,
    });
  }
}