const getTeam = require('../models/team/teams').getTeam;
const Team = require('../models/team/team').Team;
const getChannel = require('../models/channel/channels').getChannel;
const Channel = require('../models/channel/channel').Channel;
const getPlayer = require('../models/player/players').getPlayer;
const Player = require('../models/player/player').Player;

/**
 * @typedef {Object} SlackGameMajorData
 * @property {Team} team
 * @property {Channel} channel
 * @property {?Player} player
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
  promises.push(getTeam(teamId), getChannel(teamId, channelId), getPlayer(teamId, channelId, userId));
  return Promise.all(promises)
    .then((data) => {
      // Retrieve Team object.
      let /** @type TeamFirebaseValue */ teamFirebaseValue = data[0];
      if (!teamFirebaseValue || teamFirebaseValue.active !== true) {
        let message = 'Team not found or game support being disabled for this team.';
        return Promise.reject({ message });
      }
      const team = new Team(teamFirebaseValue);
      // Retrieve Channel object.
      let /** @type ChannelFirebaseValue */ channelFirebaseValue = data[1];
      if (!channelFirebaseValue || channelFirebaseValue.active !== true) {
        let message = 'Channel never had game support or game support being disabled for this channel.';
        return Promise.reject({ message });
      }
      const channel = new Channel(channelFirebaseValue);
      // Retrieve Player object.
      var /** @type ?Player */ player = null;
      let /** @type PlayerFirebaseValue */ playerFirebaseValue = data[2];
      if (playerFirebaseValue) {
        player = new Player(playerFirebaseValue);
      }
      return Promise.resolve({
        team,
        channel,
        player
      });
    });
}