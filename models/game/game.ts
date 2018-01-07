import * as admin from "firebase-admin";
import { GamerFirebaseValue } from "../gamer/dbfirebase";
import { Gamer } from "../gamer/gamer";
import { GameFirebaseValue, getDBGame, getDBGames, getNewGameDBRef, removeDBGame, setDBGame } from "./dbfirebase";

export const enum GAME_PHASES {
  OVER = "OVER",
  PAUSE = "PAUSE",
  RUNNING = "RUNNING",
}

export class Game {
  public static assignSpells(gamers: {[key: string]: Gamer}, quantity: number): {[key: string]: Gamer} {
    for (const gamerKey in gamers) {
      if (gamers.hasOwnProperty(gamerKey)) {
        const currentGamerSpells: {[key: string]: boolean} = {};
        for (let i = 0; i < Math.min(quantity, spells.length); i++) {
          let j = null;
          // If it is first iteration or this spell already being added.
          while (j === null || currentGamerSpells[spells[j].id] === true) {
            j = Math.floor(Math.random() * spells.length);
          }
          currentGamerSpells[spells[j].id] = true;
        }
        gamers[gamerKey].spells = currentGamerSpells;
      }
    }
    return gamers;
  }

  /**
   * Load game from DB by teamKey, channelKey and gameKey.
   * @return {Promise.<?Game,Error>}
   */
  public static getGame(teamKey: string, channelKey: string, gameKey: string): Promise<Game|null> {
    return getDBGame(teamKey, channelKey, gameKey)
      .then((gameFirebaseValue): Promise<Game|null> => {
        const gameConstructorValues = Object.assign(gameFirebaseValue, { $key: gameKey, $channelKey: channelKey, $teamKey: teamKey });
        const game = new Game(gameConstructorValues);
        return Promise.resolve(game);
      });
  }

  /**
   * Load game from DB by teamKey, channelKey and gameKey.
   * @return {Promise.<Array<Game>,Error>}
   */
  public static getGames(teamKey: string, channelKey: string, phase?: string): Promise<Game[]> {
    return getDBGames(teamKey, channelKey, phase)
      .then((gamesFirebaseObject): Promise<Game[]> => {
        const gamesArray = [];
        for (const gameKey in gamesFirebaseObject) {
          if (gamesFirebaseObject.hasOwnProperty(gameKey)) {
            const gameFirebaseValue = gamesFirebaseObject[gameKey];
            const gameConstructorValues = Object.assign(gameFirebaseValue, { $key: gameKey, $channelKey: channelKey, $teamKey: teamKey });
            const game = new Game(gameConstructorValues);
            gamesArray.push(game);
          }
        }
        return Promise.resolve(gamesArray);
      });
  }

  /**
   * Returns new game Firebase reference.
   */
  public static getNewGameRef(teamKey: string, channelKey: string): admin.database.ThenableReference {
    return getNewGameDBRef(teamKey, channelKey);
  }

  public static setGame(gameValues: GameFirebaseValue, teamKey: string, channelKey: string, gameKey: string): Promise<void> {
    return setDBGame(gameValues, teamKey, channelKey, gameKey);
  }

  public static removeGame(teamKey: string, channelKey: string, gameKey: string): Promise<void> {
    return removeDBGame(teamKey, channelKey, gameKey);
  }

  public timeStep: number;
  public phase: GAME_PHASES;
  public $key: string;
  public $channelKey: string;
  public $teamKey: string;
  public gamers: Gamer[];

  constructor(values: GameFirebaseValue & {$key: string, $channelKey: string, $teamKey: string}) {
    this.timeStep = values.timeStep;
    this.phase = values.phase;
    this.$key = values.$key;
    this.$channelKey = values.$channelKey;
    this.$teamKey = values.$teamKey;
    // Construct gamers.
    const gamers: Gamer[] = [];
    for (const gamerKey in values.gamers) {
      if (values.gamers.hasOwnProperty(gamerKey)) {
        const gamer = new Gamer(Object.assign(values.gamers[gamerKey], { $gameKey: values.$key, $channelKey: values.$channelKey, $teamKey: values.$teamKey }), gamerKey);
        if (gamer !== null) {
          gamers.push(gamer);
        }
      }
    }
    this.gamers = gamers;
  }

  public getGamer(gamerKey: string): Gamer|null {
    const gamer = this.gamers.find((item) => item.$key === gamerKey);
    return gamer === undefined ? null : gamer;
  }

  public getFirebaseValue(): GameFirebaseValue {
    const gamers: { [key: string]: GamerFirebaseValue } = {};
    for (const gamer of this.gamers) {
      gamers[gamer.$key] = gamer.getFirebaseValue();
    }
    return Object.assign({}, {
      gamers,
      phase: this.phase,
      timeStep: this.timeStep,
    });
  }
}
