import { getDBTeam, getDBTeams, setDBTeam, TeamFirebaseValue } from "./dbfirebase";

export class Team {

  /**
   * Load team from DB by teamId.
   */
  public static getTeam(teamKey: string): Promise<Team|null> {
    return getDBTeam(teamKey)
      .then((teamFirebaseValue): Promise<Team|null> => {
        if (teamFirebaseValue) {
          const team = new Team(teamFirebaseValue, teamKey);
          return Promise.resolve(team);
        } else {
          return Promise.resolve(teamFirebaseValue);
        }
      });
  }

  /**
   * Respond with teams array from DB.
   */
  public static getTeams(active?: boolean): Promise<Team[]> {
    return getDBTeams(active)
      .then((teamsFirebaseObject): Promise<Team[]> => {
        const teamsArray = [];
        for (const teamKey in teamsFirebaseObject) {
          if (teamsFirebaseObject.hasOwnProperty(teamKey)) {
            const teamFirebaseValue = teamsFirebaseObject[teamKey];
            const team = new Team(teamFirebaseValue, teamKey);
            teamsArray.push(team);
          }
        }
        return Promise.resolve(teamsArray);
      });
  }

  /**
   * Sets team data into DB.
   */
  public static setTeam(teamValues: TeamFirebaseValue, teamId: string): Promise<void> {
    return setDBTeam(teamValues, teamId);
  }

  public active: boolean;
  public name: string;
  public admin?: string;
  public token?: string;
  public userId?: string;
  public botId?: string;
  public botToken?: string;
  private $key: string;

  constructor(values: TeamFirebaseValue, $key: string) {
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
    this.$key = $key;
  }

  public getKey(): string {
    return this.$key;
  }

  /**
   *
   * @return {TeamFirebaseValue}
   */
  public getFirebaseValue(): TeamFirebaseValue {
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
