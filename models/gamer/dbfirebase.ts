export type GamerFirebaseValueRaw = {
  name: string,
  dead: boolean,
  health: number,
  mana: number,
  spells?: {[key: string]: boolean},
  items?: {[key: string]: boolean},
};

export type GamerFirebaseValue = {
  name: string,
  dead: boolean,
  health: number,
  mana: number,
  spells: {[key: string]: boolean},
  items: {[key: string]: boolean},
};

export function processFirebaseRawValues(value: GamerFirebaseValueRaw): GamerFirebaseValue {
  return Object.assign(value, {
    items: value.items === undefined ? {} : value.items,
    spells: value.spells === undefined ? {} : value.spells,
  });
}
