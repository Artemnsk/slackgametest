import { GameFirebaseValue } from "../game/dbfirebase";
import { Game, GAME_PHASES } from "../game/game";
import { GamerFirebaseValue } from "../gamer/dbfirebase";
import { Player } from "../player/player";
import { Team } from "../team/team";
import { CHANNEL_PHASES, ChannelFirebaseValue, getDBChannel, getDBChannels, setDBChannel } from "./dbfirebase";

export class Channel {
  /**
   * Load channel from DB by channelId.
   */
  public static getChannel(team: Team, channelKey: string): Promise<Channel|null> {
    return getDBChannel(team.getKey(), channelKey)
      .then((channelFirebaseValue): Promise<Channel|null> => {
        if (channelFirebaseValue) {
          const channel = new Channel(team, channelFirebaseValue, channelKey);
          return Promise.resolve(channel);
        } else {
          return Promise.resolve(channelFirebaseValue);
        }
      });
  }

  /**
   * Respond with channels array from DB.
   */
  public static getChannels(team: Team, active?: boolean): Promise<Channel[]> {
    return getDBChannels(team.getKey(), active)
      .then((teamsFirebaseObject): Promise<Channel[]> => {
        const channelsArray = [];
        for (const channelKey in teamsFirebaseObject) {
          if (teamsFirebaseObject.hasOwnProperty(channelKey)) {
            const channelFirebaseValue = teamsFirebaseObject[channelKey];
            const channel = new Channel(team, channelFirebaseValue, channelKey);
            channelsArray.push(channel);
          }
        }
        return Promise.resolve(channelsArray);
      });
  }

  /**
   * Sets channel in DB.
   */
  public static setChannel(team: Team, channelValues: ChannelFirebaseValue, channelKey: string): Promise<void> {
    return setDBChannel(channelValues, team.getKey(), channelKey);
  }

  public active: boolean;
  public name: string;
  public timeStep: number;
  public phase: CHANNEL_PHASES;
  public breakTime: number;
  public nextGame: number|null;
  public currentGame: string|null;
  private $key: string;
  private team: Team;

  constructor(team: Team, values: ChannelFirebaseValue, $key: string) {
    this.team = team;
    this.$key = $key;
    this.active = values.active;
    this.name = values.name;
    this.timeStep = values.timeStep;
    this.phase = values.phase;
    this.breakTime = values.breakTime;
    if (values.nextGame) {
      this.nextGame = values.nextGame;
    }
    if (values.currentGame) {
      this.currentGame = values.currentGame;
    }
  }

  public getTeamToken(): string {
    return this.team.token !== undefined ? this.team.token : "";
  }

  public getTeamKey(): string {
    return this.team.getKey();
  }

  public getKey(): string {
    return this.$key;
  }

  public startGame(): Promise<Game> {
    if (this.phase === CHANNEL_PHASES.BREAK) {
      // Ensure there are no 'RUNNING' games.
      return Game.getGames(this, GAME_PHASES.RUNNING)
        .then((games): Promise<Game> => {
          if (games.length === 0) {
            return Player.getPlayers(this, true)
              .then((players): Promise<Game> => {
                // Create gamers object.
                const gamers: {[key: string]: GamerFirebaseValue} = players.reduce((gamersObj: {[key: string]: GamerFirebaseValue}, currentPlayer) => {
                  gamersObj[currentPlayer.getKey()] = currentPlayer.getGamerFirebaseValue();
                  return gamersObj;
                }, {});
                const ref = Game.getNewGameRef(this);
                const newGameKey = ref.key;
                if (newGameKey !== null) {
                  // Assign 2 random spells to gamers. Beware continuous loop if you quantity > spells exist.
                  Game.assignSpells(gamers, 2);
                  const gameFirebaseValue: GameFirebaseValue = {
                    gamers,
                    phase: GAME_PHASES.RUNNING,
                    timeStep: this.timeStep,
                  };
                  return Game.setGame(this, gameFirebaseValue, newGameKey)
                    .then((): Promise<Game> => {
                      // Remember old values.
                      const channelOldFirebaseValue = this.getFirebaseValue();
                      // Update channel now.
                      this.currentGame = newGameKey;
                      this.phase = CHANNEL_PHASES.IN_GAME;
                      // TODO: decide what to do. Seems like if phase is IN_GAME we do not take care of this value at all.
                      this.nextGame = 0;
                      return Channel.setChannel(this.team, this.getFirebaseValue(), this.getKey())
                        .then((): Promise<Game> => {
                          const newGame = new Game(this, gameFirebaseValue, newGameKey);
                          return Promise.resolve(newGame);
                        }, (updateChannelErr) => {
                          // Return values back.
                          this.currentGame = channelOldFirebaseValue.currentGame;
                          this.phase = channelOldFirebaseValue.phase;
                          this.nextGame = channelOldFirebaseValue.nextGame;
                          // If problem during channel update appeared we need to 'revert' this process - remove newly created game.
                          return Game.removeGame(this, newGameKey)
                            .then((): Promise<Game> => {
                              const error = {
                                message: `In some reason game successfully created but channel wasn't updated. So we removed newly created game. Try again or ask admin to fix that! Error: ${updateChannelErr.message}`,
                              };
                              return Promise.reject(error);
                            }, (err) => {
                              // Respond with error.
                              const error = {
                                message: `Game games/'${this.team.getKey()}/${this.getKey()}/${newGameKey}' being created but data of appropriate channel wasn't updated. Ask admin to fix that! Error: ${err.message}`,
                              };
                              return Promise.reject(error);
                            });
                        });
                    });
                } else {
                  const error = {
                    message: `Game key cannot be retrieved from DB.`,
                  };
                  return Promise.reject(error);
                }
              });
          } else {
            const error = {
              message: `Game with '${GAME_PHASES.RUNNING}' status already exists for this channel.`,
            };
            return Promise.reject(error);
          }
        });
    }
    return Promise.reject({ message: "Wrong channel phase to start a game." });
  }

  public overGame(): Promise<Game> {
    if (this.phase === CHANNEL_PHASES.IN_GAME) {
      // Ensure 'RUNNING' game exists.
      return Game.getGames(this, GAME_PHASES.RUNNING)
        .then((games) => {
          if (games.length > 0) {
            const currentGame = games[0];
            const gameOldFirebaseValue = currentGame.getFirebaseValue();
            currentGame.phase = GAME_PHASES.OVER;
            return Game.setGame(this, currentGame.getFirebaseValue(), currentGame.getKey())
              .then(() => {
                // Update Channel now.
                const channelOldFirebaseValue = this.getFirebaseValue();
                this.phase = CHANNEL_PHASES.BREAK;
                this.currentGame = null;
                this.nextGame = Date.now() + this.breakTime;
                return Channel.setChannel(this.team, this.getFirebaseValue(), this.getKey())
                  .then(() => {
                    return Promise.resolve(currentGame);
                  }, (updateChannelErr) => {
                    this.phase = channelOldFirebaseValue.phase;
                    this.currentGame = channelOldFirebaseValue.currentGame;
                    // If problem during channel update appeared we need to 'revert' this process - change updated game values back.
                    return Game.setGame(this, gameOldFirebaseValue, currentGame.getKey())
                      .then(() => {
                        currentGame.phase = gameOldFirebaseValue.phase;
                        const error = {
                          message: `In some reason game successfully updated but channel wasn't updated. So we returned game values back. Try again or ask admin to fix that! Error: ${updateChannelErr.message}`,
                        };
                        return Promise.reject(error);
                      }, (err) => {
                        // Respond with error.
                        const error = {
                          message: `Game games/'${this.team.getKey()}/${this.getKey()}/${currentGame.getKey()}' being updated but data of appropriate channel wasn't updated. Ask admin to fix that! Error: ${err.message}`,
                        };
                        return Promise.reject(error);
                      });
                  });
              }, (err) => {
                currentGame.phase = gameOldFirebaseValue.phase;
                const error = {
                  message: `Game games/'${this.team.getKey()}/${this.getKey()}/${currentGame.getKey()}' wasn't updated! Error: ${err.message}`,
                };
                return Promise.reject(error);
              });
          } else {
            // Anyway make this channel not in game.
            this.nextGame = Date.now() + this.breakTime;
            this.phase = CHANNEL_PHASES.BREAK;
            this.currentGame = null;
            return Channel.setChannel(this.team, this.getFirebaseValue(), this.getKey())
              .then(() => {
                const error = {
                  message: `There is no game with '${GAME_PHASES.RUNNING}' status in this channel.`,
                };
                return Promise.reject(error);
              }, () => {
                const error = {
                  message: `There is no game with '${GAME_PHASES.RUNNING}' status in this channel.`,
                };
                return Promise.reject(error);
              });
          }
        });
    }
    return Promise.reject({ message: "Wrong channel phase to over game." });
  }

  public getFirebaseValue(): ChannelFirebaseValue {
    return Object.assign({}, {
      active: this.active,
      breakTime: this.breakTime,
      currentGame: this.currentGame,
      name: this.name,
      nextGame: this.nextGame,
      phase: this.phase,
      timeStep: this.timeStep,
    });
  }
}
