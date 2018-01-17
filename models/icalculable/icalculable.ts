import { GameAction } from "../gameaction/gameaction";

export interface IGameStepAlterable {
  alterAbleToAct: () => GameAction | null;
}
