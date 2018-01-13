import { Channel } from "../models/channel/channel";
import { CHANNEL_PHASES } from "../models/channel/dbfirebase";
import { Game } from "../models/game/game";
import { Gamer } from "../models/gamer/gamer";
import { Player } from "../models/player/player";
import { Team } from "../models/team/team";

export type SlackGameMajorData = {
  channel: Channel,
  player: Player|null,
  game: Game|null,
  gamer: Gamer|null,
};

export function slackGameData(teamKey: string, channelKey: string, userKey: string): Promise<SlackGameMajorData> {
  return Team.getTeam(teamKey)
    .then((team) => {
      if (team !== null && team.active === true) {
        return Channel.getChannel(team, channelKey)
          .then((channel) => {
            if (channel !== null && channel.active === true) {
              return Player.getPlayer(channel, userKey)
                .then((player) => {
                  switch (channel.phase) {
                    case CHANNEL_PHASES.BREAK:
                      return Promise.resolve({
                        channel,
                        game: null,
                        gamer: null,
                        player,
                        team,
                      });
                    case CHANNEL_PHASES.IN_GAME:
                      if (channel.currentGame !== null) {
                        // Load Game.
                        return Game.getGame(channel, channel.currentGame)
                          .then((game): Promise<SlackGameMajorData> => {
                            if (game !== null) {
                              return Promise.resolve({
                                channel,
                                game,
                                gamer: game.getGamer(userKey),
                                player,
                                team,
                              });
                            } else {
                              const error = `Channel phase is ${CHANNEL_PHASES.IN_GAME} however there is no Game in DB with key = currentGame value of channel which is critical bug. Contact administrator.`;
                              return Promise.reject({ message: error });
                            }
                          });
                      } else {
                        const error = `Channel phase is ${CHANNEL_PHASES.IN_GAME} however there is no currentGame for channel which is critical bug. Contact administrator.`;
                        return Promise.reject({ message: error });
                      }
                  }
                  const message = "Channel is invalid.";
                  return Promise.reject({ message });
                });
            } else {
              const error = "Channel never had game support or game support being disabled for this channel.";
              return Promise.reject({ message: error });
            }
          });
      } else {
        const error = "Team not found or game support being disabled for this team.";
        return Promise.reject({ message: error });
      }
    });
}
