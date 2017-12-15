"use strict";

const slackGameData = require('../helpers/slackgamedata');

module.exports = {
  setGameData
};

/**
 * @typedef {SlackGameMajorData} SlackGameCommandsReqData
 */

/**
 * @typedef {Object} SlackCommandRequest
 * @property {Object} body
 * @property {string} body.channel_id
 * @property {string} body.channel_name
 * @property {string} body.command
 * @property {string} body.response_url
 * @property {string} body.team_domain
 * @property {string} body.team_id
 * @property {string} body.text
 * @property {string} body.token
 * @property {string} body.trigger_id
 * @property {string} body.user_id
 * @property {string} body.user_name
 * @property {SlackGameCommandsReqData} slackData - custom data with info about team. channel and player we put into req.
 */

function setGameData(/** SlackCommandRequest */ req, res, next) {
  // Ensure that all needed data exists. Who knows...
  if (req.body.team_id && req.body.channel_id && req.body.user_id) {
    // TODO: any errors must respond to Slack.
    slackGameData(req.body.team_id, req.body.channel_id, req.body.user_id)
      .then((slackGameMajorData) => {
        req.slackData = slackGameMajorData;
        next();
      }, (error) => {
        res.status(500).send(error.message);
      });
  } else {
    res.status(500).send('Something wrong with Slack data sent with this request.');
  }
}