"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const channel_1 = require("./screens/channel");
const channelcreate_1 = require("./screens/channelcreate");
const channelovergame_1 = require("./screens/channelovergame");
const channels_1 = require("./screens/channels");
const channelstartgame_1 = require("./screens/channelstartgame");
const team_1 = require("./screens/team");
const teamedit_1 = require("./screens/teamedit");
const teams_1 = require("./screens/teams");
class InstallationRouter {
    constructor() {
        this.teamsRoute = teams_1.teamsRoute;
        this.teamRoute = team_1.teamRoute;
        this.teamEditRoute = teamedit_1.teamEditRoute;
        this.channelsRoute = channels_1.channelsRoute;
        this.channelCreateRoute = channelcreate_1.channelCreateRoute;
        this.channelRoute = channel_1.channelRoute;
        this.channelStartGameRoute = channelstartgame_1.channelStartGameRoute;
        this.channelOverGameRoute = channelovergame_1.channelOverGameRoute;
    }
}
exports.InstallationRouter = InstallationRouter;
exports.router = new InstallationRouter();
//# sourceMappingURL=router.js.map