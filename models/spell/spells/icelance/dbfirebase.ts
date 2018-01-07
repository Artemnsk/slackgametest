import {SPELLS} from "../../spell";

export type SpellIceLanceFirebaseValueRaw = {
  id: SPELLS.ICE_LANCE,
  emoji?: string,
  label?: string,
  description?: string,
  damage: number,
};

export type SpellIceLanceFirebaseValue = {
  id: SPELLS.ICE_LANCE,
  emoji?: string,
  label?: string,
  description?: string,
  damage: number,
};

export function processFirebaseRawValues(value: SpellIceLanceFirebaseValueRaw): SpellIceLanceFirebaseValue {
  return value;
}
