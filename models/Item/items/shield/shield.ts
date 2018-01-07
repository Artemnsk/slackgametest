import { ParsedSlackActionPayload, SlackMessageAction } from "../../../../helpers/slackmessage";
import { Game } from "../../../game/game";
import { Gamer } from "../../../gamer/gamer";
import { Item, ITEMS } from "../../item";
import { ItemShieldFirebaseValue } from "./dbfirebase";
import { GAME_ACTION_REQUEST_TYPES, GameActionRequest } from "../../../gameactionrequest/gameactionrequest";
import { GameActionRequestUseItemFirebaseValue } from "../../../gameactionrequest/gameactionrequests/gameactionrequestuseitem/dbfirebase";
import {UsableItem} from "../../usableitem";

export class ItemShield extends UsableItem {
  public id: ITEMS = ITEMS.SHIELD;
  public $key: string;
  public emoji: string = ":shield:";
  public label: string = "Steel shield";
  public description: string = "This is simple steel shield. Nothing special.";
  public armor: number;

  constructor(values: ItemShieldFirebaseValue, itemKey: string) {
    super(values, itemKey);
    this.armor = values.armor;
  }

  public getFirebaseValues(): ItemShieldFirebaseValue {
    return {
      // todo:
      armor: this.armor,
      description: this.description,
      emoji: this.emoji,
      id: ITEMS.SHIELD,
      label: this.label,
    };
  }
}
