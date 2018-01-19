import { GameAction } from "../gameaction/gameaction";

export interface IAlterableGameActionMixedValues {
  alterGameActionMixedValue(valueName: string, gameAction: GameAction, alterationType: string, alterableData: object): void;

  alterBeingUsedInGameActionMixedValue(valueName: string, gameAction: GameAction, alterationType: string, alterableData: object): GameAction[];
}
