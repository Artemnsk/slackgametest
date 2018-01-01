"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbfirebase_1 = require("./dbfirebase");
class Player {
    /**
     * Load player from DB by teamKey and channelKey and playerKey.
     * @param {string} teamKey
     * @param {string} channelKey
     * @param {string} playerKey
     * @return {Promise.<?Player,Error>}
     */
    static getPlayer(teamKey, channelKey, playerKey) {
        return dbfirebase_1.getDBPlayer(teamKey, channelKey, playerKey)
            .then((playerFirebaseValue) => {
            if (playerFirebaseValue) {
                const playerConstructorValues = Object.assign(playerFirebaseValue, { $key: playerKey, $channelKey: channelKey, $teamKey: teamKey });
                const player = new Player(playerConstructorValues);
                return Promise.resolve(player);
            }
            else {
                return Promise.resolve(playerFirebaseValue);
            }
        });
    }
    /**
     * Respond with channels array from DB.
     */
    static getPlayers(teamKey, channelKey, active) {
        return dbfirebase_1.getDBPlayers(teamKey, channelKey, active)
            .then((playersFirebaseObject) => {
            const playersArray = [];
            for (const playerKey in playersFirebaseObject) {
                if (playersFirebaseObject.hasOwnProperty(playerKey)) {
                    const playerFirebaseValue = playersFirebaseObject[playerKey];
                    const playerConstructorValues = Object.assign(playerFirebaseValue, { $key: playerKey, $channelKey: channelKey, $teamKey: teamKey });
                    const player = new Player(playerConstructorValues);
                    playersArray.push(player);
                }
            }
            return Promise.resolve(playersArray);
        });
    }
    /**
     * Sets player in DB.
     */
    static setPlayer(playerValues, teamKey, channelKey, playerKey) {
        return dbfirebase_1.setDBPlayer(playerValues, teamKey, channelKey, playerKey);
    }
    constructor(values) {
        this.active = values.active;
        this.name = values.name;
        this.gold = values.gold;
        this.items = values.items;
        this.$key = values.$key;
        this.$channelKey = values.$channelKey;
        this.$teamKey = values.$teamKey;
    }
    /**
     * Initialize gamer by player. TODO: that probably must be declared inside Game?
     */
    getGamerFirebaseValue() {
        return {
            dead: false,
            // TODO: set somewhere? Maybe channel/game setting?
            health: 100,
            items: this.items,
            // TODO: set somewhere? Maybe channel/game setting?
            mana: 40,
            name: this.name,
            spells: {},
        };
    }
    /**
     *
     * @return {PlayerFirebaseValue}
     */
    getFirebaseValue() {
        return Object.assign({}, {
            active: this.active,
            gold: this.gold,
            items: this.items,
            name: this.name,
        });
    }
}
exports.Player = Player;
//# sourceMappingURL=player.js.map