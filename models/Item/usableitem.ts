import { ParsedSlackActionPayload, SlackMessageAction, SlackMessageAttachment } from "../../helpers/slackmessage";
import { Game } from "../game/game";
import { GAME_ACTION_REQUEST_TYPES, GameActionRequest } from "../gameactionrequest/gameactionrequest";
import { GameActionRequestUseItemFirebaseValue } from "../gameactionrequest/gameactionrequests/gameactionrequestuseitem/dbfirebase";
import { Gamer } from "../gamer/gamer";
import { IUsableInGame } from "../iusable/iusable";
import { Item } from "./item";

export abstract class UsableItem extends Item implements IUsableInGame {
  /**
   * Validate: does gamer able to use item? Returns true if yes and string with error otherwise.
   */
  public validateGamerUsage(gamer: Gamer): true | string {
    if (gamer.dead === true) {
      return "You are dead.";
    } else {
      // TODO: there is first extension for mana and mana-free spells.
      if (gamer.items.some((item) => item === this)) {
        // TODO:
        return true;
        // if (!this.params.manacost || gamer.mana >= this.params.manacost) {
        //   return true;
        // } else {
        //   return "You have not enough mana.";
        // }
      } else {
        return "You have no this item.";
      }
    }
  }

  public getUsageForm(callbackId: string, game: Game, gamer: Gamer): SlackMessageAction | null {
    if (this.validateGamerUsage(gamer) === true) {
      const options = [];
      for (const gameGamer of game.gamers) {
        if (gameGamer.dead === false) {
          options.push({
            text: gameGamer.name,
            value: gameGamer.getKey(),
          });
        }
      }
      if (options.length > 0) {
        return {
          name: "target",
          options,
          text: "Target",
          type: "select",
        };
      } else {
        return null;
      }
    } else {
      // TODO: display "not enough mana" somehow.
      return null;
    }
  }

  public processUsageForm(game: Game, gamer: Gamer, parsedPayload: ParsedSlackActionPayload): Promise<boolean> {
    const action = parsedPayload.actions[0];
    if (action.selected_options !== undefined) {
      switch (action.name) {
        case "target":
          if (this.validateGamerUsage(gamer) === true) {
            const targetKey = action.selected_options && action.selected_options[0] && action.selected_options[0].value ? action.selected_options[0].value : null;
            if (targetKey) {
              const gameActionRequestFirebaseValue: GameActionRequestUseItemFirebaseValue = {
                created: Date.now(),
                initiator: gamer.getKey(),
                itemId: this.$key,
                target: targetKey,
                type: GAME_ACTION_REQUEST_TYPES.USE_ITEM,
              };
              return GameActionRequest.addGameActionRequest(game, gameActionRequestFirebaseValue)
                .then((): Promise<boolean> => Promise.resolve(true));
            }
          }
          return Promise.resolve(false);
      }
    }
    return Promise.resolve(false);
  }

  /**
   * Responds with array of attachments to display item info in Slack app message.
   */
  public getSlackInfo(callbackId: string): SlackMessageAttachment[] {
    return [{
      attachment_type: "default",
      author_name: `${this.emoji}${this.label}`,
      callback_id: callbackId,
      color: "#3AA3E3",
      fields: [
        {
          short: false,
          title: "Description",
          value: this.description,
        },
      ],
    }];
  }
}
