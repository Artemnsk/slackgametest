import { SPELLS } from "../../spell";

export type SpellFireballFirebaseValueRaw = {
  id: SPELLS.FIREBALL,
  emoji?: string,
  label?: string,
  description?: string,
  damage: number,
};

export type SpellFireballFirebaseValue = {
  id: SPELLS.FIREBALL,
  emoji?: string,
  label?: string,
  description?: string,
  damage: number,
};

export function processFirebaseRawValues(value: SpellFireballFirebaseValueRaw): SpellFireballFirebaseValue {
  return value;
}
