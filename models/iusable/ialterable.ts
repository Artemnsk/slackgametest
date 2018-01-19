import { GameAction } from "../gameaction/gameaction";

export interface IAlterableGameActionMixedValues {
  alterGameActionMixedValue(valueName: string, gameAction: GameAction, alterationType: string): void;

  alterBeingUsedInGameActionMixedValue(valueName: string, gameAction: GameAction, alterationType: string): GameAction[];
}
