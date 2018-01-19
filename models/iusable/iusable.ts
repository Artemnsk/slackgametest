import { ParsedSlackActionPayload, SlackMessageAction, SlackMessageAttachment } from "../../helpers/slackmessage";
import { Game } from "../game/game";
import { GameAction } from "../gameaction/gameaction";
import { GameActionRequest } from "../gameactionrequest/gameactionrequest";
import { Gamer } from "../gamer/gamer";

export interface IInspectable {
  getSlackInfo(callbackId: string): SlackMessageAttachment[];
}

export interface IUsableInGame {
  validateGamerUsage(gamer: Gamer): true | string;

  getUsageForm(callbackId: string, game: Game, gamer: Gamer): SlackMessageAction | null;

  processUsageForm(game: Game, gamer: Gamer, parsedPayload: ParsedSlackActionPayload): Promise<boolean>;

  getSlackInfo(callbackId: string): SlackMessageAttachment[];

  getInitialGameAction(game: Game, gameActionRequest: GameActionRequest, initiator: Gamer, target: Gamer): GameAction;

  alterGameActionPhase(phase: string, gameAction: GameAction): GameAction[];
}

export interface IUsableInBreak {
  todoIUsableInBreak: string;
}
