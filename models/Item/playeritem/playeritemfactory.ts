import { ItemFirebaseValueRaw } from "../dbfirebase";
import { ITEMS } from "../item";
import { PlayerItemDagger } from "../items/dagger/playerdagger";
import { ItemDaggerFirebaseValueRaw, processFirebaseRawValues as processValuesDagger } from "../items/dagger/dbfirebase";
import { ItemShieldFirebaseValueRaw, processFirebaseRawValues as processValuesShield } from "../items/shield/dbfirebase";
import { PlayerItemShield } from "../items/shield/playershield";
import { Player } from "../../player/player";
import { PlayerItem } from "./playeritem";

export function buildItem(player: Player, value: ItemFirebaseValueRaw, itemKey: string): PlayerItem | null {
  switch (value.id) {
    case ITEMS.DAGGER:
      const valueDagger = value as ItemDaggerFirebaseValueRaw;
      return new PlayerItemDagger(player, processValuesDagger(valueDagger), itemKey);
    case ITEMS.SHIELD:
      const valueShield = value as ItemShieldFirebaseValueRaw;
      return new PlayerItemShield(player, processValuesShield(valueShield), itemKey);
    default:
      return null;
  }
}
