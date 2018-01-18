import { Game } from "../game/game";
import { GameAction } from "../gameaction/gameaction";

export interface IGameStepAlterable {
  alterAbleToAct: (gameAction: GameAction, game: Game) => void;
  alterPower: (gameAction: GameAction, game: Game) => void;
  alterMiss: (gameAction: GameAction, game: Game) => void;
  alterEvade: (gameAction: GameAction, game: Game) => void;
  alterBeforeUse: (gameAction: GameAction, game: Game) => void;
  alterAfterUse: (gameAction: GameAction, game: Game) => void;
}
