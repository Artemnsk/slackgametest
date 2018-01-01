"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const channel_1 = require("../models/channel/channel");
const game_1 = require("../models/game/game");
const player_1 = require("../models/player/player");
const team_1 = require("../models/team/team");
function slackGameData(teamId, channelId, userId) {
    const promises = [team_1.Team.getTeam(teamId), channel_1.Channel.getChannel(teamId, channelId), player_1.Player.getPlayer(teamId, channelId, userId)];
    return Promise.all(promises)
        .then((data) => {
        // Retrieve Team object.
        const /** @type Team */ team = data[0];
        if (team === null || team.active !== true) {
            const error = "Team not found or game support being disabled for this team.";
            return Promise.reject({ message: error });
        }
        // Retrieve Channel object.
        const channel = data[1];
        if (channel === null || channel.active !== true) {
            const error = "Channel never had game support or game support being disabled for this channel.";
            return Promise.reject({ message: error });
        }
        // Retrieve Player object.
        const player = data[2];
        switch (channel.phase) {
            case "BREAK" /* BREAK */:
                return Promise.resolve({
                    channel,
                    game: null,
                    gamer: null,
                    player,
                    team,
                });
            case "IN_GAME" /* IN_GAME */:
                if (channel.currentGame !== null) {
                    // Load Game.
                    return game_1.Game.getGame(team.$key, channel.$key, channel.currentGame)
                        .then((game) => {
                        if (game !== null) {
                            return Promise.resolve({
                                channel,
                                game,
                                gamer: game.getGamer(userId),
                                player,
                                team,
                            });
                        }
                        else {
                            const error = `Channel phase is ${"IN_GAME" /* IN_GAME */} however there is no Game in DB with key = currentGame value of channel which is critical bug. Contact administrator.`;
                            return Promise.reject({ message: error });
                        }
                    });
                }
                else {
                    const error = `Channel phase is ${"IN_GAME" /* IN_GAME */} however there is no currentGame for channel which is critical bug. Contact administrator.`;
                    return Promise.reject({ message: error });
                }
        }
        const message = "Channel is invalid.";
        return Promise.reject({ message });
    });
}
exports.slackGameData = slackGameData;
//# sourceMappingURL=slackgamedata.js.map