import { ITEMS } from "../../item";

export type ItemDaggerFirebaseValueRaw = {
  id: ITEMS.DAGGER,
  emoji?: string,
  label?: string,
  description?: string,
  damage: number,
};

export type ItemDaggerFirebaseValue = {
  id: ITEMS.DAGGER,
  emoji?: string,
  label?: string,
  description?: string,
  damage: number,
};

export function processFirebaseRawValues(value: ItemDaggerFirebaseValueRaw): ItemDaggerFirebaseValue {
  return value;
}
