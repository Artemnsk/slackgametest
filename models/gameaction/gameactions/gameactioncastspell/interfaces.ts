import { GameAction } from "../../gameaction";

export interface IGameActionCastSpellValueAlterable {
  alterCanActValue: (gameAction: GameAction) => void;
  alterSpellPowerValue: (gameAction: GameAction) => void;
  alterSpellMissValue: (gameAction: GameAction) => void;
  alterSpellEvadeValue: (gameAction: GameAction) => void;
}

export interface IGameActionCastSpellPhaseAlterable {
  alterAfterUsePhase: (gameAction: GameAction) => void;
}
