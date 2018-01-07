import { ITEMS } from "../../item";

export type ItemShieldFirebaseValueRaw = {
  id: ITEMS.SHIELD,
  emoji?: string,
  label?: string,
  description?: string,
  armor: number,
};

export type ItemShieldFirebaseValue = {
  id: ITEMS.SHIELD,
  emoji?: string,
  label?: string,
  description?: string,
  armor: number,
};

export function processFirebaseRawValues(value: ItemShieldFirebaseValueRaw): ItemShieldFirebaseValue {
  return value;
}
