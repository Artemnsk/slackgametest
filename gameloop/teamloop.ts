import * as admin from "firebase-admin";
import { firebaseApp } from "../helpers/firebaseapp";
import { Channel } from "../models/channel/channel";
import { ChannelFirebaseValue, ChannelFirebaseValueRaw, processFirebaseRawValues as processChannelFirebaseRawValues, validateChannelFirebaseValue } from "../models/channel/dbfirebase";
import { Team } from "../models/team/team";
import { ChannelLoop } from "./channelloop";

export class TeamLoop {
  private team: Team;
  private ref: admin.database.Reference;
  private channelLoops: ChannelLoop[];

  constructor(team: Team) {
    this.channelLoops = [];
    this.team = team;
    this.ref = firebaseApp.database().ref(`/channels/${team.getKey()}`);
    this.ref.on("child_added", this.channelAdded, this);
    this.ref.on("child_changed", this.channelChanged, this);
    this.ref.on("child_removed", this.channelRemoved, this);
  }

  public getTeamKey(): string {
    return this.team.getKey();
  }

  // Handles destroying of object - needed to "off" Firebase listeners.
  public destroy(): void {
    // Remove all child reference listeners.
    for (const channelLoop of this.channelLoops) {
      channelLoop.destroy();
    }
    // Then remove all "top-level" reference listeners.
    this.ref.off("child_added", this.channelAdded, this);
    this.ref.off("child_changed", this.channelChanged, this);
    this.ref.off("child_removed", this.channelRemoved, this);
  }

  private channelAdded(snapshot: admin.database.DataSnapshot): void {
    // TODO: check if token works fine?
    if (snapshot.val() !== null && snapshot.key !== null) {
      // Find channel loop in array and remove. Just to make code more reliable. That must not happen I think.
      const potentialChannelWithSameKey = this.channelLoops.find((item) => item.getChannelKey() === snapshot.key);
      if (potentialChannelWithSameKey !== undefined) {
        // Remove from array and destroy.
        this.channelLoops.splice(this.channelLoops.indexOf(potentialChannelWithSameKey), 1);
        potentialChannelWithSameKey.destroy();
      }
      // Create new TeamLoop and put into loops array.
      const channelFirebaseValueRaw: ChannelFirebaseValueRaw = snapshot.val();
      const channelFirebaseValue: ChannelFirebaseValue = processChannelFirebaseRawValues(channelFirebaseValueRaw);
      if (validateChannelFirebaseValue(channelFirebaseValue)) {
        const channel = new Channel(this.team, channelFirebaseValue, snapshot.key);
        // Proceed with team if it is active only.
        if (channel.active === true) {
          const channelLoop = new ChannelLoop(channel);
          this.channelLoops.push(channelLoop);
        }
      }
    }
  }

  private channelChanged(snapshot: admin.database.DataSnapshot): void {
    if (snapshot.val() !== null && snapshot.key !== null) {
      const channelFirebaseValueRaw: ChannelFirebaseValueRaw = snapshot.val();
      const channelFirebaseValue: ChannelFirebaseValue = processChannelFirebaseRawValues(channelFirebaseValueRaw);
      if (validateChannelFirebaseValue(channelFirebaseValue)) {
        const channel = new Channel(this.team, channelFirebaseValue, snapshot.key);
        const potentialChannelWithSameKey = this.channelLoops.find((item) => item.getChannelKey() === snapshot.key);
        if (potentialChannelWithSameKey === undefined && channel.active === true) {
          const channelLoop = new ChannelLoop(channel);
          this.channelLoops.push(channelLoop);
        } else if (potentialChannelWithSameKey === undefined && channel.active !== true) {
          // Expected behavior. Do nothing.
        } else if (potentialChannelWithSameKey !== undefined && channel.active === true) {
          // Something being changed in channel data so we must update channel loop.
          this.channelLoops.splice(this.channelLoops.indexOf(potentialChannelWithSameKey), 1);
          potentialChannelWithSameKey.destroy();
          const channelLoop = new ChannelLoop(channel);
          this.channelLoops.push(channelLoop);
        } else if (potentialChannelWithSameKey !== undefined && channel.active !== true) {
          // We want to remove this TeamLoop as it's team is not active anymore.
          this.channelLoops.splice(this.channelLoops.indexOf(potentialChannelWithSameKey), 1);
          potentialChannelWithSameKey.destroy();
        }
      }
    }
  }

  private channelRemoved(snapshot: admin.database.DataSnapshot): void {
    if (snapshot.val() !== null && snapshot.key !== null) {
      // If that team was in teamLoops array - destroy it.
      const channelFirebaseValueRaw: ChannelFirebaseValueRaw = snapshot.val();
      const channel = new Channel(this.team, processChannelFirebaseRawValues(channelFirebaseValueRaw), snapshot.key);
      const potentialChannelWithSameKey = this.channelLoops.find((item) => item.getChannelKey() === snapshot.key);
      if (potentialChannelWithSameKey !== undefined) {
        this.channelLoops.splice(this.channelLoops.indexOf(potentialChannelWithSameKey), 1);
        potentialChannelWithSameKey.destroy();
      }
    }
  }
}
