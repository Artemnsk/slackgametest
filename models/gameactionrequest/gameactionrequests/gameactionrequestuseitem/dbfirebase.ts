import { GAME_ACTION_REQUEST_TYPES } from "../../gameactionrequest";

export type GameActionRequestUseItemFirebaseValueRaw = {
  type: GAME_ACTION_REQUEST_TYPES.USE_ITEM,
  created: number,
  initiator: string,
  target: string,
  itemId: string,
};

export type GameActionRequestUseItemFirebaseValue = {
  type: GAME_ACTION_REQUEST_TYPES.USE_ITEM,
  created: number,
  initiator: string,
  target: string,
  itemId: string,
};

export function processFirebaseRawValues(value: GameActionRequestUseItemFirebaseValueRaw): GameActionRequestUseItemFirebaseValue {
  return value;
}
