"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("../game/game");
const player_1 = require("../player/player");
const dbfirebase_1 = require("./dbfirebase");
class Channel {
    /**
     * Load channel from DB by channelId.
     */
    static getChannel(teamId, channelId) {
        return dbfirebase_1.getDBChannel(teamId, channelId)
            .then((channelFirebaseValue) => {
            if (channelFirebaseValue) {
                const channelConstructorValues = Object.assign(channelFirebaseValue, { $key: channelId, $teamKey: teamId });
                const channel = new Channel(channelConstructorValues);
                return Promise.resolve(channel);
            }
            else {
                return Promise.resolve(channelFirebaseValue);
            }
        });
    }
    /**
     * Respond with channels array from DB.
     */
    static getChannels(teamId, active) {
        return dbfirebase_1.getDBChannels(teamId, active)
            .then((teamsFirebaseObject) => {
            const channelsArray = [];
            for (const channelKey in teamsFirebaseObject) {
                if (teamsFirebaseObject.hasOwnProperty(channelKey)) {
                    const channelFirebaseValue = teamsFirebaseObject[channelKey];
                    const channelConstructorValues = Object.assign(channelFirebaseValue, { $key: channelKey, $teamKey: teamId });
                    const channel = new Channel(channelConstructorValues);
                    channelsArray.push(channel);
                }
            }
            return Promise.resolve(channelsArray);
        });
    }
    /**
     * Sets channel in DB.
     */
    static setChannel(channelValues, teamKey, channelKey) {
        return dbfirebase_1.setDBChannel(channelValues, teamKey, channelKey);
    }
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
    startGame() {
        if (this.phase === "BREAK" /* BREAK */) {
            // Ensure there are no 'RUNNING' games.
            return game_1.Game.getGames(this.$teamKey, this.$key, "RUNNING" /* RUNNING */)
                .then((games) => {
                if (games.length === 0) {
                    return player_1.Player.getPlayers(this.$teamKey, this.$key, true)
                        .then((players) => {
                        // Create gamers object.
                        const gamers = players.reduce((gamersObj, currentPlayer) => {
                            gamersObj[currentPlayer.$key] = currentPlayer.getGamerFirebaseValue();
                            return gamersObj;
                        }, {});
                        const ref = game_1.Game.getNewGameRef(this.$teamKey, this.$key);
                        // TODO: check that key being created!!!
                        const newGameKey = ref.key;
                        if (newGameKey !== null) {
                            // Assign 2 random spells to gamers.
                            game_1.Game.assignSpells(gamers, 2);
                            const gameFirebaseValue = {
                                gamers,
                                phase: "RUNNING" /* RUNNING */,
                                timeStep: this.timeStep,
                            };
                            return game_1.Game.setGame(gameFirebaseValue, this.$teamKey, this.$key, newGameKey)
                                .then(() => {
                                // Remember old values.
                                const channelOldFirebaseValue = this.getFirebaseValue();
                                // Update channel now.
                                this.currentGame = newGameKey;
                                this.phase = "IN_GAME" /* IN_GAME */;
                                // TODO: decide what to do. Seems like if phase is IN_GAME we do not take care of this value at all.
                                this.nextGame = 0;
                                return Channel.setChannel(this.getFirebaseValue(), this.$teamKey, this.$key)
                                    .then(() => {
                                    const gameConstructorValue = Object.assign(gameFirebaseValue, {
                                        $channelKey: this.$key,
                                        $key: newGameKey,
                                        $teamKey: this.$teamKey,
                                    });
                                    const newGame = new game_1.Game(gameConstructorValue);
                                    return Promise.resolve(newGame);
                                }, (updateChannelErr) => {
                                    // Return values back.
                                    this.currentGame = channelOldFirebaseValue.currentGame;
                                    this.phase = channelOldFirebaseValue.phase;
                                    this.nextGame = channelOldFirebaseValue.nextGame;
                                    // If problem during channel update appeared we need to 'revert' this process - remove newly created game.
                                    return game_1.Game.removeGame(this.$teamKey, this.$key, newGameKey)
                                        .then(() => {
                                        const error = {
                                            message: `In some reason game successfully created but channel wasn't updated. So we removed newly created game. Try again or ask admin to fix that! Error: ${updateChannelErr.message}`,
                                        };
                                        return Promise.reject(error);
                                    }, (err) => {
                                        // Respond with error.
                                        const error = {
                                            message: `Game games/'${this.$teamKey}/${this.$key}/${newGameKey}' being created but data of appropriate channel wasn't updated. Ask admin to fix that! Error: ${err.message}`,
                                        };
                                        return Promise.reject(error);
                                    });
                                });
                            });
                        }
                        else {
                            const error = {
                                message: `Game key cannot be retrieved from DB.`,
                            };
                            return Promise.reject(error);
                        }
                    });
                }
                else {
                    const error = {
                        message: `Game with '${"RUNNING" /* RUNNING */}' status already exists for this channel.`,
                    };
                    return Promise.reject(error);
                }
            });
        }
        return Promise.reject({ message: "Wrong channel phase to start a game." });
    }
    overGame() {
        if (this.phase === "IN_GAME" /* IN_GAME */) {
            // Ensure 'RUNNING' game exists.
            return game_1.Game.getGames(this.$teamKey, this.$key, "RUNNING" /* RUNNING */)
                .then((games) => {
                if (games.length > 0) {
                    const currentGame = games[0];
                    const gameOldFirebaseValue = currentGame.getFirebaseValue();
                    currentGame.phase = "OVER" /* OVER */;
                    return game_1.Game.setGame(currentGame.getFirebaseValue(), currentGame.$teamKey, currentGame.$channelKey, currentGame.$key)
                        .then(() => {
                        // Update Channel now.
                        const channelOldFirebaseValue = this.getFirebaseValue();
                        this.phase = "BREAK" /* BREAK */;
                        this.currentGame = null;
                        this.nextGame = Date.now() + this.breakTime;
                        return Channel.setChannel(this.getFirebaseValue(), this.$teamKey, this.$key)
                            .then(() => {
                            return Promise.resolve(currentGame);
                        }, (updateChannelErr) => {
                            this.phase = channelOldFirebaseValue.phase;
                            this.currentGame = channelOldFirebaseValue.currentGame;
                            // If problem during channel update appeared we need to 'revert' this process - change updated game values back.
                            return game_1.Game.setGame(gameOldFirebaseValue, currentGame.$teamKey, currentGame.$channelKey, currentGame.$key)
                                .then(() => {
                                currentGame.phase = gameOldFirebaseValue.phase;
                                const error = {
                                    message: `In some reason game successfully updated but channel wasn't updated. So we returned game values back. Try again or ask admin to fix that! Error: ${updateChannelErr.message}`,
                                };
                                return Promise.reject(error);
                            }, (err) => {
                                // Respond with error.
                                const error = {
                                    message: `Game games/'${this.$teamKey}/${this.$key}/${currentGame.$key}' being updated but data of appropriate channel wasn't updated. Ask admin to fix that! Error: ${err.message}`,
                                };
                                return Promise.reject(error);
                            });
                        });
                    }, (err) => {
                        currentGame.phase = gameOldFirebaseValue.phase;
                        const error = {
                            message: `Game games/'${this.$teamKey}/${this.$key}/${currentGame.$key}' wasn't updated! Error: ${err.message}`,
                        };
                        return Promise.reject(error);
                    });
                }
                else {
                    const error = {
                        message: `There is no game with '${"RUNNING" /* RUNNING */}' status in this channel.`,
                    };
                    return Promise.reject(error);
                }
            });
        }
        return Promise.reject({ message: "Wrong channel phase to over game." });
    }
    getFirebaseValue() {
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
exports.Channel = Channel;
//# sourceMappingURL=channel.js.map