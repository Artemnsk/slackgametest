import { ItemDaggerFirebaseValue, ItemDaggerFirebaseValueRaw } from "./items/dagger/dbfirebase";
import { ItemShieldFirebaseValue, ItemShieldFirebaseValueRaw } from "./items/shield/dbfirebase";

export type ItemFirebaseValueRaw = ItemDaggerFirebaseValueRaw | ItemShieldFirebaseValueRaw;

export type ItemFirebaseValue = ItemDaggerFirebaseValue | ItemShieldFirebaseValue;
