import {SpellFireballFirebaseValue, SpellFireballFirebaseValueRaw} from "./spells/fireball/dbfirebase";
import {SpellIceLanceFirebaseValue, SpellIceLanceFirebaseValueRaw} from "./spells/icelance/dbfirebase";

export type SpellFirebaseValueRaw = SpellFireballFirebaseValueRaw | SpellIceLanceFirebaseValueRaw;

export type SpellFirebaseValue = SpellFireballFirebaseValue | SpellIceLanceFirebaseValue;
