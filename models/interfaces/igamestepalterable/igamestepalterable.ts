import { Game } from "../../game/game";
import { GameAction } from "../../gameaction/gameaction";

export interface IGameStepAlterable {
  alterAbleToAct: (gameAction: GameAction) => void;
  alterPower: (gameAction: GameAction) => void;
  alterMiss: (gameAction: GameAction) => void;
  alterEvade: (gameAction: GameAction) => void;
  alterBeforeUse: (gameAction: GameAction) => void;
  alterAfterUse: (gameAction: GameAction) => void;
}
