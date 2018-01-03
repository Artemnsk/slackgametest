"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbfirebase_1 = require("./dbfirebase");
class Team {
    /**
     * Load team from DB by teamId.
     */
    static getTeam(teamId) {
        return dbfirebase_1.getDBTeam(teamId)
            .then((teamFirebaseValue) => {
            if (teamFirebaseValue) {
                const teamConstructorValues = Object.assign(teamFirebaseValue, { $key: teamId });
                const team = new Team(teamConstructorValues);
                return Promise.resolve(team);
            }
            else {
                return Promise.resolve(teamFirebaseValue);
            }
        });
    }
    /**
     * Respond with teams array from DB.
     */
    static getTeams(active) {
        return dbfirebase_1.getDBTeams(active)
            .then((teamsFirebaseObject) => {
            const teamsArray = [];
            for (const teamKey in teamsFirebaseObject) {
                if (teamsFirebaseObject.hasOwnProperty(teamKey)) {
                    const teamFirebaseValue = teamsFirebaseObject[teamKey];
                    const teamConstructorValues = Object.assign(teamFirebaseValue, { $key: teamKey });
                    const team = new Team(teamConstructorValues);
                    teamsArray.push(team);
                }
            }
            return Promise.resolve(teamsArray);
        });
    }
    /**
     * Sets team data into DB.
     */
    static setTeam(teamValues, teamId) {
        return dbfirebase_1.setDBTeam(teamValues, teamId);
    }
    /**
     *
     * @param {TeamFirebaseValue & {$key: (undefined|string)}} values
     * @constructor
     * @extends TeamFirebaseValue
     * @property {string} $key - Database key of this team.
     */
    constructor(values) {
        this.active = values.active;
        this.name = values.name;
        if (values.token) {
            this.token = values.token;
        }
        if (values.admin) {
            this.admin = values.admin;
        }
        if (values.userId) {
            this.userId = values.userId;
        }
        if (values.botId) {
            this.botId = values.botId;
        }
        if (values.botToken) {
            this.botToken = values.botToken;
        }
        this.$key = values.$key;
    }
    /**
     *
     * @return {TeamFirebaseValue}
     */
    getFirebaseValue() {
        return Object.assign({}, {
            active: this.active,
            admin: this.admin,
            botId: this.botId,
            botToken: this.botToken,
            name: this.name,
            token: this.token,
            userId: this.userId,
        });
    }
}
exports.Team = Team;
//# sourceMappingURL=team.js.map