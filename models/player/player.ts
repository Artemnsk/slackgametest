import { Channel } from "../channel/channel";
import { GamerFirebaseValue } from "../gamer/dbfirebase";
import { ItemFirebaseValue } from "../Item/dbfirebase";
import { Item } from "../Item/item";
import { buildItem } from "../Item/itemfactory";
import { getDBPlayer, getDBPlayers, PlayerFirebaseValue, setDBPlayer } from "./dbfirebase";

export class Player {
  /**
   * Load player from DB by teamKey and channelKey and playerKey.
   */
  public static getPlayer(channel: Channel, playerKey: string): Promise<Player | null> {
    return getDBPlayer(channel.team.$key, channel.$key, playerKey)
      .then((playerFirebaseValue): Promise<Player | null> => {
        if (playerFirebaseValue) {
          const player = new Player(channel, playerFirebaseValue, playerKey);
          return Promise.resolve(player);
        } else {
          return Promise.resolve(playerFirebaseValue);
        }
      });
  }

  /**
   * Respond with channels array from DB.
   */
  public static getPlayers(channel: Channel, active?: boolean): Promise<Player[]> {
    return getDBPlayers(channel.team.$key, channel.$key, active)
      .then((playersFirebaseObject): Promise<Player[]> => {
        const playersArray = [];
        for (const playerKey in playersFirebaseObject) {
          if (playersFirebaseObject.hasOwnProperty(playerKey)) {
            const playerFirebaseValue = playersFirebaseObject[ playerKey ];
            const player = new Player(channel, playerFirebaseValue, playerKey);
            playersArray.push(player);
          }
        }
        return Promise.resolve(playersArray);
      });
  }

  /**
   * Sets player in DB.
   */
  public static setPlayer(channel: Channel, playerValues: PlayerFirebaseValue, playerKey: string): Promise<void> {
    return setDBPlayer(playerValues, channel.team.$key, channel.$key, playerKey);
  }

  public active: boolean;
  public name: string;
  public $key: string;
  public channel: Channel;
  public gold: number;
  public items: Item[];

  constructor(channel: Channel, values: PlayerFirebaseValue, $key: string) {
    this.$key = $key;
    this.channel = channel;
    this.active = values.active;
    this.name = values.name;
    this.gold = values.gold;
    // Construct items.
    const items: Item[] = [];
    for (const itemKey in values.items) {
      if (values.items.hasOwnProperty(itemKey)) {
        const item = buildItem(values.items[ itemKey ], itemKey);
        if (item !== null) {
          items.push(item);
        }
      }
    }
    this.items = items;
  }

  /**
   * Initialize gamer by player. TODO: that probably must be declared inside Game?
   */
  public getGamerFirebaseValue(): GamerFirebaseValue {
    const items: { [key: string]: ItemFirebaseValue } = {};
    for (const item of this.items) {
      items[ item.$key ] = item.getFirebaseValues();
    }
    return {
      dead: false,
      // TODO: set somewhere? Maybe channel/game setting?
      health: 100,
      items,
      // TODO: set somewhere? Maybe channel/game setting?
      mana: 40,
      name: this.name,
      spells: {},
    };
  }

  public getFirebaseValue(): PlayerFirebaseValue {
    const items: { [key: string]: ItemFirebaseValue } = {};
    for (const item of this.items) {
      items[ item.$key ] = item.getFirebaseValues();
    }
    return Object.assign({}, {
      active: this.active,
      gold: this.gold,
      items,
      name: this.name,
    });
  }
}
