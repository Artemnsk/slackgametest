const getDBChannel = require('./dbfirebase').getDBChannel;
const getDBChannels = require('./dbfirebase').getDBChannels;
const setDBChannel = require('./dbfirebase').setDBChannel;
const Player = require('../player/player').Player;
const Game = require('../game/game').Game;
const GAME_PHASES = require('../game/game').GAME_PHASES;

const CHANNEL_PHASES = {
  BREAK: "BREAK",
  IN_GAME: "IN_GAME"
};

class Channel {
  /**
   *
   * @param {ChannelFirebaseValue & {$key: string, $teamKey: string}} values
   * @constructor
   * @extends ChannelFirebaseValue
   * @property {string} $key - Database key of this channel.
   * @property {string} $teamKey - Database key of channel team.
   */
  constructor(values) {
    this.active = values.active;
    this.name = values.name;
    this.timeStep = values.timeStep;
    this.phase = values.phase;
    this.breakTime = values.breakTime;
    this.$key = values.$key;
    this.$teamKey = values.$teamKey;
    if (values.nextGame) {
      this.nextGame = values.nextGame;
    }
    if (values.currentGame) {
      this.currentGame = values.currentGame;
    }
  }

  /**
   *
   * @return {Promise.<Game,Error>}
   */
  startGame() {
    if (this.phase === CHANNEL_PHASES.BREAK) {
      // Ensure there are no 'RUNNING' games.
      return Game.getGames(this.$teamKey, this.$key, GAME_PHASES.RUNNING)
        .then((games) => {
          if (games.length === 0) {
            return Player.getPlayers(this.$teamKey, this.$key, true)
              .then((players) => {
                // Create gamers object.
                const /** @type Object.<string,GamerFirebaseValue> */ gamers = players.reduce((gamersObj, currentPlayer) => {
                  gamersObj[currentPlayer.$key] = currentPlayer.getGamerFirebaseValue();
                  return gamersObj;
                }, {});
                const ref = Game.getNewGameRef(this.$teamKey, this.$key);
                // TODO: check that key being created.
                const newGameKey = ref.key;
                // Assign 2 random spells to gamers.
                Game.assignSpells(gamers, 2);
                const /** @type GameFirebaseValue */ gameFirebaseValue = {
                  timeStep: this.timeStep,
                  phase: GAME_PHASES.RUNNING,
                  gamers
                };
                return Game.setGame(gameFirebaseValue, this.$teamKey, this.$key, newGameKey)
                  .then(() => {
                    // Remember old values.
                    let channelOldFirebaseValue = this.getFirebaseValue();
                    // Update channel now.
                    this.currentGame = newGameKey;
                    this.phase = CHANNEL_PHASES.IN_GAME;
                    // TODO: decide what to do. Seems like if phase is IN_GAME we do not take care of this value at all.
                    this.nextGame = 0;
                    Channel.setChannel(this.getFirebaseValue(), this.$teamKey, this.$key)
                      .then(() => {
                        let gameConstructorValue = Object.assign(gameFirebaseValue, {
                          $key: newGameKey,
                          $channelKey: this.$key,
                          $teamKey: this.$teamKey
                        });
                        let newGame = new Game(gameConstructorValue);
                        return Promise.resolve(newGame);
                      }, (updateChannelErr) => {
                        // Return values back.
                        this.currentGame = channelOldFirebaseValue.currentGame;
                        this.phase = channelOldFirebaseValue.phase;
                        this.nextGame = channelOldFirebaseValue.nextGame;
                        // If problem during channel update appeared we need to 'revert' this process - remove newly created game.
                        return Game.removeGame(newGameKey)
                          .then(() => {
                            let error = {
                              message: `In some reason game successfully created but channel wasn't updated. So we removed newly created game. Try again or ask admin to fix that! Error: ${updateChannelErr.message}`
                            };
                            return Promise.reject(error);
                          }, (err) => {
                            // Respond with error.
                            let error = {
                              message: `Game games/'${this.$teamKey}/${this.$key}/${newGameKey}' being created but data of appropriate channel wasn't updated. Ask admin to fix that! Error: ${err.message}`
                            };
                            return Promise.reject(error);
                          });
                      });
                  });
              });
          } else {
            let error = {
              message: `Game with '${GAME_PHASES.RUNNING}' status already exists for this channel.`
            };
            return Promise.reject(error);
          }
        });
    }
    return Promise.reject({ message: "Wrong channel phase to start a game." });
  }

  /**
   *
   * @return {Promise.<Game,Error>}
   */
  overGame() {
    if (this.phase === CHANNEL_PHASES.IN_GAME) {
      // Ensure 'RUNNING' game exists.
      return Game.getGames(this.$teamKey, this.$key, GAME_PHASES.RUNNING)
        .then((games) => {
          if (games.length > 0) {
            const currentGame = games[0];
            let gameOldFirebaseValue = currentGame.getFirebaseValue();
            currentGame.phase = GAME_PHASES.OVER;
            return Game.setGame(currentGame.getFirebaseValue(), currentGame.$teamKey, currentGame.$channelKey, currentGame.$key)
              .then(() => {
                // Update Channel now.
                let channelOldFirebaseValue = this.getFirebaseValue();
                this.phase = CHANNEL_PHASES.BREAK;
                this.currentGame = undefined;
                this.nextGame = Date.now() + this.breakTime;
                return Channel.setChannel(this.getFirebaseValue(), this.$teamKey, this.$key)
                  .then(() => {
                    return Promise.resolve(currentGame);
                  }, (updateChannelErr) => {
                    this.phase = channelOldFirebaseValue.phase;
                    this.currentGame = channelOldFirebaseValue.currentGame;
                    // If problem during channel update appeared we need to 'revert' this process - change updated game values back.
                    return Game.setGame(gameOldFirebaseValue, currentGame.$teamKey, currentGame.$channelKey, currentGame.$key)
                      .then(() => {
                        currentGame.phase = gameOldFirebaseValue.OVER;
                        currentGame.nextGame = gameOldFirebaseValue.nextGame;
                        let error = {
                          message: `In some reason game successfully updated but channel wasn't updated. So we returned game values back. Try again or ask admin to fix that! Error: ${updateChannelErr.message}`
                        };
                        return Promise.reject(error);
                      }, (err) => {
                        // Respond with error.
                        let error = {
                          message: `Game games/'${this.$teamKey}/${this.$key}/${currentGame.$key}' being updated but data of appropriate channel wasn't updated. Ask admin to fix that! Error: ${err.message}`
                        };
                        return Promise.reject(error);
                      });
                  });
              }, (err) => {
                currentGame.phase = gameOldFirebaseValue.OVER;
                let error = {
                  message: `Game games/'${this.$teamKey}/${this.$key}/${currentGame.$key}' wasn't updated! Error: ${err.message}`
                };
                return Promise.reject(error);
              });
          } else {
            let error = {
              message: `There is no game with '${GAME_PHASES.RUNNING}' status in this channel.`
            };
            return Promise.reject(error);
          }
        });
    }
    return Promise.reject({ message: "Wrong channel phase to over game." });
  }

  /**
   *
   * @return {ChannelFirebaseValue}
   */
  getFirebaseValue() {
    return Object.assign({}, {
      active: this.active,
      name: this.name,
      timeStep: this.timeStep,
      phase: this.phase,
      breakTime: this.breakTime,
      nextGame: this.nextGame ? this.nextGame : null,
      currentGame: this.currentGame ? this.currentGame : null
    });
  }

  /**
   * Load channel from DB by channelId.
   * @param {string} teamId
   * @param {string} channelId
   * @return {Promise.<?Channel,Error>}
   */
  static getChannel(teamId, channelId) {
    return getDBChannel(teamId, channelId)
      .then(channelFirebaseValue => {
        if (channelFirebaseValue) {
          let channelConstructorValues = Object.assign(channelFirebaseValue, { $key: channelId, $teamKey: teamId });
          let channel = new Channel(channelConstructorValues);
          return Promise.resolve(channel);
        } else {
          return Promise.resolve(channelFirebaseValue);
        }
      });
  }

  /**
   * Respond with channels array from DB.
   * @param {string} teamId
   * @param {boolean} [active] - filter by 'active' field. No filter if not set.
   * @return Promise.<Array<Channel>,Error>
   */
  static getChannels(teamId, active) {
    return getDBChannels(teamId, active)
      .then(teamsFirebaseObject => {
        const channelsArray = [];
        for (let channelKey in teamsFirebaseObject) {
          let channelFirebaseValue = teamsFirebaseObject[channelKey];
          let channelConstructorValues = Object.assign(channelFirebaseValue, { $key: channelKey, $teamKey: teamId });
          let channel = new Channel(channelConstructorValues);
          channelsArray.push(channel);
        }
        return Promise.resolve(channelsArray);
      });
  }

  /**
   * Sets channel in DB.
   * @param {ChannelFirebaseValue} channelValues
   * @param {string} teamKey
   * @param {string} channelKey
   * @return Promise.<any,Error>
   */
  static setChannel(channelValues, teamKey, channelKey) {
    return setDBChannel(channelValues, teamKey, channelKey);
  }
}

module.exports = {
  Channel,
  CHANNEL_PHASES
};