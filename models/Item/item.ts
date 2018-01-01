import { ParsedSlackActionPayload, SlackMessageAction, SlackMessageAttachment } from "../../helpers/slackmessage";
import { RAW_ACTION_TYPES } from "../../models/rawaction/dbfirebase";
import { RawAction } from "../../models/rawaction/rawaction";
import { Game } from "../game/game";
import { Gamer } from "../gamer/gamer";

export type ItemConstructorValues = {
  emoji: string,
  id: string,
  label: string,
  description: string,
  consumable: boolean,
  quantity: number|null,
  params: {
    manacost?: number,
    damage?: number,
  },
};

export class Item {
  public emoji: string;
  public id: string;
  public label: string;
  public description: string;
  public consumable: boolean;
  public quantity: number|null;
  public params: {
    manacost?: number,
    damage?: number,
  };

  constructor(itemData: ItemConstructorValues) {
    this.emoji = itemData.emoji;
    this.id = itemData.id;
    this.label = itemData.label;
    this.description = itemData.description;
    this.params = itemData.params;
    this.consumable = itemData.consumable;
    this.quantity = itemData.quantity;
  }

  /**
   * Validate: does gamer able to use item? Returns true if yes and string with error otherwise.
   */
  public validateGamerUsage(gamer: Gamer): true|string {
    if (gamer.dead === true) {
      return "You are dead.";
    } else {
      // TODO: there is first extension for mana and mana-free spells.
      if (gamer.items && gamer.items[this.id] === true) {
        if (!this.params.manacost || gamer.mana >= this.params.manacost) {
          return true;
        } else {
          return "You have not enough mana.";
        }
      } else {
        return "You have no this item.";
      }
    }
  }

  /**
   * Returns select Action for uiAttachment with non-dead gamers (even with empty opts).
   */
  public getUsageForm(callbackId: string, game: Game, gamer: Gamer): SlackMessageAction|null {
    if (this.validateGamerUsage(gamer) === true) {
      const options = [];
      for (const gamerKey in game.gamers) {
        if (game.gamers[gamerKey].dead === false) {
          options.push({
            text: game.gamers[gamerKey].name,
            value: gamerKey,
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

  /**
   * If promise resolved to false it means that it is simply non-spell action.
   * But if promise being rejected it means that we really wanted to process usage form but error appeared.
   */
  public processUsageForm(game: Game, gamer: Gamer, parsedPayload: ParsedSlackActionPayload): Promise<boolean> {
    const action = parsedPayload.actions[0];
    if (action.selected_options !== undefined) {
      switch (action.name) {
        case "target":
          if (this.validateGamerUsage(gamer) === true) {
            const targetKey = action.selected_options && action.selected_options[0] && action.selected_options[0].value ? action.selected_options[0].value : null;
            if (targetKey) {
              const rawActionFirebaseValue = {
                initiator: gamer.$key,
                params: {
                  itemId: this.id,
                },
                target: targetKey,
                type: RAW_ACTION_TYPES.USE_ITEM,
              };
              return RawAction.addRawAction(rawActionFirebaseValue, game.$teamKey, game.$channelKey, game.$key)
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
