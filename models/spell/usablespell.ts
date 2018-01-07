import { ParsedSlackActionPayload, SlackMessageAction, SlackMessageAttachment } from "../../helpers/slackmessage";
import { Game } from "../game/game";
import { Gamer } from "../gamer/gamer";
import {GAME_ACTION_REQUEST_TYPES, GameActionRequest} from "../gameactionrequest/gameactionrequest";
import {GameActionRequestUseItemFirebaseValue} from "../gameactionrequest/gameactionrequests/gameactionrequestuseitem/dbfirebase";
import {GameActionRequestCastSpellFirebaseValue} from "../gameactionrequest/gameactionrequests/gameactionrequestcastspell/dbfirebase";
import {Spell} from "./spell";

export abstract class UsableSpell extends Spell {
  /**
   * Validate: does gamer able to use item? Returns true if yes and string with error otherwise.
   */
  public validateGamerUsage(gamer: Gamer): true|string {
    if (gamer.dead === true) {
      return "You are dead.";
    } else {
      // TODO: there is first extension for mana and mana-free spells.
      if (gamer.spells.some((item) => item === this)) {
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

  public processUsageForm(game: Game, gamer: Gamer, parsedPayload: ParsedSlackActionPayload): Promise<boolean> {
    const action = parsedPayload.actions[0];
    if (action.selected_options !== undefined) {
      switch (action.name) {
        case "target":
          if (this.validateGamerUsage(gamer) === true) {
            const targetKey = action.selected_options && action.selected_options[0] && action.selected_options[0].value ? action.selected_options[0].value : null;
            if (targetKey) {
              const gameActionRequestFirebaseValue: GameActionRequestCastSpellFirebaseValue = {
                created: Date.now(),
                initiator: gamer.$key,
                spellId: this.id,
                target: targetKey,
                type: GAME_ACTION_REQUEST_TYPES.CAST_SPELL,
              };
              return GameActionRequest.addRawAction(gameActionRequestFirebaseValue, game.$teamKey, game.$channelKey, game.$key)
                .then((): Promise<boolean> => Promise.resolve(true));
            }
          }
          return Promise.resolve(false);
      }
    }
    return Promise.resolve(false);
  }
}
