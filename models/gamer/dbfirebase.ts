import { ItemFirebaseValueRaw } from "../Item/dbfirebase";
import { SpellFirebaseValueRaw } from "../spell/dbfirebase";

export type GamerFirebaseValueRaw = {
  name: string,
  dead: boolean,
  health: number,
  mana: number,
  stats: {
    strength: number,
    agility: number,
    intelligence: number,
  },
  spells?: { [key: string]: SpellFirebaseValueRaw },
  items?: { [key: string]: ItemFirebaseValueRaw },
};

export type GamerFirebaseValue = {
  name: string,
  dead: boolean,
  health: number,
  mana: number,
  stats: {
    strength: number,
    agility: number,
    intelligence: number,
  },
  spells: { [key: string]: SpellFirebaseValueRaw },
  items: { [key: string]: ItemFirebaseValueRaw },
};

export function processFirebaseRawValues(value: GamerFirebaseValueRaw): GamerFirebaseValue {
  return Object.assign(value, {
    items: value.items === undefined ? {} : value.items,
    spells: value.spells === undefined ? {} : value.spells,
  });
}
