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
      token: this.token,
      userId: this.userId,
      botId: this.botId,
      botToken: this.botToken,
    });
  }
}

module.exports = {
  Team
};