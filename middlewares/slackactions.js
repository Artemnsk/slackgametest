"use strict";

const slackGameData = require('../helpers/slackgamedata');
const getTeam = require('../models/team/teams').getTeam;
const Team = require('../models/team/team').Team;
const getChannel = require('../models/channel/channels').getChannel;
const Channel = require('../models/channel/channel').Channel;
const getPlayer = require('../models/player/players').getPlayer;
const Player = require('../models/player/player').Player;

module.exports = {
  setGameData
};

/**
 * @typedef {Object} ParsedSlackActionPayload
 * @property {Array<Object>} actions
 * @property {string} action_ts
 * @property {string} attachment_id
 * @property {string} callback_id
 * @property {Object} channel
 * @property {string} channel.id
 * @property {string} channel.name
 * @property {boolean} is_app_unfurl
 * @property {string} message_ts
 * @property {string} response_url
 * @property {Object} team
 * @property {string} team.domain
 * @property {string} team.id
 * @property {string} token
 * @property {string} trigger_id
 * @property {string} type
 * @property {Object} user
 * @property {string} user.name
 * @property {string} user.id
 */

/**
 * @typedef {SlackGameMajorData & {parsedPayload: ParsedSlackActionPayload}} SlackGameActionsReqData
 */

/**
 * @typedef {Object} SlackActionRequest
 * @property {Object} body
 * @property {string} body.payload
 * @property {SlackGameActionsReqData} slackData - custom data with info about team, channel and player we put into req.
 */

function setGameData(/** SlackActionRequest */ req, res, next) {
  // Ensure that all needed data exists. Who knows...
  if (req.body.payload) {
    // TODO: any errors must respond to Slack.
    const /** @type ParsedSlackActionPayload */ parsedPayload = JSON.parse(req.body.payload);
    slackGameData(parsedPayload.team.id, parsedPayload.channel.id, parsedPayload.user.id)
      .then((slackGameMajorData) => {
        req.slackData = Object.assign(slackGameMajorData, { parsedPayload });
        next();
      }, (error) => {
        res.status(500).send(error.message);
      });
  } else {
    res.status(500).send('Something wrong with Slack data sent with this request.');
  }
}