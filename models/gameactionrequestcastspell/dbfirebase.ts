import { ACTION_TYPES } from "../gameaction/gameaction";

export type GameActionRequestCastSpellFirebaseValueRaw = {
  type: ACTION_TYPES.CAST_SPELL,
  created: number,
  initiator?: string,
  target?: string,
  spellId: string,
};

export type GameActionRequestCastSpellFirebaseValue = {
  type: ACTION_TYPES.CAST_SPELL,
  created: number,
  initiator: string|null,
  target: string|null,
  spellId: string,
};

export function processFirebaseRawValues(value: GameActionRequestCastSpellFirebaseValueRaw): GameActionRequestCastSpellFirebaseValue {
  return Object.assign(value, {
    initiator: value.initiator === undefined ? null : value.initiator,
    target: value.target === undefined ? null : value.target,
  });
}
