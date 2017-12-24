const Team = require('../models/team/team').Team;
const Channel = require('../models/channel/channel').Channel;
const Game = require('../models/game/game').Game;
const CHANNEL_PHASES = require('../models/channel/channel').CHANNEL_PHASES;
const Player = require('../models/player/player').Player;

/**
 * @typedef {Object} SlackGameMajorData
 * @property {Team} team
 * @property {Channel} channel
 * @property {?Player} player
 * @property {?Game} game
 */

/**
 *
 * @param {string} teamId
 * @param {string} channelId
 * @param {string} userId
 * @return Promise<SlackGameMajorData,Error>
 */
module.exports = slackGameData;

function slackGameData(teamId, channelId, userId) {
  let promises = [];
  promises.push(Team.getTeam(teamId), Channel.getChannel(teamId, channelId), Player.getPlayer(teamId, channelId, userId));
  return Promise.all(promises)
    .then((data) => {
      // Retrieve Team object.
      const /** @type Team */ team = data[0];
      if (!team || team.active !== true) {
        let message = 'Team not found or game support being disabled for this team.';
        return Promise.reject({ message });
      }
      // Retrieve Channel object.
      const /** @type Channel */ channel = data[1];
      if (!channel || channel.active !== true) {
        let message = 'Channel never had game support or game support being disabled for this channel.';
        return Promise.reject({ message });
      }
      // Retrieve Player object.
      const /** @type Player */ player = data[2];
      switch(channel.phase) {
        case CHANNEL_PHASES.BREAK:
          return Promise.resolve({
            team,
            channel,
            player,
            game: null
          });
          break;
        case CHANNEL_PHASES.IN_GAME:
          // Load Game.
          return Game.getGame(team.$key, channel.$key, channel.currentGame)
            .then(game => {
              return Promise.resolve({
                team,
                channel,
                player,
                game
              });
            });
          break;
      }
      let message = 'Channel is invalid.';
      return Promise.reject({ message });
    });
}