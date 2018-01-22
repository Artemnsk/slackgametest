import { GameAction } from "../gameaction/gameaction";
import { MixedValue } from "../mixed/mixedvalue/mixedvalue";

export interface IAlterableGameActionMixedValues {
  alterGameActionMixedValue(valueName: string, mixedValue: MixedValue<any, any>, gameAction: GameAction, alterationType: string, alterableData: object): void;

  alterBeingUsedInGameActionMixedValue(valueName: string, mixedValue: MixedValue<any, any>, gameAction: GameAction, alterationType: string, alterableData: object): GameAction[];
}

export interface IAlterableDefaultGameProcess {
  alterDefaultGameProcess(): boolean;
}
