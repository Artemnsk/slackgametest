import * as admin from "firebase-admin";
import { firebaseApp } from "../helpers/firebaseapp";
import { Channel } from "../models/channel/channel";
import { TeamFirebaseValue } from "../models/team/dbfirebase";
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
    this.ref.on("child_added", this.channelAdded);
    this.ref.on("child_changed", this.channelChanged);
    this.ref.on("child_removed", this.channelRemoved);
  }

  public getTeamKey(): string {
    return this.team.getKey();
  }

  // Handles destroying of object - needed to "off" Firebase listeners.
  public destroy(): void {
    // TODO: destroy all children.
    this.ref.off("child_added", this.channelAdded);
    this.ref.off("child_changed", this.channelChanged);
    this.ref.off("child_removed", this.channelRemoved);
  }

  private channelAdded(snapshot: admin.database.DataSnapshot): void {
    // snapshot.ref.on("value", );
    //
    const a = 1;
    // TODO: initialize Team "watcher".
  }

  private channelChanged(snapshot: admin.database.DataSnapshot): void {
    // snapshot.ref.on("value", );
    //
    const a = 1;
    // TODO: initialize Team "watcher".
  }

  private channelRemoved(snapshot: admin.database.DataSnapshot): void {
    // snapshot.ref.on("value", );
    //
    const a = 1;
    // TODO: initialize Team "watcher".
  }
}
