import { Channel } from "../models/channel/channel";
import { CHANNEL_PHASES } from "../models/channel/dbfirebase";
import { Game } from "../models/game/game";
import { Gamer } from "../models/gamer/gamer";
import { Player } from "../models/player/player";
import { Team } from "../models/team/team";

export type SlackGameMajorData = {
  team: Team,
  channel: Channel,
  player: Player|null,
  game: Game|null,
  gamer: Gamer|null,
};

export function slackGameData(teamId: string, channelId: string, userId: string): Promise<SlackGameMajorData> {
  const promises: [Promise<Team|null>, Promise<Channel|null>, Promise<Player|null>] = [Team.getTeam(teamId), Channel.getChannel(teamId, channelId), Player.getPlayer(teamId, channelId, userId)];
  return Promise.all(promises)
    .then((data): Promise<SlackGameMajorData> => {
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
      const player: Player|null = data[2];
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
            return Game.getGame(team.$key, channel.$key, channel.currentGame)
              .then((game): Promise<SlackGameMajorData> => {
                if (game !== null) {
                  return Promise.resolve({
                    channel,
                    game,
                    gamer: game.getGamer(userId),
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
}
