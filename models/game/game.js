"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spells_1 = require("../../storage/spells/spells");
const gamer_1 = require("../gamer/gamer");
const dbfirebase_1 = require("./dbfirebase");
class Game {
    static assignSpells(gamers, quantity) {
        for (const gamerKey in gamers) {
            if (gamers.hasOwnProperty(gamerKey)) {
                const currentGamerSpells = {};
                for (let i = 0; i < Math.min(quantity, spells_1.spells.length); i++) {
                    let j = null;
                    // If it is first iteration or this spell already being added.
                    while (j === null || currentGamerSpells[spells_1.spells[j].id] === true) {
                        j = Math.floor(Math.random() * spells_1.spells.length);
                    }
                    currentGamerSpells[spells_1.spells[j].id] = true;
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
    static getGame(teamKey, channelKey, gameKey) {
        return dbfirebase_1.getDBGame(teamKey, channelKey, gameKey)
            .then((gameFirebaseValue) => {
            const gameConstructorValues = Object.assign(gameFirebaseValue, { $key: gameKey, $channelKey: channelKey, $teamKey: teamKey });
            const game = new Game(gameConstructorValues);
            return Promise.resolve(game);
        });
    }
    /**
     * Load game from DB by teamKey, channelKey and gameKey.
     * @return {Promise.<Array<Game>,Error>}
     */
    static getGames(teamKey, channelKey, phase) {
        return dbfirebase_1.getDBGames(teamKey, channelKey, phase)
            .then((gamesFirebaseObject) => {
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
    static getNewGameRef(teamKey, channelKey) {
        return dbfirebase_1.getNewGameDBRef(teamKey, channelKey);
    }
    static setGame(gameValues, teamKey, channelKey, gameKey) {
        return dbfirebase_1.setDBGame(gameValues, teamKey, channelKey, gameKey);
    }
    static removeGame(teamKey, channelKey, gameKey) {
        return dbfirebase_1.removeDBGame(teamKey, channelKey, gameKey);
    }
    constructor(values) {
        this.timeStep = values.timeStep;
        this.phase = values.phase;
        this.$key = values.$key;
        this.$channelKey = values.$channelKey;
        this.$teamKey = values.$teamKey;
        this.gamers = values.gamers ? values.gamers : {};
    }
    getGamer(userKey) {
        if (this.gamers[userKey]) {
            const gamerConstructorValue = Object.assign(this.gamers[userKey], {
                $channelKey: this.$channelKey,
                $gameKey: this.$key,
                $key: userKey,
                $teamKey: this.$teamKey,
            });
            return new gamer_1.Gamer(gamerConstructorValue);
        }
        else {
            return null;
        }
    }
    /**
     *
     * @return {GameFirebaseValue}
     */
    getFirebaseValue() {
        return Object.assign({}, {
            gamers: this.gamers,
            phase: this.phase,
            timeStep: this.timeStep,
        });
    }
}
exports.Game = Game;
//# sourceMappingURL=game.js.map