import { Gamer } from "../../gamer/gamer";
import { ItemFirebaseValueRaw } from "../dbfirebase";
import { ITEMS } from "../item";
import { ItemDaggerFirebaseValueRaw, processFirebaseRawValues as processValuesDagger } from "../items/dagger/dbfirebase";
import { ItemShieldFirebaseValueRaw, processFirebaseRawValues as processValuesShield } from "../items/shield/dbfirebase";
import { GamerItem } from "./gameritem";

import { GamerItemDagger } from "../items/dagger/gamerdagger";
import { GamerItemShield } from "../items/shield/gamershield";

export function buildItem(gamer: Gamer, value: ItemFirebaseValueRaw, itemKey: string): GamerItem|null {
  switch (value.id) {
    case ITEMS.DAGGER:
      const valueDagger = value as ItemDaggerFirebaseValueRaw;
      return new GamerItemDagger(gamer, processValuesDagger(valueDagger), itemKey);
    case ITEMS.SHIELD:
      const valueShield = value as ItemShieldFirebaseValueRaw;
      return new GamerItemShield(gamer, processValuesShield(valueShield), itemKey);
    default:
      return null;
  }
}
