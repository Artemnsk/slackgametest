import * as admin from "firebase-admin";
import { firebaseApp } from "../helpers/firebaseapp";
import { TeamFirebaseValue } from "../models/team/dbfirebase";
import { Team } from "../models/team/team";
import { ChannelLoop } from "./channelloop";
import { TeamLoop } from "./teamloop";

// That will store all channel loops.
const channelLoops: ChannelLoop[] = [];

export class AppLoop {
  private ref: admin.database.Reference;
  private teamLoops: TeamLoop[];

  constructor() {
    this.teamLoops = [];
    this.ref = firebaseApp.database().ref("/teams");
    this.ref.on("child_added", this.teamAdded, this);
    this.ref.on("child_changed", this.teamChanged, this);
    this.ref.on("child_removed", this.teamRemoved, this);
  }

  // Handles destroying of object - needed to "off" Firebase listeners.
  public destroy(): void {
    // Remove all child reference listeners.
    for (const teamLoop of this.teamLoops) {
      teamLoop.destroy();
    }
    // Then remove all "top-level" reference listeners.
    this.ref.off("child_added", this.teamAdded, this);
    this.ref.off("child_changed", this.teamChanged, this);
    this.ref.off("child_removed", this.teamRemoved, this);
  }

  private teamAdded(snapshot: admin.database.DataSnapshot): void {
    // TODO: check if tokens work fine?
    if (snapshot.val() !== null && snapshot.key !== null) {
      // Find team loop in array and remove. Just to make code more reliable. That must not happen I think.
      const potentialTeamWithSameKey = this.teamLoops.find((item) => item.getTeamKey() === snapshot.key);
      if (potentialTeamWithSameKey !== undefined) {
        // Remove from array and destroy.
        this.teamLoops.splice(this.teamLoops.indexOf(potentialTeamWithSameKey), 1);
        potentialTeamWithSameKey.destroy();
      }
      // Create new TeamLoop and put into loops array.
      const teamFirebaseValue: TeamFirebaseValue = snapshot.val();
      const team = new Team(teamFirebaseValue, snapshot.key);
      // Proceed with team if it is active only.
      if (team.active === true) {
        const teamLoop = new TeamLoop(team);
        this.teamLoops.push(teamLoop);
      }
    }
  }

  private teamChanged(snapshot: admin.database.DataSnapshot): void {
    if (snapshot.val() !== null && snapshot.key !== null) {
      const teamFirebaseValue: TeamFirebaseValue = snapshot.val();
      const team = new Team(teamFirebaseValue, snapshot.key);
      const potentialTeamWithSameKey = this.teamLoops.find((item) => item.getTeamKey() === snapshot.key);
      if (potentialTeamWithSameKey === undefined && team.active === true) {
        const teamLoop = new TeamLoop(team);
        this.teamLoops.push(teamLoop);
      } else if (potentialTeamWithSameKey === undefined && team.active !== true) {
        // Expected behavior. Do nothing.
      } else if (potentialTeamWithSameKey !== undefined && team.active === true) {
        // Expected behavior. Do nothing.
      } else if (potentialTeamWithSameKey !== undefined && team.active !== true) {
        // We want to remove this TeamLoop as it's team is not active anymore.
        this.teamLoops.splice(this.teamLoops.indexOf(potentialTeamWithSameKey), 1);
        potentialTeamWithSameKey.destroy();
      }
    }
  }

  private teamRemoved(snapshot: admin.database.DataSnapshot): void {
    if (snapshot.val() !== null && snapshot.key !== null) {
      // If that team was in teamLoops array - destroy it.
      const teamFirebaseValue: TeamFirebaseValue = snapshot.val();
      const team = new Team(teamFirebaseValue, snapshot.key);
      const potentialTeamWithSameKey = this.teamLoops.find((item) => item.getTeamKey() === snapshot.key);
      if (potentialTeamWithSameKey !== undefined) {
        this.teamLoops.splice(this.teamLoops.indexOf(potentialTeamWithSameKey), 1);
        potentialTeamWithSameKey.destroy();
      }
    }
  }
}
