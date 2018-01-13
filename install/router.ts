import { Channel } from "../models/channel/channel";
import { Team } from "../models/team/team";
import { channelRoute } from "./screens/channel";
import { channelCreateRoute } from "./screens/channelcreate";
import { channelOverGameRoute } from "./screens/channelovergame";
import { channelsRoute } from "./screens/channels";
import { channelStartGameRoute } from "./screens/channelstartgame";
import { teamRoute } from "./screens/team";
import { teamEditRoute } from "./screens/teamedit";
import { teamsRoute } from "./screens/teams";

export class InstallationRouter {
  public teamsRoute: (router: InstallationRouter) => void;
  public teamRoute: (args: { teamKey: string }, router: InstallationRouter) => void;
  public teamEditRoute: (args: { team: Team }, router: InstallationRouter) => void;
  public channelsRoute: (args: { team: Team }, router: InstallationRouter) => void;
  public channelCreateRoute: (args: { team: Team }, router: InstallationRouter) => void;
  public channelRoute: (args: { team: Team, channelKey: string }, router: InstallationRouter) => void;
  public channelStartGameRoute: (args: { channel: Channel }, router: InstallationRouter) => void;
  public channelOverGameRoute: (args: { channel: Channel }, router: InstallationRouter) => void;

  constructor() {
    this.teamsRoute = teamsRoute;
    this.teamRoute = teamRoute;
    this.teamEditRoute = teamEditRoute;
    this.channelsRoute = channelsRoute;
    this.channelCreateRoute = channelCreateRoute;
    this.channelRoute = channelRoute;
    this.channelStartGameRoute = channelStartGameRoute;
    this.channelOverGameRoute = channelOverGameRoute;
  }
}

export const router = new InstallationRouter();
