const getDBTeam = require('./dbfirebase').getDBTeam;
const getDBTeams = require('./dbfirebase').getDBTeams;
const setDBTeam = require('./dbfirebase').setDBTeam;

class Team {
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
    if (values.$key) {
      this.$key = values.$key;
    }
  }

  /**
   *
   * @return {TeamFirebaseValue}
   */
  getFirebaseValue() {
    return Object.assign({}, {
      active: this.active,
      name: this.name,
      admin: this.admin,
      token: this.token,
      userId: this.userId,
      botId: this.botId,
      botToken: this.botToken,
    });
  }

  /**
   * Load team from DB by teamId.
   * @param {string} teamId
   * @return {Promise.<?Team,Error>}
   */
  static getTeam(teamId) {
    return getDBTeam(teamId)
      .then(teamFirebaseValue => {
        if (teamFirebaseValue) {
          let teamConstructorValues = Object.assign(teamFirebaseValue, { $key: teamId });
          let team = new Team(teamConstructorValues);
          return Promise.resolve(team);
        } else {
          return Promise.resolve(teamFirebaseValue);
        }
      });
  }

  /**
   * Respond with teams array from DB.
   * @param {boolean} [active] - filter by 'active' field. No filter if not set.
   * @return Promise<Array<Team>,Error>
   */
  static getTeams(active) {
    return getDBTeams(active)
      .then(teamsFirebaseObject => {
        const teamsArray = [];
        for (let teamKey in teamsFirebaseObject) {
          let teamFirebaseValue = teamsFirebaseObject[teamKey];
          let teamConstructorValues = Object.assign(teamFirebaseValue, { $key: teamKey });
          let team = new Team(teamConstructorValues);
          teamsArray.push(team);
        }
        return Promise.resolve(teamsArray);
      });
  }

  /**
   * Sets team data into DB.
   * @param {TeamFirebaseValue} teamValues
   * @param {string} teamId
   * @return Promise.<any,Error>
   */
  static setTeam(teamValues, teamId) {
    return setDBTeam(teamValues, teamId);
  }
}

module.exports = {
  Team
};