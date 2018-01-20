import * as admin from "firebase-admin";
import { Channel } from "../channel/channel";
import { GameAction } from "../gameaction/gameaction";
import { GameActionRequest } from "../gameactionrequest/gameactionrequest";
import { getRecentAction } from "../gameactionrequest/gameactionrequestfactory";
import { GamerFirebaseValue } from "../gamer/dbfirebase";
import { Gamer } from "../gamer/gamer";
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
    return getRecentAction(this)
      .then((gameActionRequest): Promise<GAME_STEP_RESULTS> => {
        if (gameActionRequest !== null) {
          // At first we simply get GameAction object from request.
          const gameAction = gameActionRequest.toGameAction();
          if (gameAction !== null) {
            return gameAction.processGameStep()
              .then((gameStepResult) => {
                return GameActionRequest.removeGameActionRequest(gameActionRequest.getTeamKey(), gameActionRequest.getChannelKey(), gameActionRequest.getGameKey(), gameActionRequest.getKey())
                  .then(() => {
                    return this.defaultGameProcessing();
                  }, () => {
                    return this.defaultGameProcessing();
                  });
              }, () => {
                return Promise.resolve(GAME_STEP_RESULTS.ERROR);
              });
          } else {
            return Promise.resolve(GAME_STEP_RESULTS.ERROR);
          }
        } else {
          return this.defaultGameProcessing();
        }
      }, (err) => {
        return Promise.resolve(GAME_STEP_RESULTS.ERROR);
      });
  }

  private defaultGameProcessing(): Promise<GAME_STEP_RESULTS> {
    // Allow each entity to alter default calculation. E.g. calculate buffs/debuffs damage or their end.
    for (const gamer of this.gamers) {
      for (const item of gamer.items) {
        item.alterDefaultGameProcess();
      }
    }
    // Calculate deaths.
    for (const gamer of this.gamers) {
      if (gamer.health <= 0) {
        gamer.dead = true;
      }
    }
    // TODO: somewhere in the beginning of loop Calculate game end.
    const liveGamers = this.gamers.filter((gamer) => gamer.dead === false);
    if (liveGamers.length <= 0) {
      // TODO: somewhere in the beginning of loop Calculate game end.
      return Promise.resolve(GAME_STEP_RESULTS.END);
    }
    return Game.setGame(this.channel, this.getFirebaseValue(), this.getKey())
      .then(() => {
        return Promise.resolve(GAME_STEP_RESULTS.DEFAULT);
      }, () => {
        return Promise.resolve(GAME_STEP_RESULTS.ERROR);
      });
  }
}
