import {ParsedSlackActionPayload, SlackMessageAction} from "../../../../helpers/slackmessage";
import { Game } from "../../../game/game";
import { Gamer } from "../../../gamer/gamer";
import { Item, ITEMS } from "../../item";
import { ItemDaggerFirebaseValue } from "./dbfirebase";
import { GAME_ACTION_REQUEST_TYPES, GameActionRequest } from "../../../gameactionrequest/gameactionrequest";
import {GameActionRequestUseItemFirebaseValue} from "../../../gameactionrequest/gameactionrequests/gameactionrequestuseitem/dbfirebase";
import {UsableItem} from "../../usableitem";

export class ItemDagger extends UsableItem {
  public id: ITEMS = ITEMS.DAGGER;
  public emoji: string = ":dagger_knife:";
  public label: string = "Steel Dagger";
  public description: string = "This is simple steel dagger. Nothing special.";
  public damage: number;

  constructor(values: ItemDaggerFirebaseValue, itemKey: string) {
    super(values, itemKey);
    this.damage = values.damage;
  }

  public getFirebaseValues(): ItemDaggerFirebaseValue {
    return {
      // todo:
      damage: this.damage,
      description: this.description,
      emoji: this.emoji,
      id: ITEMS.DAGGER,
      label: this.label,
    };
  }
}
