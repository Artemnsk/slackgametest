import { IUsableInBreak } from "../../iusable/iusable";
import { PlayerItem } from "./playeritem";

export abstract class UsablePlayerItem extends PlayerItem implements IUsableInBreak {
  public todoIUsableInBreak: string;
}
