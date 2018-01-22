import * as admin from "firebase-admin";
import { Channel } from "../channel/channel";
import { GamerFirebaseValue } from "../gamer/dbfirebase";
import { Gamer } from "../gamer/gamer";
import { SpellFirebaseValue } from "../spell/dbfirebase";
import { getRandomSpellFirebaseValue as getRandomSpell } from "../spell/spellfactory";
import { GameFirebaseValue, getDBGame, getDBGames, getNewGameDBRef, removeDBGame, setDBGame } from "./dbfirebase";
import { IAlterableGameActionMixedValues } from "../iusable/ialterable";
import { ALTERATION_TYPES, DEFAULT_VALUES_FOR_ALTERATION, GameAction } from "../gameaction/gameaction";
import { MixedValue } from "../mixed/mixedvalue/mixedvalue";
import { MixedValueBoolean } from "../mixed/mixedvalue/mixedvalues/mixedvalueboolean";
import { MixedValuePartialBoolean } from "../mixed/mixedvaluepartial/mixedvaluepartials/mixedvaluepartialboolean";

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

export class Game implements IAlterableGameActionMixedValues {
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

  public defaultGameProcessing(): Promise<GAME_STEP_RESULTS> {
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
    return Game.setGame(this.channel, this.getFirebaseValue(), this.getKey())
      .then(() => {
        // TODO: somewhere in the beginning of loop Calculate game end.
        const liveGamers = this.gamers.filter((gamer) => gamer.dead === false);
        if (liveGamers.length <= 0) {
          // TODO: somewhere in the beginning of loop Calculate game end.
          return this.channel.overGame()
            .then(() => {
              return Promise.resolve(GAME_STEP_RESULTS.END);
            }, (err) => {
              return Promise.resolve(GAME_STEP_RESULTS.ERROR);
            });
        }
        return Promise.resolve(GAME_STEP_RESULTS.DEFAULT);
      }, () => {
        return Promise.resolve(GAME_STEP_RESULTS.ERROR);
      });
  }

  /**
   * Alters CAN_ACT value only. Involves game specific logic which applicable to ALL possible game actions: death, time since last step, etc.
   */
  public alterGameActionMixedValue(valueName: string, mixedValue: MixedValue<any, any>, gameAction: GameAction, alterationType: string, alterableData: object): void {
    if (alterationType === ALTERATION_TYPES.OTHER) {
      switch (valueName) {
        case DEFAULT_VALUES_FOR_ALTERATION.CAN_ACT:
          const canActMixedValue = mixedValue as MixedValueBoolean;
          // Is gamer dead?
          if (gameAction.initiator.dead === false) {
            // Was gamer's last game action long time ago enough?
            const initiatorHaste = gameAction.initiator.stats.haste.getFinalValue();
            if (initiatorHaste !== null) {
              // Decrease time step with haste.
              const timeStepWithHaste = Math.min(this.timeStep * (1 - initiatorHaste) / 100, 1);
              if (gameAction.initiator.lastGameAction + timeStepWithHaste < Date.now()) {
                // That important to add that. Later in alterBeingUsedInGameActionMixedValue we will change player lastActionTime value.
                const partial = new MixedValuePartialBoolean(true, this);
                canActMixedValue.addPartial(partial);
              } else {
                const partial = new MixedValuePartialBoolean(false, this);
                canActMixedValue.addPartial(partial);
                canActMixedValue.finalize();
              }
            } else {
              // TODO: that is big error in workflow!!!
            }
          }
          break;
      }
    }
  }

  public alterBeingUsedInGameActionMixedValue(valueName: string, mixedValue: MixedValue<any, any>, gameAction: GameAction, alterationType: string, alterableData: object): GameAction[] {
    if (alterationType === ALTERATION_TYPES.OTHER) {
      switch (valueName) {
        case DEFAULT_VALUES_FOR_ALTERATION.CAN_ACT:
          if (mixedValue.isFinal()) {
            const canAct = mixedValue.getFinalValue() as boolean;
            if (canAct) {
              // That means that as result gamer could act and we must update his lastGameAction.
              gameAction.initiator.updateLastGameAction();
            }
          } else {
            // TODO: that actually means some error for sure.
          }
          break;
      }
    }
    return [];
  }
}
