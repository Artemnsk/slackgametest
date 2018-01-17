import { GAME_ACTION_REQUEST_TYPES } from "../../gameactionrequest";

export type GameActionRequestCastSpellFirebaseValueRaw = {
  type: GAME_ACTION_REQUEST_TYPES.CAST_SPELL,
  created: number,
  initiator: string,
  target: string,
  spellId: string,
};

export type GameActionRequestCastSpellFirebaseValue = {
  type: GAME_ACTION_REQUEST_TYPES.CAST_SPELL,
  created: number,
  initiator: string,
  target: string,
  spellId: string,
};

export function processFirebaseRawValues(value: GameActionRequestCastSpellFirebaseValueRaw): GameActionRequestCastSpellFirebaseValue {
  return value;
}
