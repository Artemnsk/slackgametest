import { ItemFirebaseValueRaw } from "./dbfirebase";
import { Item, ITEMS } from "./item";
import { ItemDagger } from "./items/dagger/dagger";
import { ItemDaggerFirebaseValueRaw, processFirebaseRawValues as processValuesDagger } from "./items/dagger/dbfirebase";
import { ItemShieldFirebaseValueRaw, processFirebaseRawValues as processValuesShield } from "./items/shield/dbfirebase";
import { ItemShield } from "./items/shield/shield";

export function buildItem(value: ItemFirebaseValueRaw, itemKey: string): Item|null {
  switch (value.id) {
    case ITEMS.DAGGER:
      const valueDagger = value as ItemDaggerFirebaseValueRaw;
      return new ItemDagger(processValuesDagger(valueDagger), itemKey);
    case ITEMS.SHIELD:
      const valueShield = value as ItemShieldFirebaseValueRaw;
      return new ItemShield(processValuesShield(valueShield), itemKey);
    default:
      return null;
  }
}
