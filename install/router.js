"use strict";

const teamsRoute = require('./screens/teams');
const teamRoute = require('./screens/team');
const teamEditRoute = require('./screens/teamedit');
const channelsRoute = require('./screens/channels');
const channelCreateRoute = require('./screens/channelcreate');
const channelRoute = require('./screens/channel');
const channelStartGameRoute = require('./screens/channelstartgame');
const channelOverGameRoute = require('./screens/channelovergame');

/**
 * @typedef {Object} InstallationRouter
 * @property {TeamsRoute} teamsRoute
 * @property {TeamRoute} teamRoute
 * @property {TeamEditRoute} teamEditRoute
 * @property {ChannelsRoute} channelsRoute
 * @property {ChannelCreateRoute} channelCreateRoute
 * @property {ChannelRoute} channelRoute
 * @property {ChannelStartGameRoute} channelStartGameRoute
 * @property {ChannelOverGameRoute} channelOverGameRoute
 * @type {InstallationRouter}
 */
module.exports = {
  teamsRoute,
  teamRoute,
  teamEditRoute,
  channelsRoute,
  channelCreateRoute,
  channelRoute,
  channelStartGameRoute,
  channelOverGameRoute
};