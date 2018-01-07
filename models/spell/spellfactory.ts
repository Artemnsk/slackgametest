import { SpellFirebaseValueRaw} from "./dbfirebase";
import { processFirebaseRawValues as processValuesFireball } from "./spells/fireball/dbfirebase";
import { processFirebaseRawValues as processValuesIceLance } from "./spells/icelance/dbfirebase";
import {Spell, SPELLS} from "./spell";
import {SpellFireballFirebaseValueRaw} from "./spells/fireball/dbfirebase";
import {SpellIceLanceFirebaseValueRaw} from "./spells/icelance/dbfirebase";
import {SpellFireball} from "./spells/fireball/fireball";
import {SpellIceLance} from "./spells/icelance/icelance";

export function buildSpell(value: SpellFirebaseValueRaw, itemKey: string): Spell|null {
  switch (value.id) {
    case SPELLS.FIREBALL:
      const valueFireball = value as SpellFireballFirebaseValueRaw;
      return new SpellFireball(processValuesFireball(valueFireball), itemKey);
    case SPELLS.ICE_LANCE:
      const valueIceLance = value as SpellIceLanceFirebaseValueRaw;
      return new SpellIceLance(processValuesIceLance(valueIceLance), itemKey);
    default:
      return null;
  }
}
