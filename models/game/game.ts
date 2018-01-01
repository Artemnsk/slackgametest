import * as admin from "firebase-admin";
import { spells } from "../../storage/spells/spells";
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
  public phase: string; // TODO: enum.
  public $key: string;
  public $channelKey: string;
  public $teamKey: string;
  public gamers: {[key: string]: GamerFirebaseValue};

  constructor(values: GameFirebaseValue & {$key: string, $channelKey: string, $teamKey: string}) {
    this.timeStep = values.timeStep;
    this.phase = values.phase;
    this.$key = values.$key;
    this.$channelKey = values.$channelKey;
    this.$teamKey = values.$teamKey;
    this.gamers = values.gamers ? values.gamers : {};
  }

  public getGamer(userKey: string): Gamer|null {
    if (this.gamers[userKey]) {
      const gamerConstructorValue = Object.assign(this.gamers[userKey], {
        $channelKey: this.$channelKey,
        $gameKey: this.$key,
        $key: userKey,
        $teamKey: this.$teamKey,
      });
      return new Gamer(gamerConstructorValue);
    } else {
      return null;
    }
  }

  /**
   *
   * @return {GameFirebaseValue}
   */
  public getFirebaseValue(): GameFirebaseValue {
    return Object.assign({}, {
      gamers: this.gamers,
      phase: this.phase,
      timeStep: this.timeStep,
    });
  }
}
