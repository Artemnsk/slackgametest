import { ParsedSlackActionPayload, SlackMessageAction, SlackMessageAttachment } from "../../helpers/slackmessage";
import { Game } from "../game/game";
import { Gamer } from "../gamer/gamer";

export interface IUsableInGame {
  validateGamerUsage(gamer: Gamer): true | string;

  getUsageForm(callbackId: string, game: Game, gamer: Gamer): SlackMessageAction | null;

  processUsageForm(game: Game, gamer: Gamer, parsedPayload: ParsedSlackActionPayload): Promise<boolean>;

  getSlackInfo(callbackId: string): SlackMessageAttachment[];
}

export interface IUsableInBreak {
  todoIUsableInBreak: string;
}
