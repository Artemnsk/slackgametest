import * as admin from "firebase-admin";
import { Channel } from "../channel/channel";
import { GAME_ACTION_TYPES, GameAction } from "../gameaction/gameaction";
import { GameActionCastSpell } from "../gameaction/gameactions/gameactioncastspell/gameactioncastspell";
import { GameActionUseItem } from "../gameaction/gameactions/gameactionuseitem/gameactionuseitem";
import { getRecentAction } from "../gameactionrequest/gameactionrequestfactory";
import { GamerFirebaseValue } from "../gamer/dbfirebase";
import { Gamer } from "../gamer/gamer";
import { IGameStepAlterable } from "../icalculable/icalculable";
import { SpellFirebaseValue } from "../spell/dbfirebase";
import { getRandomSpellFirebaseValue as getRandomSpell } from "../spell/spellfactory";
import { GameFirebaseValue, getDBGame, getDBGames, getNewGameDBRef, removeDBGame, setDBGame } from "./dbfirebase";

export const enum GAME_PHASES {
  OVER = "OVER",
  PAUSE = "PAUSE",
  RUNNING = "RUNNING",
}

export const enum GAME_STEP_RESULTS {
  ERROR = "ERROR",
  DEFAULT = "DEFAULT",
  END = "END",
}

export class Game {
  public static assignSpells(gamers: { [key: string]: GamerFirebaseValue }, quantity: number): { [key: string]: GamerFirebaseValue } {
    for (const gamerKey in gamers) {
      if (gamers.hasOwnProperty(gamerKey)) {
        const currentGamerSpells: { [key: string]: SpellFirebaseValue } = {};
        for (let i = 0; i < quantity; i++) {
          let spellFbValue: SpellFirebaseValue | null = null;
          // If it is first iteration or this spell already being added.
          while (spellFbValue === null || currentGamerSpells[spellFbValue.id] === spellFbValue) {
            spellFbValue = getRandomSpell();
          }
          currentGamerSpells[spellFbValue.id] = spellFbValue;
        }
        gamers[gamerKey].spells = currentGamerSpells;
      }
    }
    return gamers;
  }

  /**
   * Load game from DB by teamKey, channelKey and gameKey.
   */
  public static getGame(channel: Channel, gameKey: string): Promise<Game | null> {
    return getDBGame(channel.getTeamKey(), channel.getKey(), gameKey)
      .then((gameFirebaseValue): Promise<Game | null> => {
        if (gameFirebaseValue !== null) {
          const game = new Game(channel, gameFirebaseValue, gameKey);
          return Promise.resolve(game);
        }
        return Promise.resolve(null);
      });
  }

  /**
   * Load game from DB by teamKey, channelKey and gameKey.
   */
  public static getGames(channel: Channel, phase?: string): Promise<Game[]> {
    return getDBGames(channel.getTeamKey(), channel.getKey(), phase)
      .then((gamesFirebaseObject): Promise<Game[]> => {
        const gamesArray = [];
        for (const gameKey in gamesFirebaseObject) {
          if (gamesFirebaseObject.hasOwnProperty(gameKey)) {
            const gameFirebaseValue = gamesFirebaseObject[gameKey];
            const game = new Game(channel, gameFirebaseValue, gameKey);
            gamesArray.push(game);
          }
        }
        return Promise.resolve(gamesArray);
      });
  }

  /**
   * Returns new game Firebase reference.
   */
  public static getNewGameRef(channel: Channel): admin.database.ThenableReference {
    return getNewGameDBRef(channel.getTeamKey(), channel.getKey());
  }

  public static setGame(channel: Channel, gameValues: GameFirebaseValue, gameKey: string): Promise<void> {
    return setDBGame(gameValues, channel.getTeamKey(), channel.getKey(), gameKey);
  }

  public static removeGame(channel: Channel, gameKey: string): Promise<void> {
    return removeDBGame(channel.getTeamKey(), channel.getKey(), gameKey);
  }

  public timeStep: number;
  public phase: GAME_PHASES;
  public gamers: Gamer[];
  private channel: Channel;
  private $key: string;

  constructor(channel: Channel, values: GameFirebaseValue, $key: string) {
    this.channel = channel;
    this.timeStep = values.timeStep;
    this.phase = values.phase;
    this.$key = $key;
    // Construct gamers.
    const gamers: Gamer[] = [];
    for (const gamerKey in values.gamers) {
      if (values.gamers.hasOwnProperty(gamerKey)) {
        const gamer = new Gamer(this, values.gamers[gamerKey], gamerKey);
        if (gamer !== null) {
          gamers.push(gamer);
        }
      }
    }
    this.gamers = gamers;
  }

  public getTeamKey(): string {
    return this.channel.getTeamKey();
  }

  public getChannelKey(): string {
    return this.channel.getKey();
  }

  public getKey(): string {
    return this.$key;
  }

  public getGamer(gamerKey: string): Gamer | null {
    const gamer = this.gamers.find((item) => item.getKey() === gamerKey);
    return gamer === undefined ? null : gamer;
  }

  public getFirebaseValue(): GameFirebaseValue {
    const gamers: { [key: string]: GamerFirebaseValue } = {};
    for (const gamer of this.gamers) {
      gamers[gamer.getKey()] = gamer.getFirebaseValue();
    }
    return Object.assign({}, {
      gamers,
      phase: this.phase,
      timeStep: this.timeStep,
    });
  }

  /**
   * Handles game step for game.
   */
  public gameStep(): Promise<GAME_STEP_RESULTS> {
    getRecentAction(this)
      .then((gameActionRequest): Promise<GAME_STEP_RESULTS> => {
        if (gameActionRequest !== null) {
          // At first we simply get GameAction object from request.
          const gameAction: GameAction = gameActionRequest.toGameAction();
          switch (gameAction.type) {
            case GAME_ACTION_TYPES.USE_ITEM:
              const useItemGameAction = gameAction as GameActionUseItem;
              return this.gameStepUseItem(useItemGameAction);
            case GAME_ACTION_TYPES.CAST_SPELL:
              const castSpellGameAction = gameAction as GameActionCastSpell;
              return this.gameStepCastSpell(castSpellGameAction);
          }
          return Promise.resolve(GAME_STEP_RESULTS.ERROR);
        } else {
          // TODO: Make default game loop?
          return Promise.resolve(GAME_STEP_RESULTS.ERROR);
        }
      }, () => {
        return Promise.resolve(GAME_STEP_RESULTS.ERROR);
      });
    return Promise.resolve(GAME_STEP_RESULTS.DEFAULT);
  }

  protected gameStepUseItem(gameAction: GameActionUseItem): Promise<GAME_STEP_RESULTS> {
    // Now we are going to fill it with all related values. The Game decides which entities have influence on that. Also Game can involve it's own items.
    const calculables: IGameStepAlterable[] = [];
    // Get all items.
    if (gameAction.initiator !== null) {
      calculables.concat(gameAction.initiator.items);
    }
    if (gameAction.target !== null) {
      calculables.concat(gameAction.target.items);
    }
    // TODO: 0. Ability to make action? Not a simple validation.
    // TODO: 1. Collect damage phase.
    // TODO: 2. Miss.
    // TODO: 3. If not miss - evade.
    // TODO: 4. defence phase.
    // TODO: collect logs with weight. Most important shown to all. Less important - to concrete user?
    // TODO: 5. afterUse callback gameAction of used item?
    // TODO: 6. for all used items start "onUse" callbacks - gameActions?
    return Promise.resolve(GAME_STEP_RESULTS.DEFAULT);
  }

  protected gameStepCastSpell(gameAction: GameActionCastSpell): Promise<GAME_STEP_RESULTS> {
    // Now we are going to fill it with all related values. The Game decides which entities have influence on that. Also Game can involve it's own items.
    const calculables: IGameStepAlterable[] = [];
    // Get all items.
    if (gameAction.initiator !== null) {
      calculables.concat(gameAction.initiator.items);
    }
    if (gameAction.target !== null) {
      calculables.concat(gameAction.target.items);
    }
    // TODO: 0. Ability to make action? Not a simple validation.
    // TODO: 1. Collect damage phase.
    // TODO: 2. Miss.
    // TODO: 3. If not miss - evade.
    // TODO: 4. defence phase.
    // TODO: collect logs with weight. Most important shown to all. Less important - to concrete user?
    // TODO: 5. afterUse callback gameAction of used item?
    // TODO: 6. for all used items start "onUse" callbacks - gameActions?
    return Promise.resolve(GAME_STEP_RESULTS.DEFAULT);
  }
}
